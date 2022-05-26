import React from "react";
import { trackError } from "../../util/analytics";

interface IWidgetErrorBoundaryState {
  hasError: boolean;
}
export class WidgetErrorBoundary extends React.Component<
  {},
  IWidgetErrorBoundaryState
> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error) {
    this.setState({ hasError: true });
    trackError(error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
