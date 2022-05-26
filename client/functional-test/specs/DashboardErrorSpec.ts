import {
  networkFailureAccount,
  resolverFailureAccount,
  singleAccountDigitalUserData,
} from "../fixtures";
import { GlobalErrorPage } from "../pages/GlobalErrorPage";
import { DashboardPage } from "../shared/pages/DashboardPage";
import { base } from "../utilities/DynamicBaseUrl";
import {
  createSession,
  setupKrakenGraphqlMock,
  setupRxGatewayGraphqlMock,
} from "../utilities/KrakenStubClient";

const dashboardPage = new DashboardPage();

/* eslint-disable-next-line no-undef */
fixture("DashboardErrorSpec");

test.before(async (t) => {
  await createSession(t);
})("Dashboard API failure check", async (t) => {
  await t.navigateTo(`${base.url}${DashboardPage.url}`);
  await GlobalErrorPage.at();
});

test.before(async (t) => {
  await createSession(t);
  await setupRxGatewayGraphqlMock(t, singleAccountDigitalUserData);
  await setupKrakenGraphqlMock(t, networkFailureAccount);
})("Dashboard network failure check", async (t) => {
  await t.navigateTo(`${base.url}${DashboardPage.url}`);
  await DashboardPage.at();
  await t.expect(dashboardPage.failure.count).eql(1);
});

test.before(async (t) => {
  await createSession(t);
  await setupRxGatewayGraphqlMock(t, singleAccountDigitalUserData);
  await setupKrakenGraphqlMock(t, resolverFailureAccount);
})("Dashboard resolver failure check", async (t) => {
  await t.navigateTo(`${base.url}${DashboardPage.url}`);
  await DashboardPage.at();
  await t.expect(dashboardPage.failure.count).eql(1);
});
