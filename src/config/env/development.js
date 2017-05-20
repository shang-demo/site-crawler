
module.exports = {
  log: {
    level: 'trace',
    requestBody: true,
    responseBody: false,
  },
  connections: {
    defaultMongo: {
      dbName: 'noDbName',
      appId: process.env.APP_ID,
      appKey: process.env.APP_KEY,
      masterKey: process.env.MASTER_KEY,
    },
  },
  auth: {
    tokenExpiresIn: 7200,
    superSecret: process.env.SUPER_SECRET || 'SUPER_SECRET',
  },
  execCmdKey: process.env.EXEC_CMD_KEY || 'key',
  mailTransport: {
    host: 'smtp.sina.com',
    port: 465,
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: 'test4code@sina.com',
      pass: 'Test4code;',
    },
  },
  update: {
    ref: 'master',
  },
  port: process.env.PORT || 1337,
  bootstrap: [
    // 'WebhookService',
  ],
  proxiesCache: {
    ttl: 3600,
    requestOptions: {
      url: 'https://proxy-crawler.leanapp.cn/api/v1/proxy?limit=3',
      json: true,
    },
  },
};
