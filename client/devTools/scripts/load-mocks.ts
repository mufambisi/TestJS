import {
  createGraphqlMockEndpoint,
  createRestMockEndpoints,
  EndpointDefinition,
  resetServer,
} from "@origin-digital/digital-stub";
import { join } from "path";
import { stringify, unescape } from "querystring";

type RestMockEndpointResponse = {
  endpoint: EndpointDefinition;
};

async function run() {
  console.log("setting up the backend mocking");
  await resetServer();
  await setupGatewayEndpoint();
  await setupLpgEndpoint();
  await setupKrakenEndpoint();
  await setupRestEndpoints();
}

async function setupGatewayEndpoint() {
  console.log("setting rx gateway graphql mocking");
  const GRAPHQL_SCHEMA_DIR = join(__dirname, "..", "schema", "rx-gateway");
  const GRAPHQL_MOCK_FILE = join(
    __dirname,
    "..",
    "graphql-mocks",
    "rx-gateway-standard.json"
  );
  await createGraphqlMockEndpoint({
    graphqlRoute: "/graphql",
    schemaDefinitionDirectory: GRAPHQL_SCHEMA_DIR,
    mockDefinitionFile: GRAPHQL_MOCK_FILE,
  });

  console.log("mocked rx gateway graphql endpoint");
}

async function setupLpgEndpoint() {
  console.log("setting lpg graphql mocking");
  const GRAPHQL_SCHEMA_DIR = join(__dirname, "..", "schema", "lpg");
  const GRAPHQL_MOCK_FILE = join(
    __dirname,
    "..",
    "graphql-mocks",
    "lpg-standard.json"
  );
  await createGraphqlMockEndpoint({
    graphqlRoute: "/v1/lpg/graphql",
    schemaDefinitionDirectory: GRAPHQL_SCHEMA_DIR,
    mockDefinitionFile: GRAPHQL_MOCK_FILE,
  });

  console.log("mocked lpg graphql endpoint");
}

async function setupKrakenEndpoint() {
  console.log("setting kraken graphql mocking");
  const GRAPHQL_SCHEMA_DIR = join(__dirname, "..", "schema", "kraken");
  const GRAPHQL_MOCK_FILE = join(
    __dirname,
    "..",
    "graphql-mocks",
    "kraken-standard.json"
  );
  await createGraphqlMockEndpoint({
    graphqlRoute: "/v1/graphql/",
    schemaDefinitionDirectory: GRAPHQL_SCHEMA_DIR,
    mockDefinitionFile: GRAPHQL_MOCK_FILE,
  });

  console.log("mocked kraken graphql endpoint");
}

async function setupRestEndpoints() {
  console.info("setting endpoints mocking");
  const response = await createRestMockEndpoints({
    mockDefinitionDirectory: join(__dirname, "..", "rest-mocks"),
  });

  if (response) {
    response.forEach((item: object | undefined) => {
      if (item) {
        const {
          endpoint: { route, method, requestQueryParameters = [] },
        } = item as RestMockEndpointResponse;

        let query: { [key: string]: string | number } = {};

        requestQueryParameters?.forEach(
          ({ name, value }: { name: string; value: string }) =>
            (query[name] = value)
        );
        console.info(
          `[${method}] ${route}${
            Object.values(query).length > 0
              ? `?${unescape(stringify(query))}`
              : ""
          }`
        );
      }
    });
  }
  console.info("mocked rest endpoints");
}

run()
  .then(() => {
    console.info("complete");
  })
  .catch((error: Error) => {
    console.error("error", error);
  });
