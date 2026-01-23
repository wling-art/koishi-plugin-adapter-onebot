import type { UserSex } from "./enum";

/** 账号信息 */
export interface UserInfo {
    /** 账号 ID */
    user_id: number;
    /** 昵称 */
    nickname: string;
    /** 性别 */
    sex?: UserSex;
    /** 年龄 */
    age?: number;
    /** 等级 */
    level?: number;
    /** 更多字段 */
    [property: string]: unknown;
}
