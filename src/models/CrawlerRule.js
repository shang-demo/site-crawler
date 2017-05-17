module.exports = {
  attributes: {
    // 站点别名
    site: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    // 请求参数, 支持request参数
    requestOptions: {
      type: Mixed,
      required: true,
    },
    // 通过 Web Scraper获取到的参数
    // https://chrome.google.com/webstore/detail/web-scraper/jnhgnonknehpejjnehehllkliplmbmhn
    sitemap: {
      type: Mixed,
      required: true,
    },
    // 转换方法, 比如将日期格式化
    transform: {
      type: Mixed,
    },
    // 描述, 用于显示
    description: {
      type: Mixed,
    },
    // 链接, 用于 点击 描述时打开的页面
    href: {
      type: String,
    },
    // 从第二页开始的url
    pageRule: {
      type: String,
    },
    // 是否显示文章
    isShowArticle: {
      type: Boolean,
      default: true,
    },
    // 是否采集
    isCrawler: {
      type: Boolean,
      default: true,
    },
  },
};
