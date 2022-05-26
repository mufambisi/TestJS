import React from "react";
import {
  ResearchCommunitySignUpWidget,
  WIDGET_DISMISSED_TIME_KEY,
} from "./ResearchCommunitySignupWidget";
import { render, fireEvent } from "@origin-digital/ods-testing-library";
import { FeatureProvider } from "@origin-digital/features";

const featureProviderConfig = {
  localMode: {
    features: {
      "origin-exchange-lpg-widget": true,
    },
  },
};

describe("<ResearchCommunitySignupWidget />", () => {
  it("should render button ", () => {
    const { getByText } = render(
      <FeatureProvider config={featureProviderConfig}>
        <ResearchCommunitySignUpWidget customerNumber="123" />
      </FeatureProvider>
    );
    const joinButton = getByText("Join");
    expect(joinButton).toBeInTheDocument();
  });

  it("should not render when clear", () => {
    const { getByTestId, queryByTestId } = render(
      <FeatureProvider config={featureProviderConfig}>
        <ResearchCommunitySignUpWidget customerNumber="123" />
      </FeatureProvider>
    );
    const closeButton = getByTestId(
      "research-community-signup-widget-close-button"
    );
    fireEvent.click(closeButton);
    expect(
      queryByTestId("research-community-signup-widget")
    ).not.toBeInTheDocument();
    expect(localStorage.getItem(WIDGET_DISMISSED_TIME_KEY)).not.toBeNull();
  });

  it("should update when join is clicked", () => {
    const { getByTestId } = render(
      <FeatureProvider config={featureProviderConfig}>
        <ResearchCommunitySignUpWidget customerNumber="123" />
      </FeatureProvider>
    );
    const joinButton = getByTestId(
      "research-community-signup-widget-join-button"
    );
    fireEvent.click(joinButton);
    expect(localStorage.getItem(WIDGET_DISMISSED_TIME_KEY)).not.toBeNull();
  });
});
