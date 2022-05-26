import React from "react";
import { Stack } from "@origin-digital/ods-core";

export const CardStack: React.FC = ({ children }) => {
  return <Stack space={["medium", "xlarge"]}>{children}</Stack>;
};
