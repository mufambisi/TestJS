import { EVWidget } from "@origin-digital/ev-widget";
import { FeatureType } from "../../../graphql-types/rx-gateway/globalTypes";
import { hasFeature } from "../../../util/featuresHelper";
import { WidgetDefinition } from "../../WidgetDefinition";
import { getEvWidgetProps } from "./evWidgetPropsHelper";

export const evWidgetDefinition: WidgetDefinition<{ nmi: string }> = {
  widgetComponent: EVWidget,
  name: "EVWidget",
  propsBuilder: (data) => getEvWidgetProps(data),
  shouldLoad: (data) => hasFeature(data, FeatureType.EV),
};
