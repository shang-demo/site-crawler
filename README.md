# site-crawler

## [backend-v2](https://github.com/shang-demo/site-crawler/tree/backend-v2)
基于koa的采集器后端程序, 提供采集哪些站点 和 定时采集

## [frontend](https://github.com/shang-demo/site-crawler/tree/frontend)
基于angular的前端程序, 提供了简易的界面

## [site-crawler-service](https://github.com/shang-demo/site-crawler/tree/site-crawler-service)
基于 [website-crawler](https://github.com/shang-package/website-crawler), 提供代理重试获取页面html服务

## [site-parser-service](https://github.com/shang-demo/site-crawler/tree/site-parser-service)
基于 [website-parser](https://github.com/shang-package/website-parser), 提供解析html服务

## [site-crawler-eval](https://github.com/shang-demo/site-crawler/tree/site-crawler-eval)
`eval`执行部分不安全代码, 主要用于[http://www.zdfans.com/](http://www.zdfans.com/)的`安全检查`(5秒后可访问网站)

## [backend](https://github.com/shang-demo/site-crawler/tree/backend) 
**DEPRECATED** 使用老版 `gather-site` 实现的采集服务, 已经被[backend-v2](https://github.com/shang-demo/site-crawler/tree/backend-v2)代替