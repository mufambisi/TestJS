import { LPGWidget, LPGWidgetProps } from "@origin-digital/lpg-widget";
import { DigitalAccountType } from "../../../graphql-types/rx-gateway/globalTypes";
import { hasActiveAccount } from "../../../util/account";
import { WidgetDefinition } from "../../WidgetDefinition";

export const lpgWidgetDefinition: WidgetDefinition<LPGWidgetProps> = {
  widgetComponent: LPGWidget,
  name: "LPGWidget",
  shouldLoad: (data) => hasActiveAccount(data, DigitalAccountType.LPG),
  propsBuilder: (data) => {
    const accountIds = data.accounts
      .filter((account) => account?.type === DigitalAccountType.LPG)
      .map((account) => account.accountId);
    const customerNumber = accountIds[0];
    return {
      customerNumber,
    };
  },
};
