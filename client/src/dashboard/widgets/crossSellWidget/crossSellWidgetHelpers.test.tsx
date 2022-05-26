import { setAdobeTargetParams } from "./crossSellWidgetHelpers";
import { exampleData } from "./crossSellTestData";

const globalAny: any = global;

const expectedResult = {
  RX_TARGET_BROADBAND: false,
  RX_TARGET_ELECTRICITY: true,
  RX_TARGET_SAP: false,
};

describe("setAdobeTargetParams()", () => {
  it("should overwrite the function targetPageParamsAll to return the expected parameters", () => {
    setAdobeTargetParams(exampleData);
    expect(globalAny.targetPageParamsAll()).toEqual(expectedResult);
  });
});
