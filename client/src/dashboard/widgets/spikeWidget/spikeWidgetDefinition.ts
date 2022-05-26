import { SpikeWidget } from "@origin-digital/spike-widget";

import { WidgetDefinition } from "../../WidgetDefinition";
import { hasActiveAccount } from "../../../util/account";
import { DigitalAccountType } from "../../../graphql-types/rx-gateway/globalTypes";

export const spikeWidgetDefinition: WidgetDefinition<{}> = {
  widgetComponent: SpikeWidget,
  name: "SpikeWidget",
  shouldLoad: (data) => hasActiveAccount(data, DigitalAccountType.OHM),
};
