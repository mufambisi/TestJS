import {
  Account,
  AccountBlueprint,
  AccountPayment,
  AccountPaymentBlueprint,
  AgreementBlueprint,
  BillingOptions,
  BillingOptionsBlueprint,
  BillStatement,
  BillStatementBlueprint,
  BlueprintContext,
  createRefArray,
  createRefConnection,
  createRefField,
  DirectDebitInstruction,
  DirectDebitInstructionBlueprint,
  DueCharges,
  DueChargesBlueprint,
  KrakenAppBlueprint,
  PaymentForecast,
  PaymentForecastBlueprint,
  PaymentSchedule,
  PaymentScheduleBlueprint,
  Property,
  PropertyBlueprint,
} from "@origin-digital/kraken-fixture";
import {
  MeterStatus,
  MeterInstallationType,
} from "@origin-digital/kraken-fixture/lib/typings/blueprints/meter/ElectricityMeter";

const monthsToDays = (months: number) => months * 30;

const buildRefArray = <T>(context: BlueprintContext, list: T[]) =>
  createRefArray<T>(context.addAllToDefinitions(list));

const buildRefField = <T>(context: BlueprintContext, item: T) =>
  createRefField<T>(context.addToDefinitions(item));

const buildRefConnection = <T>(context: BlueprintContext, list: T[]) =>
  createRefConnection<T>(context.addAllToDefinitions(list));

export const createAccount = (
  context: BlueprintContext,
  number: string,
  balance: number,
  config: {
    hasPendingPayments?: boolean;
    hasScheduledPayments?: boolean;
    hasCharges?: boolean;
    hasMultipleCharges?: boolean;
    hasBills?: boolean;
    isOverdueBill?: boolean;
    noAgreements?: boolean;
    isGas?: boolean;
    isPaymentPlan?: boolean;
    address?: string;
    isSolar?: boolean;
  } = {}
) => {
  return new AccountBlueprint(context).build({
    number,
    balance,
    billingOptions: buildRefField<BillingOptions>(
      context,
      new BillingOptionsBlueprint(context).build({
        currentBillingPeriodStartDate: context.getDateStringInPast(
          monthsToDays(2)
        ),
        currentBillingPeriodEndDate: context.getDateStringInFuture(
          monthsToDays(1)
        ),
      })
    ),
    agreements: config.noAgreements
      ? null
      : buildRefArray(
          context,
          new AgreementBlueprint(context).buildMany(
            1,
            {
              __typename: config.isGas
                ? "GasAgreementType"
                : "ElectricityAgreementType",
              supplyType: config.isGas ? "GAS" : "ELECTRICITY",
              meterPoint: config.isSolar
                ? {
                    __typename: "MeterPointType",
                    id: "",
                    status: "",
                    enrolment: null,
                    smartStartDate: "",
                    agreements: [],
                    electricityAgreements: [],
                    identifier: "1234568790",
                    lnsp: {
                      id: "",
                      shortName: "",
                      longName: "",
                      emergencyPhoneNumber: "",
                      outagePhoneNumber: "",
                    },
                    meters: [
                      {
                        __typename: "ElectricityMeterType",
                        id: "",
                        activeFrom: "",
                        activeTo: "",
                        status: "C" as MeterStatus,
                        nextScheduledReadDate: "",
                        serialNumber: "",
                        readTypeMethod: null,
                        readTypeMode: null,
                        readTypeFrequency: null,
                        consumptionUnits: null,
                        readings: null,
                        installationType: "COMMS1" as MeterInstallationType,
                        meterPoint: null,
                        registers: [
                          {
                            __typename: "ElectricityRegisterType",
                            isExportRegister: true,
                            isActive: true,
                          } as any,
                        ],
                      },
                    ],
                  }
                : null,
            },
            { includeProduct: true }
          )
        ),
    dueCharges: config.hasCharges
      ? buildRefArray<DueCharges>(context, [
          new DueChargesBlueprint(context).build({
            amount: -balance,
            dueDate: config.isOverdueBill
              ? context.getDateStringInPast(2)
              : context.getDateStringInFuture(10),
          }),
          ...(config.hasMultipleCharges
            ? [
                new DueChargesBlueprint(context).build({
                  amount: -balance * 2,
                  dueDate: context.getDateStringInPast(2),
                }),
              ]
            : []),
        ])
      : [],
    bills: buildRefConnection<BillStatement>(
      context,
      config.hasBills
        ? [
            new BillStatementBlueprint(context).build({
              temporaryUrl: "/bill.pdf",
            }),
          ]
        : []
    ),
    payments: buildRefConnection<AccountPayment>(context, [
      ...(config.hasPendingPayments
        ? [
            new AccountPaymentBlueprint(context).build({
              amount: -balance,
              status: "PENDING",
            }),
          ]
        : []),
      ...(config.hasScheduledPayments
        ? [
            new AccountPaymentBlueprint(context).build({
              amount: -balance,
              status: "SCHEDULED",
            }),
          ]
        : []),
    ]),
    directDebitInstructions: buildRefConnection<DirectDebitInstruction>(
      context,
      [
        new DirectDebitInstructionBlueprint(context).build({
          instructionType: config.hasScheduledPayments
            ? "DIRECT_DEBIT"
            : "CARD",
        }),
      ]
    ),
    paymentSchedules: buildRefConnection<PaymentSchedule>(context, [
      new PaymentScheduleBlueprint(context).build({
        isVariablePaymentAmount: !config.isPaymentPlan,
        scheduleType: config.hasScheduledPayments
          ? "DIRECT_DEBIT"
          : "BACS_TRANSFER",
      }),
    ]),
    paymentForecast: config.isPaymentPlan
      ? buildRefArray<PaymentForecast>(context, [
          new PaymentForecastBlueprint(context).build(),
        ])
      : null,
    ...(config.address
      ? {
          properties: buildRefArray<Property>(context, [
            new PropertyBlueprint(context).build(
              { address: config.address },
              {}
            ),
          ]),
        }
      : {}),
  });
};

export const createKrakenBlueprintWithAccounts = (
  context: BlueprintContext,
  accounts: Account[]
) => {
  const refIds = context.addAllToDefinitions(accounts);
  const accountRefs = createRefArray<Account>(refIds);

  return new KrakenAppBlueprint(context).build(
    {},
    {
      query: {
        viewer: {
          overrides: {
            accounts: accountRefs,
          },
        },
      },
    }
  );
};
