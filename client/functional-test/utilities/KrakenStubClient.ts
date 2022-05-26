import { join } from "path";

import {
  createGraphqlMockEndpoint,
  createSession as createSessionForStub,
} from "@origin-digital/digital-stub";

import { StubSessionRequestHook } from "./StubSessionRequestHook";

export const KRAKEN_GRAPHQL_SCHEMA_DIRECTORY = join(
  "..",
  "devTools",
  "schema",
  "kraken"
);
export const RX_GATEWAY_GRAPHQL_SCHEMA_DIRECTORY = join(
  "..",
  "devTools",
  "schema",
  "rx-gateway"
);

export async function createSession(t: TestController) {
  const result = await createSessionForStub();
  if (!result) {
    throw new Error("unable to create session");
  }

  const sessionId = (result as any)?.session?.id;
  t.ctx.sessionId = sessionId;

  await t.addRequestHooks(new StubSessionRequestHook(t.ctx.sessionId));

  return sessionId;
}

export async function setupKrakenGraphqlMock(
  t: TestController,
  mockDefinition: object
) {
  await createGraphqlMockEndpoint({
    schemaDefinitionDirectory: KRAKEN_GRAPHQL_SCHEMA_DIRECTORY,
    graphqlRoute: "/v1/graphql/",
    mockDefinition,
    sessionId: t.ctx.sessionId,
  });
}

export async function setupRxGatewayGraphqlMock(
  t: TestController,
  mockDefinition: object
) {
  await createGraphqlMockEndpoint({
    schemaDefinitionDirectory: RX_GATEWAY_GRAPHQL_SCHEMA_DIRECTORY,
    graphqlRoute: "/graphql",
    mockDefinition,
    sessionId: t.ctx.sessionId,
  });
}
