import { EventType } from "../enum";
import { BaseEvent } from "./base";

/** 元事件 */
interface MetaEvent<meta_event_type extends "lifecycle" | "heartbeat"> extends BaseEvent<EventType.META> {
    /** 元事件类型 */
    meta_event_type: meta_event_type;
}

/** 心跳包 */
export interface HeartbeatMetaEvent extends MetaEvent<"heartbeat"> {
    /** 心跳状态 */
    status: {
        /**
         *  当前 QQ 在线
         *
         *  undefined 表示无法查询到在线状态
         */
        online?: boolean;
        /** 状态符合预期，意味着各模块正常运行、功能正常，且 QQ 在线 */
        good: boolean;
    };
    /** 距离上一次心跳包的时间（单位是毫秒） */
    interval: number;
}

/** 生命周期 */
export interface LifecycleMetaEvent extends MetaEvent<"lifecycle"> {
    /** 子类型
     *
     * - enable: 启用
     * - disable: 禁用
     * - connect: 连接成功
     */
    sub_type: "enable" | "disable" | "connect";
}