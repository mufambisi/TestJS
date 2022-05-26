import { add } from "date-fns";
import { AccountServiceStatus } from "@origin-digital/kraken-account";
import { ServiceType } from "src/graphql-types/rx-gateway/globalTypes";
import { PortfolioSummaryQuery_viewer_kraken_accounts } from "src/graphql-types/rx-gateway/PortfolioSummaryQuery";
import { getAccountWithStatus, getStatusFilter } from "./accountHelper";

const getTestAccount = (
  isActive: boolean,
  validFrom: string | null
): PortfolioSummaryQuery_viewer_kraken_accounts => ({
  __typename: "Account",
  accountNumber: "A-BS6540BF",
  services: [
    {
      __typename: "ElectricityService",
      type: ServiceType.ELECTRICITY,
      validFrom,
      isActive,
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
});

const today = new Date();
const yesterday = add(today, { days: -1 }).toISOString();
const tomorrow = add(today, { days: 1 }).toISOString();
const activeAccount = getTestAccount(true, yesterday);
const onboardingAccount = getTestAccount(false, tomorrow);
const closedAccount = getTestAccount(false, yesterday);
const unknownStatusAccount = getTestAccount(false, null);

describe("getAccountWithStatus()", () => {
  it.each([
    [AccountServiceStatus.ONBOARDING, "future start date", onboardingAccount],
    [AccountServiceStatus.ACTIVE, "flag isActive=true", activeAccount],
    [AccountServiceStatus.CLOSED, "past start date", closedAccount],
    [AccountServiceStatus.UNKNOWN, "invalid start date", unknownStatusAccount],
  ])(
    "returns %s when passing in %s accounts",
    (
      expected: AccountServiceStatus,
      _d: string,
      account: PortfolioSummaryQuery_viewer_kraken_accounts
    ) => {
      expect(getAccountWithStatus(account).serviceStatus).toEqual(expected);
    }
  );
});

describe("getStatusFilter()", () => {
  const accountsWithStatus = [
    onboardingAccount,
    activeAccount,
    closedAccount,
    unknownStatusAccount,
  ].map((account) => getAccountWithStatus(account));

  it("returns a filter that filters out closed accounts", () => {
    expect(accountsWithStatus.filter(getStatusFilter(true))).toEqual(
      [closedAccount].map((account) => getAccountWithStatus(account))
    );
  });

  it("returns a filter that filters out active/onboarding/unknown accounts", () => {
    expect(accountsWithStatus.filter(getStatusFilter(false))).toEqual(
      [onboardingAccount, activeAccount, unknownStatusAccount].map((account) =>
        getAccountWithStatus(account)
      )
    );
  });
});
