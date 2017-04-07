.PHONY: push start
start:
	npm run start:hmr
push:
	git push origin master:frontend
pushProd:
	npm run build:aot:prod; \
	cd dist; \
	git init; \
	git remote add coding git@git.coding.net:xinshangshangxin/site-crawler.git; \
	git add -A; \
	git commit -m "auto"; \
	git push coding master:coding-pages -f
