import {
  UserAccounts_viewer_digital,
  UserAccounts_viewer_digital_features,
} from "src/graphql-types/rx-gateway/UserAccounts";
import {
  FeatureType,
  FeatureStatus,
} from "src/graphql-types/rx-gateway/globalTypes";

import { getFeature } from "./featuresHelper";

const getTestFeatures = (): UserAccounts_viewer_digital_features[] => [
  {
    __typename: "Feature",
    id: "1",
    type: FeatureType.BATTERY,
    featureId: "battery",
    status: FeatureStatus.ACTIVE,
  },
  {
    __typename: "Feature",
    id: "2",
    type: FeatureType.EV,
    featureId: "ev",
    status: FeatureStatus.INACTIVE,
  },
];

describe("getFeature", () => {
  it("should return the feature if it is found and active", () => {
    const features = getTestFeatures();
    expect(
      getFeature(
        { features } as UserAccounts_viewer_digital,
        FeatureType.BATTERY
      )
    ).toEqual(features[0]);
  });
  it("should return nothing if it is found but inactive", () => {
    const features = getTestFeatures();
    expect(
      getFeature({ features } as UserAccounts_viewer_digital, FeatureType.EV)
    ).toBeUndefined();
  });
  it("should return nothing if it is not found", () => {
    const features = getTestFeatures();
    expect(
      getFeature(
        { features } as UserAccounts_viewer_digital,
        FeatureType.INTERCOM
      )
    ).toBeUndefined();
  });
});
