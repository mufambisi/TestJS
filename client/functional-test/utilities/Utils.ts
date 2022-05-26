import { readFileSync } from "fs";
import { ClientFunction, t } from "testcafe";

export default class Utils {
  static readFromJsonFile(filepath: string) {
    if (typeof filepath === "string") {
      const body = filepath
        ? readFileSync(`./stub/${filepath}.json`, "utf-8")
        : "";
      return body ? body : "";
    }
    return "";
  }

  static async hasUrlParam(paramName: string, expectedVal: string) {
    const getURL = await ClientFunction(() => window.location.href);
    await t.expect(await getURL()).contains(`${paramName}=${expectedVal}`);
  }
}
