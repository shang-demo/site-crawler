const rp = require('request-promise');
const { transformResult } = require('./CrawlerResultTransformService');
const { gatherTags } = require('./Constants');

const svc = {
  querySite: [],
  async lift() {
    return svc.updateShowArticleSites();
  },
  async crawler(siteInfo) {
    logger.info('start update site： ', siteInfo.site);

    return rp(_.assign({
      body: {
        requestOptions: siteInfo.requestOptions,
        config: {
          site: siteInfo.site,
        },
      },
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
        return svc.addArticleGatherTag(article);
      });
  },
  async crawlerAndSave(siteInfo) {
    return Promise
      .try(() => {
        return svc.crawler(siteInfo);
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
        else if (article.date !== _article.date) {
          logger.info('article.date: ', article.date, 'origin: ', _article.date, article.href);
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
  async updateShowArticleSites() {
    return CrawlerRule
      .find({
        isShowArticle: true,
      }, {
        site: 1,
      })
      .lean()
      .then((data) => {
        svc.querySite = _.map(data, 'site');
        logger.info('querySite: ', svc.querySite);
      });
  },
  getQuerySites() {
    return svc.querySite;
  },
};

module.exports = svc;
