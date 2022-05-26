import React, { RefObject } from "react";
import { WidgetProvider } from "@origin-digital/widget-provider";
import { UserAccounts_viewer_digital } from "../../graphql-types/rx-gateway/UserAccounts";
import { WidgetDefinition } from "../WidgetDefinition";
import { WidgetErrorBoundary } from "../WidgetErrorBoundary";
import { DashboardMonitoring } from "../widgetHelpers/widgetAnalytics";

interface WidgetLoaderProps {
  widgetDefinition: WidgetDefinition<any>;
  userData: UserAccounts_viewer_digital;
  dashboardAnalytics: RefObject<DashboardMonitoring | undefined>;
}

export const WidgetLoader: React.FC<WidgetLoaderProps> = (
  props: WidgetLoaderProps
) => {
  const { widgetDefinition, userData, dashboardAnalytics } = props;
  const Widget = widgetDefinition.widgetComponent;
  const widgetProps = widgetDefinition.propsBuilder
    ? widgetDefinition.propsBuilder(userData)
    : {};

  return (
    <WidgetErrorBoundary>
      <WidgetProvider
        onStatusChange={(_, metaData) => {
          dashboardAnalytics.current?.onStatusUpdate(
            widgetDefinition.name,
            metaData
          );
        }}
      >
        <Widget key={widgetDefinition.name} {...widgetProps} />
      </WidgetProvider>
    </WidgetErrorBoundary>
  );
};
