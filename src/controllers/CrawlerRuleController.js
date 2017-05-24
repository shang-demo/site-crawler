const ctrl = {
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
    let body = ctx.request.body;

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
};

module.exports = ctrl;
