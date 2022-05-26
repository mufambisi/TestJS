import React from "react";

import { render, fireEvent } from "@origin-digital/ods-testing-library";
import { OriginThemeProvider } from "@origin-digital/ods-core";

import { AppContext } from "src/context/AppContext";
import { trackError } from "src/util/analytics";

import { ErrorWrapper } from ".";

jest.mock("src/util/analytics");

const error = new Error("Fail the render");
(error as any).suppressReactErrorLogging = true;

const contextError = new Error("Error in context");
(contextError as any).suppressReactErrorLogging = true;

const Component = () => <div data-id="component">Component</div>;
const ThrowComponent = () => (
  <>
    {(() => {
      throw error;
    })()}
  </>
);

const createErrorWrapper = (
  Child: () => JSX.Element | never,
  setContextError?: boolean
) => {
  return render(
    <AppContext.Provider
      value={{
        context: { error: setContextError ? contextError : undefined },
        setContext: jest.fn(),
      }}
    >
      <OriginThemeProvider>
        <ErrorWrapper>
          <Child />
        </ErrorWrapper>
      </OriginThemeProvider>
    </AppContext.Provider>
  );
};

describe("<ErrorWrapper />", () => {
  it("should render component without error", () => {
    const { getAllByTestId } = createErrorWrapper(Component);
    expect(getAllByTestId("component")).toHaveLength(1);
  });

  it("should render with error message", () => {
    const { getAllByTestId } = createErrorWrapper(ThrowComponent);
    expect(getAllByTestId("dashboard-rx-error")).toHaveLength(1);
  });

  it("should call window.location.reload() when cta is clicked ", () => {
    jest.spyOn(window.location, "reload");

    const { getByTestId } = createErrorWrapper(ThrowComponent);
    fireEvent.click(getByTestId("try-again"));

    expect(window.location.reload).toHaveBeenCalled();
  });

  it("should call fireNewRelicErrorEvent() and errorTracking()", () => {
    createErrorWrapper(ThrowComponent);
    expect(trackError).toHaveBeenCalledWith(error);
  });

  it("should call tracking if context has an error", () => {
    createErrorWrapper(Component, true);
    expect(trackError).toHaveBeenCalledWith(contextError);
  });
});
