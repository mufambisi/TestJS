import React from "react";
import { act, render } from "@testing-library/react";

import { TestHook } from "devTools/helpers";

import { useOnce } from ".";

describe("useOnce()", () => {
  it("should call provided hook function", () => {
    const callback = jest.fn();
    const fn = jest.fn().mockImplementation(() => callback);

    act(() => {
      const { unmount } = render(
        <TestHook<typeof useOnce> hook={useOnce} args={[fn]} />
      );
      unmount();
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
