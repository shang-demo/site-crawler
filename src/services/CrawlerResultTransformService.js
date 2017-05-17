const moment = require('moment');
const TimerParserService = require('./TimerParserService');

const svc = {
  map: {
    formatDate(item, key, fmt) {
      return TimerParserService.calculateTime(item[key], fmt);
    },
    setFieldValue(item, key, field) {
      return item[field];
    },
    defaultValue(item, key, val) {
      return val;
    },
    addPrefix(item, key, val) {
      return val + item[key];
    },
    constant(item, key, val) {
      return val;
    },
    or(...args) {
      let [item, key] = args.splice(0, 2);
      let result = null;

      _.forEach(args, (obj) => {
        let data = svc.transformOne(obj, item, key);
        if (data !== undefined) {
          result = data;
          return false;
        }
        return true;
      });

      return result;
    },
    switchCase(...args) {
      let [item, key] = args.splice(0, 2);

      return Promise
        .filter(args, (obj) => {
          if (obj.default) {
            return true;
          }
          return new RegExp(obj.match.regex, obj.match.options).test(item[key]);
        })
        .then((arr) => {
          if (arr.length) {
            return svc.transformOne(arr[0], item, key);
          }
          return null;
        });
    },
  },
  transformOne({ fn, param, params } = {}, item = {}, key) {
    /* eslint-disable no-param-reassign */
    return Promise.try(() => {
      if (!params || !params.length) {
        params = [param];
      }
      if (svc.map[fn]) {
        let args = [item, key, ...params];
        return svc.map[fn](...args);
      }

      return item[key];
    });
  },
  transformResult(result, transform = {}) {
    let now = new Date();

    return Promise
      .map(result || [], (item, i) => {
        return Promise
          .each(Object.keys(transform), (key) => {
            return svc.transformOne(transform[key], item, key)
              .then((data) => {
                item[key] = data;
              });
          })
          .then(() => {
            let date = moment(item.date).startOf('day').format('YYYYMMDD');

            return {
              date,
              href: item.href,
              title: item.title,
              gatherTime: now.getTime() + (1000 - i),
              img: item.img,
              time: new Date(item.date).getTime() + (1000 - i),
              intro: item.intro,
            };
          });
      });
  },
};

module.exports = svc;
