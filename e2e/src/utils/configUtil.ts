import { getEnv, readFromJsonFile } from "./utils";

export class ConfigUtil {
  static config = readFromJsonFile("conf/config.json");
  static baseUrl = ConfigUtil.configData("environment-url");
  static basePath = "/my";

  public static getUrl(path: string) {
    return `${ConfigUtil.baseUrl}${this.basePath}${path}`;
  }

  public static configData(param: string) {
    const properties = this.getProperties();
    return properties[`${param}`];
  }

  public static getProperties() {
    const env = this.getEnvironment();
    return this.config[env].properties || {};
  }

  public static getEnvironment() {
    const env = getEnv("ENVIRONMENT");
    if (typeof env == "undefined") {
      return this.config.base["default-environment"];
    } else {
      return env;
    }
  }
}
