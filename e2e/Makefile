OUTPUT ?= ${CURDIR}/output

prepare: .
	yarn install
	make clean/shared

clean: .
	rm -rf node_modules/
	yarn clean

clean/shared:
	rm -rf ./shared
	cp -r ../shared/testcafe/ ./src/shared

.PHONY: check/pre-commit
check/pre-commit:
	yarn validate

build: .
	make prepare
	yarn validate
	make clean
	zip -r ${OUTPUT}/e2e.zip .

run/local: .
	make prepare
	ENVIRONMENT=$(environment) yarn testcafe:local

run: .
	docker-compose -p dashboard-rx-micro-site \
		-f docker-compose.yml \
		build
	ENVIRONMENT=$(environment) \
	docker-compose -p dashboard-rx-micro-site \
		-f docker-compose.yml \
		run testcafe