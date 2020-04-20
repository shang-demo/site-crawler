import { Context, Next } from 'koa';

async function requestLog(ctx: Context, next: Next) {
  if (['POST', 'UPDATE', 'GET'].indexOf(ctx.method) === -1) {
    await next();
    return;
  }

  const logs = [`${ctx.method} ${ctx.url} -- query:`, JSON.stringify(ctx.request.query)];
  if (ctx.method === 'POST' || ctx.method === 'UPDATE') {
    logs.push('--- body:');
    logs.push(ctx.request.body || {});
  }

  console.info(...logs);
  await next();
}

async function responseLog(ctx: Context, next: Next) {
  const start = Date.now();
  const logs: any = [];

  await next();

  const ms = Date.now() - start;
  logs.push(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);

  logs.push('---');
  // eslint-disable-next-line no-underscore-dangle
  if (ctx.body && ctx.body._readableState) {
    logs.push('response send buffer');
  } else {
    // logs.push(ctx.body || '');
  }

  console.info(...logs);
}

export { requestLog, responseLog };
