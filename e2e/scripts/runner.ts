import { readFileSync } from "fs";
import { execSync } from "child_process";

function run() {
  const env = process.env["ENVIRONMENT"];
  const config = JSON.parse(readFileSync("conf/config.json", "utf-8"));
  const properties = env && config[env] ? config[env].properties : false;

  if (!properties) {
    console.log(`Skipping E2E for ${env}`);
    return;
  }
  try {
    execSync(`yarn testcafe:docker`, { stdio: "inherit" });
  } catch (error) {
    process.exit(error.status);
  } finally {
    process.exit(0);
  }
}

run();
