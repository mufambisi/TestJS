import { WidgetDefinition } from "../../WidgetDefinition";
import { hasActiveAccount } from "../../../util/account";
import { DigitalAccountType } from "../../../graphql-types/rx-gateway/globalTypes";
import {
  ResearchCommunitySignUpWidget,
  ResearchCommunitySignUpWidgetProps,
  WIDGET_DISMISSED_TIME_KEY,
} from "./ResearchCommunitySignupWidget";

const hasBeenDismissed = () => {
  const dismissedClickTimeISO = localStorage.getItem(WIDGET_DISMISSED_TIME_KEY);
  if (!dismissedClickTimeISO) {
    return false;
  }

  const dismissedOn = new Date(dismissedClickTimeISO);
  const now = new Date();
  const diffTime = now.getTime() - dismissedOn.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays < 90;
};

export const researchCommunitySignUpWidgetDefinition: WidgetDefinition<ResearchCommunitySignUpWidgetProps> = {
  widgetComponent: ResearchCommunitySignUpWidget,
  name: "ResearchCommunitySignUp",
  shouldLoad: (data) =>
    hasActiveAccount(data, DigitalAccountType.LPG) && !hasBeenDismissed(),
  propsBuilder: (data) => {
    const accountIds = data.accounts
      .filter((account) => account?.type === DigitalAccountType.LPG)
      .map((account) => account.accountId);
    const customerNumber = accountIds[0];
    return {
      customerNumber,
    };
  },
};
