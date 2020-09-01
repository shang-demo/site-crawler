const MONGODB_DATABASE = 'noName';
const MONGODB_USERNAME = 'noNameUser';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || 'WhvyGd6tH4VpL44k';

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
      hosts: [],
      database: MONGODB_DATABASE,
    },
  },
  port: process.env.LEANCLOUD_APP_PORT || 8080,
  graphql: {
    graphiql: true,
  },
  ip: undefined,
  bootstrap: [],
};
