import { DashboardPage } from "../shared/pages/DashboardPage";
import { base } from "../utilities/DynamicBaseUrl";
import {
  createSession,
  setupRxGatewayGraphqlMock,
} from "../utilities/KrakenStubClient";
import { digitalUserData } from "../fixtures";
import { StubServer } from "../utilities/StubServer";

const dashboardPage = new DashboardPage();

// eslint-disable-next-line no-undef
fixture("EVWidgetSpec").clientScripts([
  {
    // @ts-ignore
    module: "mockdate",
  },
  {
    content: 'window.MockDate.set("2021-09-20T05:00:00.000Z")',
  },
]);

test.before(async (t) => {
  await createSession(t);
  await setupRxGatewayGraphqlMock(t, digitalUserData);
  await StubServer.setupStubs(["ev-status"]);
})("EV widget is displayed on the page", async (t) => {
  await t.navigateTo(`${base.url}${DashboardPage.url}`);
  await DashboardPage.at();
  await t.expect(dashboardPage.evWidget.visible).ok();

  await t.expect(dashboardPage.evWidget.card.visible).ok();
  await t.expect(dashboardPage.evWidget.card.header.visible).ok();
  await t.expect(dashboardPage.evWidget.card.header.heading.visible).ok();
  await t
    .expect(dashboardPage.evWidget.card.header.heading.textContent)
    .eql("Smart charger");
  await t
    .expect(dashboardPage.evWidget.card.header.viewChargingHistory.visible)
    .ok();
});
