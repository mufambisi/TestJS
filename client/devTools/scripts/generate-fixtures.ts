import fs from "fs";
import path from "path";

import { writeFixtureFolder } from "@origin-digital/kraken-fixture";

async function run() {
  await generateClient();
  await generateFuncTest();
}

async function generateFuncTest() {
  console.log("Generate functional test fixtures");
  const testFuncDir = path.join(__dirname, "..", "..", "functional-test");
  // generate fixture for each directory
  const directories = fs
    .readdirSync(path.join(testFuncDir, "fixtures"), {
      withFileTypes: true,
    })
    .filter((d) => d.isDirectory());

  for (let directory of directories) {
    await generate(
      path.join(__dirname, "..", "..", "functional-test"),
      directory.name
    );
  }
}

async function generateClient() {
  console.log("Generate fixtures");
  await generate(path.join(__dirname, ".."));
}

async function generate(basePath: string, fixtureBasePath: string = "./") {
  const outputPath = path.join(basePath, "graphql-mocks", fixtureBasePath);
  const fixtureFolderPath = path.join(basePath, "fixtures", fixtureBasePath);
  await writeFixtureFolder(outputPath, fixtureFolderPath);
}

run()
  .then(() => {
    console.info("complete");
  })
  .catch((error: Error) => {
    console.error(`error`, error);
  });
