import { UserAccounts_viewer_digital } from "../graphql-types/rx-gateway/UserAccounts";
import {
  DigitalServiceStatus,
  DigitalServiceType,
} from "../graphql-types/rx-gateway/globalTypes";

export function hasActiveService(
  data: UserAccounts_viewer_digital,
  serviceType: DigitalServiceType
) {
  return data.services.some(
    ({ status, type }) =>
      type === serviceType && status === DigitalServiceStatus.ACTIVE
  );
}
