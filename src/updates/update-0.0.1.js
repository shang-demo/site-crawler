let siteRules = [];

function lift(argStr) {
  logger.info('update-0.0.1 lift');

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
      return captureAll();
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
  });
  logger.info('siteRules: ', siteRules);
}

function parseArgs(args) {
  let defaultConfig = {};
  _.forEach(siteRules, (item) => {
    defaultConfig[item.site] = {};
  });

  let config;
  try {
    config = JSON.parse(args[0]);
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

// 采集所有页面
function captureAll() {
  siteRules.forEach((item) => {
    if (item.nextPageRequestOptions && item.curPage > 1) {
      item.requestOptions = replace(item.nextPageRequestOptions, item);
    }
  });

  return Promise
    .all(siteRules.map((item) => {
      logger.info('item.requestOptions: ', item.requestOptions);
      return CrawlerService.crawler(item)
        .catch((e) => {
          logger.warn(e);
          return {
            record: {},
          };
        });
    }))
    .then((data) => {
      _.forEachRight(data, (siteResult, i) => {
        if (!siteResult.record.total || siteResult.record.updateFailed) {
          // eslint-disable-next-line no-plusplus
          siteRules[i].canErrNu--;
          logger.warn('siteResult: ', siteResult);
        }
        else {
          logger.info('site success: ', siteResult.site, siteRules[i].curPage);
          siteRules[i].canErrNu = 3;
          // eslint-disable-next-line no-plusplus
          siteRules[i].curPage++;
        }

        if (siteRules[i].canErrNu < 0) {
          siteRules.splice(i, 1);
        }
      });
    })
    .then(() => {
      return captureAll();
    });
}


module.exports = lift;
