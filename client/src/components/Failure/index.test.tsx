import React from "react";
import { render, fireEvent } from "@origin-digital/ods-testing-library";
import { trackError } from "src/util/analytics";
import { Failure } from "./index";

const id = "id";
const error = new Error("error");
const onClick = jest.fn();
const Component = () => <div data-id="component" />;

jest.mock("src/util/analytics");

const renderFailure = (condition?: Error) =>
  render(
    <Failure id={id} error={condition} onClick={onClick}>
      <Component />
    </Failure>
  );

describe("<Failure />", () => {
  it("should render without error", () => {
    const { container, getAllByTestId } = renderFailure();

    expect(getAllByTestId("component")).toHaveLength(1);
    expect(container).toMatchSnapshot();
  });

  it("should call onClick() when CTA is clicked", () => {
    const { getByTestId } = renderFailure(error);

    fireEvent.click(getByTestId("failure-cta"));

    expect(onClick).toHaveBeenCalled();
  });

  it("should call on trackError", () => {
    const { getByTestId } = renderFailure(error);

    fireEvent.click(getByTestId("failure-cta"));

    expect(trackError).toHaveBeenCalledWith(error, id);
  });
});
