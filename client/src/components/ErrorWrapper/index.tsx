import React from "react";

import {
  Button,
  Card,
  CardStackSection,
  Heading,
  Stack,
  Text,
} from "@origin-digital/ods-core";

import { AppContextConsumer } from "src/context/AppContext";
import { trackError } from "src/util/analytics";

import { Laundry } from "../Icons/Laundry";
import content from "./content.json";

interface State {
  error?: Error;
}

export class ErrorWrapper extends React.PureComponent<{}, State> {
  public state: State = {};

  public componentDidCatch(error: Error) {
    this.setState({ error });
  }

  public render() {
    const { children } = this.props;
    const { error } = this.state;

    return (
      <AppContextConsumer>
        {({ context }) => {
          const thrownError = error || context.error;
          if (thrownError) {
            trackError(thrownError);
            return (
              <CardStackSection data-id="dashboard-rx-error">
                <Card padding="medium">
                  <Stack alignX="center" space="large">
                    <Stack alignX="center" space={["small", "medium"]}>
                      <Laundry />
                      <Heading align="center" variant="h4">
                        {content.heading}
                      </Heading>
                      <Text align="center">{content.text}</Text>
                    </Stack>

                    <Button
                      variant="outlined"
                      onClick={() => window.location.reload()}
                      data-id="try-again"
                    >
                      {content.cta}
                    </Button>
                  </Stack>
                </Card>
              </CardStackSection>
            );
          }

          return children;
        }}
      </AppContextConsumer>
    );
  }
}
