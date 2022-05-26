import {
  UserAccounts_viewer_digital,
  UserAccounts_viewer_digital_features,
} from "../../../graphql-types/rx-gateway/UserAccounts";
import { getBatteryWidgetProps } from "./batteryWidgetPropsHelper";
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

const mockGetNmiFromFeatureId = jest.fn();
jest.mock("./batteryNmiHelper", () => ({
  getNmiFromFeatureId: (featureId: string) =>
    mockGetNmiFromFeatureId(featureId),
}));

const mockFeature: UserAccounts_viewer_digital_features = {
  __typename: "Feature",
  id: "1",
  type: FeatureType.BATTERY,
  featureId: "123_500003528527",
  status: FeatureStatus.ACTIVE,
};

describe("batteryWidgetPropsHelper", () => {
  beforeEach(() => {
    mockGetFeature.mockReset();
    mockGetNmiFromFeatureId.mockReset();
  });

  describe("getBatteryWidgetProps()", () => {
    it("should successfully return valid props for the battery widget", async () => {
      const userData: UserAccounts_viewer_digital = {
        ...baseData,
        features: [mockFeature],
      };

      mockGetFeature.mockReturnValue(mockFeature);
      mockGetNmiFromFeatureId.mockReturnValue("500003528527");

      expect(getBatteryWidgetProps(userData)).toEqual({
        nmi: "500003528527",
      });
    });

    it("should fail to return valid props when a user does not have a battery feature", async () => {
      mockGetFeature.mockReturnValue(undefined);
      const userData: UserAccounts_viewer_digital = {
        ...baseData,
        features: [],
      };

      expect(() => getBatteryWidgetProps(userData)).toThrowError(
        "Failed to get battery feature from user accounts data"
      );
    });

    it("should fail to return valid props when a nmi cannot be retrieved from the feature id", async () => {
      const userData: UserAccounts_viewer_digital = {
        ...baseData,
        features: [mockFeature],
      };

      mockGetFeature.mockReturnValue(mockFeature);
      mockGetNmiFromFeatureId.mockImplementation(() => {
        throw new Error("no nmi");
      });

      expect(() => getBatteryWidgetProps(userData)).toThrowError("no nmi");
    });
  });
});
