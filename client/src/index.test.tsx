import React from "react";

import { render, screen, fireEvent } from "@origin-digital/ods-testing-library";
import {
  openFeedbackForm,
  parseMarkdownEvent,
} from "@origin-digital/event-dispatcher";

import { usabillaWebHandler } from "./util/usabilla";
import { usabillaFormId } from "./consts";
import { MeshLink } from "./index";

jest.mock("@origin-digital/event-dispatcher");

const parseMarkdownEventMock = parseMarkdownEvent as jest.Mock;

const { getByTestId } = screen;

describe("<MeshLink />", () => {
  const onClickProp = jest.fn();
  const meshOnClick = jest.fn();

  it("should render a link which calls usabilla with the correct details if the href if '{usabillaLink}'", () => {
    render(
      <MeshLink data-id="give-feedback" href="{usabillaLink}">
        give feedback
      </MeshLink>
    );

    const link = getByTestId("give-feedback");
    expect(link.textContent).toBe("give feedback");
    fireEvent.click(link);

    expect(openFeedbackForm).toBeCalledWith({
      formId: usabillaFormId,
      webHandler: usabillaWebHandler,
    });
  });

  it("should override onClick if parseMarkdownEvent returns them", () => {
    parseMarkdownEventMock.mockReturnValue({
      onClick: meshOnClick,
      href: "#dashboard",
    });

    render(
      <MeshLink data-id="nav-to" href="NAV_TO:dashboard" onClick={onClickProp}>
        go to dashboard
      </MeshLink>
    );

    const link = getByTestId("nav-to");
    expect(link.getAttribute("href")).toBe("#dashboard");
    expect(link.textContent).toBe("go to dashboard");
    fireEvent.click(link);
    expect(meshOnClick).toBeCalledTimes(1);
    expect(onClickProp).toBeCalledTimes(0);
  });

  it("should use link onClick if parseMarkdownEvent does not return one", () => {
    parseMarkdownEventMock.mockReturnValue({ href: "http://origin.com.au" });

    render(
      <MeshLink
        data-id="origin"
        href="http://origin.com.au"
        onClick={onClickProp}
      >
        Origin
      </MeshLink>
    );

    const link = getByTestId("origin");
    expect(link.getAttribute("href")).toBe("http://origin.com.au");
    expect(link.textContent).toBe("Origin");
    fireEvent.click(link);
    expect(meshOnClick).toBeCalledTimes(0);
    expect(onClickProp).toBeCalledTimes(1);
  });
});
