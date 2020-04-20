import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';

import { createReadStream } from 'fs';
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

router.get('*', async (ctx) => {
  ctx.type = 'html';
  return createReadStream(pathResolve(__dirname, '../index.html'));
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.PORT || 8080);

export { app };
