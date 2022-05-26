import { DigitalAccountType } from "../../../graphql-types/rx-gateway/globalTypes";
import { UserAccounts_viewer_digital } from "../../../graphql-types/rx-gateway/UserAccounts";
import { WidgetDefinition } from "../../WidgetDefinition";
import { PortfolioSummaryProps } from "./PortfolioSummary";
import { PortfolioSummaryWidget } from "./PortfolioSummaryWidget";

export const portfolioSummaryWidgetDefinition = (
  isClosed: boolean
): WidgetDefinition<PortfolioSummaryProps> => ({
  widgetComponent: PortfolioSummaryWidget,
  name: isClosed ? "PortfolioSummaryWidgetClosed" : "PortfolioSummaryWidget",
  propsBuilder: () => ({
    isClosed,
  }),
  shouldLoad: (data: UserAccounts_viewer_digital) =>
    data.accounts.some(({ type }) => type === DigitalAccountType.KRAKEN),
});
