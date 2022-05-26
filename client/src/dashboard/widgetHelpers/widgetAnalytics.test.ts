import { waitFor } from "@origin-digital/ods-testing-library";
import { navigationCard } from "@origin-digital/reporting-client";

import {
  DigitalAccountStatus,
  DigitalAccountType,
  DigitalUserCustomerType,
} from "../../graphql-types/rx-gateway/globalTypes";
import {
  UserAccounts_viewer_digital_accounts,
  UserAccounts,
} from "../../graphql-types/rx-gateway/UserAccounts";
import { getCustomerId } from "../../util/jwt";
import { lpgWidgetDefinition } from "../widgets/lpgWidget";
import { WidgetDefinition } from "../WidgetDefinition";
import { portfolioSummaryWidgetDefinition } from "../widgets/portfolioWidget";
import { CardReportingData, DashboardMonitoring } from "./widgetAnalytics";

jest.mock("@origin-digital/reporting-client");
jest.mock("../../util/jwt");

const digitalAccount = (
  accountId: string,
  type: DigitalAccountType
): UserAccounts_viewer_digital_accounts => ({
  __typename: "DigitalAccount",
  accountId,
  id: "",
  status: DigitalAccountStatus.ACTIVE,
  type,
});

const getUserData = (
  digital: UserAccounts_viewer_digital_accounts[]
): UserAccounts => ({
  viewer: {
    __typename: "Viewer",
    digital: {
      __typename: "DigitalViewer",
      accounts: digital,
      features: [],
      services: [],
      user: null,
    },
  },
});

const getCardData = (id: string = "widget-card"): CardReportingData => ({
  category: "dashboard-card",
  id,
  title: "Widget Card",
});

describe("DashboardMonitoring", () => {
  let standardDigital: UserAccounts_viewer_digital_accounts[];
  let standardWidgets: WidgetDefinition<any>[];

  const getCards = (): CardReportingData[] =>
    (navigationCard as jest.Mock).mock.calls[0][1].cards;

  beforeEach(() => {
    jest.useFakeTimers();
    (getCustomerId as jest.Mock).mockResolvedValue("customer-id");

    standardDigital = [
      digitalAccount("A-12345678", DigitalAccountType.KRAKEN),
      digitalAccount("A-87654321", DigitalAccountType.KRAKEN),
      digitalAccount("LPG12345", DigitalAccountType.LPG),
    ];
    standardWidgets = [
      portfolioSummaryWidgetDefinition(false),
      lpgWidgetDefinition,
    ];
  });

  it("should add all widgets", async () => {
    const monitoring = new DashboardMonitoring(getUserData(standardDigital), [
      ...standardWidgets,
      portfolioSummaryWidgetDefinition(true),
    ]);

    monitoring.onStatusUpdate("PortfolioSummaryWidget", [
      getCardData("A-ACTIVE"),
    ]);
    monitoring.onStatusUpdate("PortfolioSummaryWidgetClosed", [
      getCardData("A-CLOSED"),
    ]);
    monitoring.onStatusUpdate("LPGWidget", [getCardData("card-lpg")]);

    await waitFor(() => expect(navigationCard).toBeCalled());

    const cards = getCards();

    expect(cards).toHaveLength(3);
    expect(cards[0].id).toContain("A-ACTIVE");
    expect(cards[1].id).toContain("card-lpg");
    expect(cards[2].id).toContain("A-CLOSED");
  });

  it("should handle multiple cards per widget", async () => {
    const monitoring = new DashboardMonitoring(
      getUserData(standardDigital),
      standardWidgets
    );

    const error = { errorMessage: "Failed to load" };

    monitoring.onStatusUpdate("PortfolioSummaryWidget", [
      getCardData("A-12345678"),
      {
        ...getCardData("A-87654321"),
        error,
      },
    ]);

    expect(getCustomerId).not.toBeCalled();

    monitoring.onStatusUpdate("LPGWidget", [
      { ...getCardData("card-lpg"), error },
      getCardData("card-lpg"),
    ]);

    expect(getCustomerId).toBeCalledTimes(1);

    jest.runAllTimers();

    await waitFor(() => expect(navigationCard).toBeCalled());

    const cards = getCards();

    expect(cards[0]).toEqual(getCardData("A-12345678"));
    expect(cards[1]).toEqual({
      ...getCardData("A-87654321"),
      error,
    });
    expect(cards[2]).toEqual({ ...getCardData("card-lpg"), error });
    expect(cards[3]).toEqual(getCardData("card-lpg"));
  });

  it("should only track widgets which have updated their status", async () => {
    const monitoring = new DashboardMonitoring(
      getUserData(standardDigital),
      standardWidgets
    );

    monitoring.onStatusUpdate("PortfolioSummaryWidget", [
      getCardData("A-12345678"),
    ]);

    jest.runAllTimers();

    await waitFor(() => expect(navigationCard).toBeCalled());

    const cards = getCards();

    expect(cards).toHaveLength(1);
    expect(cards[0]).toEqual(getCardData("A-12345678"));
  });

  it("should not track data once it has been tracked if any card is update again", async () => {
    const monitoring = new DashboardMonitoring(
      getUserData(standardDigital),
      standardWidgets
    );

    monitoring.onStatusUpdate("PortfolioSummaryWidget", [
      getCardData("A-12345678"),
    ]);
    monitoring.onStatusUpdate("LPGWidget", [getCardData("card-lpg")]);

    expect(getCustomerId).toBeCalledTimes(1);

    await waitFor(() => expect(navigationCard).toBeCalled());

    monitoring.onStatusUpdate("LPGWidget", [getCardData("card-lpg")]);

    expect(getCustomerId).toBeCalledTimes(1);
  });

  describe("should call navigation card", () => {
    const error = { errorMessage: "Failed to load" };
    const setupTest = async (userAccounts: UserAccounts) => {
      const monitoring = new DashboardMonitoring(userAccounts, standardWidgets);

      monitoring.onStatusUpdate("PortfolioSummaryWidget", [
        getCardData("A-12345678"),
        {
          ...getCardData("A-87654321"),
          error,
        },
      ]);

      expect(getCustomerId).not.toBeCalled();

      monitoring.onStatusUpdate("LPGWidget", [
        { ...getCardData("card-lpg"), error },
        getCardData("card-lpg"),
      ]);

      await waitFor(() => expect(navigationCard).toBeCalled());
    };

    it("with customer type as RESI and all other correct details", async () => {
      await setupTest(getUserData(standardDigital));

      expect(navigationCard).toBeCalledWith("screen", {
        appName: "dashboard-rx",
        currentUri: "http://localhost/",
        cards: [
          getCardData("A-12345678"),
          {
            ...getCardData("A-87654321"),
            error,
          },
          { ...getCardData("card-lpg"), error },
          getCardData("card-lpg"),
        ],
        user: {
          customerId: "customer-id",
          customerType: "RESI",
          accountIds: ["A-12345678", "A-87654321", "LPG12345"],
        },
      });
    });

    it("with customer type as SME and all other correct details", async () => {
      const defaulUserAccount = getUserData(standardDigital);
      const userAccountWithSMECustomerType: UserAccounts = {
        ...defaulUserAccount,
        viewer: {
          ...defaulUserAccount.viewer,
          digital: {
            ...defaulUserAccount.viewer.digital,
            user: {
              __typename: "DigitalUser",
              customerType: DigitalUserCustomerType.SMALL_MEDIUM_ENTERPRISE,
            },
          },
        },
      };
      await setupTest(userAccountWithSMECustomerType);
      expect(navigationCard).toBeCalledWith("screen", {
        appName: "dashboard-rx",
        currentUri: "http://localhost/",
        cards: [
          getCardData("A-12345678"),
          {
            ...getCardData("A-87654321"),
            error,
          },
          { ...getCardData("card-lpg"), error },
          getCardData("card-lpg"),
        ],
        user: {
          customerId: "customer-id",
          customerType: "SME",
          accountIds: ["A-12345678", "A-87654321", "LPG12345"],
        },
      });
    });
  });
});
