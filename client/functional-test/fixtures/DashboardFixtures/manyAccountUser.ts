import { KrakenApp, BlueprintContext } from "@origin-digital/kraken-fixture";

import {
  createAccount,
  createKrakenBlueprintWithAccounts,
} from "../../../devTools/scripts/fixture-helpers";

export function main(): KrakenApp {
  const context = new BlueprintContext({ seed: 210 });
  const accounts = [
    createAccount(context, "A-6883E277", -10935),
    createAccount(context, "A-6883E278", 50641, { noAgreements: true }),
  ];

  return createKrakenBlueprintWithAccounts(context, accounts);
}
