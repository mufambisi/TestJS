import React from "react";
import { Text } from "@origin-digital/ods-core";
import { TransparentCard } from "src/components/TransparentCard";
import content from "./gstDisclaimerContent";

export const GstDisclaimerCard: React.FC = () => (
  <TransparentCard>
    <Text variant="body">{content.gstDisclaimer}</Text>
  </TransparentCard>
);
