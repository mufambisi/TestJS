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
fixture("BatteryWidgetSpec").clientScripts([
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
  await StubServer.setupStubs([
    "battery-weather",
    "battery-vpp-state-of-charge",
  ]);
})("Battery widget is displayed on the page", async (t) => {
  await t.navigateTo(`${base.url}${DashboardPage.url}`);
  await DashboardPage.at();

  await t.expect(dashboardPage.batteryWidget.visible).ok();

  // header
  await t
    .expect(dashboardPage.batteryWidget.header.visible)
    .ok()
    .expect(dashboardPage.batteryWidget.infoBar.visible)
    .ok()
    .expect(dashboardPage.batteryWidget.infoBar.weather.textContent)
    .contains("21.5°");

  // energy summary
  await t
    .expect(dashboardPage.batteryWidget.energySummary.visible)
    .ok()
    .expect(dashboardPage.batteryWidget.energySummary.houseImage.visible)
    .ok()
    .expect(dashboardPage.batteryWidget.energySummary.currentUse.textContent)
    .eql("2.65 kW")
    .expect(dashboardPage.batteryWidget.energySummary.solar.visible)
    .ok()
    .expect(dashboardPage.batteryWidget.energySummary.solar.kwh.textContent)
    .eql("0 kW")
    .expect(dashboardPage.batteryWidget.energySummary.battery.visible)
    .ok()
    .expect(dashboardPage.batteryWidget.energySummary.battery.kwh.textContent)
    .eql("-0.3 kW")
    .expect(dashboardPage.batteryWidget.energySummary.grid.visible)
    .ok()
    .expect(dashboardPage.batteryWidget.energySummary.grid.kwh.textContent)
    .eql("2.35 kW");

  // footer
  await t
    .expect(dashboardPage.batteryWidget.viewDetailsButton.textContent)
    .eql("View details");
});
