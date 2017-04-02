const proxyConfig = {
  urls: ['https://gather-proxy.leanapp.cn/api/v1/combine?nu=2'],
  beforeProxies: [null],
  afterProxies: [null],
};

// const proxyConfig = null;
const gather = require('gather-site').defaults(null, null, proxyConfig);

const { gatherTags, minUpdateLen, articleUpdateLen } = Constants;
const { allSites } = CaptureService;
// const allSites = [CaptureService.allSites[1]];

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

    logger.info('ctx.query.sites: ', ctx.query.sites);
    logger.info('conditions: ', conditions);

    await UtilService.conditionsQuerySend(Article, ctx, new Errors.UnknownError(), {
      conditions,
      options: {
        sort: {
          time: -1,
          updatedAt: -1,
        }
      }
    });
  },
  async crawler(siteInfo) {
    logger.info('start update site： ', siteInfo.site);

    await Promise
      .try(() => {
        return gather(_.assign({
          timeout: 15 * 1000
        }, siteInfo.requestConfig), siteInfo.parseConfig);
      })
      .then((data) => {
        return data.articleList || [];
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
