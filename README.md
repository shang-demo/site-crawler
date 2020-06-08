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
# 注意 文件映射, /data/headless-chrome 文件夹权限
docker run -e FILE_ROOT=/home/pptruser/fs -v /data/headless-chrome:/home/pptruser/fs -itd --name headless-chrome headless-chrome
```
