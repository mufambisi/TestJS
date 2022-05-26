import { UserAccounts_viewer_digital } from "../../../graphql-types/rx-gateway/UserAccounts";
import { getFeature } from "../../../util/featuresHelper";
import { FeatureType } from "../../../graphql-types/rx-gateway/globalTypes";

export function getEvWidgetProps(
  data: UserAccounts_viewer_digital
): { nmi: string } {
  const { featureId } = getFeature(data, FeatureType.EV) || {};

  if (featureId) {
    return {
      nmi: featureId,
    };
  }

  throw new Error(`Failed to get ev feature from user accounts data`);
}
