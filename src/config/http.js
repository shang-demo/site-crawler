const bodyParser = require('koa-bodyparser');
const cors = require('kcors');

module.exports.http = {
  middlewares: [
    function requestLog() {
      return async (ctx, next) => {
        const start = new Date();
        const arr = [];
        if (mKoa.config.log.requestBody && ctx.method !== 'GET') {
          arr.push('--');
          arr.push(ctx.body || {});
        }

        await next();

        let ms = new Date() - start;
        arr.unshift(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);

        if (mKoa.config.log.responseBody) {
          arr.push('---');
          // eslint-disable-next-line no-underscore-dangle
          if (ctx.body && ctx.body._readableState) {
            arr.push('response send buffer');
          }
          else {
            arr.push(ctx.body || '');
          }
        }
        logger.trace(...arr);
      };
    },
    cors,
    bodyParser,
  ],
};
