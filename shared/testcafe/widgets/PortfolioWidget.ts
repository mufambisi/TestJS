import { selectorByDataId } from "../utils";

export const PortfolioWidget = {
  accountDetail: selectorByDataId("account-summary"),
  accountNumber: selectorByDataId("service-id"),
  billPayments: selectorByDataId("bills-payments"),
  makePayment: selectorByDataId("make-payment"),
  payNowButton: selectorByDataId("pay-now-button"),
  viewBillButton: selectorByDataId("view-bill-button"),
  currBillPeriod: selectorByDataId("current-bill-period"),
};
