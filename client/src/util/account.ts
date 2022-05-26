import {
  DigitalAccountStatus,
  DigitalAccountType,
} from "../graphql-types/rx-gateway/globalTypes";
import { UserAccounts_viewer_digital } from "../graphql-types/rx-gateway/UserAccounts";

export function hasActiveAccount(
  data: UserAccounts_viewer_digital,
  accountType: DigitalAccountType
) {
  return data.accounts.some(
    (account) =>
      account.type === accountType &&
      account.status === DigitalAccountStatus.ACTIVE
  );
}

export const getOpenSapAccounts = (data: UserAccounts_viewer_digital) => {
  return data.accounts.filter(
    (it) =>
      it.type === DigitalAccountType.SAP &&
      it.status === DigitalAccountStatus.ACTIVE
  );
};

export function hasAccountOnly(
  data: UserAccounts_viewer_digital,
  accountType: DigitalAccountType
) {
  return data.accounts.every(
    (account) =>
      account.type === accountType &&
      account.status === DigitalAccountStatus.ACTIVE
  );
}
