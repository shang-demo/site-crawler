const ArticleController = require('../controllers/ArticleController');

let sites = [];

function lift() {
  logger.info('update-0.0.1 lift');
  sites = CaptureService.allSites;

  return Promise
    .try(() => {
      return getSiteConfig();
    })
    .then(() => {
      return captureAll();
    });
}

function getSiteConfig() {
  let sitesConfig = parseArgs(process.argv.slice(2));

  _.forEachRight(sites, function (item, i) {
    let siteConfig = sitesConfig[item.site];
    if (!siteConfig || siteConfig.disabled) {
      sites.splice(i, 1);
      return;
    }

    item.curPage = siteConfig.curPage || 1;
    item.canErrNu = siteConfig.canErrNu || 3;

    item.isUpdate = true;
    item.isErr = false;
  });
}

function parseArgs(args) {
  let defaultConfig = {};
  _.forEach(sites, function (item) {
    defaultConfig[item.site] = {};
  });

  let config;
  try {
    config = JSON.parse(args[0]);
  }
  catch (e) {
  }

  if (_.isObject(config)) {
    _.assign(defaultConfig, config);
  }
  return defaultConfig;
}

// 采集所有页面
function captureAll() {
  sites.forEach(function (item) {
    if (item.pageFun) {
      item.requestConfig.url = item.pageFun(item.curPage);
    }
    else {
      item.requestConfig.url = item.requestConfig.url.replace(/(page\/\d+)+/, '');
      item.requestConfig.url = item.requestConfig.url + 'page/' + item.curPage;
    }
    item.url = item.requestConfig.url;
  });

  return Promise
    .all(sites.map(function (item) {
      return ArticleController.crawler(item)
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
          sites[i].canErrNu--;
          logger.warn('siteResult: ', siteResult);
        }
        else {
          logger.info('site success: ', siteResult.site, sites[i].curPage);
          sites[i].canErrNu = 3;
          sites[i].curPage++;
        }

        if (sites[i].canErrNu < 0) {
          sites.splice(i, 1);
        }
      });
    })
    .then(() => {
      return captureAll();
    });
}


module.exports = lift;
