import React from "react";

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@origin-digital/ods-testing-library";

import { getCustomerId } from "src/util/jwt";
import {
  storeDismissedItem,
  hasItemBeenDismissed,
} from "src/util/storageHelper";

import { DismissableComponent } from "./index";

jest.mock("src/util/jwt");
jest.mock("src/util/storageHelper");

const { getByTestId, queryByTestId } = screen;

const hasItemBeenDismissedMock = hasItemBeenDismissed as jest.Mock;

const Component: React.FC<{ close: () => void }> = ({ close }) => (
  <button data-id="button" onClick={close} />
);

describe("<DismissableComponent />", () => {
  beforeEach(() => {
    (getCustomerId as jest.Mock).mockReturnValue("customer-id");
  });

  it("should not render if it has been dismissed", async () => {
    hasItemBeenDismissedMock.mockReturnValue(true);
    render(
      <DismissableComponent
        dismissId="missing-features-banner"
        Component={Component}
      />
    );

    await waitFor(() => expect(hasItemBeenDismissed).toBeCalled());

    expect(queryByTestId("button")).toBeNull();
  });

  it("should render if it has not been dismissed", async () => {
    hasItemBeenDismissedMock.mockReturnValue(false);
    render(
      <DismissableComponent
        dismissId="missing-features-banner"
        Component={Component}
      />
    );

    await waitFor(() => expect(hasItemBeenDismissed).toBeCalled());

    expect(queryByTestId("button")).not.toBeNull();
  });

  it("should call storeDismissedItem and hide the element when clicked", async () => {
    hasItemBeenDismissedMock.mockReturnValue(false);
    render(
      <DismissableComponent
        dismissId="missing-features-banner"
        Component={Component}
      />
    );

    await waitFor(() => expect(hasItemBeenDismissed).toBeCalled());

    fireEvent.click(getByTestId("button"));

    expect(queryByTestId("button")).toBeNull();
    expect(storeDismissedItem).toBeCalledWith(
      "customer-id",
      "missing-features-banner"
    );
  });
});
