import { execSync } from "child_process";

import Eyes from "@applitools/eyes-testcafe";

const desktop = {
  deviceName: "",
  height: 768,
  width: 1024,
};

const browserList: {
  [key: string]: Eyes.Testcafe.OpenOptions["browser"];
} = {
  "browserstack:Samsung Galaxy S8@7.0": {
    deviceName: "Samsung Galaxy S8",
  },
  "browserstack:iPad 6th@11": {
    deviceName: "iPad",
  },
  "browserstack:iPhone X@11": {
    deviceName: "iPhone X",
  },
  "lambdatest:ie@11.0:Windows 10": {
    name: "ie11",
    ...desktop,
  },
  "lambdatest:chrome@78.0:Windows 10": {
    name: "chrome",
    ...desktop,
  },
  "lambdatest:firefox:Windows 10": {
    name: "firefox",
    ...desktop,
  },
  "lambdatest:edge@18.0:Windows 10": {
    name: "edge",
    ...desktop,
  },
};

export class Applitools {
  static eyes: Eyes;
  static appName = "Templated Microsite";
  static openEyesConfig: Partial<Eyes.Testcafe.OpenOptions>;

  static setup(showLogs = false) {
    this.eyes = new Eyes();

    const currentGitBranch = execSync(
      "git rev-parse --abbrev-ref HEAD"
    ).toString();
    this.openEyesConfig = {
      appName: this.appName,
      branch: `${this.appName}${currentGitBranch}`,
      parentBranch: `${this.appName}master`,
      matchLevel: "Layout",
    };

    // @ts-ignore
    process.env.APPLITOOLS_SHOW_LOGS = showLogs;
    process.env.APPLITOOLS_SERVER_URL = "https://origineyesapi.applitools.com";
  }

  static async openEyes(t: TestController) {
    let deviceName = t.browser.name;
    if (t.browser.alias.includes("browserstack")) {
      // eg. browserstack:iPad 6th@11
      deviceName = t.browser.alias.split(":")[1].split("@")[0];
    }

    await this.eyes.open({
      ...this.openEyesConfig,
      batchName: `${this.appName} ${deviceName}`,
      testName: t["testRun"]["test"]["name"],
      browser: browserList[t.browser.alias],
      t,
    });
  }

  static async checkWindow() {
    await this.eyes.checkWindow({});
  }

  static async closeEyes() {
    await this.eyes.close();
  }

  static async waitForResults() {
    await this.eyes.waitForResults();
  }
}
