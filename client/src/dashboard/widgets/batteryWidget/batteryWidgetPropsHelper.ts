import { UserAccounts_viewer_digital } from "../../../graphql-types/rx-gateway/UserAccounts";
import { getFeature } from "../../../util/featuresHelper";
import { FeatureType } from "../../../graphql-types/rx-gateway/globalTypes";
import { getNmiFromFeatureId } from "./batteryNmiHelper";

export function getBatteryWidgetProps(
  data: UserAccounts_viewer_digital
): { nmi: string } {
  const { featureId } = getFeature(data, FeatureType.BATTERY) || {};

  if (featureId) {
    return {
      nmi: getNmiFromFeatureId(featureId),
    };
  }

  // TODO; not sure what we should do here or is this ok?

  throw new Error(`Failed to get battery feature from user accounts data`);
}
