const rp = require('request-promise');

const { transformResult } = CrawlerResultTransformService;
const { gatherTags, minUpdateLen, articleUpdateLen } = Constants;
const { allSites } = CaptureService;
// const allSites = [CaptureService.allSites[4]];

// 服务器最新采集时间
let updateTime = 0;

const ctrl = {
  async query(ctx) {
    let conditions = {};
    if (ctx.query.sites) {
      conditions = {
        site: {
          $in: ctx.query.sites,
        },
      };
    }
    else {
      conditions.site = {
        $ne: 'iqq',
      };
    }

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
              gatherTime: -1,
              time: -1,
            }
          }
        });
      });
  },
  async crawler(siteInfo) {
    logger.info('start update site： ', siteInfo.site);

    return rp(_.assign({
      body: {
        requestOptions: siteInfo.requestOptions,
      }
    }, mKoa.config.request.crawler))
      .then((data) => {
        return rp(_.assign({
          body: {
            html: data.html,
            sitemap: siteInfo.sitemap,
          }
        }, mKoa.config.request.parser));
      })
      .then((data) => {
        return transformResult(data, siteInfo.transform);
      })
      .map((article) => {
        return ctrl.addArticleGatherTag(article);
      })
      .map((article) => {
        if (article.gatherTag === gatherTags.same) {
          return article;
        }

        article.site = siteInfo.site;

        return Article
          .findOneAndUpdate(
            { href: article.href },
            article,
            { upsert: true }
          )
          .then(() => {
            return article;
          })
          .catch((e) => {
            logger.warn(article, e);
            article.gatherTag = gatherTags.updateFailed;
            return article;
          });
      })
      .then((articles) => {
        let result = {
          total: articles.length,
        };

        let sumFun = _.reduce(gatherTags, (obj, value, tag) => {
          obj[value] = function sum() {
            result[tag] = (result[tag] || 0) + 1;
            return result[tag];
          };

          return obj;
        }, {});

        _.forEach(articles, (article) => {
          sumFun[article.gatherTag]();
        });

        logger.info(siteInfo.site, result);
        return {
          site: siteInfo.site,
          record: result,
        };
      })
      .then((record) => {
        return CrawlerLog.create(record);
      });
  },
  async addArticleGatherTag(article) {
    return Article
      .findOne({
        href: article.href,
      })
      .then((_article) => {
        if (!_article) {
          article.gatherTag = gatherTags.new;
        }
        // 作者文章更新时间超过 articleUpdateLen
        else if (!UtilService.compareTime(article.time, _article.time, articleUpdateLen)) {
          article.gatherTag = gatherTags.updateContent;
        }
        else if (article.img !== _article.img) {
          article.gatherTag = gatherTags.updateImage;
        }
        else {
          article.gatherTag = gatherTags.same;
        }

        return article;
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
    Promise.map(allSites, (site) => {
      return ctrl.crawler(site);
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
        allSites.forEach((site) => {
          if (site.site === ctx.params.site) {
            data.description = site.description;
            data.url = site.requestOptions.url;
          }
        });

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
