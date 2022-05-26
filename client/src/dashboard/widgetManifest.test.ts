import {
  DigitalAccountStatus,
  DigitalAccountType,
} from "../graphql-types/rx-gateway/globalTypes";
import { UserAccounts_viewer_digital } from "../graphql-types/rx-gateway/UserAccounts";
import { getWidgetManifest } from "./widgetManifest";

const mockDigitalData: UserAccounts_viewer_digital = {
  __typename: "DigitalViewer",
  accounts: [
    {
      __typename: "DigitalAccount",
      id: "1",
      type: DigitalAccountType.OHM,
      accountId: "123",
      status: DigitalAccountStatus.ACTIVE,
    },
    {
      __typename: "DigitalAccount",
      id: "1",
      type: DigitalAccountType.KRAKEN,
      accountId: "123",
      status: DigitalAccountStatus.ACTIVE,
    },
  ],
  features: [],
  services: [],
  user: null,
};

describe("getWidgetManifest", () => {
  it("returns widget manifest", () => {
    const mockToggles = {
      SpikeWidget: true,
    };
    const manifest = getWidgetManifest(mockToggles, mockDigitalData);
    expect(manifest).toMatchSnapshot();
    expect(manifest.filter((def) => def.name === "SpikeWidget")).toHaveLength(
      1
    );
  });
  it("filters out widget toggled widgets", () => {
    const mockToggles = {
      SpikeWidget: false,
    };
    expect(
      getWidgetManifest(mockToggles, mockDigitalData).filter(
        (def) => def.name === "SpikeWidget"
      )
    ).toEqual([]);
  });
  it("returns no widgets", () => {
    const mockToggles = {
      SpikeWidget: true,
    };
    expect(getWidgetManifest(mockToggles, undefined)).toEqual([]);
  });
});
