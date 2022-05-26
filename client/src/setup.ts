/**
 * This file will configure various resources for your application.
 * - Logging to Sumologic (More configuration required - see below)
 * - Analytics tracking through Adobe Target Events
 *
 * Anything else required before your app is loaded can be included in this
 * file.
 */
import SumoLogger from "sumo-logger";
import { configAnalytics, configSumo } from "@origin-digital/reporting-client";
import { config, appName } from "src/config";

const envAppName = `${appName}-${config.env}`;

configAnalytics({
  appName,
  debugToConsole: config.analyticsDebugToConsole,
});

configSumo({
  SumoLogger,
  appName: envAppName,
  consoleLogLevel: config.logLevelConsole,
  endpoint: `https://collectors.au.sumologic.com/receiver/v1/${config.sumoCollectorKey}`,
  sendOnErrors: config.sumoSendOnErrors,
  sourceEnv: config.env,
  sumoLogLevel: config.logLevelSumo,
});
