const Koa = require('koa');

module.exports = function exportKoa() {
  if (this.options.now) {
    return;
  }

  this.Koa = Koa;
  this.app = new Koa();
};
