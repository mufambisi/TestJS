import React, { useRef, useEffect } from "react";

import { AccountCard } from "@origin-digital/kraken-account";
import {
  useWidgetProvider,
  WidgetProvider,
  WidgetStatusCode,
} from "@origin-digital/widget-provider";
import { ICardAA, ICardFailedAA } from "@origin-digital/reporting-client";

import { CardStack } from "../../../components/CardStack";
import { isPresent } from "../../../util/arrayHelper";
import { config } from "../../../config";
import { usePortfolioSummaryQuery } from "../../../dashboard/queries";
import { getAccountWithStatus, getStatusFilter } from "./accountHelper";
import { sortPortfolio } from "./sortPortfolio";

type CardReportingData = (ICardAA | ICardFailedAA) & {
  status?: WidgetStatusCode;
};

export interface PortfolioSummaryProps {
  isClosed: boolean;
}

const hasLoadedStatus = ({ status }: Pick<CardReportingData, "status">) =>
  status === WidgetStatusCode.COMPLETE || status === WidgetStatusCode.FAILURE;

const getWidgetId = (accountNumber: string) =>
  `portfolio-widget-${accountNumber}`;

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  isClosed,
}) => {
  const { updateWidgetStatus } = useWidgetProvider();
  const { data } = usePortfolioSummaryQuery();
  const accounts = data?.viewer?.kraken?.accounts ?? [];
  const cardAnalytics = useRef<CardReportingData[]>([]);
  const trackingSent = useRef<boolean>(false);

  const accountsWithStatus = sortPortfolio(
    accounts
      .filter(isPresent)
      .map(getAccountWithStatus)
      .filter(getStatusFilter(isClosed))
  );

  useEffect(() => {
    if (accountsWithStatus.length && !cardAnalytics.current.length) {
      cardAnalytics.current = accountsWithStatus.map(({ accountNumber }) => ({
        category: "dashboard-card",
        id: getWidgetId(accountNumber),
        primaryCta: "",
        title: "",
      }));
    }
  }, [accountsWithStatus]);

  const updateCardAnalytics = (analyticsData: Partial<CardReportingData>) => {
    if (trackingSent.current) {
      return;
    }

    const cardIdx = cardAnalytics.current.findIndex(
      ({ id }) => id === analyticsData.id
    );
    if (cardIdx !== -1) {
      cardAnalytics.current[cardIdx] = {
        ...cardAnalytics.current[cardIdx],
        ...analyticsData,
      };
    }
    if (cardAnalytics.current.every(hasLoadedStatus)) {
      updateWidgetStatus(WidgetStatusCode.COMPLETE, cardAnalytics.current);
    }
  };

  // don't render margin when no closed card
  if (accountsWithStatus.length === 0) {
    return null;
  }

  return (
    <CardStack>
      {accountsWithStatus.map(({ accountNumber, serviceStatus }) => (
        <WidgetProvider
          key={accountNumber}
          onStatusChange={(status, metaData) => {
            if (metaData?.length) {
              updateCardAnalytics({ ...metaData[0], status });
            }
          }}
        >
          <AccountCard
            accountNumber={accountNumber}
            env={config.env}
            hideDirectDebitLink
            id={getWidgetId(accountNumber)}
            accountStatus={serviceStatus}
          />
        </WidgetProvider>
      ))}
    </CardStack>
  );
};
