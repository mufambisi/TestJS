BUILD_VERSION ?= local
OUTPUT ?= ${CURDIR}/../output
DEVTOOLS_DIR := ./shared/devTools
GRADLE_SCRIPT := ${DEVTOOLS_DIR}/gradlew
PERF_SCRIPT := ./scripts/runPerfTests.sh

.PHONY: clean/shared
clean/shared: /
	rm -rf ./shared
	cp -r ../shared shared

.PHONY: data
data:
	rm -rf build/data
	${PERF_SCRIPT} gatlingData $(call get_vars)

.PHONY: test
test:
	${PERF_SCRIPT} --continue gatlingTest $(call get_vars)

.PHONY: run
run: data test

# only works in staging
.PHONY: run/zip
run/zip:
	rm -rf build
	mkdir build
	make build OUTPUT=build
	cd build && unzip perf.zip
	make -C ./build run

.PHONY: build
build:
	make clean/shared
	cd ../client && yarn graphql:extract:queries
	zip -r ${OUTPUT}/perf.zip .

define get_vars
    $(foreach flag, $(MAKEFLAGS), -D$(flag))
endef
