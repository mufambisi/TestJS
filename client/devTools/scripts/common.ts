import fs, { WriteFileOptions } from "fs";
import fetch, { RequestInit } from "node-fetch";
import { buildClientSchema, printSchema } from "graphql";

export const printStage = (stage: string) => {
  console.info(`\n===> ${stage} <===\n`);
};

export function writeFileToDisk(
  filePath: string,
  data: string,
  options: WriteFileOptions = {}
): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    fs.writeFile(filePath, data, options, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

export async function callJsonApi(
  url: string,
  options?: RequestInit
): Promise<object | undefined> {
  const apiResponse = await fetch(url, options);
  if (apiResponse.ok) {
    try {
      return await apiResponse.json();
    } catch (e) {
      return undefined;
    }
  } else {
    const bodyText = await apiResponse.text();
    throw new Error(
      `Error calling external api. status code: ${apiResponse.status} body: ${bodyText}`
    );
  }
}

export function getSchema(schemaObject?: any) {
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
