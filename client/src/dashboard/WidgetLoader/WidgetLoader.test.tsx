import React, { RefObject } from "react";
import { render } from "@origin-digital/ods-testing-library";
import {
  useWidgetProvider,
  WidgetStatusCode,
} from "@origin-digital/widget-provider";
import { ICardAA } from "@origin-digital/reporting-client";
import {
  DigitalAccountStatus,
  DigitalAccountType,
} from "../../graphql-types/rx-gateway/globalTypes";
import { UserAccounts_viewer_digital } from "../../graphql-types/rx-gateway/UserAccounts";
import { WidgetDefinition } from "../WidgetDefinition";
import { DashboardMonitoring } from "../widgetHelpers/widgetAnalytics";
import { WidgetLoader } from "./WidgetLoader";

jest.mock("src/util/analytics");

const onStatusUpdate = jest.fn();
const createDashboardRef = (): RefObject<DashboardMonitoring> => ({
  current: ({
    onStatusUpdate,
  } as any) as DashboardMonitoring,
});

const exampleError = new Error("Fail the render");
(exampleError as any).suppressReactErrorLogging = true;

const analyticsData: ICardAA = {
  category: "dashboard-card",
  id: "battery-widget",
  title: "Battery",
};

const TestWidgetNoStatus = () => {
  return <div data-id="test-widget-no-status">content</div>;
};

const TestWidgetWithStatus = () => {
  const { updateWidgetStatus } = useWidgetProvider();
  updateWidgetStatus(WidgetStatusCode.COMPLETE, [analyticsData]);
  return <div data-id="test-widget-status">content</div>;
};

const TestWidgetWithFailure = () => {
  const { updateWidgetStatus } = useWidgetProvider();
  updateWidgetStatus(WidgetStatusCode.FAILURE, [
    {
      ...analyticsData,
      error: { errorMessage: "Missing data" },
    },
  ]);
  return <div data-id="test-widget-failure">content</div>;
};

const TestWidgetWithFailureError = () => {
  const { updateWidgetStatus } = useWidgetProvider();
  updateWidgetStatus(WidgetStatusCode.FAILURE, [
    {
      ...analyticsData,
      error: { errorMessage: exampleError.message },
    },
  ]);
  return <div data-id="test-widget-failure-error">content</div>;
};

const TestWidgetWithError = () => {
  throw exampleError;
};

const testUserData: UserAccounts_viewer_digital = {
  __typename: "DigitalViewer",
  accounts: [
    {
      __typename: "DigitalAccount",
      id: "1",
      type: DigitalAccountType.KRAKEN,
      accountId: "A-11111111",
      status: DigitalAccountStatus.ACTIVE,
    },
  ],
  features: [],
  services: [],
  user: null,
};

const widgetName = "BatteryWidget";

const createTestWidget = (
  definition: Pick<WidgetDefinition<{}>, "widgetComponent" | "name">
) => {
  return render(
    <WidgetLoader
      widgetDefinition={definition}
      userData={testUserData}
      dashboardAnalytics={createDashboardRef()}
    />
  );
};

describe("<WidgetLoader />", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("should render widget", () => {
    const { getAllByTestId } = createTestWidget({
      widgetComponent: TestWidgetWithStatus,
      name: widgetName,
    });
    expect(getAllByTestId("test-widget-status")).toHaveLength(1);
  });

  it("should render widget that does not report status", () => {
    const { getAllByTestId } = createTestWidget({
      widgetComponent: TestWidgetNoStatus,
      name: widgetName,
    });
    expect(getAllByTestId("test-widget-no-status")).toHaveLength(1);
    expect(onStatusUpdate).not.toBeCalled();
  });

  it("should not render widget when widget throws error", () => {
    const { container } = createTestWidget({
      widgetComponent: TestWidgetWithError,
      name: widgetName,
    });
    expect(container).toMatchInlineSnapshot("<div />");
    expect(onStatusUpdate).not.toBeCalled();
  });

  it("should render widget when widget reports failure", () => {
    const { getAllByTestId } = createTestWidget({
      widgetComponent: TestWidgetWithFailure,
      name: widgetName,
    });
    expect(getAllByTestId("test-widget-failure")).toHaveLength(1);

    expect(onStatusUpdate).toBeCalledWith(widgetName, [
      { ...analyticsData, error: { errorMessage: "Missing data" } },
    ]);
  });

  it("should render widget when widget reports failure and error", () => {
    const { getAllByTestId } = createTestWidget({
      widgetComponent: TestWidgetWithFailureError,
      name: widgetName,
    });
    expect(getAllByTestId("test-widget-failure-error")).toHaveLength(1);

    expect(onStatusUpdate).toBeCalledWith(widgetName, [
      { ...analyticsData, error: { errorMessage: "Fail the render" } },
    ]);
  });
});
