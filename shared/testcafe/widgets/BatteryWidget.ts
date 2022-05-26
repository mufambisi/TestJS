import { Selector } from "testcafe";
import { AbstractWidget } from "./AbstractWidget";

class InfoBar extends AbstractWidget {
  public updatedAt: Selector;
  public weather: Selector;

  constructor(context: Selector) {
    super(context);
    this.updatedAt = context.find('[data-id="info-bar-updated-at"]');
    this.weather = context.find('[data-id="weather-summary-temperature"]');
  }
}

class EnergySource extends AbstractWidget {
  public icon: Selector;
  public arrow: Selector;
  public kwh: Selector;

  constructor(context: Selector) {
    super(context);
    this.icon = context.find('[data-id*="-icon"]');
    this.arrow = context.find('[data-id="energy-source-arrow"]');
    this.kwh = context.find('[data-id="energy-source-data-value"]');
  }
}

class EnergySummary extends AbstractWidget {
  public houseImage: Selector;
  public currentUse: Selector;
  public solar: EnergySource;
  public battery: EnergySource;
  public grid: EnergySource;

  constructor(context: Selector) {
    super(context);
    this.houseImage = context.find('[data-id="house-image"]');
    this.currentUse = context.find(
      '[data-id="energy-summary-current-use-value"]'
    );
    this.solar = new EnergySource(Selector('[data-id="energy-source-solar"]'));
    this.battery = new EnergySource(
      Selector('[data-id="energy-source-battery"]')
    );
    this.grid = new EnergySource(Selector('[data-id="energy-source-grid"]'));
  }
}

export class BatteryWidget extends AbstractWidget {
  public header: Selector;
  public viewDetailsButton: Selector;
  public energySummary: EnergySummary;
  public infoBar: InfoBar;

  constructor(context: Selector = Selector('[data-id="battery-widget"]')) {
    super(context);

    this.header = context.find('[data-id="header"]');
    this.viewDetailsButton = context.find('[data-id="view-battery-details"]');
    this.energySummary = new EnergySummary(
      context.find('[data-id="energy-summary"]')
    );
    this.infoBar = new InfoBar(context.find('[data-id="info-bar"]'));
  }
}
