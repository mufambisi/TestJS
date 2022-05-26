import { Toggles } from "../config";
import { UserAccounts_viewer_digital } from "../graphql-types/rx-gateway/UserAccounts";
import { WidgetDefinition } from "./WidgetDefinition";
import { batteryWidgetDefinition } from "./widgets/batteryWidget";
import { broadbandWidgetDefinition } from "./widgets/broadbandWidget";
import { crossSellWidgetDefinition } from "./widgets/crossSellWidget";
import { evWidgetDefinition } from "./widgets/evWidget";
import { gstDisclaimerWidgetDefinition } from "./widgets/gstDisclaimerWidget";
import { krakenContactWidgetDefinition } from "./widgets/krakenContactWidget";
import { lpgWidgetDefinition } from "./widgets/lpgWidget";
import { portfolioSummaryWidgetDefinition } from "./widgets/portfolioWidget";
import { spikeWidgetDefinition } from "./widgets/spikeWidget";
import { splitCrmWidgetDefinition } from "./widgets/splitCrmWidget/splitCrmWidgetDefinition";
import { researchCommunitySignUpWidgetDefinition } from "./widgets/researchCommunitySignupWidget";
import { fuelDiscountWidgetDefinition } from "./widgets/fuelDiscountWidget";

export type WidgetManifest = WidgetDefinition<any>[];

// In order of appearance
function getBaseWidgetManifest(): WidgetManifest {
  return [
    batteryWidgetDefinition,
    evWidgetDefinition,
    portfolioSummaryWidgetDefinition(false),
    lpgWidgetDefinition,
    broadbandWidgetDefinition,
    spikeWidgetDefinition,
    fuelDiscountWidgetDefinition,
    splitCrmWidgetDefinition,
    crossSellWidgetDefinition,
    portfolioSummaryWidgetDefinition(true),
    krakenContactWidgetDefinition,
    researchCommunitySignUpWidgetDefinition,
    gstDisclaimerWidgetDefinition,
  ];
}

// Filter out widgets by widget name set to 'false' in config.toggles
function filterWidgetManifest(
  widgetManifest: WidgetManifest,
  toggles: Record<Toggles, boolean>
): WidgetManifest {
  return widgetManifest.filter(
    (manifest) =>
      toggles[manifest.name] === undefined || toggles[manifest.name] === true
  );
}

function getWidgetsForUserData(
  widgetManifest: WidgetManifest,
  digitalData?: UserAccounts_viewer_digital | null
): WidgetDefinition<any>[] {
  if (!digitalData) {
    return [];
  }
  return widgetManifest.filter((widgetDefinition) =>
    widgetDefinition.shouldLoad
      ? widgetDefinition.shouldLoad(digitalData)
      : true
  );
}

export function getWidgetManifest(
  toggles: Record<Toggles, boolean>,
  digitalData?: UserAccounts_viewer_digital | null
): WidgetManifest {
  const baseWidgetManifest = getBaseWidgetManifest();
  const filteredWidgetManifest = filterWidgetManifest(
    baseWidgetManifest,
    toggles
  );
  return getWidgetsForUserData(filteredWidgetManifest, digitalData);
}
