import { createReadStream } from 'fs';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import { AddressInfo } from 'net';
import { resolve as pathResolve } from 'path';

import { clean, getEndpoint } from '../headless/global-browser';
import { run } from '../vm/run';
import { addBodyCatch } from './catch';
import { requestLog, responseLog } from './log';

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

router.all('/clean', async () => {
  return clean();
});

router.all('/endpoint', async () => {
  return getEndpoint();
});

router.post('*', async (ctx) => {
  return run(ctx.request.body.code);
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

const server = app.listen(process.env.PORT || 8080);
const address = server.address() as AddressInfo;

server.on('listening', () => {
  console.info(`http://127.0.0.1:${address.port}`, address);
});

export { app };
