import { ClientFunction, t } from "testcafe";
import { atDataId } from "../utils";
import { LPGWidget } from "../widgets/LPGWidget";

export class LpgOrdersPage {
  public lpgWidget = LPGWidget;

  public static at = async () => await atDataId("order-form");

  public verifyUrl = async (customerNumber: string) => {
    const getLocation = ClientFunction(() => document.location.href);
    await t
      .expect(getLocation())
      .contains(`/my/service/lpg/${customerNumber}/order`);
  };
}
