import {
  getAccessToken,
  getCustomerIdFromJwt,
  getCustomerEmailFromJwt,
} from "./jwt";
import { usabillaWebHandler } from "./usabilla";

jest.mock("./jwt");

const mockGetAccessToken = getAccessToken as jest.Mock;
const mockGetCustomerId = getCustomerIdFromJwt as jest.Mock;
const mockGetCustomerEmail = getCustomerEmailFromJwt as jest.Mock;

describe("usabillaWebHandler()", () => {
  it("should call usabilla_live with email and customer id", async () => {
    mockGetAccessToken.mockResolvedValue("access-token");
    mockGetCustomerId.mockReturnValue("customerId");
    mockGetCustomerEmail.mockReturnValue("customer@email.com");
    window["usabilla_live"] = jest.fn();

    await usabillaWebHandler();

    expect(window["usabilla_live"]).toHaveBeenCalledWith("data", {
      custom: {
        originCustomerId: "customerId",
        originCustomerEmail: "customer@email.com",
      },
    });
    expect(window["usabilla_live"]).toHaveBeenCalledWith("click");
  });

  it("should call usabilla_live with no email or customer id", async () => {
    mockGetAccessToken.mockResolvedValue(undefined);

    window["usabilla_live"] = jest.fn();

    await usabillaWebHandler();

    expect(window["usabilla_live"]).toHaveBeenCalledWith("data", {
      custom: {},
    });
    expect(window["usabilla_live"]).toHaveBeenCalledWith("click");
  });
});
