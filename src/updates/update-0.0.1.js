const promiseRetry = require('promise-retry');

let siteRules = [];

function lift(mKoa, argStr) {
  logger.info('update-0.0.1 lift');
  logger.info('argStr ', argStr);

  return Promise
    .try(() => {
      return CrawlerRule.find({}).lean();
    })
    .then((_siteRules) => {
      siteRules = _.filter(_siteRules, (rule) => {
        return rule.site !== 'iqq';
      });
    })
    .then(() => {
      return getSiteConfig(argStr);
    })
    .then(() => {
      return Promise
        .map(siteRules, (rule) => {
          return Promise.resolve()
            .then(() => {
              return captureSite(rule);
            })
            .reflect();
        })
        .each((inspection) => {
          if (inspection.isFulfilled()) {
            logger.info('A promise in the array was fulfilled with', inspection.value());
          }
          else {
            logger.error('A promise in the array was rejected with', inspection.reason());
          }
        });
    });
}

function getSiteConfig(argStr) {
  let sitesConfig = parseArgs(argStr);
  logger.info('sitesConfig: ', sitesConfig);

  _.forEachRight(siteRules, (item, i) => {
    let siteConfig = sitesConfig[item.site];
    if (!siteConfig || siteConfig.disabled) {
      siteRules.splice(i, 1);
      return;
    }

    item.curPage = siteConfig.curPage || 2;
    item.canErrNu = siteConfig.canErrNu || 3;

    item.isUpdate = true;
    item.isErr = false;

    // special for site ZD
    if (item.site === 'zd' && _.get(item, 'transform.date')) {
      item.transform.date.param = 'YYYYMMDD';
    }
  });

  logger.info('siteRules: ', siteRules);
}

function parseArgs(argStr) {
  let defaultConfig = {};
  _.forEach(siteRules, (item) => {
    defaultConfig[item.site] = { disabled: true };
  });

  let config;
  try {
    config = JSON.parse(argStr);
  }
  catch (e) {
    logger.warn(e);
  }

  if (_.isObject(config)) {
    _.assign(defaultConfig, config);
  }

  return defaultConfig;
}

function replace(obj, map) {
  let str = JSON.stringify(obj);
  let replaceStr = str.replace(/{{([^{}]+)}}/gi, (match, p1) => {
    return map[p1];
  });
  try {
    return JSON.parse(replaceStr);
  }
  catch (e) {
    logger.warn(e);
    return obj;
  }
}

function captureSite(siteInfo, deferred = UtilService.defer()) {
  if (siteInfo.curPage > 1) {
    if (!siteInfo.nextPageRequestOptions) {
      return deferred.reject(new Errors.NoNextPageRequestOptions());
    }

    siteInfo.requestOptions = replace(siteInfo.nextPageRequestOptions, siteInfo);
  }

  promiseRetry(
    (retry, nu) => {
      if (nu > 1) {
        logger.info(`retry ${nu} for ${siteInfo.site} at ${siteInfo.curPage} page `);
      }

      return CrawlerService.crawlerAndSave(siteInfo)
        .then((siteResult) => {
          if (!siteResult.record.total || siteResult.record.updateFailed) {
            return Promise.reject(new Errors.NoArticleCrawler());
          }

          logger.info('site success: ', siteResult.site, siteInfo.curPage);
          return null;
        })
        .catch(retry);
    }, { retries: 1, factor: 1 })
    .then(() => {
      siteInfo.curPage += 1;
      return captureSite(siteInfo, deferred);
    })
    .catch((e) => {
      logger.warn(e);
      logger.warn('site error: ', siteInfo.site, siteInfo.curPage);
      deferred.reject(e);
    });

  return deferred.promise;
}


module.exports = lift;
