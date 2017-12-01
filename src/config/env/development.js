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
    // 'WebhookService',
  ],
  proxiesCache: {
    ttl: 3600,
    requestOptions: {
      url: 'https://proxy-crawler.now.sh/api/v1/proxy?limit=3',
      json: true,
    },
  },
  request: {
    eval: {
      host: 'http://127.0.0.1:40002',
      url: 'http://127.0.0.1:40002/api/v1/eval',
      json: true,
    },
  },
};
