import { HandWithFloatingCoinImage } from "./HandWithFloatingCoinImage";
import React, { useCallback, useState } from "react";
import {
  Card,
  Stack,
  Button,
  Heading,
  Text,
  Columns,
  Column,
  IconButton,
} from "@origin-digital/ods-core";
import { IconCancel } from "@origin-digital/ods-icons";
import content from "./content.json";
import { FeatureSwitch } from "@origin-digital/features";

export const WIDGET_DISMISSED_TIME_KEY =
  "ResearchCommunitySignUpWidgetJoinOrDismissedClickTime";

export interface ResearchCommunitySignUpWidgetProps {
  customerNumber?: string;
}

export const ResearchCommunitySignUpWidget = ({
  customerNumber,
}: ResearchCommunitySignUpWidgetProps) => {
  const [closedAt, setClosedAt] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    const nowIso = new Date().toISOString();
    localStorage.setItem(WIDGET_DISMISSED_TIME_KEY, nowIso);
    setClosedAt(nowIso);
  }, []);

  const handleJoin = useCallback(() => {
    localStorage.setItem(WIDGET_DISMISSED_TIME_KEY, new Date().toISOString());
    window.location.href = `https://www.originexchange.com.au/h/s/5zGdag710xc9KVGq8PAbn8?_i=${customerNumber}`;
  }, [customerNumber]);

  if (closedAt) {
    return null;
  }

  return (
    <FeatureSwitch
      name="origin-exchange-lpg-widget"
      enabledBehaviour="show"
      disabledBehaviour="hide"
    >
      <Card data-id="research-community-signup-widget">
        <Stack>
          <Columns>
            <Column>
              <HandWithFloatingCoinImage />
            </Column>
            <Column alignX="right">
              <IconButton
                onClick={handleClose}
                data-id="research-community-signup-widget-close-button"
              >
                <IconCancel color="neutral" />
              </IconButton>
            </Column>
          </Columns>
          <Heading variant="h4">{content.title}</Heading>
          <Text>{content.body}</Text>
          <Button
            data-id="research-community-signup-widget-join-button"
            onClick={handleJoin}
            variant="outlined"
          >
            {content.joinButton}
          </Button>
        </Stack>
      </Card>
    </FeatureSwitch>
  );
};
