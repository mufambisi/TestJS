import React, { useEffect, useRef, useState } from "react";

import { CardStackSection } from "@origin-digital/ods-core";
import { useToggleContext } from "@origin-digital/toggle";

import { Loader } from "../components/Loader";
import { LpgFeatureMissingBanner } from "../components/LpgFeatureMissingBanner";
import { DigitalAccountType } from "../graphql-types/rx-gateway/globalTypes";
import { useUserAccountsQuery } from "./queries";
import { DashboardMonitoring } from "./widgetHelpers/widgetAnalytics";
import { getWidgetManifest, WidgetManifest } from "./widgetManifest";
import { WidgetLoader } from "./WidgetLoader";

export const DashboardPage: React.FC = () => {
  const { data, loading, error } = useUserAccountsQuery();
  const [widgetManifest, setWidgetManifest] = useState<WidgetManifest>();
  const dashboardAnalytics = useRef<DashboardMonitoring>();
  const { toggles } = useToggleContext();

  useEffect(() => {
    if (!data) {
      return;
    }
    const filteredWidgetManifests = getWidgetManifest(
      toggles,
      data.viewer.digital
    );

    dashboardAnalytics.current = new DashboardMonitoring(
      data,
      filteredWidgetManifests
    );
    setWidgetManifest(filteredWidgetManifests);
  }, [data]);

  if (error) {
    throw error;
  }

  const digitalData = data?.viewer.digital;
  const hasLpg = digitalData?.accounts?.some(
    (account) => account.type === DigitalAccountType.LPG
  );

  return (
    <Loader isLoading={loading} variant="page">
      {hasLpg ? <LpgFeatureMissingBanner /> : null}
      {widgetManifest && digitalData ? (
        <CardStackSection data-id="dashboard" variant="widget">
          {widgetManifest.map((widgetDefinition) => (
            <WidgetLoader
              key={widgetDefinition.name}
              dashboardAnalytics={dashboardAnalytics}
              widgetDefinition={widgetDefinition}
              userData={digitalData}
            />
          ))}
        </CardStackSection>
      ) : null}
    </Loader>
  );
};
