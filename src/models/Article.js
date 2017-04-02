module.exports = {
  attributes: {
    title: {
      type: String,
      required: true,
    },
    href: { // 文章详情链接
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    img: {
      type: String,
    },
    time: { // 文章更新时间
      type: Date,
    },
    intro: { // 简介
      type: String
    },
    site: { // 站点名称
      type: String,
      required: true,
    },
    gatherTime: { // 采集更新时间
      type: Date,
    },
    classify: {
      type: Array //        ['mac', 'iOS', 'windows', 'Android', 'news']
    },
  },
};
