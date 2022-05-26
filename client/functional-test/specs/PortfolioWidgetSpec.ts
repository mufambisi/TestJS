import {
  manyAccountDigitalUserData,
  manyAccountUser,
  scheduledPaymentAccount,
  singleAccountDigitalUserData,
  singleAccountUser,
  singleBillOverdueAccount,
} from "../fixtures";
import { DashboardPage } from "../shared/pages/DashboardPage";
import { base } from "../utilities/DynamicBaseUrl";
import { EventDispatcher } from "../utilities/EventDispatcher";
import {
  createSession,
  setupKrakenGraphqlMock,
  setupRxGatewayGraphqlMock,
} from "../utilities/KrakenStubClient";

const dashboardPage = new DashboardPage();

/* eslint-disable-next-line no-undef */
fixture("PortfolioWidgetSpec");

const setupMocks = async (
  t: TestController,
  gatewayMockDefinition: object,
  krakenMockDefinition: object
) => {
  await createSession(t);
  await setupRxGatewayGraphqlMock(t, gatewayMockDefinition);
  await setupKrakenGraphqlMock(t, krakenMockDefinition);
};

test.before(async (t) => {
  await setupMocks(t, manyAccountDigitalUserData, manyAccountUser);
})("Multiple accounts are displayed correctly on dashboard page", async (t) => {
  await t.navigateTo(`${base.url}${DashboardPage.url}`);
  await DashboardPage.at();
  await t
    .expect(dashboardPage.portfolioWidget.accountDetail.visible)
    .ok()
    .expect(dashboardPage.portfolioWidget.accountNumber.count)
    .eql(2)
    .expect(dashboardPage.portfolioWidget.accountNumber.nth(0).textContent)
    .eql(
      manyAccountDigitalUserData.Query.viewer.kraken.accounts[0].accountNumber
    )
    .expect(dashboardPage.portfolioWidget.accountNumber.nth(1).textContent)
    .eql(
      manyAccountDigitalUserData.Query.viewer.kraken.accounts[1].accountNumber
    );
});

test.before(async (t) => {
  await setupMocks(t, singleAccountDigitalUserData, singleAccountUser);
})("Single account is displayed correctly on dashboard page", async (t) => {
  await t.navigateTo(`${base.url}${DashboardPage.url}`);
  await DashboardPage.at();
  await t
    .expect(dashboardPage.portfolioWidget.accountDetail.visible)
    .ok()
    .expect(dashboardPage.portfolioWidget.accountNumber.count)
    .eql(1);
});

test.before(async (t) => {
  await setupMocks(t, singleAccountDigitalUserData, scheduledPaymentAccount);
})(
  "Account with scheduled payment is displayed correctly on dashboard page",
  async (t) => {
    await t.navigateTo(`${base.url}${DashboardPage.url}`);
    await DashboardPage.at();
    await t
      .expect(dashboardPage.portfolioWidget.payNowButton.exists)
      .notOk()
      .expect(dashboardPage.portfolioWidget.makePayment.visible)
      .ok();
  }
);

test.before(async (t) => {
  await setupMocks(t, singleAccountDigitalUserData, singleBillOverdueAccount);
})(
  "Account without scheduled payment is displayed correctly on dashboard page",
  async (t) => {
    await t.navigateTo(`${base.url}${DashboardPage.url}`);
    await DashboardPage.at();
    await t
      .expect(dashboardPage.portfolioWidget.payNowButton.visible)
      .ok()
      .expect(dashboardPage.portfolioWidget.makePayment.exists)
      .notOk();
  }
);

test.before(async (t) => {
  await setupMocks(t, singleAccountDigitalUserData, singleBillOverdueAccount);
})("Pay now and view bill link correctly opens the bill", async (t) => {
  await t.navigateTo(`${base.url}${DashboardPage.url}`);
  await DashboardPage.at();

  await EventDispatcher.addEventListeners(["NAV_TO", "OPEN_RESOURCE"]);

  await t.click(dashboardPage.portfolioWidget.payNowButton);
  await EventDispatcher.verifyNavTo("makePayment");

  await t.click(dashboardPage.portfolioWidget.viewBillButton);
  await EventDispatcher.verifyOpenResourceUrl("/bill.pdf");
});

test.before(async (t) => {
  await setupMocks(t, singleAccountDigitalUserData, singleAccountUser);
})("bills-payment link is redirecting correctly", async (t) => {
  await t.navigateTo(`${base.url}${DashboardPage.url}`);
  await DashboardPage.at();
  await t.expect(dashboardPage.portfolioWidget.billPayments.visible).ok();

  EventDispatcher.addEventListener("NAV_TO");
  await t.click(dashboardPage.portfolioWidget.billPayments);

  await EventDispatcher.verifyNavTo("paymentHistory");
});

test.before(async (t) => {
  await setupMocks(t, singleAccountDigitalUserData, singleAccountUser);
})("make-payment link is redirecting correctly", async (t) => {
  await t.navigateTo(`${base.url}${DashboardPage.url}`);
  await DashboardPage.at();
  await t.expect(dashboardPage.portfolioWidget.makePayment.visible).ok();

  EventDispatcher.addEventListener("NAV_TO");
  await t.click(dashboardPage.portfolioWidget.makePayment);

  await EventDispatcher.verifyNavTo("makePayment");
});
