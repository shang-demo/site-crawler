module.exports = {
  connections: {
    defaultMongo: {
      hosts: [
        {
          host: '127.0.0.1',
        }
      ],
      database: 'noName',
    },
  },
  bootstrap: [
    'CrawlerService',
    // 'WebhookService',
  ],
  request: {
    parser: {
      url: 'https://site-parser-service.now.sh/api/v1/parser',
      // url: 'http://localhost:1338/api/v1/parser',
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
