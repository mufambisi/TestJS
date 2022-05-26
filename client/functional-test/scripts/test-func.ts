import { ChildProcess, exec, execSync } from "child_process";
import minimist from "minimist";
import { printStage } from "./common";

const argv = minimist(process.argv.slice(2));

const __APPLITOOLS__ = argv.applitools;
const __BROWSERSTACK__ = argv.browserstack;
const __DOCKER__ = argv.docker;
const __LIVE_MODE__ = argv.l || argv.live;
const __NOCLEAN__ = argv.noclean;

function run() {
  let appServer: ChildProcess;
  let stubServer: ChildProcess;
  const projectName = "Dashboard RX";
  const buildId = process.env.BUILD_VERSION
    ? process.env.BUILD_VERSION
    : "Adhoc-Build@templated-micro-site";

  const tearDown = (exitCode: number) => {
    if (appServer) {
      printStage("⌛️  Stop app server");
      appServer.kill();
    }
    if (stubServer) {
      printStage("⌛️  Stop stub server");
      stubServer.kill();
    }
    process.exit(exitCode);
  };

  try {
    if (!__NOCLEAN__) {
      printStage("🏗  Build");
      execSync(`yarn build:local`, { stdio: "inherit" });
    }

    execSync(`yarn fixture:generate`, { stdio: "inherit" });

    printStage("🏗  Stub");
    stubServer = exec(`yarn serve:stub`);

    printStage("🏗  Serve");
    appServer = exec("yarn serve");

    printStage("💊  Run testcafe functional tests");

    const task: string[] = [];

    if (__BROWSERSTACK__ || __APPLITOOLS__) {
      process.env.BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESSKEY;
      process.env.BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USER;
      process.env.BROWSERSTACK_PROJECT_NAME = process.env.LT_TEST_NAME = projectName;
      process.env.BROWSERSTACK_BUILD_ID = process.env.LT_BUILD = buildId;
    }

    if (__BROWSERSTACK__) {
      task.push("--browserstack");
    }

    if (__DOCKER__) {
      task.push("--docker");
    }

    if (__APPLITOOLS__) {
      task.push("--applitools -c 1 -f ApplitoolsSpec");
    }

    if (__LIVE_MODE__) {
      task.push("--live");
    }

    const options = ["f", "t", "c"];
    options.forEach((option) => {
      if (argv[option]) task.push(`-${option} "${argv[option]}"`);
    });

    execSync(
      `cd functional-test && node -r ../devTools/scripts/register-ts.js ./scripts/runner.ts ${task.join(
        " "
      )}`,
      {
        stdio: "inherit",
      }
    );
  } catch (error) {
    tearDown(error.status);
  } finally {
    tearDown(0);
  }
}

run();
