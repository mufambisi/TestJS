import { useEffect } from "react";
/**
 * Hook that only runs once, allows for async usage
 */
type UseOnceReturnType = void | (() => void);
export const useOnce = (
  fn: () => UseOnceReturnType | Promise<UseOnceReturnType>
): void => {
  useEffect(() => {
    const cleanup = fn();
    if (typeof cleanup === "function") {
      return cleanup;
    }
    /* eslint-disable-next-line */
    return;
  }, []);
};
