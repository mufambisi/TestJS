import { DigitalAccountType } from "src/graphql-types/rx-gateway/globalTypes";
import { hasAccountOnly } from "src/util/account";
import { WidgetDefinition } from "../../WidgetDefinition";
import { KrakenContactWidget } from "./KrakenContactWidget";

export const krakenContactWidgetDefinition: WidgetDefinition<{}> = {
  widgetComponent: KrakenContactWidget,
  name: "KrakenContactWidget",
  shouldLoad: (data) => !hasAccountOnly(data, DigitalAccountType.LPG),
};
