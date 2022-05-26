SHELL := /bin/bash
BUILD_VERSION ?= local
BUILD_NUMBER ?= 0
OUTPUT ?= ${CURDIR}/output

.PHONY: prepare
prepare:
	(cd ./shared/devTools/githooks; ./install.sh)
	make BUILD_VERSION=${BUILD_VERSION} -C ./client prepare
	make BUILD_VERSION=${BUILD_VERSION} -C ./e2e prepare

.PHONY: compile
compile:
	make BUILD_VERSION=${BUILD_VERSION} OUTPUT="${OUTPUT}" -C ./client compile

.PHONY: check/pre-commit
check/pre-commit:
	make -C ./client check/pre-commit
	make -C ./e2e check/pre-commit

test/applitools: .
	make BUILD_VERSION=${BUILD_VERSION} -C ./client test/applitools

.PHONY: build
build:
	mkdir -p $(OUTPUT)
	make BUILD_VERSION=${BUILD_VERSION} OUTPUT="${OUTPUT}" -C ./client build
	make BUILD_VERSION=${BUILD_VERSION} OUTPUT="${OUTPUT}" -C ./e2e build
	# make BUILD_VERSION=${BUILD_VERSION} OUTPUT="${OUTPUT}" -C ./perf build

.PHONY: build/verify
build/verify: .
	make BUILD_VERSION=${BUILD_VERSION} OUTPUT="${OUTPUT}" -C ./client build/verify

.PHONY: clean
clean:
	rm -rf ${OUTPUT}
	make -C ./client clean
