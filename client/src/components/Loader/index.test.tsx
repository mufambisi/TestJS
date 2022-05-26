import React from "react";
import { render } from "@origin-digital/ods-testing-library";
import { Loader, LoaderProps } from "./index";

const Component = () => <div data-id="component">Component</div>;
const renderLoader = (props?: LoaderProps) =>
  render(
    <Loader {...props}>
      <Component />
    </Loader>
  );

describe("<Loader />", () => {
  it("should include loading indicator", () => {
    const { queryAllByTestId } = renderLoader({
      isLoading: true,
      variant: "section",
    });

    expect(queryAllByTestId("loading-indicator")).toHaveLength(1);
    expect(queryAllByTestId("component")).toHaveLength(0);
  });

  it("should render children", () => {
    const { queryAllByTestId } = renderLoader({
      isLoading: false,
      variant: "section",
    });

    expect(queryAllByTestId("loading-indicator")).toHaveLength(0);
    expect(queryAllByTestId("component")).toHaveLength(1);
  });

  it("should include page loading indicator", () => {
    const { queryAllByTestId } = renderLoader({
      isLoading: true,
      variant: "page",
    });

    expect(queryAllByTestId("page-loading-indicator")).toHaveLength(1);
    expect(queryAllByTestId("component")).toHaveLength(0);
  });
});
