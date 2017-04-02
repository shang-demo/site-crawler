const request = require('request');

const ctrl = {
  pipe(ctx) {
    let url = ctx.query.url;
    if (!url) {
      ctx.status = 404;
      ctx.body = { err: 'no url' };

      return null;
    }

    ctx.body = request(url);
    return null;
  }
};

module.exports = ctrl;
