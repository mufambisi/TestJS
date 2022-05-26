import {
  FeatureStatus,
  FeatureType,
} from "../graphql-types/rx-gateway/globalTypes";
import {
  UserAccounts_viewer_digital,
  UserAccounts_viewer_digital_features,
} from "../graphql-types/rx-gateway/UserAccounts";

export function getFeature(
  data: UserAccounts_viewer_digital,
  featureType: FeatureType
): UserAccounts_viewer_digital_features | undefined {
  return data.features.find(
    ({ type, status }) =>
      type === featureType && status === FeatureStatus.ACTIVE
  );
}

export function hasFeature(
  data: UserAccounts_viewer_digital,
  featureType: FeatureType
) {
  return !!getFeature(data, featureType);
}
