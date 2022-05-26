import { WidgetDefinition } from "../../WidgetDefinition";
import { CrossSellWidget, ICrossSellWidgetProps } from "./CrossSellWidget";

export const crossSellWidgetDefinition: WidgetDefinition<ICrossSellWidgetProps> = {
  widgetComponent: CrossSellWidget,
  name: "CrossSellWidget",
  propsBuilder: (data) => ({ data }),
};
