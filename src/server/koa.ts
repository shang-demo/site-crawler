import { createReadStream } from 'fs';
import http from 'http';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import { AddressInfo } from 'net';
import { resolve as pathResolve } from 'path';

import { clean, getEndpoint } from '../headless/global-browser';
import { run } from '../vm';
import { addBodyCatch } from './catch';
import { requestLog, responseLog } from './log';
import { SocketIo } from './socket';

const app = new Koa();
const router = new Router();

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

router.all('/clean', async () => {
  return clean();
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
server.listen(process.env.PORT || 8080, process.env.HOST as any);

const address = server.address() as AddressInfo;

server.on('listening', () => {
  console.info(`http://127.0.0.1:${address.port}`, address);
});

const io = new SocketIo(server, [{ key: 'requestId', header: 'x-request-id', required: true }]);

io.addConnectionListener((client) => {
  client.on('run', async (data) => {
    console.info(data);
    await run(data, client);
  });
});

export { app, server, io };
