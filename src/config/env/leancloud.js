const MONGODB_DATABASE = 'siteCrawler';
const MONGODB_USERNAME = 'siteCrawlerUser';
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
          host: 'us.mongo.xinshangshangxin.com',
          port: 13508,
        },
        {
          host: 'zh.mongo.xinshangshangxin.com',
          port: 13508,
        }
      ],
      database: MONGODB_DATABASE,
    },
  },
  port: process.env.LEANCLOUD_APP_PORT || 8080,
  ip: undefined,
  bootstrap: [
    'CrawlerService',
  ],
  request: {
    parser: {
      url: 'http://site-crawler-parser.xinshangshangxin.com/api/v1/parser',
      json: true,
      method: 'POST',
    },
    crawler: {
      url: 'http://site-crawler-service.xinshangshangxin.com/api/v1/crawler',
      json: true,
      method: 'POST',
    },
  },
};
