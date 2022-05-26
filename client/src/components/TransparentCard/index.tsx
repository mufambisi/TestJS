import React from "react";
import { Box, CardProps } from "@origin-digital/ods-core";

export const TransparentCard: React.FC<Pick<CardProps, "data-id">> = (
  props
) => {
  const { "data-id": dataId, children } = props;
  return (
    <Box
      width="full"
      backgroundColor="transparent"
      data-id={dataId}
      paddingY={["xsmall", "none"]}
    >
      {children}
    </Box>
  );
};
