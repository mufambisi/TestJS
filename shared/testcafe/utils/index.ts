import { Selector, t } from "testcafe";

export const atDataId = async (dataId: string, tag: string = "") =>
  await t.expect(Selector(`${tag}[data-id="${dataId}"]`).visible).ok();

export const selectorByDataId = (dataId: string, tag: string = "") =>
  Selector(`${tag}[data-id="${dataId}"]`);

export const selectorByDataIdWithChild = (
  dataId: string,
  childDataId: string,
  tag: string = ""
) => Selector(`[data-id="${dataId}"]`).find(`${tag}[data-id="${childDataId}"]`);

export const lpgSelectorByDataId = (dataId: string, tag: string = "") =>
  selectorByDataIdWithChild("lpg-widget-body", dataId, tag);
