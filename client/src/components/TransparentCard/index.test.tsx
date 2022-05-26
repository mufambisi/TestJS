import React from "react";
import { render } from "@origin-digital/ods-testing-library";
import { TransparentCard } from "./index";

const renderTransparentCard = () =>
  render(<TransparentCard>Hello world</TransparentCard>);

describe("<TransparentCard />", () => {
  it("should render without error", () => {
    const { container } = renderTransparentCard();

    expect(container).toMatchSnapshot();
  });
});
