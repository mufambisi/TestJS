import { BroadbandWidget } from "@origin-digital/broadband-widget";
import { DigitalAccountType } from "../../../graphql-types/rx-gateway/globalTypes";
import { hasActiveAccount } from "../../../util/account";
import { WidgetDefinition } from "../../WidgetDefinition";

export const broadbandWidgetDefinition: WidgetDefinition<void> = {
  widgetComponent: BroadbandWidget,
  name: "BroadbandWidget",
  shouldLoad: (data) =>
    hasActiveAccount(data, DigitalAccountType.BROADBAND) &&
    hasActiveAccount(data, DigitalAccountType.KRAKEN),
};
