import {
  getAccessToken,
  getCustomerIdFromJwt,
  getCustomerEmailFromJwt,
} from "./jwt";

async function fetchOriginCustomerDetailsFromJwt(): Promise<{
  originCustomerId?: string;
  originCustomerEmail?: string;
}> {
  const accessToken = await getAccessToken();
  if (!accessToken) return {};

  return {
    originCustomerId: getCustomerIdFromJwt(accessToken),
    originCustomerEmail: getCustomerEmailFromJwt(accessToken),
  };
}

export async function usabillaWebHandler() {
  window?.["usabilla_live"]?.("data", {
    custom: await fetchOriginCustomerDetailsFromJwt(),
  });
  window?.["usabilla_live"]?.("click");
}
