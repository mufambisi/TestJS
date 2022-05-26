import {
  getOriginCustomerId,
  decodeJwtPayload,
  ClaimKey,
} from "@origin-digital/auth-utils";
import { fetchAccessToken } from "@origin-digital/event-dispatcher";

jest.mock("@origin-digital/auth-utils");
jest.mock("@origin-digital/event-dispatcher");

import {
  getAccessToken,
  getCustomerEmailFromJwt,
  getCustomerIdFromJwt,
} from "./jwt";

describe("getAccessToken", () => {
  it("should return an access token", async () => {
    (fetchAccessToken as jest.Mock).mockReturnValue({ accessToken: "token" });
    expect(await getAccessToken()).toBe("token");
    expect(fetchAccessToken).toBeCalledWith({});
  });

  it("should return undefined", async () => {
    (fetchAccessToken as jest.Mock).mockReturnValue({});
    expect(await getAccessToken()).toBeUndefined();
    expect(fetchAccessToken).toBeCalledWith({});
  });
});

describe("getCustomerEmailFromJwt", () => {
  it("should return the email", () => {
    (decodeJwtPayload as jest.Mock).mockReturnValue({
      [ClaimKey.EMAIL]: "test@email.com",
    });
    expect(getCustomerEmailFromJwt("payload")).toBe("test@email.com");
  });
});

describe("getCustomerIdFromJwt", () => {
  it("should return the customer number", () => {
    (getOriginCustomerId as jest.Mock).mockReturnValue("customer-number");
    expect(getCustomerIdFromJwt("payload")).toBe("customer-number");
  });
  it("should return the an empty string", () => {
    (getOriginCustomerId as jest.Mock).mockReturnValue(undefined);
    expect(getCustomerIdFromJwt("payload")).toBe("");
  });
});
