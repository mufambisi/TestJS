#!/usr/bin/env bash

# This is a do-nothing script. It is intended to start off as just a list of steps, but with the
# long term goal that the steps in the script can incrementally be automated. If adding to
# the script, make sure to add your new step as a separate function that represents one step
# in the setup. Do not worry if you don't think it is possible to automate it in the future.

manual_step_end() {
  read -p "Press enter to continue"
  echo -e "\n------------------------------------------------------------------\n\n\n\n\n"
}

automated_step_end() {
  echo -e "\n------------------------------------------------------------------\n\n\n\n\n"
}

update_tal_manifests() {
  echo "1) Update the tal manifests - route, canonical and newrelic sections"
  echo "You can create the New Relic browser application ids with these instructions: https://origindd.atlassian.net/wiki/spaces/DIG/pages/720241221/How+to+add+NewRelic+Browser+monitoring+to+your+app"
  echo "client/config/auth.manifest.json - update or delete if you are not supporting auth my-account access to this app"
  echo "client/config/unauth.manifest.json - update or delete if you are not supporting unauth access to this app"
  manual_step_end
}

update_sumo_keys() {
  echo "2a) Create a sumo logic collector key by running this jenkins job: https://ci-devops.origindigital-dac.com.au/job/shared-sumo-create-receiver/build with the SourceName=appId"
  echo "2b) Update the sumologic collector keys for the various env files in client/tal using the Prod collector key only for prod and NonProd for all other environments"
  manual_step_end
}

replace_template_references() {
  echo "3) Search through the client dir and replace reference to 'template' with your appId"
  manual_step_end
}

update_tal_manifests
update_sumo_keys
replace_template_references