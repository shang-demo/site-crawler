import { decamelize } from 'humps';
import {
  get,
  isNumber,
  isPlainObject,
  isString,
  isUndefined,
  map,
  sortBy,
} from 'lodash';
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

export interface SocketClient extends Socket {
  userProps: { [key: string]: any };
  headersError: { key: string; message: string }[];
}

interface ParseKeyItem {
  key: string;
  header: string;
  required?: boolean;
  excludeRoom?: boolean;
}

async function parseHeaders(
  keys: ParseKeyItem[],
  socket: SocketClient,
  next: (err?: any) => void,
) {
  const errors: { key: string; message: string }[] = [];

  socket.userProps = {};

  keys.forEach((item) => {
    const { key, header, required } = item;
    const value = get(socket, `request.headers['${header}']`);

    if (required && isUndefined(value)) {
      errors.push({
        key,
        message: 'required',
      });
      return null;
    }

    socket.userProps[key] = value;
    return null;
  });

  if (errors?.length) {
    socket.headersError = errors;
  }

  next();
}

async function checkHeadersError(client: SocketClient) {
  if (client.headersError) {
    client.emit('unauthorized', { message: client.headersError }, () => {
      client.disconnect();
    });

    setTimeout(() => {
      client.disconnect();
    }, 1000);
  }
}

class SocketIo {
  public keys: ParseKeyItem[] = [];

  public io: Server;

  private connectionListeners: any[] = [];

  constructor(
    private server: HttpServer,
    private socketHeaderKeys: ParseKeyItem[] = [],
    private autoJoinRoom = true,
  ) {
    this.io = this.getIO();

    this.init();
  }

  public emit(
    clientPropsOrRoomId: string | { [key: string]: any },
    data: any,
    event?: any,
  ) {
    if (!clientPropsOrRoomId) {
      console.debug('emit to all with event: ', event, 'data: ', data);
      this.io.emit(event, data);
    }

    let roomId: string;
    if (isString(clientPropsOrRoomId)) {
      roomId = clientPropsOrRoomId;
    } else {
      roomId = this.getRoomId(clientPropsOrRoomId);
    }

    if (!roomId) {
      throw new Error('no roomId found');
    }

    console.debug({ roomId, event, data });

    this.io.to(roomId).emit(event, data);
    // this.io.in(roomId).clients((err: any, clients: any) => {
    //   if (err) {
    //     return null;
    //   }
    //   console.debug(`${roomId} clients length: `, clients.length);
    //   return null;
    // });
  }

  public addConnectionListener(fun: (client: SocketClient) => any) {
    this.connectionListeners.push(fun);
  }

  public removeConnectionListener(fun: Function) {
    this.connectionListeners.splice(this.connectionListeners.indexOf(fun), 1);
  }

  public close() {
    this.io.close();
  }

  private watchConnect() {
    this.io.on('connection', (client) => {
      console.info('socket.io client connect, roomId:', this.getRoomId(client));

      this.connectionListeners.forEach((listener) => {
        listener(client);
      });
    });
  }

  private init() {
    // header 参数解析
    this.io.use((socket, next) => {
      return parseHeaders(this.keys, socket as SocketClient, next);
    });
    this.connectionListeners.push(checkHeadersError);

    // 加入某个 room
    if (this.autoJoinRoom) {
      this.connectionListeners.push((client: SocketClient) => {
        client.join(this.getRoomId(client));
      });
    }

    // client error 监听
    this.connectionListeners.push((client: SocketClient) => {
      client.on('error', (error) => {
        console.warn('socket client error: ', error);
      });
    });

    this.watchConnect();
  }

  private getIO() {
    this.parseSocketHeaderKeys();
    const extraHeader = map(this.keys, 'header');

    const io = new Server(this.server, {
      cors: {
        origin: true,
        allowedHeaders: [...extraHeader, 'content-type', 'authorization'],
        credentials: true,
      },
    });

    return io;
  }

  private parseSocketHeaderKeys() {
    const keys = map(this.socketHeaderKeys, (item) => {
      if (isString(item)) {
        return {
          key: item,
          header: decamelize(item, { separator: '-' }),
          required: false,
        };
      }

      if (isPlainObject(item)) {
        return {
          key: item.key,
          header: item.header
            ? item.header
            : `x-${decamelize(item.key, { separator: '-' })}`,
          required: !!item.required,
          excludeRoom: !!item.excludeRoom,
        };
      }

      throw new Error(`not support header key: ${JSON.stringify(item)}`);
    });

    this.keys = sortBy(keys, 'key');
  }

  private getRoomId(obj: SocketClient | { [key: string]: any }) {
    let props: any;
    if (obj.userProps) {
      props = obj.userProps;
    } else {
      props = obj;
    }

    return map(this.keys, ({ key, excludeRoom }) => {
      console.info('excludeRoom: ', excludeRoom, key);
      if (excludeRoom) {
        return undefined;
      }

      const value = props[key];
      if (isString(value) || isNumber(value)) {
        return `${key}:${value}`;
      }
      return undefined;
    })
      .filter((value) => {
        return value !== undefined;
      })
      .join('|');
  }
}

export { SocketIo };
