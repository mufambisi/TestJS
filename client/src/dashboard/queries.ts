import { gql, useKraxiQuery } from "@origin-digital/kraxi";
import { PortfolioSummaryQuery } from "../graphql-types/rx-gateway/PortfolioSummaryQuery";
import { UserAccounts } from "../graphql-types/rx-gateway/UserAccounts";

export const useUserAccountsQuery = () =>
  useKraxiQuery<UserAccounts>(gql`
    query UserAccounts {
      viewer {
        digital {
          services {
            status
            type
          }
          accounts {
            id
            type
            accountId
            status
          }
          features {
            id
            type
            featureId
            status
          }
          user {
            customerType
          }
        }
      }
    }
  `);

export const usePortfolioSummaryQuery = () =>
  useKraxiQuery<PortfolioSummaryQuery>(
    gql`
      query PortfolioSummaryQuery {
        viewer {
          kraken {
            accounts {
              accountNumber
              services {
                ... on ElectricityService {
                  type
                  validFrom
                  isActive
                  property {
                    address {
                      value
                      components {
                        postcode
                        locality
                      }
                    }
                  }
                }
                ... on GasService {
                  type
                  validFrom
                  isActive
                  property {
                    address {
                      value
                      components {
                        postcode
                        locality
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    {
      // bypassing cache to avoid useUserAccountsQuery from excuting again
      fetchPolicy: "no-cache",
    }
  );
