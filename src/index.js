require('./now.js');
const My = require('./init/index');

const lift = new My({ alias: 'mKoa', now: process.env.NOW })
  .use('config')
  .use('logger')
  .use('errors')
  .use('model')
  .use('service')
  .use('controller')
  .use('policy')
  .use('bootstrap')
  .use('koa')
  .use('koa-route')
  .lift();

module.exports = lift;
