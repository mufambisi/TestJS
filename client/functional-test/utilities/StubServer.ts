import { readFileSync } from "fs";
import { RequestMock, t } from "testcafe";

import { base } from "./DynamicBaseUrl";

interface IStubData {
  responseBody?: any;
  delay: number;
  method?: string;
  route: string;
  status: number;
}

export abstract class StubServer {
  public static setupStubs = async (filenames: string[] | string) => {
    const mock = RequestMock();
    const filenameList =
      typeof filenames === "string" ? [filenames] : filenames;

    filenameList.forEach((filename) => {
      const stubData: IStubData = JSON.parse(
        readFileSync(`../devTools/rest-mocks/${filename}.json`, "utf-8")
      );
      const responseBody = JSON.stringify(stubData.responseBody);
      mock
        .onRequestTo({
          url: `${base.url}${stubData.route}`,
          method: stubData.method || "get",
        })
        .respond(responseBody || "", stubData.status, {
          "content-type": "application/json",
        });
    });

    await t.addRequestHooks(mock);
  };
}
