import { configure, cleanup } from "@origin-digital/ods-testing-library";
import "@testing-library/jest-dom/extend-expect";

require("jest-styled-components");
const enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
enzyme.configure({ adapter: new Adapter() });

configure({ testIdAttribute: "data-id" });

global.beforeEach(() => {
  // In the latest version of React a lot of warnings are thrown
  // due to the deprication warnings for a lot of lifecycle components.

  // In order to keep the test debuggable we surpress the warnings in
  // the console. This ONLY happens during tests.
  console.warn = jest.fn(() => undefined);
  console.error = jest.fn(() => undefined);

  window.MutationObserver = class {
    constructor() {}
    observe() {}
    disconnect() {}
  };
});

global.afterEach(() => {
  jest.resetAllMocks();
  cleanup();
});

window.FRAME = {
  eventDispatcherInstance: {
    dispatch: jest.fn(),
    addListener: jest.fn(),
    addListeners: jest.fn(),
    addMulticastListener: jest.fn(),
  },
};
