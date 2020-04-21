const MONGODB_DATABASE = 'production';
const MONGODB_USERNAME = 'productionUser';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

module.exports = {
  log: {
    level: 'trace',
    requestBody: true,
    responseBody: false,
  },
  connections: {
    defaultMongo: {
      username: MONGODB_USERNAME,
      password: MONGODB_PASSWORD,
      hosts: [
        {
          host: '112.74.107.82',
          port: 13508,
        }
      ],
      database: MONGODB_DATABASE,
    },
  },
  port: process.env.PORT || 8080,
  ip: undefined,
  bootstrap: [],
  proxiesCache: {
    ttl: 3600,
    requestOptions: {
      url: 'https://proxy-crawler.leanapp.cn/api/v1/proxy?limit=3',
      json: true,
    },
  },
  request: {
    eval: {
      host: 'http://site-crawler-eval.leanapp.cn',
    },
    headless: {
      url: 'http://headless.xinshangshangxin.com/'
    },
  },
};
