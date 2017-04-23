const siteParser = require('website-parser');

const ctrl = {
  async parse(ctx) {
    let sitemap = ctx.request.body.sitemap;
    let html = ctx.request.body.html;

    if (!sitemap || !html) {
      return ctx.wrapError(new Errors.ParamsError());
    }

    try {
      let result = await Promise.try(() => {
        return siteParser({
          sitemap,
          html,
        });
      });
      ctx.body = result;
      return result;
    }
    catch (e) {
      return ctx.wrapError(e);
    }
  },
};

module.exports = ctrl;
