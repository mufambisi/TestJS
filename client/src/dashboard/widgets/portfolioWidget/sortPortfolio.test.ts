import { ServiceType } from "src/graphql-types/rx-gateway/globalTypes";
import { PortfolioSummaryQuery_viewer_kraken_accounts } from "src/graphql-types/rx-gateway/PortfolioSummaryQuery";
import { sortPortfolio } from "./sortPortfolio";

describe("sortPortfolio", () => {
  const getPortfolioSummary = (params: {
    postcode?: string;
    locality?: string;
    addressValue?: string;
    serviceType?: ServiceType;
    validFrom?: string;
  }): PortfolioSummaryQuery_viewer_kraken_accounts => ({
    __typename: "Account",
    accountNumber: "A-BS6540BF",
    services: [
      {
        __typename: "ElectricityService",
        type: params.serviceType ?? ServiceType.ELECTRICITY,
        validFrom: params.validFrom ?? "2020-12-31T14:00:00.000Z",
        isActive: true,
        property: {
          __typename: "Property",
          address: {
            __typename: "AustralianAddress",
            value:
              params.addressValue ?? "U 3, 76 Mathoura Rd, Toorak, VIC 3142",
            components: {
              __typename: "AustralianAddressComponents",
              locality: params.locality ?? "Toorak",
              postcode: params.postcode ?? "3142",
            },
          },
        },
      },
    ],
  });

  const basePortfolio = getPortfolioSummary({});
  const largerPostcodePortfolio = getPortfolioSummary({
    postcode: "3143",
    addressValue: "109 Kooyong Rd, Armadale, VIC 3143",
  });
  const smallerSuburbPortfolio = getPortfolioSummary({
    locality: "Hawksburn",
    addressValue: "12 Gladstone Ave, Hawksburn, VIC 3142",
  });
  const gasFuelPortfolio = getPortfolioSummary({
    serviceType: ServiceType.GAS,
  });
  const laterStartDateProfolio = getPortfolioSummary({
    validFrom: new Date().toISOString(),
  });

  it.each([
    ["postcode", basePortfolio, largerPostcodePortfolio],
    ["suburb", smallerSuburbPortfolio, basePortfolio],
    ["fuel type", basePortfolio, gasFuelPortfolio],
    ["agreement start date", basePortfolio, laterStartDateProfolio],
  ])(
    "sorts portfolio summary by %s",
    (
      _d: string,
      firstPortfolio: PortfolioSummaryQuery_viewer_kraken_accounts,
      secondPortfolio: PortfolioSummaryQuery_viewer_kraken_accounts
    ) => {
      expect(sortPortfolio([secondPortfolio, firstPortfolio])).toEqual([
        firstPortfolio,
        secondPortfolio,
      ]);
    }
  );

  it("groups and sorts portfolio summary based on rules", () => {
    expect(
      sortPortfolio([
        largerPostcodePortfolio,
        laterStartDateProfolio,
        gasFuelPortfolio,
        smallerSuburbPortfolio,
        basePortfolio,
      ])
    ).toEqual([
      smallerSuburbPortfolio,
      basePortfolio,
      laterStartDateProfolio,
      gasFuelPortfolio,
      largerPostcodePortfolio,
    ]);
  });
});
