import { WidgetDefinition } from "../../WidgetDefinition";
import { SplitCrmWidget, SplitCrmWidgetProps } from "./SplitCrmWidget";
import { hasActiveAccount } from "../../../util/account";
import { DigitalAccountType } from "../../../graphql-types/rx-gateway/globalTypes";

export const splitCrmWidgetDefinition: WidgetDefinition<SplitCrmWidgetProps> = {
  widgetComponent: SplitCrmWidget,
  name: "SplitCrmWidget",
  propsBuilder: (data) => ({ data }),
  shouldLoad: (data) => {
    return (
      hasActiveAccount(data, DigitalAccountType.SAP) &&
      hasActiveAccount(data, DigitalAccountType.KRAKEN)
    );
  },
};
