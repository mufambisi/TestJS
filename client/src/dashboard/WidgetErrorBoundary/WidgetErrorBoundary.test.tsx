import React from "react";
import { render } from "@origin-digital/ods-testing-library";
import { WidgetErrorBoundary } from "./WidgetErrorBoundary";
import { trackError } from "src/util/analytics";

jest.mock("src/util/analytics");

const error = new Error("Fail the render");
(error as any).suppressReactErrorLogging = true;

const BrokenWidget = () => {
  throw error;
};

describe("<WidgetErrorBoundary />", () => {
  it(`should render widget when there is no error`, () => {
    const { getAllByTestId } = render(
      <WidgetErrorBoundary>
        <div data-id="working-widget">working widget</div>
      </WidgetErrorBoundary>
    );
    expect(getAllByTestId("working-widget")).toHaveLength(1);
    expect(trackError).not.toHaveBeenCalled();
  });

  it(`should render nothing when there is an error`, () => {
    const { container } = render(
      <WidgetErrorBoundary>
        <BrokenWidget />
      </WidgetErrorBoundary>
    );
    expect(container).toMatchInlineSnapshot("<div />");
    expect(trackError).toHaveBeenCalledWith(error);
  });
});
