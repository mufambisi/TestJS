import { Selector, t } from "testcafe";
import { ConfigUtil } from "../utils";

export class LoginPage {
  public loginEmailAddress = Selector(`[data-id='login_usernameInput']`);
  public loginPassword = Selector(`[data-id='PasswordInput']`);
  public loginBtn = Selector(`[data-id='LoginStep__continue']`);

  public doLogin = async (email: string) => {
    await t
      .expect(this.loginEmailAddress)
      .ok()
      .typeText(this.loginEmailAddress, email)
      .typeText(this.loginPassword, ConfigUtil.configData("password"))
      .click(this.loginBtn);
  };
}
