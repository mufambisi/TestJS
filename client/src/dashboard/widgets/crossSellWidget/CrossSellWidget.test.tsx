/*global spyOn*/
import React from "react";

import { render } from "@origin-digital/ods-testing-library";
import {
  useWidgetProvider,
  WidgetStatusCode,
} from "@origin-digital/widget-provider";

import { CrossSellWidget } from "./CrossSellWidget";
import { setAdobeTargetParams } from "./crossSellWidgetHelpers";
import { exampleNBACard, exampleData } from "./crossSellTestData";

jest.mock("@origin-digital/widget-provider");
jest.mock("./crossSellWidgetHelpers");

const globalAny: any = global;

const updateWidgetStatus = jest.fn();

const setUseWidgetProvider = () =>
  (useWidgetProvider as jest.Mock).mockReturnValue({ updateWidgetStatus });

const renderWidget = () => render(<CrossSellWidget data={exampleData} />);

describe("<CrossSellWidget />", () => {
  beforeEach(() => {
    setUseWidgetProvider();

    globalAny.window = Object.create(window);

    Object.defineProperty(window, "adobe", {
      value: {
        target: { getOffer: jest.fn },
      },
      writable: true,
    });
  });

  it("should display a NBA card on receiving offer from Adobe Target", () => {
    spyOn(globalAny.window.adobe.target, "getOffer").and.callFake(
      ({ mbox, success }) => {
        expect(mbox).toEqual("rx-dashboard-cross-sell-mbox");
        success([
          {
            content: [exampleNBACard],
          },
        ]);
      }
    );
    const { getByTestId } = renderWidget();
    getByTestId("next-best-action-product-card");

    expect(setAdobeTargetParams).toBeCalledWith(exampleData);

    expect(updateWidgetStatus).toBeCalledWith(WidgetStatusCode.COMPLETE, [
      {
        category: "dashboard-card",
        id: "TEST rx exp-electricity",
        title: "TEST Get 5,000 bonus points",
        primaryCta: "View offer",
      },
    ]);
  });

  it("should not display NBA card on offer has no content", () => {
    spyOn(globalAny.window.adobe.target, "getOffer").and.callFake(
      ({ mbox, success }) => {
        expect(mbox).toEqual("rx-dashboard-cross-sell-mbox");
        success();
      }
    );
    const { queryAllByTestId } = renderWidget();
    const nextBestActionCard = queryAllByTestId(
      "next-best-action-product-card"
    );
    expect(nextBestActionCard).toHaveLength(0);

    expect(updateWidgetStatus).toBeCalledWith(WidgetStatusCode.FAILURE, [
      {
        category: "dashboard-card",
        id: "card-cross-sell",
        title: "",
        primaryCta: "",
      },
    ]);
  });

  it("should not display NBA card on if no offer is sent from Adobe Target", () => {
    spyOn(globalAny.window.adobe.target, "getOffer").and.callFake(
      ({ mbox, error }) => {
        expect(mbox).toEqual("rx-dashboard-cross-sell-mbox");
        error();
      }
    );
    const { queryAllByTestId } = renderWidget();
    const nextBestActionCard = queryAllByTestId(
      "next-best-action-product-card"
    );
    expect(nextBestActionCard).toHaveLength(0);

    expect(updateWidgetStatus).toBeCalledWith(WidgetStatusCode.FAILURE, [
      {
        category: "dashboard-card",
        id: "card-cross-sell",
        title: "",
        primaryCta: "",
      },
    ]);
  });
});
