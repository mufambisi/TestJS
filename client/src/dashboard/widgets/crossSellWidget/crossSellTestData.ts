import {
  DigitalAccountStatus,
  DigitalAccountType,
  DigitalServiceStatus,
  DigitalServiceType,
} from "src/graphql-types/rx-gateway/globalTypes";
import { UserAccounts_viewer_digital } from "src/graphql-types/rx-gateway/UserAccounts";

export const exampleNBACard = {
  componentType: "productCard",
  experienceId: "TEST rx exp-electricity",
  tagText: "ELECTRICITY OFFER",
  heading: "TEST Get 5,000 bonus points",
  imageSha: "/v1644900732/EDR/tile_32-9_brand-2021_edr-piggybank_3x.png",
  logoSha: "06eededbde4f34c2af0369fe3b724940c78d44fd",
  subHeading:
    "When you switch your electricity to an Origin Everyday Rewards Plan. That's up to **$25 off** a future shop at **Woolworths, BIG W, BWS** and more. T&Cs apply.",
  hideCTA: false,
  buttonLink:
    "/for-home/electricity-and-gas/plans/origin-everyday-rewards.html",
  buttonKind: "primary",
  buttonText: "View offer",
  newTab: false,
  clickToMessage: false,
  terms: "",
  isDismissable: false,
  dismissDuration: null,
};

export const exampleData: UserAccounts_viewer_digital = {
  __typename: "DigitalViewer",
  accounts: [
    {
      __typename: "DigitalAccount",
      id: "XYZ",
      type: DigitalAccountType.KRAKEN,
      accountId: "123",
      status: DigitalAccountStatus.ACTIVE,
    },
  ],
  features: [],
  services: [
    {
      __typename: "DigitalService",
      status: DigitalServiceStatus.ACTIVE,
      type: DigitalServiceType.VOIP,
    },
    {
      __typename: "DigitalService",
      status: DigitalServiceStatus.ACTIVE,
      type: DigitalServiceType.ELECTRICITY,
    },
  ],
  user: null,
};
