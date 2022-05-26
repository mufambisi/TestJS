import {
  getOriginCustomerId,
  decodeJwtPayload,
  ClaimKey,
} from "@origin-digital/auth-utils";
import { fetchAccessToken } from "@origin-digital/event-dispatcher";

export async function getAccessToken() {
  const jwt = await fetchAccessToken({});
  return jwt?.accessToken ?? undefined;
}

export function getCustomerEmailFromJwt(payload: string): string {
  return decodeJwtPayload(payload)[ClaimKey.EMAIL];
}

export function getCustomerIdFromJwt(payload: string): string {
  const custId = getOriginCustomerId(payload) ?? "";
  return custId;
}

export async function getCustomerId(): Promise<string | undefined> {
  const accessToken = await getAccessToken();
  if (!accessToken) return;
  return getCustomerIdFromJwt(accessToken);
}
