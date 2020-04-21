ifeq (now,$(firstword $(MAKECMDGOALS)))
  # use the rest as arguments for "run"
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  # ...and turn them into do-nothing targets
  $(eval $(RUN_ARGS):;@:)
endif

.PHONY:test merge push deploy rsync now
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
	@ bash config/script-tools/push-git.sh
deploy:
	@ bash config/script-tools/push-git.sh prod $(e)
now:
	@ # make now -- XXX
	@ # will do now -t token XXXX
	@ bash config/script-tools/now.sh $(RUN_ARGS)
copy:
	@ sh config/copy.sh $(d)
rsyncAli:
	gulp buildServer
	cp ./package.json ./production
	gsed -i 's/"start": ".*/"start": "PORT=4001 NODE_ENV=production pm2 start .\/index.js --name site-craler-service:4001",/g' ./production/package.json
	rsync --exclude .DS_Store --exclude .tmp --exclude .idea --exclude .git --exclude node_modules -crzvF -e "ssh -p 22" ./production/  root@114.67.70.208:/root/production/site-craler-service
