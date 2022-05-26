import { Selector } from "testcafe";
import { AbstractWidget } from "./AbstractWidget";

class EVHeader extends AbstractWidget {
  public heading: Selector;
  public viewChargingHistory: Selector;

  constructor(context: Selector) {
    super(context);
    this.heading = context.find('[data-id="ev-heading"]');
    this.viewChargingHistory = context.find(
      '[data-id="view-charging-history"]'
    );
  }
}
class EVCard extends AbstractWidget {
  public header: EVHeader;

  constructor(context: Selector) {
    super(context);
    this.header = new EVHeader(context.find('[data-id="ev-widget-header"]'));
  }
}
export class EVWidget extends AbstractWidget {
  public card: EVCard;

  constructor(context: Selector = Selector('[data-id="ev-widget"]')) {
    super(context);
    this.card = new EVCard(context.find('[data-id="ev-widget-card"]'));
  }
}
