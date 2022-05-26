SHELL := /bin/bash
BUILD_VERSION := ${BUILD_VERSION}
OUTPUT ?= ${CURDIR}/output
TEST_HUB ?= browserstack
QUICK_BUILD ?= false

prepare: .
	yarn install
	cd ./functional-test && yarn && yarn shared:prepare

clean: .
	yarn clean

check/pre-commit: .
	yarn validate

compile: .
	make clean
	yarn build
	cd ./dist && zip -r ${OUTPUT}/tal-assets.zip .

test/functional: .
	docker-compose -f docker-compose.yml up --build --exit-code-from dashboardrxmicrosite
	docker-compose down

test/applitools: .
	make prepare
	yarn test:func:applitools

build: .
	make prepare
	yarn validate
	make compile

build/verify: .
	make test/functional

