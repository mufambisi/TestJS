import { BlueprintContext, KrakenApp } from "@origin-digital/kraken-fixture";
import {
  createAccount,
  createKrakenBlueprintWithAccounts,
} from "../scripts/fixture-helpers";

export function main(): KrakenApp {
  const context = new BlueprintContext({ seed: 210 });

  const accounts = [
    // Due soon
    createAccount(context, "A-BS6540BF", -10500, {
      hasCharges: true,
      isSolar: true,
    }),
    // Gas
    createAccount(context, "A-5CA6C8DE", -10500, {
      hasCharges: true,
      isGas: true,
    }),
    // Overdue
    createAccount(context, "A-A5B5065D", -18800, {
      hasCharges: true,
      hasBills: true,
      isOverdueBill: true,
    }),
    // Due soon with pending payments
    createAccount(context, "A-BC1A654E", -17054, {
      hasCharges: true,
      hasPendingPayments: true,
      address: "12 Ocean St, Sydney, NSW 2000",
    }),
    // Overdue with pending payments
    createAccount(context, "A-D4CA509C", -10835, {
      hasCharges: true,
      hasBills: true,
      hasPendingPayments: true,
      isOverdueBill: true,
      address: "28 Bathurst Road, The Rocks, NSW 2000",
    }),
    // In credit
    createAccount(context, "A-A15C8D6C", 1803),
    // On Payment Plan
    createAccount(context, "A-C5D423CF", -15034, {
      isPaymentPlan: true,
      address: "23 Woodlands Ave, Forest Glen, NSW 2157",
    }),
    // Closed account
    createAccount(context, "A-BC1A612E", 0, {
      noAgreements: true,
      address: "6 Eurack Court, Kingsvale, NSW 2587",
    }),
  ];

  return createKrakenBlueprintWithAccounts(context, accounts);
}
