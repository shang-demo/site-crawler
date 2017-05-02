const ctrl = {
  async crawler(ctx) {
    let body = ctx.request.body;
    let requestOptions = body.requestOptions;
    let config = body.config;

    let result = await CrawlerService.crawler(requestOptions, config);
    ctx.body = {
      html: result,
    };
  },
  async crawlerGet(ctx) {
    let url = ctx.request.query.url;
    let result = await CrawlerService.crawler({ url });
    ctx.body = {
      html: result,
    };
  },
  async crawlerPipe(ctx) {
    let url = ctx.request.query.url;
    let config = { stream: true };

    try {
      let result = await CrawlerService.crawler({ url }, config);
      ctx.body = result.toStream();
    }
    catch (e) {
      ctx.wrapError(e);
    }
  },
};

module.exports = ctrl;

