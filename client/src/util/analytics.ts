import {
  errorForm,
  reportException,
  ICardAA,
  IInteractionCardData,
  interactionCard,
} from "@origin-digital/reporting-client";

export const trackError = (error: Error, formName?: string) => {
  reportException(error.message, error);
  errorForm({
    errorCode: error.name,
    errorMessage: error.message,
    formName,
  });
};

export const trackingProviderCaptureClickCard = (
  card: Pick<ICardAA, "id" | "title" | "primaryCta">
) => ({ label }: Pick<IInteractionCardData, "label">) => {
  const interactionCardData: IInteractionCardData = {
    card: {
      category: "dashboard-card",
      ...card,
    },
    label,
  };

  interactionCard("click", interactionCardData);
};
