import React, { useEffect, useState } from "react";

import { NextBestAction } from "@origin-digital/personalisation";
import { TrackingProvider } from "@origin-digital/ods-core";
import {
  useWidgetProvider,
  WidgetStatusCode,
} from "@origin-digital/widget-provider";
import { ICardAA } from "@origin-digital/reporting-client";

import { trackingProviderCaptureClickCard } from "src/util/analytics";
import { UserAccounts_viewer_digital } from "src/graphql-types/rx-gateway/UserAccounts";
import { setAdobeTargetParams } from "./crossSellWidgetHelpers";

export interface ICrossSellWidgetProps {
  data: UserAccounts_viewer_digital;
}

const defaultData: ICardAA = {
  category: "dashboard-card",
  id: "card-cross-sell",
  title: "",
  primaryCta: "",
};

export const CrossSellWidget: React.FC<ICrossSellWidgetProps> = ({ data }) => {
  const [trackingData, setTrackingData] = useState(defaultData);
  const [showWidget, setShowWidget] = useState(false);
  const [nbaContent, setNbaContent] = useState(undefined);

  const { updateWidgetStatus } = useWidgetProvider();

  useEffect(() => {
    // 1. send parameters to Target
    setAdobeTargetParams(data);

    // 2. get content based on parameters sent
    // logic of what to return is based in Target
    //@ts-ignore
    window.adobe.target.getOffer({
      mbox: "rx-dashboard-cross-sell-mbox",
      success: (offer: any[]) => {
        const offerContent = offer && offer[0]?.content[0];

        // handle returned data corrupted
        if (offerContent) {
          const updatedData = {
            id: offerContent.experienceId,
            title: offerContent.heading,
            primaryCta: offerContent.buttonText,
          };

          setNbaContent(offerContent);
          setShowWidget(true);
          setTrackingData({ ...trackingData, ...updatedData });
          updateWidgetStatus(WidgetStatusCode.COMPLETE, [
            { ...trackingData, ...updatedData },
          ]);
        } else {
          updateWidgetStatus(WidgetStatusCode.FAILURE, [trackingData]);
        }
      },
      error: () => {
        updateWidgetStatus(WidgetStatusCode.FAILURE, [trackingData]);
      },
    });
  }, []);

  if (!showWidget) {
    return null;
  }

  return (
    <TrackingProvider
      onTrackingCapture={trackingProviderCaptureClickCard(trackingData)}
    >
      <NextBestAction content={nbaContent} />
    </TrackingProvider>
  );
};
