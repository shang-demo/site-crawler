import { Context, Next } from 'koa';

import { Errors } from '../common/error';

async function addBodyCatch(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    console.warn(err);

    if (err instanceof Errors.OperationalError) {
      ctx.status = ctx.status === 404 ? 400 : ctx.status;
      ctx.body = err.toJSON();
    } else {
      ctx.status = ctx.status === 404 ? 400 : ctx.status;
      ctx.body = new Errors.Unknown().toJSON();
    }
  }
}

export { addBodyCatch };
