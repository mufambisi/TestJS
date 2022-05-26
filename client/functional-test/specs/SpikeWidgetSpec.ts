import { DashboardPage } from "../shared/pages/DashboardPage";
import { base } from "../utilities/DynamicBaseUrl";
import {
  createSession,
  setupRxGatewayGraphqlMock,
} from "../utilities/KrakenStubClient";
import { digitalUserData } from "../fixtures";
import { StubServer } from "../utilities/StubServer";

const dashboardPage = new DashboardPage();

/* eslint-disable-next-line no-undef */
fixture("SpikeWidgetSpec");

test.before(async (t) => {
  await createSession(t);
  await setupRxGatewayGraphqlMock(t, digitalUserData);
  await StubServer.setupStubs("spike-summary");
})("Spike widget is displayed on the page", async (t) => {
  await t.navigateTo(`${base.url}${DashboardPage.url}`);
  await DashboardPage.at();
  await t
    .expect(dashboardPage.spikeWidget.widget.visible)
    .ok()
    .expect(dashboardPage.spikeWidget.link.visible)
    .ok()
    .expect(dashboardPage.spikeWidget.points.textContent)
    .eql("26,761");
});
