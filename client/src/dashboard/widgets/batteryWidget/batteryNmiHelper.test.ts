import { getNmiFromFeatureId } from "./batteryNmiHelper";

describe("batteryNmiHelper", () => {
  describe("getNmiFromFeatureId()", () => {
    it("should successfully return a nmi from a valid feature id", async () => {
      const featureId = "123_500003528527";

      expect(getNmiFromFeatureId(featureId)).toEqual("500003528527");
    });

    it.each([["123_"], ["123"], [""]])(
      `should fail to return a nmi when the feature id %p is invalid`,
      async (featureId) => {
        expect(() => getNmiFromFeatureId(featureId)).toThrow();
      }
    );
  });
});
