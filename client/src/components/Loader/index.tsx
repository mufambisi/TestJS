import React from "react";
import { Box, Preloader, Spinner } from "@origin-digital/ods-core";

export interface LoaderProps {
  variant?: "page" | "section";
  isLoading?: boolean;
}

export const Loader: React.FC<LoaderProps> = (props) => {
  const { variant = "section", isLoading = false, children } = props;
  if (isLoading) {
    if (variant === "page") {
      return (
        <Box
          data-id="page-loading-indicator"
          display="flex"
          justifyContent="center"
          alignItems="center"
          paddingY="xxxlarge"
        >
          <Preloader />
        </Box>
      );
    }

    if (variant === "section") {
      return (
        <Box
          data-id="loading-indicator"
          display="flex"
          justifyContent="center"
          alignItems="center"
          paddingY={["large", "xlarge"]}
        >
          <Spinner />
        </Box>
      );
    }
  }

  return <>{children}</>;
};
