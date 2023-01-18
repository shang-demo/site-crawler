# mbinfo

## 本地跑

```bash
npm install
# 无界面跑
npm start
# 有界面跑
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm start
```

## docker / 服务器跑

```bash
docker build -t headless-chrome .
docker rm -f headless-chrome && docker run -p 8080:8080 -itd --name headless-chrome headless-chrome
```
