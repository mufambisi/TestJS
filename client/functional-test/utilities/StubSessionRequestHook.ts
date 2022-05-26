import { RequestHook } from "testcafe";

export class StubSessionRequestHook extends RequestHook {
  sessionId: string;
  constructor(sessionId: string) {
    // No URL filtering applied to this hook
    // so it will be used for all requests.
    super();
    this.sessionId = sessionId;
  }

  async onRequest(e: any) {
    e.requestOptions.headers["x-stub-session"] = this.sessionId;
  }

  async onResponse() {
    // This method must also be overridden,
    // but you can leave it blank.
  }
}
