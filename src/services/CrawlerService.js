const cacheManager = require('cache-manager');
const crawler = require('website-crawler');
const rp = require('request-promise');

const memoryCache = cacheManager.caching({ store: 'memory', max: 100, ttl: mKoa.config.proxiesCache.ttl });

const svc = {
  async crawler(requestOptions, config = {}) {
    if (!config.proxies) {
      requestOptions.proxies = await this.getProxies();
      // 第一次 和 最后一次 不设置代理
      requestOptions.proxies.unshift(null);
      requestOptions.proxies.push(null);
    }

    return crawler(requestOptions, config);
  },
  async getProxies() {
    return memoryCache
      .wrap('proxies', () => {
        return rp(mKoa.config.proxiesCache.requestOptions)
          .then((data) => {
            logger.info('cache proxies: ', data);
            return data;
          });
      })
      .catch((e) => {
        logger.warn(e);
        return [null];
      });
  },
};

module.exports = svc;
