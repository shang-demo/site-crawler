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

    body.requestOptions = UtilService.tryParseJson(body.requestOptions);
    body.sitemap = UtilService.tryParseJson(body.sitemap);
    body.transform = UtilService.tryParseJson(body.transform);

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
      });
  },
};

module.exports = ctrl;
