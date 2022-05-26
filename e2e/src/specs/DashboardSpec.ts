import { ConfigUtil } from "../utils";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../shared/pages/DashboardPage";
import { LpgOrdersPage } from "../shared/pages/LpgOrdersPage";

const loginPage = new LoginPage();
const dashboardPage = new DashboardPage();
const lpgOrdersPage = new LpgOrdersPage();

/* eslint-disable-next-line no-undef */
fixture("DashboardRxSpec").page(ConfigUtil.getUrl(DashboardPage.url));

test("RetailX customer can view single account details", async (t) => {
  await loginPage.doLogin(ConfigUtil.configData("singleAccountUser"));

  await DashboardPage.at();
  await t
    .expect(dashboardPage.portfolioWidget.accountDetail.visible)
    .ok()
    .expect(dashboardPage.portfolioWidget.accountNumber.visible)
    .ok()
    .expect(dashboardPage.portfolioWidget.billPayments.visible)
    .ok()
    .expect(dashboardPage.portfolioWidget.makePayment.exists)
    .ok();

  await t.expect(dashboardPage.feedbackBtn.visible).ok();
});

test("RetailX customer can view all account details", async (t) => {
  await loginPage.doLogin(ConfigUtil.configData("multipleAccountUser"));

  await DashboardPage.at();
  await t
    .expect(dashboardPage.portfolioWidget.accountDetail.visible)
    .ok()
    .expect(dashboardPage.portfolioWidget.accountNumber.visible)
    .ok()
    .expect(dashboardPage.portfolioWidget.billPayments.visible)
    .ok()
    .expect(dashboardPage.portfolioWidget.makePayment.visible)
    .ok();

  await t.expect(dashboardPage.portfolioWidget.accountNumber.count).eql(4);
  await t.expect(dashboardPage.feedbackBtn.visible).ok();
});

test("RetailX LPG customer can view LPG account details and order LPG", async (t) => {
  const lpg = ConfigUtil.configData("lpg");
  const email = lpg.lpgKraken.email;
  const customerNumber = lpg.lpgKraken.customerNumber;
  await loginPage.doLogin(email);

  await DashboardPage.at();
  await dashboardPage.lpgWidget.verifyLPGDashboard();
  await t.click(dashboardPage.lpgWidget.orderLpg);
  await LpgOrdersPage.at();
  await lpgOrdersPage.verifyUrl(customerNumber);
});

test("RetailX LPG only customer can view LPG account details and order LPG", async (t) => {
  const lpg = ConfigUtil.configData("lpg");
  const email = lpg.lpgOnly.email;
  const customerNumber = lpg.lpgOnly.customerNumber;
  await loginPage.doLogin(email);

  await DashboardPage.at();
  await dashboardPage.lpgWidget.verifyLPGDashboard();
  await t.click(dashboardPage.lpgWidget.orderLpg);
  await LpgOrdersPage.at();
  await lpgOrdersPage.verifyUrl(customerNumber);
});
