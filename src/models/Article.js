module.exports = {
  attributes: {
    href: { // 文章详情链接
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    date: { // start of day
      type: String,
      required: true,
      index: true,
    },
    site: { // 站点名称
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    time: { // 文章更新时间
      type: Date,
    },
    intro: { // 简介
      type: String
    },
    gatherTime: { // 采集更新时间
      type: Date,
    },
    classify: {
      type: Array //        ['mac', 'iOS', 'windows', 'Android', 'news']
    },
  },
};
