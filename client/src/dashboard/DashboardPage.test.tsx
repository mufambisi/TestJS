import { render } from "@origin-digital/ods-testing-library";
import React from "react";
import { ServiceType } from "src/graphql-types/rx-gateway/globalTypes";
import { DashboardPage } from "./DashboardPage";
import { usePortfolioSummaryQuery, useUserAccountsQuery } from "./queries";
import { config } from "../config";
import { ToggleContextProvider } from "@origin-digital/toggle";

jest.mock("@origin-digital/event-dispatcher", () => ({
  ...jest.requireActual("@origin-digital/event-dispatcher"),
  eventListener: { addListener: jest.fn() },
}));
jest.mock("@origin-digital/kraken-account", () => ({
  ...jest.requireActual("@origin-digital/kraken-account"),
  AccountCard: ({ accountNumber }: { accountNumber: string }) => (
    <div data-id="service-id">{accountNumber}</div>
  ),
}));
jest.mock("src/util/analytics");
jest.mock("src/util/jwt");
jest.mock("./queries");

const accountNumber = "A-132645879";

const renderDashboardPage = () =>
  render(
    <ToggleContextProvider toggles={config.toggles} appName={config.appName}>
      <DashboardPage />
    </ToggleContextProvider>
  );

describe("<DashboardPage />", () => {
  beforeEach(() => {
    (useUserAccountsQuery as jest.Mock).mockReturnValue({
      data: {
        viewer: {
          kraken: {
            accounts: [
              {
                accountNumber,
                services: [{ __typename: "ElectricityService" }],
              },
            ],
          },
          digital: {
            accounts: [
              {
                id: "1",
                type: "KRAKEN",
                accountId: accountNumber,
                product: "ELECTRICITY",
                status: "ACTIVE",
              },
            ],
            features: [],
            services: [],
          },
        },
      },
    });

    (usePortfolioSummaryQuery as jest.Mock).mockReturnValue({
      data: {
        viewer: {
          kraken: {
            accounts: [
              {
                __typename: "Account",
                accountNumber,
                services: [
                  {
                    __typename: "ElectricityService",
                    type: ServiceType.ELECTRICITY,
                    validFrom: "2020-12-31T14:00:00.000Z",
                    isActive: true,
                    property: {
                      __typename: "Property",
                      address: {
                        __typename: "AustralianAddress",
                        value: "U 3, 76 Mathoura Rd, Toorak, VIC 3142",
                        components: {
                          __typename: "AustralianAddressComponents",
                          locality: "Toorak",
                          postcode: "3142",
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    });
  });

  it("should render without error", () => {
    const { container } = renderDashboardPage();

    expect(container).toMatchSnapshot();
  });

  it("should contain correct account number", () => {
    const { getByTestId } = renderDashboardPage();

    expect(getByTestId("service-id").textContent).toBe("A-132645879");
  });

  it("should render error message", () => {
    (useUserAccountsQuery as jest.Mock).mockReturnValue({
      error: {},
    });

    expect(() => renderDashboardPage()).toThrowError();
  });

  it("should render the loading indicator when loading", () => {
    (useUserAccountsQuery as jest.Mock).mockReturnValue({
      loading: true,
    });

    const { getAllByTestId } = renderDashboardPage();

    expect(getAllByTestId("page-loading-indicator")).toHaveLength(1);
  });

  it("should not render the loading indicator when loading is false", () => {
    (useUserAccountsQuery as jest.Mock).mockReturnValue({
      loading: false,
    });

    const { queryAllByTestId } = renderDashboardPage();

    expect(queryAllByTestId("page-loading-indicator")).toHaveLength(0);
  });

  it("should render LPG missing feature banner and not default missing feature banner", async () => {
    (useUserAccountsQuery as jest.Mock).mockReturnValue({
      data: {
        viewer: {
          kraken: {
            accounts: [
              {
                accountNumber,
                services: [{ __typename: "ElectricityService" }],
              },
            ],
          },
          digital: {
            accounts: [
              {
                type: "KRAKEN",
              },
              {
                type: "LPG",
              },
            ],
            features: [],
            services: [],
          },
        },
      },
    });
    const { findByTestId } = renderDashboardPage();

    await findByTestId("lpg-missing-features-banner");
  });

  it("should render split crm card when there is at least one active sap, and one active kraken acccount", async () => {
    (useUserAccountsQuery as jest.Mock).mockReturnValue({
      data: {
        viewer: {
          kraken: {
            accounts: [
              {
                accountNumber: "A-5CA6C8DE",
                services: [
                  {
                    __typename: "GasService",
                    type: "GAS",
                    validFrom: "2020-12-31T14:00:00.000Z",
                    isActive: true,
                    property: {
                      address: {
                        value: "24 West St, Hillsdale, Nsw 2047",
                        components: {
                          locality: "Hillsdale",
                          postcode: "2047",
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
          digital: {
            accounts: [
              {
                id:
                  "eyJ0eXBlIjoiRGlnaXRhbEFjY291bnQiLCJpZCI6IjExZWJmNWE5LTVmZjEtMDJjOS04N2M0LTA2NzM0YjA1MDgzKjM9",
                type: "SAP",
                accountId: "400005194727",
                product: "ELECTRICITY",
                status: "ACTIVE",
              },
              {
                id:
                  "eyJ0eXBlIjoiRGlnaXRhbEFjY291bnQiLCJpZCI6IjUxOTZkNGMzLWVjZGUtNDA3Mi1hMzVjLWIxYzY4M2E3OGExOCJ1",
                type: "KRAKEN",
                accountId: "A-5CA6C8DE",
                product: "GAS",
                status: "ACTIVE",
              },
            ],
            features: [],
            services: [],
          },
        },
      },
    });
    const { findByTestId } = renderDashboardPage();

    await findByTestId("split-crm-card");
  });

  it("should render split crm card with no bullet points, when there is only one active sap and one active kraken account", async () => {
    (useUserAccountsQuery as jest.Mock).mockReturnValue({
      data: {
        viewer: {
          kraken: {
            accounts: [
              {
                accountNumber: "A-5CA6C8DE",
                services: [
                  {
                    __typename: "GasService",
                    type: "GAS",
                    validFrom: "2020-12-31T14:00:00.000Z",
                    isActive: true,
                    property: {
                      address: {
                        value: "24 West St, Hillsdale, Nsw 2047",
                        components: {
                          locality: "Hillsdale",
                          postcode: "2047",
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
          digital: {
            accounts: [
              {
                id:
                  "eyJ0eXBlIjoiRGlnaXRhbEFjY291bnQiLCJpZCI6IjExZWJmNWE5LTVmZjEtMDJjOS04N2M0LTA2NzM0YjA1MDgzKjM9",
                type: "SAP",
                accountId: "400005194727",
                product: "ELECTRICITY",
                status: "ACTIVE",
              },
              {
                id:
                  "eyJ0eXBlIjoiRGlnaXRhbEFjY291bnQiLCJpZCI6IjUxOTZkNGMzLWVjZGUtNDA3Mi1hMzVjLWIxYzY4M2E3OGExOCJ1",
                type: "KRAKEN",
                accountId: "A-5CA6C8DE",
                product: "GAS",
                status: "ACTIVE",
              },
            ],
            features: [],
            services: [],
          },
        },
      },
    });
    const { findByTestId, queryByRole } = renderDashboardPage();

    await findByTestId("split-crm-card");
    const dotPoints = queryByRole("listitem");
    expect(dotPoints).not.toBeInTheDocument();
  });

  it("should render split crm card with bullet points, when there is more than one active sap and one active kraken account", async () => {
    (useUserAccountsQuery as jest.Mock).mockReturnValue({
      data: {
        viewer: {
          kraken: {
            accounts: [
              {
                accountNumber: "A-5CA6C8DE",
                services: [
                  {
                    __typename: "GasService",
                    type: "GAS",
                    validFrom: "2020-12-31T14:00:00.000Z",
                    isActive: true,
                    property: {
                      address: {
                        value: "24 West St, Hillsdale, Nsw 2047",
                        components: {
                          locality: "Hillsdale",
                          postcode: "2047",
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
          digital: {
            accounts: [
              {
                id:
                  "eyJ0eXBlIjoiRGlnaXRhbEFjY291bnQiLCJpZCI6IjExZWJmNWE5LTVmZjEtMDJjOS04N2M0LTA2NzM0YjA1MDgzKjM9",
                type: "SAP",
                accountId: "400005194727",
                product: "ELECTRICITY",
                status: "ACTIVE",
              },
              {
                id:
                  "eyJ0eXBlIjoiRGlnaXRhbEFjY291bnQiLCJpZCI6IjExZWJmNWE5LTVmZjEtMDJjOS04N2M0LTA2NzM0YjA1MDgzKjM8",
                type: "SAP",
                accountId: "400005194728",
                product: "ELECTRICITY",
                status: "ACTIVE",
              },
              {
                id:
                  "eyJ0eXBlIjoiRGlnaXRhbEFjY291bnQiLCJpZCI6IjUxOTZkNGMzLWVjZGUtNDA3Mi1hMzVjLWIxYzY4M2E3OGExOCJ1",
                type: "KRAKEN",
                accountId: "A-5CA6C8DE",
                product: "GAS",
                status: "ACTIVE",
              },
            ],
            features: [],
            services: [],
          },
        },
      },
    });
    const { findByTestId, queryAllByRole } = renderDashboardPage();

    await findByTestId("split-crm-card");
    const dotPoints = queryAllByRole("listitem");
    expect(dotPoints).toHaveLength(2);
  });
});
