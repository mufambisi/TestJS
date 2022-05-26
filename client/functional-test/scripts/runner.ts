import minimist from "minimist";
import createTestCafe from "testcafe";
import { execSync } from "child_process";

const argv = minimist(process.argv.slice(2));

const __APPLITOOLS__ = argv.a || argv.applitools;
const __BROWSERSTACK__ = argv.bs || argv.browserstack;
const __DOCKER__ = argv.d || argv.docker;
const __LIVEMODE__ = argv.l || argv.live;
const __CONCURRENCY__ = argv.c;
const __FIXTURE__ = argv.f;
const __TEST__ = argv.t;

let testcafe: TestCafe;
let totalErrors = 0;

const browserstack = [
  "browserstack:iPad 6th@11",
  "browserstack:iPhone X@11",
  "browserstack:Samsung Galaxy S8@7.0",
];

const lambdatest = [
  "lambdatest:ie@11.0:Windows 10",
  "lambdatest:chrome@78.0:Windows 10",
  "lambdatest:firefox:Windows 10",
  "lambdatest:edge@18.0:Windows 10",
];

let hostIP = execSync(
  "ifconfig | grep -Eo 'inet (addr:)?([0-9]*\\.){3}[0-9]*' | grep -Eo '([0-9]*\\.){3}[0-9]*' | grep -v '127.0.0.1' |  sed -n 1p"
);

const runTest = async (browsers: string | string[]) => {
  console.log(
    `Starting tests on Browser "${browsers}" with live mode ${
      __LIVEMODE__ ? "ON" : "OFF"
    }`
  );
  await createTestCafe(hostIP.toString().trim(), 1337, 1338)
    .then((tc) => {
      testcafe = tc;
      const runner = __LIVEMODE__
        ? testcafe.createLiveModeRunner()
        : testcafe.createRunner();

      if (__CONCURRENCY__) {
        console.log(`Tests are running with ${__CONCURRENCY__} concurrency`);
        runner.concurrency(__CONCURRENCY__);
      }

      return runner
        .browsers(browsers)
        .filter((testName, fixtureName, _fixturePath, _testMeta) => {
          if (__FIXTURE__ && __TEST__) {
            return testName === __TEST__ && fixtureName === __FIXTURE__;
          }

          if (__TEST__) {
            return testName === __TEST__;
          }

          if (__FIXTURE__) {
            return fixtureName === __FIXTURE__;
          }

          return fixtureName !== "ApplitoolsSpec";
        })
        .reporter([
          "spec",
          {
            name: "test-summary",
            output: "./build/reports/testcafe_report.html",
          },
        ])
        .run();
    })
    .then(async (failedCount) => {
      console.log(`Tests failed: ${failedCount}`);

      await testcafe.close();
      if (failedCount > 0) {
        if (__APPLITOOLS__) {
          totalErrors += failedCount;
        } else {
          throw new Error(`${failedCount} tests failed`);
        }
      }
    });
};

const runAllBrowsers = async () => {
  if (__BROWSERSTACK__) {
    console.log("Using browserstack and lambdatest");
    for (const browser of [browserstack, lambdatest]) {
      await runTest(browser);
    }
  } else if (__APPLITOOLS__) {
    console.log("Snapshot testing using browserstack and lambdatest");
    for (const browser of [...browserstack, ...lambdatest]) {
      await runTest(browser);
    }
  } else if (__DOCKER__) {
    console.log("Using docker chromium browser");
    await runTest(["chromium --window-size=375,667"]);
  } else {
    console.log("Using local chrome browser");
    await runTest(["chrome --window-size=375,667"]);
  }
};

runAllBrowsers().then(() => {
  if (__APPLITOOLS__ && totalErrors) {
    throw new Error(`${totalErrors} tests failed`);
  }
});
