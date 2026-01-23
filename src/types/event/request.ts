import { EventType } from "../enum";
import type { BaseEvent } from "./base";

/** 请求事件 */
export interface RequestEvent<request_type extends "friend" | "group"> extends BaseEvent<EventType.REQUEST> {
    /** 请求类型 */
    request_type: request_type;
    /** 发送者 QQ 号 */
    user_id: number;
    /** 验证信息 */
    comment: string;
    /** 请求标识符 */
    flag: string;
}

// 类型守卫
export function isRequestEvent(event: BaseEvent<EventType>): event is RequestEvent<"friend" | "group"> {
    return event.post_type === EventType.REQUEST;
}

export function isFriendRequest(event: BaseEvent<EventType>): event is FriendRequest {
    return isRequestEvent(event) && event.request_type === "friend";
}

export function isGroupRequest(event: BaseEvent<EventType>): event is GroupRequest {
    return isRequestEvent(event) && event.request_type === "group";
}

/** 加好友请求 */
export interface FriendRequest extends RequestEvent<"friend"> {}

/** 加群请求/邀请 */
export interface GroupRequest extends RequestEvent<"group"> {
    /** 事件子类型
     *
     * - add: 加群请求
     * - invite: 邀请登录号入群
     */
    sub_type: "add" | "invite";
    /** 群号 */
    group_id: number;
}
