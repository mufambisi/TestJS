import { t } from "testcafe";
import { lpgSelectorByDataId, selectorByDataId } from "../utils";

export const LPGWidget = {
  widget: selectorByDataId("lpg-widget-body"),
  customerNumber: lpgSelectorByDataId("customer-number"),
  customerLocation: lpgSelectorByDataId("service-address"),
  orderList: lpgSelectorByDataId("lpg-order-list"),
  accountBalance: lpgSelectorByDataId("account-balance"),
  dueAmount: lpgSelectorByDataId("due-amount-0"),
  orderLpg: lpgSelectorByDataId("lpg-order", "button"),

  verifyLPGDashboard: async () => {
    await t
      .expect(LPGWidget.customerNumber.visible)
      .ok()
      .expect(LPGWidget.customerLocation.visible)
      .ok()
      .expect(LPGWidget.orderList.visible)
      .ok()
      .expect(LPGWidget.orderLpg.visible)
      .ok();

    // depending on the state of the account it may be showing a due amount or not
    // if it is showing a due amount we check the dueAmount else we check the accountBalance
    if (await LPGWidget.accountBalance.exists) {
      await t.expect(LPGWidget.accountBalance.visible).ok();
    } else {
      await t.expect(LPGWidget.dueAmount.visible).ok();
    }

    await t.expect(LPGWidget.customerNumber.count).eql(1);
  },
};
