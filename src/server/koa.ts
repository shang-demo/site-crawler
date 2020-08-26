import { createReadStream } from 'fs';
import http from 'http';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import koaStatic from 'koa-static';
import { AddressInfo } from 'net';
import { resolve as pathResolve } from 'path';

import { FILE_ROOT } from '../common/constant';
import { clean, getEndpoint } from '../headless/global-browser';
import { run } from '../vm';
import { addBodyCatch } from './catch';
import { requestLog, responseLog } from './log';
import { SocketIo } from './socket';
import { getPages } from '../headless/browser';

const app = new Koa();
const router = new Router();

app.use(koaStatic(FILE_ROOT));
app.use(koaBody());
app.use(addBodyCatch);
app.use(requestLog);
app.use(responseLog);

app.use(async (ctx, next) => {
  const data = await next();
  if (!ctx.body) {
    ctx.body = data;
  }
});

app.on('error', (err, ctx) => {
  console.warn(
    `uncaught error: ${ctx.method} ${ctx.url}`,
    { ...ctx.request.query },
    ctx.request.body
  );
  console.warn(err);
});

// leancloud不使用云函数和Hook
router.all('/1.1/functions/_ops/metadatas', (ctx) => {
  ctx.status = 404;
  ctx.body = {};
});

// leancloud heartbeat
router.all('/__engine/*', (ctx) => {
  ctx.status = 200;
  ctx.body = {};
});

router.all('/clean', async () => {
  return clean();
});

router.all('/pages', async () => {
  const pages = await getPages();

  console.info('pages: ', pages[0]);

  return pages.map((page) => {
    return { title: page.title(), url: page.url() };
  });
});

router.all('/endpoint', async () => {
  return getEndpoint();
});

router.post('*', async (ctx) => {
  const data = await run(ctx.request.body);
  return data;
});

router.get('/headless-test*', async (ctx) => {
  ctx.type = 'html';
  return createReadStream(pathResolve(__dirname, '../headless-test.html'));
});

router.get('*', async (ctx) => {
  ctx.type = 'html';
  return createReadStream(pathResolve(__dirname, '../index.html'));
});

app.use(router.routes());
app.use(router.allowedMethods());

const server = http.createServer(app.callback());
server.listen(process.env.PORT || process.env.LEANCLOUD_APP_PORT || 8080, process.env.HOST as any);

const address = server.address() as AddressInfo;

server.on('listening', () => {
  console.info(`http://127.0.0.1:${address.port}`, address);
});

const io = new SocketIo(server, [
  { key: 'requestId', header: 'x-request-id', required: true },
  { key: 'when', header: 'x-when', excludeRoom: true },
]);

io.addConnectionListener((client) => {
  client.on('run', async (data) => {
    console.info(data);

    // TODO: 防止多次请求, 再加入 requestId 检测是否已经使用过
    if (Date.now() - client.userProps.when > 3000) {
      io.emit(
        client,
        { message: '请求超时', serverWhen: Date.now(), when: client.userProps.when },
        'LOG'
      );
      return;
    }
    // TODO: 判断上次执行已经结束, 还是还在继续执行中
    // requestId 检测

    await run(data, (...args) => {
      io.emit(client.userProps, ...args);
    });
  });
});

export { app, server, io };
