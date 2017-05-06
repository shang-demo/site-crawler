
const PASSWORD = process.env.MONGODB_PASSWORD;
const DATABASE = 'siteCrawler';

module.exports = {
  log: {
    level: 'trace',
    requestBody: true,
    responseBody: false,
  },
  connections: {
    defaultMongo: {
      type: 'uri',
      uri: `mongodb://q2234037172:${PASSWORD}@cluster0-shard-00-00-g30bn.mongodb.net:27017,cluster0-shard-00-01-g30bn.mongodb.net:27017,cluster0-shard-00-02-g30bn.mongodb.net:27017/${DATABASE}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`,
      collectionPrefix: '',
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
  port: process.env.LEANCLOUD_APP_PORT || 8080,
  ip: undefined,
  bootstrap: [
    'WebhookService',
  ],
  request: {
    parser: {
      url: 'http://site-parser-service.leanapp.cn/api/v1/parser',
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


// var mongoOptionalConfig = {
//  coding: {
//    type: 'fun',
//    fun: function() {
//      try {
//        return _.get(JSON.parse(process.env.VCAP_SERVICES), 'mongodb[0].credentials.uri');
//      }
//      catch(e) {
//        return false;
//      }
//    }
//  },
//  docker: {
//    type: 'env',
//    condition: 'host',
//    username: 'MONGO_USERNAME',
//    password: 'MONGO_PASSWORD',
//    host: 'MONGO_PORT_27017_TCP_ADDR',
//    post: 'MONGO_PORT_27017_TCP_PORT',
//    name: 'MONGO_INSTANCE_NAME'
//  },
//  daoCloud: {
//    type: 'env',
//    condition: 'host',
//    username: 'MONGODB_USERNAME',
//    password: 'MONGODB_PASSWORD',
//    host: 'MONGODB_PORT_27017_TCP_ADDR',
//    post: 'MONGODB_PORT_27017_TCP_PORT',
//    name: 'MONGODB_INSTANCE_NAME'
//  },
//  openshift: {
//    type: 'env',
//    condition: 'host',
//    username: 'OPENSHIFT_MONGODB_DB_USERNAME',
//    password: 'OPENSHIFT_MONGODB_DB_PASSWORD',
//    host: 'OPENSHIFT_MONGODB_DB_HOST',
//    post: 'OPENSHIFT_MONGODB_DB_PORT',
//    name: 'OPENSHIFT_APP_NAME'
//  }
// };
