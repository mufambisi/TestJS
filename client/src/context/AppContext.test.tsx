import React from "react";
import { render } from "@testing-library/react";

import { AppContextProvider, mergeContext } from "./AppContext";

describe("<AppContext />", () => {
  it("should render without error", () => {
    const { container } = render(
      <AppContextProvider>Hello world</AppContextProvider>
    );

    expect(container).toMatchSnapshot();
  });
});

describe("mergeContext()", () => {
  it("should call setContext() with merged context", () => {
    const setContext = jest.fn();

    const status = "OK";
    const error = new Error("Error");
    const context = {
      status,
    } as any;

    mergeContext({ setContext, context })({ error });

    expect(setContext).toHaveBeenCalledWith({
      error,
      status,
    });
  });
});
