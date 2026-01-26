import type { Session } from "koishi";
import { OneBot } from "./bot";
import type { Internal } from "./internal";

export { OneBot };

export * from "./bot";
export * from "./http";
export * from "./ws";

export default OneBot;

declare module "koishi" {
  interface Session {
    onebot?: Internal & {
      targetId?: string;
      duration?: number;
    }; // TODO: onebot event value
  }
}

declare module "koishi" {
  interface Events {
    "onebot/notice-poke"(session: Session): void;
    "onebot/notice-honor"(session: Session): void;
    "onebot/notice-title"(session: Session): void;
    "onebot/notice-lucky-king"(session: Session): void;
    "onebot/group-essence"(session: Session): void;
  }
}
