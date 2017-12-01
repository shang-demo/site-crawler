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
          host: '112.74.107.82',
          port: 13508,
        }
      ],
      database: MONGODB_DATABASE,
    },
  },
  port: process.env.PORT || 3000,
  graphql: {
    graphiql: true,
  },
  ip: undefined,
  bootstrap: [
    'CrawlerService',
  ],
  request: {
    parser: {
      url: 'http://site-parser-service.now.sh/api/v1/parser',
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
