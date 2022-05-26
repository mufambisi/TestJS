import React, { useState } from "react";

import { AlertBanner, MarkdownLite, Text } from "@origin-digital/ods-core";
import { eventListener, TOPICS } from "@origin-digital/event-dispatcher";

import { useOnce } from "src/hooks";

import { DismissableComponent } from "../DismissableComponent";

import * as content from "./content.json";

export const LpgFeatureMissingBanner: React.FC = () => {
  const [shouldRender, setShouldRender] = useState(true);

  // If the actual alert banner is opened we need to dismiss our custom one so we add a listener for it
  useOnce(() => {
    eventListener.addListener(TOPICS.ALERT_BANNER_OPEN, () => {
      setShouldRender(false);
    });
  });

  if (!shouldRender) {
    return null;
  }

  return (
    <DismissableComponent
      dismissId="lpg-missing-features-banner"
      Component={({ close }) => (
        <AlertBanner data-id="lpg-missing-features-banner" onCloseClick={close}>
          <Text>
            <MarkdownLite>{content.message}</MarkdownLite>
          </Text>
        </AlertBanner>
      )}
    />
  );
};
