const cacheManager = require('cache-manager');
const crawler = require('website-crawler');
const rp = require('request-promise');

const memoryCache = cacheManager.caching({ store: 'memory', max: 100, ttl: mKoa.config.proxiesCache.ttl });

const svc = {
  async crawler(requestOptions, config = {}) {
    // if (!config.proxies) {
    //   config.proxies = await this.getProxies();
    // }

    if (requestOptions.mode === 'headless') {
      const code = `
const browser = await puppeteer.connect();
const page = await browser.newPage();
await page.goto('${requestOptions.url}', {waitUntil: 'networkidle2', timeout: 60000});
if (${requestOptions.device ? 'true' : 'false'}) {
  await page.emulate(DeviceDescriptors['${requestOptions.device}'])
}
await page.evaluate(async () => {
  const scrollingElement = document.scrollingElement || document.body;

  const scrollHeight = scrollingElement.scrollHeight;
  const viewHeight =
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  let currentHeight = 0;
  while (currentHeight + viewHeight < scrollHeight) {
    currentHeight += viewHeight;
    scrollingElement.scrollTo({ top: currentHeight, left: 0, behavior: 'smooth' });
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }
});
await Promise.delay(3000);
const result = await page.content();
await browser.close();
return result;
      `;
      logger.info(code);
      // eslint-disable-next-line no-param-reassign
      requestOptions = {
        method: 'POST',
        url: mKoa.config.request.headless.url,
        body: {
          code,
        },
        json: true,
      };

      const result = await rp(requestOptions);
      return result;
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
};

module.exports = svc;
