declare interface IAppConfig {
  env: string;
  appName?: string;

  krakenGraphqlUrl: string;

  analyticsDebugToConsole: boolean;
  sumoCollectorKey: string;
  sumoSendOnErrors: boolean;
  logLevelSumo: string;
  logLevelConsole: string;

  sacDefaultContext?: {
    premiseId: string;
    contractAccountId: string;
    businessPartner: string;
  };
}
