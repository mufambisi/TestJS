import { ClientFunction, t } from "testcafe";

import {
  TOPICS,
  IAlertBanner,
  IOpenResource,
  INavClose,
} from "@origin-digital/event-dispatcher";

interface INavTo {
  topic: TOPICS.NAV_TO;
  payload: {
    to: string;
  };
}

interface INavComplete {
  topic: TOPICS.NAV_COMPLETE;
  payload: {
    from: string;
  };
}

declare global {
  /* eslint-disable-next-line @typescript-eslint/interface-name-prefix */
  interface Window {
    FRAME: {
      eventDispatcherInstance: {
        addListener: (
          name: string,
          callback: (event: IAlertBanner) => void
        ) => void;
      };
    };
    EVENTS: (
      | IAlertBanner
      | INavClose
      | INavTo
      | INavComplete
      | IOpenResource
    )[];
  }
}

type EventType = keyof typeof TOPICS;
type AlertBannerType = IAlertBanner["payload"]["type"];

export class EventDispatcher {
  static async addEventListener(
    eventTopic: keyof typeof TOPICS,
    event?: () => any
  ) {
    const addListener = ClientFunction((topic) =>
      window.FRAME.eventDispatcherInstance.addListener(topic, (firedEvent) => {
        window.EVENTS = window.EVENTS || [];
        window.EVENTS.push(firedEvent);
        if (event) {
          event();
        }
      })
    );
    await addListener(eventTopic);
  }

  static async addEventListeners(eventTopics: (keyof typeof TOPICS)[]) {
    await Promise.all(eventTopics.map((topic) => this.addEventListener(topic)));
  }

  static async eventDispatched(eventTopic: EventType) {
    const getIndex = ClientFunction((topic: string) =>
      window.EVENTS
        ? window.EVENTS.findIndex((event) => event.topic === topic)
        : -1
    );
    const getEvent = ClientFunction(
      (eventIndex: number) => window.EVENTS[eventIndex]
    );

    const eventIndex = await getIndex(eventTopic);

    if (eventIndex !== -1) {
      const event = await getEvent(eventIndex);
      ClientFunction((idx) => window.EVENTS.splice(idx, 1));
      return event;
    }
    return false;
  }

  static async verifyAlertBannerType(
    eventTopic: EventType,
    type: AlertBannerType
  ) {
    const event = await this.eventDispatched(eventTopic);
    t.expect(event && (event as IAlertBanner).payload.type === type);
  }

  static async verifyNavTo(to: string) {
    const event = await this.eventDispatched(TOPICS.NAV_TO);
    t.expect(event && (event as INavTo).payload.to === to);
  }

  static async verifyNavComplete(from: string) {
    const event = await this.eventDispatched(TOPICS.NAV_COMPLETE);
    t.expect(event && (event as INavComplete).payload.from === from);
  }

  static async verifyNavClose() {
    const event = await this.eventDispatched(TOPICS.NAV_CLOSE);
    t.expect(!!event);
  }

  static async verifyOpenResourceUrl(url: string) {
    const event = await this.eventDispatched(TOPICS.OPEN_RESOURCE);
    t.expect(event && (event as IOpenResource).payload.url === url);
  }
}
