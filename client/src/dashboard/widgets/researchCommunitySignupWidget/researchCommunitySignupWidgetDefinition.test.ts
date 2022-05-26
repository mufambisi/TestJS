import {
  DigitalAccountStatus,
  DigitalAccountType,
} from "src/graphql-types/rx-gateway/globalTypes";
import { UserAccounts_viewer_digital } from "src/graphql-types/rx-gateway/UserAccounts";
import { WIDGET_DISMISSED_TIME_KEY } from "./ResearchCommunitySignupWidget";
import { researchCommunitySignUpWidgetDefinition } from ".";

const testViewerWithAnLPGAccount: UserAccounts_viewer_digital = {
  __typename: "DigitalViewer",
  accounts: [
    {
      id: "123",
      accountId: "456",
      status: DigitalAccountStatus.ACTIVE,
      type: DigitalAccountType.LPG,
      __typename: "DigitalAccount",
    },
  ],
  features: [],
  services: [],
  user: null,
};

const localStorageMock = () => {
  let store = {};
  return {
    getItem: (key: string) => {
      return store[key];
    },
    setItem: (key: string, value: any) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
};

Object.defineProperty(window, "localStorage", { value: localStorageMock() });

describe("researchCommunitySignUpWidgetDefinition", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("shouldLoad returns true", () => {
    const subject = researchCommunitySignUpWidgetDefinition;
    expect(
      subject.shouldLoad && subject.shouldLoad(testViewerWithAnLPGAccount)
    ).toBe(true);
  });

  it("shouldLoad returns false", () => {
    const oneDayAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
    localStorage.setItem(WIDGET_DISMISSED_TIME_KEY, oneDayAgo.toISOString());
    const subject = researchCommunitySignUpWidgetDefinition;
    expect(
      subject.shouldLoad && subject.shouldLoad(testViewerWithAnLPGAccount)
    ).toBe(false);
  });

  it("should Load returns true when dismissed a year ago", () => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    localStorage.setItem(WIDGET_DISMISSED_TIME_KEY, oneYearAgo.toISOString());
    const subject = researchCommunitySignUpWidgetDefinition;
    expect(
      subject.shouldLoad && subject.shouldLoad(testViewerWithAnLPGAccount)
    ).toBe(true);
  });

  it("should build props", () => {
    const subject = researchCommunitySignUpWidgetDefinition;
    expect(
      subject.propsBuilder &&
        subject.propsBuilder(testViewerWithAnLPGAccount).customerNumber
    ).toBe("456");
  });
});
