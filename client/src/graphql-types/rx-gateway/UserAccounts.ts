/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DigitalServiceStatus, DigitalServiceType, DigitalAccountType, DigitalAccountStatus, FeatureType, FeatureStatus, DigitalUserCustomerType } from "./globalTypes";

// ====================================================
// GraphQL query operation: UserAccounts
// ====================================================

export interface UserAccounts_viewer_digital_services {
  __typename: "DigitalService";
  status: DigitalServiceStatus;
  type: DigitalServiceType;
}

export interface UserAccounts_viewer_digital_accounts {
  __typename: "DigitalAccount";
  id: string;
  /**
   * The type of origin system this account belongs to.
   */
  type: DigitalAccountType;
  accountId: string;
  status: DigitalAccountStatus;
}

export interface UserAccounts_viewer_digital_features {
  __typename: "Feature";
  id: string;
  type: FeatureType;
  featureId: string | null;
  status: FeatureStatus;
}

export interface UserAccounts_viewer_digital_user {
  __typename: "DigitalUser";
  customerType: DigitalUserCustomerType;
}

export interface UserAccounts_viewer_digital {
  __typename: "DigitalViewer";
  services: UserAccounts_viewer_digital_services[];
  accounts: UserAccounts_viewer_digital_accounts[];
  features: UserAccounts_viewer_digital_features[];
  user: UserAccounts_viewer_digital_user | null;
}

export interface UserAccounts_viewer {
  __typename: "Viewer";
  digital: UserAccounts_viewer_digital;
}

export interface UserAccounts {
  viewer: UserAccounts_viewer;
}
