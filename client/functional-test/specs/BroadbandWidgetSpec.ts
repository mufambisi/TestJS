import { DashboardPage } from "../shared/pages/DashboardPage";
import { base } from "../utilities/DynamicBaseUrl";
import {
  createSession,
  setupRxGatewayGraphqlMock,
} from "../utilities/KrakenStubClient";
import { digitalUserData } from "../fixtures";

const dashboardPage = new DashboardPage();

/* eslint-disable-next-line no-undef */
fixture("BroadbandWidgetSpec");

test.before(async (t) => {
  await createSession(t);
  await setupRxGatewayGraphqlMock(t, digitalUserData);
})("Broadband widget is displayed on the page", async (t) => {
  await t.navigateTo(`${base.url}${DashboardPage.url}`);
  await DashboardPage.at();
  await t
    .expect(dashboardPage.broadbandWidget.widget.visible)
    .ok()
    .expect(dashboardPage.broadbandWidget.linkToABBPortal.visible)
    .ok();
});
