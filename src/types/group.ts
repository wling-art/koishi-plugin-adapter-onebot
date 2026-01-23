import type { GroupMemberRole } from "./enum";
import type { UserInfo } from "./user";

export interface GroupInfo {
    /** 群号 */
    group_id: number;
    /** 群名称 */
    group_name: string;
    /** 成员数量 */
    member_count: number;
    /** 最大成员数量 */
    max_member_count: number;
    /** 更多字段 */
    [property: string]: unknown;
}

/**
 * 群成员信息
 */
export interface GroupMemberInfo extends UserInfo {
    /** 群号 */
    group_id: number;
    /** 群名片／备注 */
    card?: string;
    /** 地区 */
    area?: string;
    /** 加群时间戳 */
    join_time: number;
    /** 最后发言时间戳 */
    last_sent_time: number;
    /** 成员等级 */
    level: number;
    /** 角色 */
    role: GroupMemberRole;
    /** 是否不良记录成员 */
    unfriendly?: boolean;
    /** 专属头衔 */
    title?: string;
    /** 专属头衔过期时间戳（0 表示永不过期） */
    title_expire_time?: number;
    /** 是否允许修改群名片 */
    card_changeable?: boolean;
    /** 更多字段 */
    [property: string]: unknown;
}
