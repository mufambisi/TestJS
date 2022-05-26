// @ts-ignore
export const TestHook = <T extends (...args: any) => any>({
  hook,
  args = [],
  result = [],
}: {
  hook: T;
  args?: Parameters<T> | [];
  result?: Array<ReturnType<T>>;
}) => {
  // @ts-ignore
  result.push(hook(...args));
  return null;
};
