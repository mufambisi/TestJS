import { atDataId } from "../shared/utils";

export class GlobalErrorPage {
  public static async at() {
    await atDataId("dashboard-rx-error");
  }
}
