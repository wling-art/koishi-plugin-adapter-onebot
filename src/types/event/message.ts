import { CQCode } from "../../bot/cqcode";
import { EventType } from "../enum";
import { Anonymous, GroupSender, Sender } from "../sender";
import { BaseEvent, SubType } from "./base";

/** 消息事件接口 */
interface BaseMessageEvent<S extends Sender | GroupSender, M extends "private" | "group"> extends BaseEvent<
    EventType.MESSAGE | EventType.MESSAGE_SENT
> {
    /** 消息类型 */
    message_type: M;
    /** 消息子类型 */
    sub_type: SubType;
    /** 消息 ID */
    message_id: number;
    /** 发送者 QQ 号 */
    user_id: number;
    /** 消息内容 */
    message: string | CQCode[];
    /** 原始消息内容 */
    raw_message: string;
    /** 字体 */
    font: number;
    /** 发送人信息 */
    sender: S;
    /** 更多字段 */
    [property: string]: unknown;
}

// 类型守卫
export function isMessageEvent(event: BaseEvent<EventType>): event is MessageEvent {
    return event.post_type === EventType.MESSAGE || event.post_type === EventType.MESSAGE_SENT;
}

export function isPrivateMessageEvent(event: BaseEvent<EventType>): event is PrivateMessageEvent {
    return isMessageEvent(event) && event.message_type === "private";
}

export function isGroupMessageEvent(event: BaseEvent<EventType>): event is GroupMessageEvent {
    return isMessageEvent(event) && event.message_type === "group";
}

/** 私聊消息事件 */
export interface PrivateMessageEvent extends BaseMessageEvent<Sender, "private"> {
    /** 更多字段 */
    [property: string]: unknown;
}

/** 群消息事件 */
export interface GroupMessageEvent extends BaseMessageEvent<GroupSender, "group"> {
    /** 群号 */
    group_id: number;
    /** 匿名信息 */
    anonymous?: Anonymous;
    /** 更多字段 */
    [property: string]: unknown;
}

export type MessageEvent = PrivateMessageEvent | GroupMessageEvent;
