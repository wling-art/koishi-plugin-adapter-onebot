/**
 * 群荣誉类型枚举
 */
export enum HonorType {
  /** 龙王 */
  talkative = "talkative",
  /** 群聊之火 */
  performer = "performer",
  /** 群聊炽焰 */
  legend = "legend",
  /** 新人王 */
  strong_newbie = "strong_newbie",
  /** 快乐源泉 */
  emotion = "emotion"
}

/**
 * 安全等级
 */
export enum SafetyLevel {
  /** 安全 */
  Safe = 1,
  /** 未知 */
  Unknown = 2,
  /** 危险 */
  Dangerous = 3
}
/**
 * 用户性别枚举
 */
export enum UserSex {
  /** 男性 */
  male = "male",
  /** 女性 */
  female = "female",
  /** 未知 */
  unknown = "unknown"
}

/**
 * 群成员角色枚举
 */
export enum GroupMemberRole {
  /** 群主 */
  owner = "owner",

  /** 管理员 */
  admin = "admin",

  /** 成员 */
  member = "member"
}

/**
 *  消息事件类型枚举
 */
export enum EventType {
  /** 元事件 */
  META = "meta_event",
  /** 请求类事件 */
  REQUEST = "request",
  /** 通知类事件 */
  NOTICE = "notice",
  /** 消息类事件 */
  MESSAGE = "message",
  /**
   * 自身消息（go-cqhttp 扩展事件）
   */
  MESSAGE_SENT = "message_sent"
}
