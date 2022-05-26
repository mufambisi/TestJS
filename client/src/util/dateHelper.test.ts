import { parseDate, formatDate } from "./dateHelper";

describe("parseDate()", () => {
  const testCases = [
    { input: "2020-10-13", expected: new Date(2020, 9, 13) },
    {
      input: "2020-10-12T13:00:00.000Z",
      expected: new Date("2020-10-12T13:00:00.000Z"),
    },
    { input: null, expected: undefined },
    { input: undefined, expected: undefined },
    { input: "", expected: undefined },
    { input: "2020-20-20", expected: undefined },
  ];

  testCases.forEach(({ input, expected }) => {
    it(`should return "${expected?.toISOString()}" given "${input}"`, () => {
      expect(parseDate(input)?.toISOString()).toEqual(expected?.toISOString());
    });
  });
});

describe("formatDate()", () => {
  const testCases = [
    { input: new Date(2020, 9, 13), expected: "13-Oct-2020" },
    { input: undefined, expected: "" },
  ];

  testCases.forEach(({ input, expected }) => {
    it(`should return "${expected}" given "${input?.toISOString()}"`, () => {
      expect(formatDate(input, "dd-MMM-yyyy")).toEqual(expected);
    });
  });
});
