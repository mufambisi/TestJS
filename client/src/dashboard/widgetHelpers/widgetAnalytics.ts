import {
  ICardAA,
  ICardFailedAA,
  navigationCard,
} from "@origin-digital/reporting-client";

import { UserAccounts } from "src/graphql-types/rx-gateway/UserAccounts";
import { appName } from "src/config";
import { getCustomerId } from "src/util/jwt";
import { isPresent } from "src/util/arrayHelper";
import { WidgetDefinition } from "../WidgetDefinition";
import { DigitalUserCustomerType } from "src/graphql-types/rx-gateway/globalTypes";

const LOAD_TIMEOUT = 10000;

export type CardReportingData = ICardAA | ICardFailedAA;

type AnalyticsData = {
  widgetName: string;
  cards?: CardReportingData[];
};
const mapCustomerTypeForAnalytics = (userAccounts: UserAccounts) =>
  userAccounts.viewer.digital.user?.customerType ===
  DigitalUserCustomerType.SMALL_MEDIUM_ENTERPRISE
    ? "SME"
    : "RESI";

export async function reportDashboardPageLoadAnalytics(
  userAccounts: UserAccounts,
  widgets: AnalyticsData[]
) {
  const customerId = await getCustomerId();
  const accountIds = userAccounts.viewer.digital.accounts.map(
    (account) => account.accountId
  );

  const cards: CardReportingData[] = widgets
    .map((widget) => widget.cards)
    .filter(isPresent)
    .flatMap((card) => card);

  const customerType = mapCustomerTypeForAnalytics(userAccounts);

  navigationCard("screen", {
    appName,
    currentUri: window.location.href,
    cards,
    user: {
      customerId,
      customerType,
      accountIds,
    },
  });
}

export class DashboardMonitoring {
  private analyticsData: AnalyticsData[] = [];
  private userData: UserAccounts | undefined;
  private dataSent: boolean = false;
  private failedWidgetLoadTimeout: ReturnType<typeof setTimeout> | undefined;

  public constructor(
    data: UserAccounts,
    widgetManifest: WidgetDefinition<any>[]
  ) {
    const widgets: AnalyticsData[] = widgetManifest
      .filter(({ noTracking }) => !noTracking)
      .map(({ name }) => ({
        widgetName: name,
      }));

    this.failedWidgetLoadTimeout = setTimeout(
      this.widgetLoadTimeout(this),
      LOAD_TIMEOUT
    );

    this.analyticsData = widgets;
    this.userData = data;
  }

  public onStatusUpdate(widgetName: string, cardData?: CardReportingData[]) {
    const widgetIdx = this.analyticsData.findIndex(
      (widget) => widget?.widgetName === widgetName
    );
    const widget = this.analyticsData[widgetIdx];

    if (!widget) {
      return;
    }

    this.analyticsData[widgetIdx].cards = cardData;
    this.reportAnalytics();
  }

  private hasAllTrackingData() {
    return this.analyticsData.every(({ cards }) => Boolean(cards));
  }

  private reportAnalytics() {
    if (!this.dataSent && this.hasAllTrackingData() && this.userData) {
      if (this.failedWidgetLoadTimeout) {
        clearTimeout(this.failedWidgetLoadTimeout);
      }
      this.dataSent = true;
      reportDashboardPageLoadAnalytics(this.userData, this.analyticsData);
    }
  }

  private widgetLoadTimeout = (self: DashboardMonitoring) => () => {
    if (self.dataSent) return;

    // remove all widgets with no data
    for (let i = 0; i < this.analyticsData.length; i++) {
      if (!this.analyticsData[i].cards) {
        delete this.analyticsData[i];
      }
    }

    self.reportAnalytics();
  };
}
