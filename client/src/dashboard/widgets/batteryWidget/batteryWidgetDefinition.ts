import { BatteryWidget } from "@origin-digital/battery-widget";
import { FeatureType } from "../../../graphql-types/rx-gateway/globalTypes";
import { hasFeature } from "../../../util/featuresHelper";
import { WidgetDefinition } from "../../WidgetDefinition";
import { getBatteryWidgetProps } from "./batteryWidgetPropsHelper";

export const batteryWidgetDefinition: WidgetDefinition<{ nmi: string }> = {
  widgetComponent: BatteryWidget,
  name: "BatteryWidget",
  propsBuilder: (data) => getBatteryWidgetProps(data),
  shouldLoad: (data) => hasFeature(data, FeatureType.BATTERY),
};
