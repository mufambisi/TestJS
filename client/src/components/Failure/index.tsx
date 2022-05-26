import React, { useEffect } from "react";
import {
  Columns,
  Column,
  Stack,
  Text,
  TextLinkRenderer,
} from "@origin-digital/ods-core";
import { IconCancelCircle } from "@origin-digital/ods-icons";

import * as content from "./content.json";
import { trackError } from "src/util/analytics";

interface Props {
  onClick: () => void;
  id: string;
  error?: Error | boolean;
  children?: JSX.Element | null;
}

export const Failure: React.FC<Props> = ({
  error,
  onClick,
  children = null,
  id,
}) => {
  useEffect(() => {
    if (!error || typeof error === "boolean") {
      return;
    }

    trackError(error, id);
  }, [error]);

  if (!error) {
    return children;
  }

  return (
    <Columns space="small" data-id="failure">
      <Column width="content">
        <IconCancelCircle tone="critical" />
      </Column>
      <Column>
        <Stack>
          <Text weight="medium">{content.heading}</Text>
          <Text>{content.text}</Text>
          <Text>
            <TextLinkRenderer>
              {({ textLinkStyles }) => (
                <button
                  data-id="failure-cta"
                  className={textLinkStyles}
                  onClick={onClick}
                >
                  {content.cta}
                </button>
              )}
            </TextLinkRenderer>
          </Text>
        </Stack>
      </Column>
    </Columns>
  );
};
