import type { Device } from "../device";
import { EventType } from "../enum";
import type { BaseEvent } from "./base";

/**
 * 通知事件类型
 */
export enum NoticeType {
  /** 群文件上传事件 */
  GROUP_UPLOAD = "group_upload",
  /** 群管理员变动事件*/
  GROUP_ADMIN = "group_admin",
  /** 群成员减少事件 */
  GROUP_DECREASE = "group_decrease",
  /** 群成员增加事件 */
  GROUP_INCREASE = "group_increase",
  /** 群禁言事件 */
  GROUP_BAN = "group_ban",
  /** 群消息撤回事件 */
  GROUP_RECALL = "group_recall",
  /** 好友添加事件 */
  FRIEND_ADD = "friend_add",
  /** 好友消息撤回事件 */
  FRIEND_RECALL = "friend_recall",
  /** 特殊通知事件 */
  NOTIFY = "notify",
  /** 群名片变更（go-cqhttp 扩展事件） */
  GROUP_CARD = "group_card",
  /** 接收到离线文件（go-cqhttp 扩展事件） */
  OFFLINE_FILE = "offline_file",
  /** 其他客户端在线状态变更（go-cqhttp 扩展事件） */
  CLIENT_STATUS = "client_status",
  /** 精华消息变更（go-cqhttp 扩展事件）*/
  GROUP_ESSENCE = "essence"
}

/** 通知事件 */
interface NoticeEvent<notice_type extends NoticeType> extends BaseEvent<EventType.NOTICE> {
  /** 通知类型 */
  notice_type: notice_type;
}

// 类型守卫
export function isNoticeEvent(event: BaseEvent<EventType>): event is AllNoticeEvents {
  return event.post_type === EventType.NOTICE;
}

/** 群文件信息 */
export interface GroupUploadFile {
  /** 文件 ID */
  id: string;
  /** 文件名 */
  name: string;
  /** 文件大小，单位字节 */
  size: number;
  /** 业务ID */
  busid: number;
}

/** 群文件上传 */
export interface GroupUploadNotice extends NoticeEvent<NoticeType.GROUP_UPLOAD> {
  /** 群号 */
  group_id: number;
  /** 发送者 QQ 号 */
  user_id: number;
}

/** 群管理员变动 */
export interface GroupAdminNotice extends NoticeEvent<NoticeType.GROUP_ADMIN> {
  /**
   * 事件子类型
   *
   * - set: 设置管理员
   * - unset: 取消管理员
   */
  sub_type: "set" | "unset";
  /** 群号 */
  group_id: number;
  /** 管理员 QQ 号 */
  user_id: number;
}

/** 群成员减少 */
export interface GroupDecreaseNotice extends NoticeEvent<NoticeType.GROUP_DECREASE> {
  /**
   * 事件子类型
   *
   * - leave: 主动退群
   * - kick: 成员被踢
   * - kick_me: 登录号被踢
   */
  sub_type: "leave" | "kick" | "kick_me";
  /** 群号 */
  group_id: number;
  /**
   * 操作者 QQ 号
   *
   * 对于主动退群的成员，该字段为操作者本人 QQ 号
   */
  operator_id: number;
  /** 离开者 QQ 号 */
  user_id: number;
}

/** 群成员增加 */
export interface GroupIncreaseNotice extends NoticeEvent<NoticeType.GROUP_INCREASE> {
  /**
   * 事件子类型
   *
   * - approve: 管理员同意入群
   * - invite: 成员邀请入群
   */
  sub_type: "approve" | "invite";
  /** 群号 */
  group_id: number;
  /** 操作者 QQ 号 */
  operator_id: number;
  /** 加入者 QQ 号 */
  user_id: number;
}

/** 群禁言 */
export interface GroupBanNotice extends NoticeEvent<NoticeType.GROUP_BAN> {
  /**
   * 事件子类型
   *
   * - ban: 禁言
   * - lift_ban: 解除禁言
   *  */
  sub_type: "ban" | "lift_ban";
  /** 群号 */
  group_id: number;
  /** 操作者 QQ 号 */
  operator_id: number;
  /** 被禁言 QQ 号，0 代表全员禁言 */
  user_id: number;
  /** 禁言时长，单位秒（全员禁言为时为-1） */
  duration: number;
}

/** 群消息撤回 */
export interface GroupRecallNotice extends NoticeEvent<NoticeType.GROUP_RECALL> {
  /** 群号 */
  group_id: number;
  /** 消息发送者 QQ 号 */
  user_id: number;
  /** 操作者 QQ 号 */
  operator_id: number;
  /** 被撤回的消息 ID */
  message_id: number;
}

/** 戳一戳 */
export interface NotifyPokeNotice extends NoticeEvent<NoticeType.NOTIFY> {
  /** 提示类型 */
  sub_type: "poke";
  /** 发送者 QQ 号 */
  user_id: number;
  /** 被戳者 QQ 号 */
  target_id: number;
}

export function isGroupPokeNotice(event: NoticeEvent<NoticeType.NOTIFY>): event is NotifyGroupPokeNotice {
  return (event as NotifyGroupPokeNotice).group_id !== undefined;
}

/** 群内戳一戳 */
export interface NotifyGroupPokeNotice extends NotifyPokeNotice {
  /** 群号 */
  group_id: number;
}

/** 群红包运气王 */
export interface NotifyLuckyKingNotice extends NoticeEvent<NoticeType.NOTIFY> {
  /** 提示类型 */
  sub_type: "lucky_king";
  /** 群号 */
  group_id: number;
  /** 红包发送者 QQ 号 */
  user_id: number;
  /** 运气王 QQ 号 */
  target_id: number;
}

/** 群成员荣誉变更 */
export interface NotifyHonorNotice extends NoticeEvent<NoticeType.NOTIFY> {
  /** 提示类型 */
  sub_type: "honor";
  /** 群号 */
  group_id: number;
  /**
   * 荣誉类型
   *
   * - talkative: 龙王
   * - performer: 群聊之火
   * - emotion: 快乐源泉
   */
  honor_type: "talkative" | "performer" | "emotion";
  /** 成员 QQ 号 */
  user_id: number;
}

/** 群成员头衔变更（go-cqhttp 扩展事件） */
export interface NotifyTitleNotice extends NoticeEvent<NoticeType.NOTIFY> {
  /** 提示类型 */
  sub_type: "title";
  /** 群号 */
  group_id: number;
  /** 变更头衔的用户 QQ 号 */
  user_id: number;
  /** 变更后的头衔 */
  title: string;
}

/** 好友添加 */
export interface FriendAddNotice extends NoticeEvent<NoticeType.FRIEND_ADD> {
  /** 新添加好友 QQ 号 */
  user_id: number;
}

/** 好友消息撤回 */
export interface FriendRecallNotice extends NoticeEvent<NoticeType.FRIEND_RECALL> {
  /** 好友 QQ 号 */
  user_id: number;
  /** 被撤回的消息 ID */
  message_id: number;
}

/** 群名片变更（go-cqhttp 扩展事件） */
export interface GroupCardNotice extends NoticeEvent<NoticeType.GROUP_CARD> {
  /** 群号 */
  group_id: number;
  /** 成员 QQ 号 */
  user_id: number;
  /** 变更后的群名片 */
  card_new: string;
  /** 变更前的群名片 */
  card_old: string;
}

/** 接收到离线文件（go-cqhttp 扩展事件） */
export interface OfflineFileNotice extends NoticeEvent<NoticeType.OFFLINE_FILE> {
  /** 发送者 QQ 号 */
  user_id: number;
  /** 文件数据 */
  file: {
    /** 文件名 */
    name: string;
    /** 文件大小，单位字节 */
    size: number;
    /** 文件下载 URL */
    url: string;
  };
}

/** 其他客户端在线状态变更（go-cqhttp 扩展事件） */
export interface ClientStatusNotice extends NoticeEvent<NoticeType.CLIENT_STATUS> {
  /** 客户端信息 */
  client: Device;
  /** 当前是否在线 */
  online: boolean;
}

/** 精华消息变更（go-cqhttp 扩展事件）*/
export interface GroupEssenceNotice extends NoticeEvent<NoticeType.GROUP_ESSENCE> {
  /**
   * 事件子类型
   *
   * - add: 添加精华消息
   * - delete: 删除精华消息
   */
  sub_type: "add" | "delete";
  /** 群号 */
  group_id: number;
  /** 消息发送者 ID */
  sender_id: number;
  /** 操作者 QQ 号 */
  operator_id: number;
  /** 消息 ID */
  message_id: number;
}

export type AllNoticeEvents =
  | GroupUploadNotice
  | GroupAdminNotice
  | GroupDecreaseNotice
  | GroupIncreaseNotice
  | GroupBanNotice
  | GroupRecallNotice
  | NotifyPokeNotice
  | NotifyGroupPokeNotice
  | NotifyLuckyKingNotice
  | NotifyHonorNotice
  | NotifyTitleNotice
  | FriendAddNotice
  | FriendRecallNotice
  | GroupCardNotice
  | OfflineFileNotice
  | ClientStatusNotice
  | GroupEssenceNotice;
