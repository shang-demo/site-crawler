const ctrl = {
  async transformBody(body) {
    if (body.requestOptions) {
      body.requestOptions = UtilService.tryParseJson(body.requestOptions);
    }
    if (body.sitemap) {
      body.sitemap = UtilService.tryParseJson(body.sitemap);
    }
    if (body.transform) {
      body.transform = UtilService.tryParseJson(body.transform);
    }
    if (body.nextPageRequestOptions) {
      body.nextPageRequestOptions = UtilService.tryParseJson(body.nextPageRequestOptions);
    }

    return body;
  },
  async query(ctx) {
    let conditions = {};

    if (ctx.query.search) {
      conditions.$or = [{
        site: {
          $regex: _.escapeRegExp(ctx.query.search),
          $options: 'gi',
        }
      }];
    }

    return UtilService.conditionsQuerySend(CrawlerRule, ctx);
  },
  async get(ctx) {
    let id = ctx.params.id;

    return CrawlerRule.findById(id)
      .lean()
      .then((data) => {
        ctx.body = data;
      })
      .catch((e) => {
        ctx.wrapError(e);
      });
  },
  async create(ctx) {
    let body = await ctrl.transformBody(ctx.request.body);

    return CrawlerRule
      .findOneAndUpdate({
        site: body.site
      }, {
        $set: body,
      }, {
        upsert: true,
        new: true,
      })
      .lean()
      .then((data) => {
        ctx.body = data;
      })
      .catch((e) => {
        ctx.wrapError(e);
      })
      .then(() => {
        CrawlerService.updateShowArticleSites()
          .catch((e) => {
            logger.warn(e);
          });
      });
  },
  async export(ctx) {
    let rules = await CrawlerRule.find({}).lean();
    let buffer = new Buffer(JSON.stringify(rules));
    ctx.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=rule.json'
    });
    ctx.body = buffer;
  },
  async preview(ctx) {
    let body = await ctrl.transformBody(ctx.request.body);

    return CrawlerService.crawler(body)
      .then((result) => {
        ctx.body = result;
        return null;
      })
      .catch((e) => {
        ctx.wrapError(e);
      });
  },
};

module.exports = ctrl;
