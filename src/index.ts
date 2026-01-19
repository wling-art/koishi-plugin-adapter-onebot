import { Session } from "koishi";
import { OneBot } from "./bot";
import { Internal } from "./internal";

export { OneBot };

export * from "./bot";
export * from "./http";
export * from "./ws";

export default OneBot;

declare module "@satorijs/core" {
    interface Session {
        onebot?: Internal & {
            targetId?: string;
            duration?: number;
        };
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