import { isAfter, isBefore } from "date-fns";
import { AccountServiceStatus } from "@origin-digital/kraken-account";
import { parseDate } from "src/util/dateHelper";
import { PortfolioSummaryQuery_viewer_kraken_accounts } from "src/graphql-types/rx-gateway/PortfolioSummaryQuery";

export interface AccountWithStatus
  extends PortfolioSummaryQuery_viewer_kraken_accounts {
  serviceStatus: AccountServiceStatus;
}

const getAccountServiceStatus = (
  account: PortfolioSummaryQuery_viewer_kraken_accounts
): AccountServiceStatus => {
  if (account.services.some((service) => service.isActive)) {
    return AccountServiceStatus.ACTIVE;
  }

  const today = new Date();
  const validFromDate = parseDate(account.services[0].validFrom);

  if (validFromDate && isBefore(validFromDate, today)) {
    return AccountServiceStatus.CLOSED;
  }

  if (validFromDate && isAfter(validFromDate, today)) {
    return AccountServiceStatus.ONBOARDING;
  }

  return AccountServiceStatus.UNKNOWN;
};

export const getAccountWithStatus = (
  account: PortfolioSummaryQuery_viewer_kraken_accounts
): AccountWithStatus => {
  return { ...account, serviceStatus: getAccountServiceStatus(account) };
};

export const getStatusFilter = (isClosed: boolean) => (
  account: AccountWithStatus
) => {
  if (isClosed) {
    return account.serviceStatus === AccountServiceStatus.CLOSED;
  } else {
    return account.serviceStatus !== AccountServiceStatus.CLOSED;
  }
};
