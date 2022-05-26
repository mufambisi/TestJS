import {
  UserAccounts_viewer_digital,
  UserAccounts_viewer_digital_features,
} from "../../../graphql-types/rx-gateway/UserAccounts";
import { getEvWidgetProps } from "./evWidgetPropsHelper";
import {
  FeatureStatus,
  FeatureType,
} from "../../../graphql-types/rx-gateway/globalTypes";

const baseData: UserAccounts_viewer_digital = {
  __typename: "DigitalViewer",
  accounts: [],
  features: [],
  services: [],
  user: null,
};

const mockGetFeature = jest.fn();
jest.mock("../../../util/featuresHelper", () => ({
  getFeature: (data: UserAccounts_viewer_digital, type: FeatureType) =>
    mockGetFeature(data, type),
}));

const mockFeature: UserAccounts_viewer_digital_features = {
  __typename: "Feature",
  id: "22",
  type: FeatureType.EV,
  featureId: "500003528527",
  status: FeatureStatus.ACTIVE,
};

describe("evWidgetPropsHelper", () => {
  beforeEach(() => {
    mockGetFeature.mockReset();
  });

  describe("getEvWidgetProps()", () => {
    it("should successfully return valid props for the ev widget", async () => {
      const userData: UserAccounts_viewer_digital = {
        ...baseData,
        features: [mockFeature],
      };

      mockGetFeature.mockReturnValue(mockFeature);
      const actualProps = getEvWidgetProps(userData);
      expect(actualProps).toEqual({
        nmi: "500003528527",
      });
      expect(mockGetFeature).toHaveBeenCalledWith(userData, FeatureType.EV);
    });
    it("should fail to return valid props when a user does not have a ev feature", async () => {
      const userData: UserAccounts_viewer_digital = {
        ...baseData,
        features: [],
      };
      mockGetFeature.mockReturnValue(undefined);

      expect(() => getEvWidgetProps(userData)).toThrowError(
        "Failed to get ev feature from user accounts data"
      );
    });
  });
});
