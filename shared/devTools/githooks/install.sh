#!/usr/bin/env bash

HOOKSPATH=./../../../.git/hooks/

cp pre-commit ${HOOKSPATH}
chmod a+x ${HOOKSPATH}/pre-commit