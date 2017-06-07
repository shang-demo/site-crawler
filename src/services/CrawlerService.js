const cacheManager = require('cache-manager');
const crawler = require('website-crawler');
const rp = require('request-promise');

const request = crawler.request;
const RetryStrategy = crawler.RetryStrategy;

const memoryCache = cacheManager.caching({ store: 'memory', max: 100, ttl: mKoa.config.proxiesCache.ttl });

const svc = {
  zdRequestOptions: null,
  zdJar: request.jar(),
  getZdRequestOptions() {
    svc.zdRequestOptions.jar = svc.zdJar;
    return _.assign({}, svc.zdRequestOptions);
  },
  async crawler(requestOptions, config = {}) {
    if (!config.proxies) {
      config.proxies = await this.getProxies();
    }

    if (config.site === 'zd') {
      return svc.crawlerZD(requestOptions, config);
    }

    return crawler(requestOptions, config);
  },
  async getProxies() {
    return memoryCache
      .wrap('proxies', () => {
        return rp(mKoa.config.proxiesCache.requestOptions)
          .then((data) => {
            return data;
          })
          .then((data) => {
            let arr = data.map((item) => {
              return item.url;
            });

            // 第一次 和 最后一次 不设置代理
            arr.unshift(null);
            arr.push(null);
            logger.info('cache proxies: ', arr);
            return arr;
          });
      })
      .catch((e) => {
        logger.warn(e);
        return [null, null];
      });
  },
  async evalCode(html, site) {
    let result = await rp({
      url: `${mKoa.config.request.eval.host}/api/v1/eval/${site}`,
      json: true,
      method: 'POST',
      body: {
        html,
      },
    });

    return result.data;
  },
  async crawlerZD(requestOptions, config = {}) {
    requestOptions.encoding = requestOptions.encoding || null;
    requestOptions.headers = requestOptions.headers || {};
    requestOptions.headers['User-Agent'] = requestOptions.headers['User-Agent'] ||
      {
        'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729)',
      };

    requestOptions.jar = svc.zdJar;
    let originUrl = requestOptions.url;
    let newUrl;

    logger.info('svc.zdJar.getCookieString(originUrl): ', svc.zdJar.getCookieString(originUrl));


    return crawler(requestOptions,
      {
        disableEncodingCheck: true,
        proxies: config.proxies,
        requestRetryStrategy(err, response) {
          logger.info('response.statusCode1: ', response.statusCode);
          if (!response || response.statusCode < 400) {
            return RetryStrategy.all(err, response);
          }

          return Promise
            .try(() => {
              return svc.evalCode(crawler.changeEncoding(response.body), 'zd');
            })
            .delay(3000)
            .then((url) => {
              requestOptions.url = url;
              newUrl = url;
              svc.zdRequestOptions = requestOptions;

              return crawler(requestOptions, {
                disableChangeEncoding: true,
                disableTransformRequestOptions: true,
                resolveWithFullResponse: true,
              }, {
                retries: 0,
              });
            })
            .spread((body, res) => {
              logger.info('response.statusCode2: ', res.statusCode);
              svc.zdJar.setCookie(svc.zdJar.getCookieString(newUrl), originUrl);
              return body;
            })
            .catch((e) => {
              logger.warn(e);
            });
        },
      });
  },
};

module.exports = svc;
