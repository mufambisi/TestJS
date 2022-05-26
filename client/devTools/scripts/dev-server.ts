import { exec, execSync, ChildProcess } from "child_process";
import { printStage } from "./common";

function run() {
  let serve: ChildProcess | undefined;
  let exitCode = 0;

  try {
    printStage("⏳  Start stub API server");
    serve = exec("yarn serve:stub", (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        throw error;
      }
    });

    printStage("💉  Stub API calls");
    execSync("yarn fixture:generate && yarn stub", { stdio: "inherit" });

    printStage("⏳  Start webpack-dev-server");
    execSync("yarn start:webpack", { stdio: "inherit" });
  } catch (error) {
    exitCode = error.status;
  } finally {
    if (serve) {
      printStage("⌛️  Stop stub API server");
      serve.kill();
    }

    process.exit(exitCode);
  }
}

run();
