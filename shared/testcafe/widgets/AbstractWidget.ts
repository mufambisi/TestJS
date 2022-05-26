// @ts-ignore
import { Selector } from "testcafe";

export abstract class AbstractWidget {
  // eslint-disable-next-line no-useless-constructor
  protected constructor(protected readonly context: Selector) {}

  public get visible(): Promise<boolean> {
    return this.context.visible;
  }

  public find(cssSelector: string): Selector {
    return this.context.find(cssSelector);
  }
}
