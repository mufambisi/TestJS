import { atDataId, selectorByDataId } from "../utils";
import { PortfolioWidget } from "../widgets/PortfolioWidget";
import { SpikeWidget } from "../widgets/SpikeWidget";
import { LPGWidget } from "../widgets/LPGWidget";
import { BatteryWidget } from "../widgets/BatteryWidget";
import { EVWidget } from "../widgets/EVWidget";
import { BroadbandWidget } from "../widgets/BroadbandWidget";

export class DashboardPage {
  public static url = "";

  public failure = selectorByDataId("failure");
  public feedbackBtn = selectorByDataId("open-contact-us");

  public portfolioWidget = PortfolioWidget;
  public spikeWidget = SpikeWidget;
  public lpgWidget = LPGWidget;
  public batteryWidget = new BatteryWidget();
  public evWidget = new EVWidget();
  public broadbandWidget = BroadbandWidget;

  public static at = async () => await atDataId("dashboard");
}
