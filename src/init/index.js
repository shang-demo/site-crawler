const _ = require('lodash');
const EventEmitter = require('events');
const path = require('path');
const Promise = require('bluebird');
const Koa = require('koa');

const symbolLift = Symbol('_lift');
const SymbolCheckMiddleware = Symbol('_checkMiddleware');

class My extends EventEmitter {
  constructor(options) {
    super();

    this.options = options || {};
    this.middlewares = [];

    this.init();

    if (options.now) {
      const app = new Koa();
      const port = 3000;

      app.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on server http://localhost:${port}`);
      });

      this.app = app;
    }
  }

  init() {
    this.environment = (process.env.NODE_ENV || 'development').trim();
    this.projectPath = path.join(__dirname, '../');
    this.promise = Promise.resolve();

    this.config = {};
    this.model = {};

    // 设置 alias
    if (this.options.alias) {
      global[this.options.alias] = this;
    }
    else {
      global.my = this;
    }

    global.logger = console;
    global.logger.trace = global.logger.log;
    global.logger.debug = global.logger.log;
  }

  use(middlewareName) {
    let middleware;
    if (_.isString(middlewareName)) {
      /* eslint-disable global-require */
      /* eslint-disable import/no-dynamic-require */
      middleware = require(path.join(this.projectPath, 'init/load', middlewareName));
    }
    else if (_.isFunction(middlewareName)) {
      middleware = middlewareName;
    }
    else {
      throw new Error('middleware should be string or function');
    }

    this.middlewares.push(middleware);
    return this;
  }

  [SymbolCheckMiddleware](name) {
    return Promise
      .each(this.middlewares, (middleware) => {
        if (_.isFunction(middleware[name])) {
          return middleware[name].call(this);
        }
        return undefined;
      })
      .then(() => {
        this.emit(`${name}ed`);
      })
      .catch((e) => {
        this.emit('error', e);
        return Promise.reject(e);
      });
  }


  [symbolLift]() {
    return Promise
      .each(this.middlewares, (middleware) => {
        if (_.isFunction(middleware)) {
          return middleware.call(this);
        }
        if (_.isFunction(middleware.lift)) {
          return middleware.lift.call(this);
        }
        return undefined;
      })
      .then(() => {
        this.emit('lifted');
        return null;
      })
      .catch((e) => {
        this.emit('error', e);
        return Promise.reject(e);
      });
  }

  lift() {
    this.promise = this.promise.then(() => {
      this[symbolLift]();
    });
    return this;
  }


  listen() {
    this.promise = this.promise.then(() => {
      return this[SymbolCheckMiddleware]('listen');
    });
    return this;
  }


  lower() {
    this.promise = this.promise.then(() => {
      return this[SymbolCheckMiddleware]('lower');
    });
    return this;
  }
}


module.exports = My;
