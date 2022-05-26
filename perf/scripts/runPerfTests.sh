#!/bin/bash

# set up environment
. scripts/setupEnv.sh

# copy shared resources into hidden working directory if not present
if [[ ! -d "./shared" ]]; then 
    make clean/shared
fi

# run load test(s)
./shared/devTools/gradlew --rerun-tasks "$@"
