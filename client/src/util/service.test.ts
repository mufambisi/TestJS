import { UserAccounts_viewer_digital } from "../graphql-types/rx-gateway/UserAccounts";
import {
  DigitalServiceStatus,
  DigitalServiceType,
} from "../graphql-types/rx-gateway/globalTypes";
import { hasActiveService } from "./service";

const data: UserAccounts_viewer_digital = {
  __typename: "DigitalViewer",
  accounts: [],
  features: [],
  services: [
    {
      __typename: "DigitalService",
      status: DigitalServiceStatus.ACTIVE,
      type: DigitalServiceType.ELECTRICITY,
    },
  ],
  user: null,
};

describe("hasActiveService()", () => {
  it("should return true when user has active service of type", () => {
    expect(hasActiveService(data, DigitalServiceType.ELECTRICITY)).toEqual(
      true
    );
  });
  it("should return false when user no service of type", () => {
    expect(hasActiveService(data, DigitalServiceType.GAS)).toEqual(false);
  });
});
