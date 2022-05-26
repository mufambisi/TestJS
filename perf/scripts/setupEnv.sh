#!/bin/bash

# Setup your required environment vars here (if any)

if [ -z "$MY_ACCOUNT_CLIENT_ID" ]
then
    if [ "$environment" = "staging" ]
    then
        host="createssm-service-staging.origindigital-pac.com.au"
    else
        host="createssm-service-dev.origindigital-dac.com.au"
    fi
    export MY_ACCOUNT_CLIENT_ID="$(curl -s GET https://${host}/v1/get-ssm-parameter/my-account-${environment}-client-id | sed -E 's/.*"paramValue":"?([^,"]*)"?.*/\1/')"
fi

if [[ -z "$MY_ACCOUNT_CLIENT_ID" ]]
then
    echo "Environment variable not set: MY_ACCOUNT_CLIENT_ID"
    exit 1
fi
