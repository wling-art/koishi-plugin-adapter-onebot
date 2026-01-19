import { EventType } from "../enum";

/** 消息子类型 */
export enum SubType {
    /** 好友 */
    Friend = "friend",
    /** 群聊 */
    Normal = "normal",
    /** 匿名 */
    Anonymous = "anonymous",
    /** 群中自身发送 */
    GroupSelf = "group_self",
    /** 群临时会话 */
    Group = "group",
    /** 系统提示 */
    Notice = "notice"
}

/** 基础事件 */
export interface BaseEvent<T extends EventType> {
    /** 事件发生的时间戳 */
    time: number;
    /** 收到事件的机器人 QQ 号 */
    self_id: number;
    /** 上报类型 */
    post_type: T;
}

// 类型守卫
export function isBaseEvent(event: any): event is BaseEvent<EventType> {
    return event && typeof event === "object" && "post_type" in event && "time" in event && "self_id" in event;
}