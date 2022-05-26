import { WidgetDefinition } from "../../WidgetDefinition";
import { GstDisclaimerWidget } from "./GstDisclaimerWidget";

export const gstDisclaimerWidgetDefinition: WidgetDefinition<{}> = {
  widgetComponent: GstDisclaimerWidget,
  name: "GstDisclaimerWidget",
  noTracking: true,
};
