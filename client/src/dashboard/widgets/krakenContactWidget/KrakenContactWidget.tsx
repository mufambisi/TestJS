import React from "react";

import { ICardAA } from "@origin-digital/reporting-client";
import { navTo } from "@origin-digital/event-dispatcher";
import {
  Card,
  Heading,
  Stack,
  Text,
  Button,
  MarkdownLite,
  TrackingProvider,
} from "@origin-digital/ods-core";
import {
  useWidgetProvider,
  WidgetStatusCode,
} from "@origin-digital/widget-provider";

import { trackingProviderCaptureClickCard } from "../../../util/analytics";

import content from "./content.json";

const trackingData: ICardAA = {
  category: "dashboard-card",
  id: "card-contact-us",
  title: `My Account - ${content.heading}`,
  primaryCta: content.cta.text,
};

export const KrakenContactWidget: React.FC = () => {
  const { updateWidgetStatus } = useWidgetProvider();
  updateWidgetStatus(WidgetStatusCode.COMPLETE, [trackingData]);
  return (
    <TrackingProvider
      onTrackingCapture={trackingProviderCaptureClickCard(trackingData)}
    >
      <Card data-id="contact-card">
        <Stack>
          <Heading variant="h4">{content.heading}</Heading>

          <Text>
            <MarkdownLite>{content.body}</MarkdownLite>
          </Text>

          <Button
            data-id="open-contact-us"
            variant="outlined"
            onClick={() => {
              navTo.feedback(content.cta);
            }}
          >
            {content.cta.text}
          </Button>
        </Stack>
      </Card>
    </TrackingProvider>
  );
};
