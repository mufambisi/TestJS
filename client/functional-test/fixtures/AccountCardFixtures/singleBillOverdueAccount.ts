import { BlueprintContext, KrakenApp } from "@origin-digital/kraken-fixture";
import {
  createAccount,
  createKrakenBlueprintWithAccounts,
} from "../../../devTools/scripts/fixture-helpers";

export function main(): KrakenApp {
  const context = new BlueprintContext({ seed: 210 });
  const accounts = [
    createAccount(context, "A-A15C8D6C", -10501, {
      hasCharges: true,
      hasBills: true,
      isOverdueBill: true,
    }),
  ];

  return createKrakenBlueprintWithAccounts(context, accounts);
}
