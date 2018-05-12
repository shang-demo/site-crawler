const ctrl = {
  async query(ctx) {
    let conditions = {
      site: {
        $in: ctx.query.sites || CrawlerService.getQuerySites(),
      },
    };

    if (ctx.query.search) {
      conditions.$or = [{
        title: {
          $regex: _.escapeRegExp(ctx.query.search),
          $options: 'gi',
        }
      }, {
        intro: {
          $regex: _.escapeRegExp(ctx.query.search),
          $options: 'gi',
        }
      }];
    }

    logger.info('ctx.query.sites: ', ctx.query.sites);
    logger.info('conditions: ', conditions);

    await Promise.delay(0)
      .then(() => {
        return UtilService.conditionsQuerySend(Article, ctx, new Errors.UnknownError(), {
          conditions,
          options: {
            sort: {
              date: -1,
              gatherTime: -1,
            }
          }
        });
      });
  },
  async taskUpdate(ctx) {

    if (!ctx.query.wait) {
      ctx.body = { start: true };

      Promise
        .try(() => {
          return CrawlerRule.find({}).lean();
        })
        .map((site) => {
          return CrawlerService.crawlerAndSave(site)
            .catch((e) => {
              logger.warn(site.site);
              logger.warn(e);
            });
        })
        .catch((e) => {
          logger.warn(e);
        });

      return null;
    }

    // not wait return
    return Promise
      .try(() => {
        return CrawlerRule.find({}).lean();
      })
      .map((site) => {
        return CrawlerService.crawlerAndSave(site)
          .catch((e) => {
            logger.warn(site.site);
            logger.warn(e);
          });
      })
      .then((data) => {
        ctx.body = {
          start: true,
          data: data,
        };
      })
      .catch((e) => {
        logger.warn(e);
        ctx.body = {
          start: false,
          data: e,
        };
      });
  },
  async crawlerRecord(ctx) {
    if (!ctx.params.site) {
      return ctx.wrapError(new Errors.NeedSite());
    }

    let conditions = {
      site: ctx.params.site,
    };
    let options = {
      sort: {
        _id: -1
      },
    };
    let projection = '-record';

    return CrawlerLog.findOne(conditions, projection, options)
      .lean()
      .then((data) => {
        ctx.body = data;
      })
      .catch((e) => {
        ctx.wrapError(e);
      });
  },
  async getUpdateTime(ctx) {
    return CrawlerLog.findOne()
      .sort({ createdAt: -1 })
      .lean()
      .then((result) => {
        ctx.body = {
          updateTime: result.createdAt,
        };
      })
      .catch((e) => {
        logger.warn(e);
        ctx.body = {
          updateTime: 0,
        };
      });
  },
};

module.exports = ctrl;
