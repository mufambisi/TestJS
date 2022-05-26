import { subDays } from "date-fns";

import {
  DashboardStorageKeys,
  getDashboardLocalStorage,
  hasItemBeenDismissed,
  setDashboardLocalStorage,
  storageExpiry,
  storeDismissedItem,
  StorageItemStatus,
} from "src/util/storageHelper";

const customerId = "A-1234567";
const storageKey = `dashboard-rx-${customerId}`;
const itemDismissed: DashboardStorageKeys = "missing-features-banner";

const localStorageProto = Object.getPrototypeOf(window.localStorage);
jest.spyOn(localStorageProto, "setItem");
jest.spyOn(localStorageProto, "getItem");

const getItemMock = localStorageProto.getItem as jest.Mock;
const setItemMock = localStorageProto.setItem as jest.Mock;
const getData = (overrides: Partial<StorageItemStatus> = {}) => ({
  [itemDismissed]: {
    status: "closed",
    dismissedAt: subDays(new Date(), storageExpiry - 10),
    ...overrides,
  },
});

describe("getDashboardLocalStorage()", () => {
  it("should not call getItem is the customer id is undefined", () => {
    getDashboardLocalStorage(undefined, itemDismissed);

    expect(localStorage.getItem).not.toBeCalled();
  });

  it("should return is undefined if there is no data", () => {
    expect(getDashboardLocalStorage(customerId, itemDismissed)).toBeUndefined();

    expect(localStorage.getItem).toBeCalledWith(storageKey);
  });

  it(`should return undefined if dismissedAt is more than ${storageExpiry} days ago and remove item from the storage object`, () => {
    const data = {
      [itemDismissed]: {
        status: "closed",
        dismissedAt: subDays(new Date(), storageExpiry + 10),
      },
      "other-stored-item": {
        status: "closed",
        dismissedAt: subDays(new Date(), storageExpiry - 10),
      },
    };
    getItemMock.mockReturnValue(JSON.stringify(data));

    expect(getDashboardLocalStorage(customerId, itemDismissed)).toBeUndefined();

    const setItemData = setItemMock.mock.calls[0];
    const storedValue = JSON.parse(setItemData[1]);
    expect(storedValue[itemDismissed]).toBeUndefined();
    expect(storedValue["other-stored-item"]).toEqual({
      status: "closed",
      dismissedAt: expect.any(String),
    });
  });

  it(`should return the stored data if dismissedAt is within ${storageExpiry} days`, () => {
    const data = getData();
    getItemMock.mockReturnValue(JSON.stringify(data));

    expect(getDashboardLocalStorage(customerId, itemDismissed)).toEqual(
      data[itemDismissed]
    );
  });

  it("should return the data if there is no dismissedAt value", () => {
    const data = getData({ status: "shown", dismissedAt: undefined });
    getItemMock.mockReturnValue(JSON.stringify(data));

    expect(getDashboardLocalStorage(customerId, itemDismissed)).toEqual(
      data[itemDismissed]
    );
  });
});

describe("hasItemBeenDismissed()", () => {
  it('should return true if the status is "closed"', () => {
    getItemMock.mockReturnValue(JSON.stringify(getData()));
    expect(hasItemBeenDismissed(customerId, itemDismissed)).toBe(true);
  });

  it('should return false if the status is "shown"', () => {
    getItemMock.mockReturnValue(
      JSON.stringify(getData({ dismissedAt: undefined, status: "shown" }))
    );
    expect(hasItemBeenDismissed(customerId, itemDismissed)).toBe(false);
  });

  it("should return false if there is no stored data", () => {
    expect(hasItemBeenDismissed(customerId, itemDismissed)).toBe(false);
  });
});

describe("setDashboardLocalStorage()", () => {
  it("should not call setItem is the customer id is undefined", () => {
    setDashboardLocalStorage(
      undefined,
      "other-stored-item" as DashboardStorageKeys
    );

    expect(localStorage.setItem).not.toBeCalled();
  });

  it("should call setItem with the correct key, closed status and dismissedAt", () => {
    setDashboardLocalStorage(customerId, itemDismissed);

    const setItemData = setItemMock.mock.calls[0];
    const storedKey = setItemData[0];
    const storedValue: StorageItemStatus = JSON.parse(setItemData[1])[
      itemDismissed
    ];

    expect(storedKey).toBe(storageKey);
    expect(storedValue.dismissedAt).not.toBeUndefined();
    expect(storedValue.status).toBe("closed");
  });

  it("should call setItem with the correct key, closed open and no dismissedAt", () => {
    setDashboardLocalStorage(customerId, itemDismissed, "shown");

    const setItemData = setItemMock.mock.calls[0];
    const storedKey = setItemData[0];
    const storedValue: StorageItemStatus = JSON.parse(setItemData[1])[
      itemDismissed
    ];

    expect(storedKey).toBe(storageKey);
    expect(storedValue.dismissedAt).toBeUndefined();
    expect(storedValue.status).toBe("shown");
  });

  it("should not override data that is already stored", () => {
    const currentData = {
      "other-stored-item": {
        status: "shown",
      },
    };
    getItemMock.mockReturnValue(JSON.stringify(currentData));

    setDashboardLocalStorage(customerId, itemDismissed, "closed");

    const setItemData = JSON.parse(setItemMock.mock.calls[0][1]);
    expect(setItemData).toEqual({
      "other-stored-item": {
        status: "shown",
      },
      [itemDismissed]: {
        dismissedAt: expect.any(String),
        status: "closed",
      },
    });
  });
});

describe("storeDismissedItem()", () => {
  it("should store the closed status", () => {
    storeDismissedItem(customerId, "other-stored-item" as DashboardStorageKeys);

    const setItemData = JSON.parse(setItemMock.mock.calls[0][1]);
    expect(setItemData).toEqual({
      "other-stored-item": {
        dismissedAt: expect.any(String),
        status: "closed",
      },
    });
  });
});
