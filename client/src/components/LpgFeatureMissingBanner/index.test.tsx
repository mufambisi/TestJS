import React from "react";

import { fireEvent, render, screen } from "@origin-digital/ods-testing-library";
import { eventListener, TOPICS } from "@origin-digital/event-dispatcher";

import { LpgFeatureMissingBanner } from "./index";

jest.mock("@origin-digital/event-dispatcher", () => ({
  ...jest.requireActual("@origin-digital/event-dispatcher"),
  eventListener: { addListener: jest.fn() },
}));

const { getByTestId, findByTestId, queryByTestId } = screen;

describe("<LpgFeatureMissingBanner />", () => {
  it("should render and dismiss when close is clicked", async () => {
    render(<LpgFeatureMissingBanner />);

    await findByTestId("lpg-missing-features-banner");
    fireEvent.click(getByTestId("alert-close"));

    expect(eventListener.addListener).toBeCalledWith(
      TOPICS.ALERT_BANNER_OPEN,
      expect.any(Function)
    );

    expect(queryByTestId("lpg-missing-features-banner")).toBeNull();
  });
});
