import { isPresent } from "./arrayHelper";

describe("isPresent()", () => {
  const theories: [any, boolean][] = [
    [true, true],
    [null, false],
    [undefined, false],
  ];

  theories.forEach(([value, expected]) => {
    it(`should return ${expected.toString()} given "${value}"`, () => {
      expect(isPresent(value)).toEqual(expected);
    });
  });
});
