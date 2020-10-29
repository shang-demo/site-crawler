local-run:
	CHROME="/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary" npm start
run:
	docker build -t headless-chrome . && docker run -p 8080:8080 -it --name headless-chrome headless-chrome
run-proxy:
	docker build --network host -t headless-chrome . && docker rm -f headless-chrome && docker run -e FILE_ROOT=/home/pptruser/fs -v /data/headless_dir:/home/pptruser/fs -p 8080:8080 -itd --name headless-chrome headless-chrome
stop:
	docker ps -a | grep "headless-chrome" | awk '{print $$1 }' | xargs docker rm -f
clean:stop
	docker images | grep "none" | awk '{print $$3 }' | xargs docker rmi -f
rsync:
	rsync -P -azv \
    --exclude .git \
    --exclude node_modules \
    --exclude dist \
    -e "ssh -p 22" \
    ./ \
    ubuntu@106.54.169.129:/home/ubuntu/production/headless-chrome