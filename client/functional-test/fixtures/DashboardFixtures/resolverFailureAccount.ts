import {
  AccountBlueprint,
  BlueprintContext,
  createErrorField,
  KrakenApp,
} from "@origin-digital/kraken-fixture";
import { createKrakenBlueprintWithAccounts } from "../../../devTools/scripts/fixture-helpers";

export function main(): KrakenApp {
  const context = new BlueprintContext({ seed: 210 });
  const account = new AccountBlueprint(context).build({
    number: "A-A15C8D6C",
    billingOptions: createErrorField({ type: "resolver" }),
  });

  return createKrakenBlueprintWithAccounts(context, [account]);
}
