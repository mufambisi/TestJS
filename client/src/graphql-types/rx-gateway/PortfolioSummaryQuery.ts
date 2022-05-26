/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ServiceType } from "./globalTypes";

// ====================================================
// GraphQL query operation: PortfolioSummaryQuery
// ====================================================

export interface PortfolioSummaryQuery_viewer_kraken_accounts_services_ElectricityService_property_address_components {
  __typename: "AustralianAddressComponents";
  postcode: string | null;
  locality: string | null;
}

export interface PortfolioSummaryQuery_viewer_kraken_accounts_services_ElectricityService_property_address {
  __typename: "AustralianAddress";
  value: string;
  components: PortfolioSummaryQuery_viewer_kraken_accounts_services_ElectricityService_property_address_components;
}

export interface PortfolioSummaryQuery_viewer_kraken_accounts_services_ElectricityService_property {
  __typename: "Property";
  address: PortfolioSummaryQuery_viewer_kraken_accounts_services_ElectricityService_property_address;
}

export interface PortfolioSummaryQuery_viewer_kraken_accounts_services_ElectricityService {
  __typename: "ElectricityService";
  type: ServiceType;
  validFrom: any | null;
  isActive: boolean;
  property: PortfolioSummaryQuery_viewer_kraken_accounts_services_ElectricityService_property | null;
}

export interface PortfolioSummaryQuery_viewer_kraken_accounts_services_GasService_property_address_components {
  __typename: "AustralianAddressComponents";
  postcode: string | null;
  locality: string | null;
}

export interface PortfolioSummaryQuery_viewer_kraken_accounts_services_GasService_property_address {
  __typename: "AustralianAddress";
  value: string;
  components: PortfolioSummaryQuery_viewer_kraken_accounts_services_GasService_property_address_components;
}

export interface PortfolioSummaryQuery_viewer_kraken_accounts_services_GasService_property {
  __typename: "Property";
  address: PortfolioSummaryQuery_viewer_kraken_accounts_services_GasService_property_address;
}

export interface PortfolioSummaryQuery_viewer_kraken_accounts_services_GasService {
  __typename: "GasService";
  type: ServiceType;
  validFrom: any | null;
  isActive: boolean;
  property: PortfolioSummaryQuery_viewer_kraken_accounts_services_GasService_property | null;
}

export type PortfolioSummaryQuery_viewer_kraken_accounts_services = PortfolioSummaryQuery_viewer_kraken_accounts_services_ElectricityService | PortfolioSummaryQuery_viewer_kraken_accounts_services_GasService;

export interface PortfolioSummaryQuery_viewer_kraken_accounts {
  __typename: "Account";
  accountNumber: string;
  services: PortfolioSummaryQuery_viewer_kraken_accounts_services[];
}

export interface PortfolioSummaryQuery_viewer_kraken {
  __typename: "KrakenViewer";
  accounts: PortfolioSummaryQuery_viewer_kraken_accounts[];
}

export interface PortfolioSummaryQuery_viewer {
  __typename: "Viewer";
  kraken: PortfolioSummaryQuery_viewer_kraken | null;
}

export interface PortfolioSummaryQuery {
  viewer: PortfolioSummaryQuery_viewer;
}
