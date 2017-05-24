const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const iconv = require('iconv-lite');

const { timeConversion } = require('./Constants');

const svc = {
  isMongoError(err) {
    return err.name === 'MongoError';
  },
  isMongoDuplicateKeyError(err) {
    return err.code === 11000 && err.name === 'MongoError';
  },
  defer() {
    let resolve;
    let reject;
    let promise = new Promise((...param) => {
      resolve = param[0];
      reject = param[1];
    });
    return {
      resolve,
      reject,
      promise,
    };
  },
  spawnDefer(option) {
    let deferred = svc.defer();
    if (!option) {
      return deferred.reject(new Error('no option'));
    }

    if (option.platform) {
      // eslint-disable-next-line no-param-reassign
      option.cmd = (process.platform === 'win32' ? (`${option.cmd}.cmd`) : option.cmd);
    }
    let opt = {
      stdio: 'inherit',
    };
    // set ENV
    let env = Object.create(process.env);
    env.NODE_ENV = (option.NODE_ENV || process.env.NODE_ENV || 'development').trim();
    opt.env = env;

    let proc = spawn(option.cmd, option.arg, opt);
    deferred.promise.proc = proc;
    proc.on('error', (err) => {
      logger.info(err);
    });
    proc.on('exit', (code) => {
      if (code !== 0) {
        return deferred.reject(code);
      }
      return deferred.resolve();
    });
    return deferred.promise;
  },
  spawnAsync(option) {
    if (!option) {
      return Promise.reject(new Error('no option'));
    }

    return new Promise((resolve, reject) => {
      if (option.platform) {
        // eslint-disable-next-line no-param-reassign
        option.cmd = (process.platform === 'win32' ? (`${option.cmd}.cmd`) : option.cmd);
      }
      let opt = { stdio: 'inherit' };
      // set ENV
      let env = Object.create(process.env);
      env.NODE_ENV = (option.NODE_ENV || process.env.NODE_ENV || 'development').trim();
      opt.env = env;

      let cmd = spawn(option.cmd, option.arg, opt);
      cmd.on('error', (err) => {
        logger.error(err);
      });
      cmd.on('exit', (code) => {
        if (code !== 0) {
          return reject(code);
        }
        return resolve();
      });
    });
  },
  execAsync(cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          return reject(error);
        }

        return resolve(stdout || stderr);
      });
    });
  },
  promiseWhile: Promise.method((condition, action) => {
    if (!condition()) {
      return Promise.resolve(null);
    }
    return action().then(svc.promiseWhile.bind(null, condition, action));
  }),
  escapeRegExp(str, disAbleRegExp) {
    if (!str) {
      return null;
    }

    // eslint-disable-next-line no-param-reassign
    str = str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
    if (disAbleRegExp === true) {
      return str;
    }

    return new RegExp(str, 'gi');
  },
  getConditions(ctx, { conditions = {}, projection, options }) {
    let opt = {
      sort: ctx.query.sort || { _id: -1 },
    };

    if (ctx.query.skip || ctx.query.page || ctx.query.limit) {
      opt.limit = parseInt(ctx.query.limit, 10) || 20;

      if (ctx.query.page) {
        opt.skip = opt.limit * (parseInt(ctx.query.page, 10) - 1);
      }
      else if (ctx.query.skip) {
        opt.skip = parseInt(opt.skip, 10);
      }

      opt.skip = opt.skip || 0;
    }

    opt = _.assign(opt, options);

    let query = {};

    let from = ctx.query.from;
    if (from) {
      query.createdAt = {
        $gte: new Date(from),
      };
    }

    let to = ctx.query.to;
    if (to) {
      query.createdAt = query.createdAt || {};
      query.createdAt.$lte = new Date(to);
    }

    query = _.assign(query, conditions);
    return {
      conditions: query,
      projection,
      options: opt,
    };
  },
  conditionsQuery(Model, ctx, opt = {}) {
    let { conditions, projection, options } = svc.getConditions(ctx, opt);

    return Promise
      .props({
        total: Model.count(conditions),
        data: Model.find(conditions, projection, options),
      })
      .then((result) => {
        if (opt.filter) {
          result.data = opt.filter(result.data);
        }
        return result;
      });
  },
  conditionsQuerySend(Model, ctx, error, opt = {}) {
    return svc.conditionsQuery(Model, ctx, opt)
      .then((result) => {
        let totalName = opt.totalName || 'x-total';
        ctx.set(totalName, result.total);
        return result.data;
      })
      .then((data) => {
        ctx.body = data;
      })
      .catch((e) => {
        return ctx.wrapError(e, error);
      });
  },
  calculateTimeLen(millisecond) {
    /* eslint-disable no-param-reassign */
    let arr = [];
    let yearNu = parseInt(millisecond / timeConversion.year, 10);
    if (yearNu >= 1) {
      arr.push(`${yearNu} 年`);
      millisecond -= yearNu * timeConversion.year;
    }
    let monthNu = parseInt(millisecond / timeConversion.month, 10);
    if (monthNu >= 1) {
      arr.push(`${monthNu} 月`);
      millisecond -= monthNu * timeConversion.month;
    }
    let dayNu = parseInt(millisecond / timeConversion.day, 10);
    if (dayNu >= 1) {
      arr.push(`${dayNu} 天`);
      millisecond -= dayNu * timeConversion.day;
    }
    let hourNu = parseInt(millisecond / timeConversion.hour, 10);
    if (hourNu >= 1) {
      arr.push(`${hourNu} 小时`);
      millisecond -= hourNu * timeConversion.hour;
    }
    let minuteNu = parseInt(millisecond / timeConversion.minute, 10);
    if (minuteNu >= 1) {
      arr.push(`${minuteNu} 分`);
      millisecond -= minuteNu * timeConversion.minute;
    }
    let secondNu = parseInt(millisecond / timeConversion.second, 10);
    if (secondNu >= 1) {
      arr.push(`${secondNu} 秒`);
      millisecond -= secondNu * timeConversion.second;
    }
    arr.push(`${millisecond} 毫秒`);
    return arr.join('/');
  },
  changeEncoding(data, encoding, noCheck) {
    let val = iconv.decode(data, encoding || 'utf8');
    if (!noCheck && val.indexOf('�') !== -1) {
      val = iconv.decode(data, 'gbk');
    }
    return val;
  },
  getFewDaysAgo(n, startDay) {
    startDay = svc.getZeroDay(startDay);

    if (!n) {
      return startDay;
    }

    let fewDaysAgo = new Date(startDay);
    fewDaysAgo.setDate(startDay.getDate() - n);
    return fewDaysAgo;
  },
  getZeroDay(date) {
    date = date ? (new Date(date)) : (new Date());
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  },
  parseJson(str) {
    if (!_.isString(str)) {
      return str;
    }
    try {
      return JSON.parse(str);
    }
    catch (e) {
      return null;
    }
  },
  compareTime(date1, date2, len) {
    return Math.abs(new Date(date1).getTime() - new Date(date2).getTime()) < len;
  },
  tryParseJson(str) {
    try {
      return JSON.parse(str);
    }
    catch (e) {
      logger.warn(e);
      return null;
    }
  }
};

module.exports = svc;
