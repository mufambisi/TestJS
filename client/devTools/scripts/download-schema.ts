import path from "path";
import { downloadGraphqlSchema } from "./schemaHelper";

async function run() {
  const krakenOutputDir = path.join(__dirname, "..", "schema", "kraken");
  await downloadGraphqlSchema(
    "https://api.origin-kraken.systems/v1/graphql/",
    krakenOutputDir
  );

  const rxGatewayOutputDir = path.join(__dirname, "..", "schema", "rx-gateway");
  await downloadGraphqlSchema(
    "https://api.rx.originenergy.com.au/v1/gateway/graphql",
    rxGatewayOutputDir
  );

  const lpgOutputDir = path.join(__dirname, "..", "schema", "lpg");
  await downloadGraphqlSchema(
    "https://api.rx.originenergy.com.au/v1/lpg/graphql/",
    lpgOutputDir
  );
}

run()
  .then(() => {
    console.info("complete");
  })
  .catch((error: Error) => {
    console.error(`error`, error);
  });
