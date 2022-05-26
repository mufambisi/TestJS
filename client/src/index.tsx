import React from "react";

import {
  openFeedbackForm,
  parseMarkdownEvent,
} from "@origin-digital/event-dispatcher";
import { LinkComponentProps } from "@origin-digital/ods-types";
import {
  OriginThemeProvider,
  TrackingProvider,
} from "@origin-digital/ods-core";
import { trackingProviderCaptureClick } from "@origin-digital/reporting-client";
import {
  createApolloClient,
  getKraxiClientConfigPreset,
  KraxiProvider,
} from "@origin-digital/kraxi";
import { ToggleContextProvider } from "@origin-digital/toggle";

import { usabillaFormId } from "src/consts";
import { AppContextProvider } from "src/context/AppContext";
import { ErrorWrapper } from "src/components/ErrorWrapper";
import { DashboardPage } from "src/dashboard/DashboardPage";
import { usabillaWebHandler } from "src/util/usabilla";
import { FeatureProvider } from "@origin-digital/features";

import { config } from "./config";

export const MeshLink = React.forwardRef<any, LinkComponentProps>(
  (props, ref) => {
    let href: string | undefined;
    let onClick = props.onClick;
    if (props.href === "{usabillaLink}") {
      href = "#";
      onClick = (e) => {
        e.preventDefault();
        openFeedbackForm({
          formId: usabillaFormId,
          webHandler: usabillaWebHandler,
        });
      };
    } else {
      const markdownEvent = parseMarkdownEvent(props.href);
      href = markdownEvent.href;
      onClick = markdownEvent.onClick;
    }

    return (
      <a
        ref={ref}
        {...props}
        href={href}
        onClick={onClick ? onClick : props.onClick}
      >
        {props.children}
      </a>
    );
  }
);

const featureToggleEnvironment = config.env === "prod" ? "prod" : "staging";

export default () => (
  <OriginThemeProvider linkComponent={MeshLink}>
    <TrackingProvider onTrackingCapture={trackingProviderCaptureClick}>
      <ToggleContextProvider toggles={config.toggles} appName={config.appName}>
        <AppContextProvider>
          <KraxiProvider
            client={createApolloClient(
              getKraxiClientConfigPreset("gateway", config.env)
            )}
          >
            <ErrorWrapper>
              <FeatureProvider
                config={{
                  environment: featureToggleEnvironment,
                  localMode:
                    config.env === "local"
                      ? {
                          features: {
                            "origin-exchange-lpg-widget": false,
                          },
                        }
                      : undefined,
                }}
              >
                <DashboardPage />
              </FeatureProvider>
            </ErrorWrapper>
          </KraxiProvider>
        </AppContextProvider>
      </ToggleContextProvider>
    </TrackingProvider>
  </OriginThemeProvider>
);
