import {
  errorForm,
  reportException,
  interactionCard,
  ICardAA,
} from "@origin-digital/reporting-client";

import { trackError, trackingProviderCaptureClickCard } from "./analytics";

jest.mock("@origin-digital/reporting-client");

describe("trackError()", () => {
  const error = Error("Error thrown");
  const formName = "example";

  it("should call errorForm()", () => {
    trackError(error, formName);
    expect(errorForm).toBeCalledWith({
      errorCode: "Error",
      errorMessage: "Error thrown",
      formName,
    });
  });

  it("should call reportException()", () => {
    trackError(error, formName);
    expect(reportException).toBeCalledWith("Error thrown", error);
  });
});

describe("trackingProviderCaptureClickCard()", () => {
  const card: ICardAA = {
    category: "dashboard-card",
    id: "id",
    title: "title",
    primaryCta: "primaryCta",
  };
  const label = "label";

  it("should call interactionCard() with the provided details", () => {
    trackingProviderCaptureClickCard(card)({ label });
    expect(interactionCard).toBeCalledWith("click", {
      card: {
        category: "dashboard-card",
        ...card,
      },
      label,
    });
  });
});
