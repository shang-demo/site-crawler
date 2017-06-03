const ctrl = {
  async addOneRule(item) {
    let body = await ctrl.transformBody(item);

    return CrawlerRule
      .findOneAndUpdate({
        site: body.site
      }, {
        $set: body,
      }, {
        upsert: true,
        new: true,
      })
      .lean();
  },
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

    return _.omit(body, ['_id', 'createdAt', 'updatedAt', '__v']);
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
    return this.addOneRule(ctx.request.body)
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
  async export(ctx) {
    let rules = await CrawlerRule.find({}).lean();
    let buffer = new Buffer(JSON.stringify(rules));
    ctx.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=rule.json'
    });
    ctx.body = buffer;
  },
  async import(ctx) {
    let arr = ctx.request.body;

    return Promise
      .map(arr, (item) => {
        return ctrl.addOneRule(item);
      })
      .then(() => {
        return CrawlerService.updateShowArticleSites();
      })
      .then(() => {
        ctx.body = {};
      })
      .catch((e) => {
        ctx.wrapError(e);
      });
  },
};

module.exports = ctrl;
