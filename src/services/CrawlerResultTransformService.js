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
  },
  transformOne({ fn, param, params } = {}, item = {}, key) {
    /* eslint-disable no-param-reassign */
    if (!params || !params.length) {
      params = [param];
    }
    if (svc.map[fn]) {
      let args = [item, key, ...params];
      return svc.map[fn](...args);
    }

    return item[key];
  },
  transformResult(result, transform = {}) {
    let now = new Date();

    return _.map(result || [], (item, i) => {
      _.forEach(transform, (obj, key) => {
        item[key] = svc.transformOne(obj, item, key);
      });

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
  },
};

module.exports = svc;
