import { differenceInCalendarDays } from "date-fns";

// expiry in days
export const storageExpiry = 90;

export type DashboardStorageKeys =
  | "missing-features-banner"
  | "lpg-missing-features-banner";
export interface StorageItemStatus {
  status: "closed" | "shown";
  dismissedAt?: Date;
}

export type DashboardLocalStorage = {
  [key in DashboardStorageKeys]?: StorageItemStatus;
};

const getDashboardKey = (customerId: string) => `dashboard-rx-${customerId}`;

export const getDashboardLocalStorage = (
  customerId: string | undefined,
  storageType: DashboardStorageKeys
): StorageItemStatus | undefined => {
  if (!customerId) {
    return;
  }

  const data = localStorage.getItem(getDashboardKey(customerId));
  if (!data) {
    return;
  }

  const parsedData: DashboardLocalStorage = JSON.parse(data);
  const statusInfo = parsedData?.[storageType];
  if (statusInfo?.dismissedAt) {
    if (
      differenceInCalendarDays(new Date(), new Date(statusInfo?.dismissedAt)) >
      storageExpiry
    ) {
      delete parsedData[storageType];
      localStorage.setItem(
        getDashboardKey(customerId),
        JSON.stringify(parsedData)
      );
      return;
    }
  }

  const itemData = parsedData?.[storageType];
  if (itemData) {
    return {
      status: itemData.status,
      dismissedAt: itemData.dismissedAt
        ? new Date(itemData.dismissedAt)
        : undefined,
    };
  }
  return undefined;
};

export const setDashboardLocalStorage = (
  customerId: string | undefined,
  storageType: DashboardStorageKeys,
  status: StorageItemStatus["status"] = "closed"
): void => {
  if (!customerId) {
    return;
  }

  const itemStatus: StorageItemStatus = {
    status,
  };
  if (status === "closed") {
    itemStatus.dismissedAt = new Date();
  }

  const rawData = localStorage.getItem(getDashboardKey(customerId));
  const data = rawData ? JSON.parse(rawData) : {};
  data[storageType] = itemStatus;

  localStorage.setItem(getDashboardKey(customerId), JSON.stringify(data));
};

export const hasItemBeenDismissed = (
  customerId: string | undefined,
  storageType: DashboardStorageKeys
) => getDashboardLocalStorage(customerId, storageType)?.status === "closed";

export const storeDismissedItem = (
  customerId: string | undefined,
  storageType: DashboardStorageKeys
) => setDashboardLocalStorage(customerId, storageType, "closed");
