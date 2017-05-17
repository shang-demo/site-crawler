const { minUpdateLen } = Constants;

// 服务器最新采集时间
let updateTime = 0;

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
    if (new Date().getTime() - new Date(updateTime).getTime() < minUpdateLen) {
      logger.info('last update in 2 min');
      ctx.body = { start: false };
      return;
    }

    updateTime = new Date();
    ctx.body = { start: true };

    // not wait return
    Promise
      .try(() => {
        return CrawlerRule.find({}).lean();
      })
      .map((site) => {
        return CrawlerService.crawler(site)
          .catch((e) => {
            logger.warn(site.site);
            logger.warn(e);
          });
      })
      .catch((e) => {
        logger.warn(e);
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
    ctx.body = {
      updateTime,
    };
  },
};

module.exports = ctrl;
