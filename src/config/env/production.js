const MONGO_URL = process.env.MONGO_URL;

module.exports = {
  log: {
    level: 'trace',
    requestBody: true,
    responseBody: false,
  },
  connections: {
    defaultMongo: {
      type: 'uri',
      uri: MONGO_URL
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
      url: 'https://site-parser-service.now.sh/api/v1/parser',
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
