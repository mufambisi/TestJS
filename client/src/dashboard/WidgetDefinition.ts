import { FC } from "react";
import { UserAccounts_viewer_digital } from "../graphql-types/rx-gateway/UserAccounts";

export interface WidgetDefinition<Props> {
  widgetComponent: FC<Props>;
  name: string;
  noTracking?: boolean;
  shouldLoad?: (data: UserAccounts_viewer_digital) => boolean;
  propsBuilder?: (data: UserAccounts_viewer_digital) => Props;
}
