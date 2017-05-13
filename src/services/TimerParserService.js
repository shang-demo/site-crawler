const moment = require('moment');

const { timeConversion, chineseMothMap, englishMonthMao } = require('./Constants');

const svc = {
  calculateTime(dateStr, fmt) {
    let date = this.formatDate(dateStr, fmt);

    if (!moment.isDate(date)) {
      logger.warn('not valid date for ', dateStr, fmt);
      return new Date().getTime();
    }
    return date.getTime();
  },
  formatDate(dateStr, fmt = 'YYYYMMDD') {
    /* eslint-disable no-param-reassign */
    if (fmt === 'chinese-offset') {
      return svc.offsetChinese(dateStr);
    }

    // CM = C + M = chinese month
    if (/CM/.test(fmt)) {
      fmt = fmt.replace('CM', 'MM');
      _.forEachRight(chineseMothMap, (value, key) => {
        dateStr = dateStr.replace(key, value);
      });
    }
    // EM = E + M = english month
    if (/EM/.test(fmt)) {
      fmt = fmt.replace('EM', 'MM');
      _.forEachRight(englishMonthMao, (value, key) => {
        dateStr = dateStr.replace(key, value);
      });
    }

    return moment(dateStr, fmt).toDate();
  },
  offsetChinese(dateStr) {
    let key;
    if (/秒前/.test(dateStr)) {
      key = 'second';
    }
    else if (/分钟前/.test(dateStr)) {
      key = 'minute';
    }
    else if (/小时前/.test(dateStr)) {
      key = 'hour';
    }
    else if (/天前/.test(dateStr)) {
      key = 'day';
    }
    else if (/周前/.test(dateStr)) {
      key = 'week';
    }
    else if (/month/.test(dateStr)) {
      key = 'hour';
    }
    else if (/年前/.test(dateStr)) {
      key = 'year';
    }
    else {
      return null;
    }

    return new Date(new Date() - (parseInt(dateStr, 10) * timeConversion[key]));
  }
};

module.exports = svc;
