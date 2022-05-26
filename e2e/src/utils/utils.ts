import { readFileSync } from "fs";
import { ClientFunction } from "testcafe";

export function metaTag(tagName: string, t: TestController) {
  return t.eval(
    () => {
      const m = document.querySelectorAll("meta");
      for (let i = 0; i < m.length; i++) {
        if (m[i].name === tagName) {
          return m[i].content;
        }
      }
      return undefined;
    },
    { dependencies: { tagName } }
  );
}

function testCondition(condition: (() => boolean) | boolean): boolean {
  return typeof condition == "boolean" ? condition : condition();
}

export function testIf(
  condition: (() => boolean) | boolean,
  testFn: TestFn
): TestFn {
  if (testCondition(condition)) {
    return testFn;
  } else {
    return testFn.skip;
  }
}

export function fixtureIf(
  condition: (() => boolean) | boolean,
  fixtureFn: FixtureFn
): FixtureFn {
  if (testCondition(condition)) {
    return fixtureFn;
  } else {
    return fixtureFn.skip;
  }
}

export function getEnv(name: string, deflt?: string): string | undefined {
  return process.env[name] || deflt;
}

export function readFromJsonFile(filepath: string) {
  if (typeof filepath === "string") {
    const file = readFileSync(`${filepath}`, "utf-8");
    return JSON.parse(file);
  } else {
    return filepath; // already a json object
  }
}

export const getPageUrl = ClientFunction(() => window.location.href);
