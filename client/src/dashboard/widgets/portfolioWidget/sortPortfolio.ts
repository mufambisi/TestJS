import sortby from "lodash.sortby";
import { ServiceType } from "src/graphql-types/rx-gateway/globalTypes";
import { PortfolioSummaryQuery_viewer_kraken_accounts } from "src/graphql-types/rx-gateway/PortfolioSummaryQuery";
import { parseDate } from "src/util/dateHelper";

const getServiceTypePriority = (type: ServiceType): number => {
  switch (type) {
    case ServiceType.ELECTRICITY:
      return 0;
    case ServiceType.GAS:
      return 1;
    default:
      return 2;
  }
};

export const sortPortfolio = <
  t extends PortfolioSummaryQuery_viewer_kraken_accounts
>(
  accounts: t[]
): t[] => {
  const portfolioSortOrder = [
    (account: t) => account.services[0].property?.address.components.postcode,
    (account: t) => account.services[0].property?.address.components.locality,
    (account: t) => getServiceTypePriority(account.services[0].type),
    (account: t) => parseDate(account.services[0].validFrom)?.valueOf(),
  ];
  return sortby(accounts, portfolioSortOrder);
};
