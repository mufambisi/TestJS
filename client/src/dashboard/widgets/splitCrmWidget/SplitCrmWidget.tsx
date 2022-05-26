import React from "react";
import {
  Card,
  Heading,
  List,
  ListItem,
  MarkdownLite,
  Stack,
  Text,
  Button,
} from "@origin-digital/ods-core";
import { UserAccounts_viewer_digital } from "../../../graphql-types/rx-gateway/UserAccounts";
import content from "./content.json";
import { getOpenSapAccounts } from "../../../util/account";
import { Toggle } from "@origin-digital/toggle";
import { IconLaunch } from "@origin-digital/ods-icons";
import { eventDispatcher, TOPICS } from "@origin-digital/event-dispatcher";

export type SplitCrmWidgetProps = {
  data: UserAccounts_viewer_digital;
};

export const SplitCrmWidget: React.FC<SplitCrmWidgetProps> = ({ data }) => {
  const sapAccounts = getOpenSapAccounts(data);
  const isMultipleAccounts = sapAccounts.length > 1;

  const textBodyNoButton = isMultipleAccounts
    ? content.noButton.bodyPlural
    : content.noButton.bodySingular;

  const textBodyButton = isMultipleAccounts
    ? content.button.bodyPlural
    : content.button.bodySingular;

  const onClick = () => {
    eventDispatcher.dispatch({
      topic: TOPICS.NAV_TO_URL,
      payload: {
        url: "/my-account/dashboard",
        authenticated: true,
        externalBrowser: true,
      },
    });
  };

  const getMailToWithAccountIds = () => {
    const commaSeparatedAccounts = sapAccounts
      .map((it) => it.accountId)
      .join(", ");

    const baseContent = isMultipleAccounts
      ? content.noButton.secondaryBodyPluralText
      : content.noButton.secondaryBodySingularText;

    return baseContent
      .replace(
        "Origin account numbers: []",
        `Origin account numbers: ${commaSeparatedAccounts}`
      )
      .replace(
        "missing accounts []",
        `missing accounts ${commaSeparatedAccounts}`
      );
  };

  return (
    <Card data-id={"split-crm-card"}>
      <Stack space={["large", "xlarge"]}>
        <Toggle name={"SplitCrmNoButton"}>
          <Stack>
            <Heading variant="h4">{content.heading}</Heading>
            <Text>{textBodyNoButton}</Text>
            <Text>
              <MarkdownLite>{getMailToWithAccountIds()}</MarkdownLite>
            </Text>
            {!isMultipleAccounts && <Text>{sapAccounts[0].accountId}</Text>}
            {isMultipleAccounts && (
              <List space="xsmall">
                {sapAccounts.map((account, index) => {
                  return <ListItem key={index}>{account.accountId}</ListItem>;
                })}
              </List>
            )}
          </Stack>
        </Toggle>
        <Toggle name={"SplitCrmButton"}>
          <Stack>
            <Heading variant="h4">{content.heading}</Heading>
            <Text>{textBodyButton}</Text>
            {!isMultipleAccounts && <Text>{sapAccounts[0].accountId}</Text>}
            {isMultipleAccounts && (
              <List space="xsmall">
                {sapAccounts.map((account, index) => {
                  return <ListItem key={index}>{account.accountId}</ListItem>;
                })}
              </List>
            )}
            <Button
              variant="outlined"
              onClick={onClick}
              size="small"
              noTextPadding
              icon={<IconLaunch tone="inherit" />}
            >
              {content.button.buttonText}
            </Button>
          </Stack>
        </Toggle>
      </Stack>
    </Card>
  );
};
