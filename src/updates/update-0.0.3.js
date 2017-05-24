const moment = require('moment');

function lift() {
  logger.info('update-0.0.3 lift');

  return Promise
    .try(() => {
      return Article
        .find({
          date: {
            $gte: moment().subtract(3, 'day').format('YYYYMMDD'),
          },
        })
        .lean()
        .then((data) => {
          return data;
        });
    })
    .map((article) => {
      return Article
        .update({
          _id: article._id
        }, {
          date: moment(article.time).subtract(1, 'year').format('YYYYMMDD'),
        });
    }, {
      concurrency: 100,
    });
}

module.exports = lift;
