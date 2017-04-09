.PHONY: push start deploy copy
start:
	npm run start:hmr
merge:
	git fetch template v2
	git merge remotes/template/v2
push:
	@ sh config/push.sh
deploy:
	@ sh config/push.sh deploy
copy:
	@ sh config/copy.sh $(d)
