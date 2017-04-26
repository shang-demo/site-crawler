const My = require('./init/index');

const lift = new My({ alias: 'mKoa' })
  .use('config')
  .use('logger')
  .use('errors')
  .use('service')
  .use('controller')
  .use('policy')
  .use('koa')
  .use('koa-route')
  .lift();

module.exports = lift;
