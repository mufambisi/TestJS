import path from "path";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";
import { logger } from "@origin-digital/node-logger";
import {
  readJsonFileFromDisk,
  writeFileToDisk,
} from "@origin-digital/node-util";
import { makeValidJsonRequest } from "@origin-digital/node-http-client";

export function getGqlSchemaFromJsonSchema(schemaObject?: any) {
  if (!schemaObject) {
    return undefined;
  }
  let schemaDefinition = schemaObject;
  if (schemaObject.data) {
    schemaDefinition = schemaObject.data;
  }
  const schema = buildClientSchema(schemaDefinition);
  // convert to sdl so that it can be merged with type defs
  return printSchema(schema, { commentDescriptions: false });
}

export async function convertGraphqlJsonSchemaToGql(
  jsonFilePath: string,
  outputPath: string
) {
  const schemaObject = await readJsonFileFromDisk(jsonFilePath);
  const schemaString = getGqlSchemaFromJsonSchema(schemaObject);
  if (!schemaString) {
    throw new Error("invalid schema object");
  }
  logger.info(`writing graphql sdl schema definition to file ${outputPath}`);
  await writeFileToDisk(outputPath, schemaString);
}

export async function downloadGraphqlJsonSchema(
  graphqlUrl: string,
  outputPath: string
) {
  logger.info(`attempting to download schema object from ${graphqlUrl}`);
  const schemaObject = await makeValidJsonRequest({
    url: graphqlUrl,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: { query: getIntrospectionQuery() },
  });
  logger.info(`writing graphql json schema object to file ${outputPath}`);
  await writeFileToDisk(outputPath, JSON.stringify(schemaObject, null, 2));
}

export async function downloadGraphqlSchema(
  graphqlUrl: string,
  outputDir: string
) {
  const jsonFilePath = path.join(outputDir, "schema.json");
  const sdlFilePath = path.join(outputDir, "schema.graphql");
  await downloadGraphqlJsonSchema(graphqlUrl, jsonFilePath);
  await convertGraphqlJsonSchemaToGql(jsonFilePath, sdlFilePath);
}
