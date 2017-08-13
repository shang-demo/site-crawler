.PHONY: all test clean static
d=template2
gulp:
	@ gulp
test:
	@ if [ -n "$(g)" ]; \
	then \
		echo 'mocha --recursive --timeout 10000 --require chai --harmony --bail -g $(g) test'; \
		mocha --recursive --timeout 10000 --require chai --harmony --bail -g $(g) test; \
	else \
		echo 'mocha --recursive --timeout 10000 --require chai --harmony --bail test'; \
		mocha --recursive --timeout 10000 --require chai --harmony --bail test; \
	fi
prod:
	gulp prod
	NODE_ENV=production PRETTY_LOG=1 node production/app.js
pushHeroku: 
	cp ./package.json ./production
	gsed -i 's/"start": ".*/"start": "NODE_ENV=heroku pm2 start .\/index.js --no-daemon",/g' ./production/package.json
	cd ./production && git add -A && git commit -m "auto" && git push heroku master && heroku logs --tail
merge:
	git fetch template v2
	git merge remotes/template/v2
push:
	@ sh config/push.sh
deploy:
	@ sh config/push.sh deploy $(e)
copy:
	@ sh config/copy.sh $(d)
rsyncAli:
	gulp buildServer
	cp ./package.json ./production
	gsed -i 's/"start": ".*/"start": "PORT=4001 NODE_ENV=production pm2 start .\/index.js --name site-craler-service:4001",/g' ./production/package.json
	rsync --exclude .DS_Store --exclude .tmp --exclude .idea --exclude .git --exclude node_modules -crzvF -e "ssh -p 22" ./production/  root@112.74.107.82:/root/production/site-craler-service