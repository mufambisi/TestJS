export enum Toggles {
  spikeWidget = "SpikeWidget",
}

/* eslint-disable no-undef */
export const config: IAppConfig =
  typeof TAL === "undefined"
    ? typeof (window as any).__STORYBOOK_ADDONS === "undefined"
      ? (null as any)
      : {}
    : TAL.config;

if (config == null) {
  throw new Error("App config is missing");
}
export const appName = TAL.config.appName || "dashboard-rx";
