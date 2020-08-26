const request = require('request');

const ctrl = {
  async pipe(ctx) {
    let url = ctx.query.url;
    if (!url) {
      ctx.status = 404;
      ctx.body = { err: 'no url' };

      return;
    }

    let requestOptions = {
      url,
      headers: {
        Referer: ctx.request.query.url,
      },
    };
    let config = { stream: true };
    ctx.body = request({ ...requestOptions, ...config });
  },
};

module.exports = ctrl;
