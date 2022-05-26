/* eslint-disable-next-line no-var */
declare var __DEV__: boolean, TAL: { config: IAppConfig };

declare interface IAppConfig {
  env: EnvironmentNames;
  appName?: string;
  analyticsDebugToConsole: boolean;
  sumoCollectorKey: string;
  sumoSendOnErrors: boolean;
  logLevelSumo: LogLevel;
  logLevelConsole: LogLevel;
  toggles: {
    [key: string]: boolean;
  };
}

declare type LogLevel =
  | "none"
  | "fail"
  | "error"
  | "warn"
  | "info"
  | "debug"
  | "trace";

declare type EnvironmentNames = "local" | "dev" | "test" | "staging" | "prod";

declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
