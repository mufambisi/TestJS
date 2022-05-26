import { UserAccounts_viewer_digital } from "../graphql-types/rx-gateway/UserAccounts";
import {
  DigitalAccountStatus,
  DigitalAccountType,
} from "../graphql-types/rx-gateway/globalTypes";
import { hasAccountOnly, hasActiveAccount } from "./account";

const data: UserAccounts_viewer_digital = {
  __typename: "DigitalViewer",
  accounts: [
    {
      __typename: "DigitalAccount",
      id: "1",
      type: DigitalAccountType.KRAKEN,
      accountId: "123",
      status: DigitalAccountStatus.ACTIVE,
    },
    {
      __typename: "DigitalAccount",
      id: "1",
      type: DigitalAccountType.KRAKEN,
      accountId: "456",
      status: DigitalAccountStatus.CLOSED,
    },
    {
      __typename: "DigitalAccount",
      id: "1",
      type: DigitalAccountType.OHM,
      accountId: "789",
      status: DigitalAccountStatus.CLOSED,
    },
  ],
  features: [],
  services: [],
  user: null,
};

const lpgOnlyData: UserAccounts_viewer_digital = {
  __typename: "DigitalViewer",
  accounts: [
    {
      __typename: "DigitalAccount",
      id: "1",
      type: DigitalAccountType.LPG,
      accountId: "789",
      status: DigitalAccountStatus.ACTIVE,
    },
  ],
  features: [],
  services: [],
  user: null,
};

describe("hasActiveAccount()", () => {
  it("should return true when user has active account of type", () => {
    expect(hasActiveAccount(data, DigitalAccountType.KRAKEN)).toEqual(true);
  });
  it("should return false when user has only closed account of type", () => {
    expect(hasActiveAccount(data, DigitalAccountType.OHM)).toEqual(false);
  });
  it("should return false when user no account of type", () => {
    expect(hasActiveAccount(data, DigitalAccountType.LPG)).toEqual(false);
  });
});

describe("hasAccountOnly()", () => {
  it("should return true when user has only LPG", () => {
    expect(hasAccountOnly(lpgOnlyData, DigitalAccountType.LPG)).toEqual(true);
  });
  it("should return false when user has LPG plus other accounts", () => {
    expect(hasAccountOnly(data, DigitalAccountType.LPG)).toEqual(false);
  });
});
