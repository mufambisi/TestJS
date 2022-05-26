import {
  DigitalAccountType,
  DigitalServiceType,
} from "src/graphql-types/rx-gateway/globalTypes";
import { hasActiveAccount } from "src/util/account";
import { hasActiveService } from "src/util/service";
import { UserAccounts_viewer_digital } from "src/graphql-types/rx-gateway/UserAccounts";

export const setAdobeTargetParams = (data: UserAccounts_viewer_digital) => {
  //@ts-ignore
  window.targetPageParamsAll = () => {
    return {
      RX_TARGET_SAP: hasActiveAccount(data, DigitalAccountType.SAP),
      RX_TARGET_BROADBAND: hasActiveAccount(data, DigitalAccountType.BROADBAND),
      RX_TARGET_ELECTRICITY:
        hasActiveService(data, DigitalServiceType.ELECTRICITY) &&
        hasActiveAccount(data, DigitalAccountType.KRAKEN),
    };
  };
};
