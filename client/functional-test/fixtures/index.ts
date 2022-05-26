/* eslint-disable @typescript-eslint/no-var-requires */

const graphqlMocks = "../graphql-mocks/";
const accountCardMocks = `${graphqlMocks}AccountCardFixtures/`;
const dashboardMocks = `${graphqlMocks}DashboardFixtures/`;
const staticMocks = `../graphql-mocks-static/`;

export const singleBillOverdueAccount = require(`${accountCardMocks}singleBillOverdueAccount.json`);
export const scheduledPaymentAccount = require(`${accountCardMocks}singleScheduledPaymentAccount.json`);

export const manyAccountUser = require(`${dashboardMocks}manyAccountUser.json`);
export const networkFailureAccount = require(`${dashboardMocks}networkFailureAccount.json`);
export const resolverFailureAccount = require(`${dashboardMocks}resolverFailureAccount.json`);
export const singleAccountUser = require(`${dashboardMocks}singleAccountUser.json`);

export const digitalUserData = require(`${staticMocks}digitalUserData.json`);
export const manyAccountDigitalUserData = require(`${staticMocks}multipleAccountDigitalUserData.json`);
export const singleAccountDigitalUserData = require(`${staticMocks}singleAccountDigitalUserData.json`);
