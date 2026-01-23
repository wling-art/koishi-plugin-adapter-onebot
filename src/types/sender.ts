import type { Dict } from "koishi";
import type { GroupMemberRole, UserSex } from "./enum";

/** 发送者信息
 *
 * 每一个字段不一定存在，具体取决于 OneBot 实现
 */
export interface Sender {
    /** 用户ID */
    user_id: number;
    /** 昵称 */
    nickname: string;
    /** 性别 */
    sex?: UserSex;
    /** 年龄 */
    age?: number;
}
/**
 * 群发送者信息
 */
export interface GroupSender extends Sender {
    /** 群名片／备注 */
    card?: string;
    /** 地区 */
    area?: string;
    /** 群等级 */
    level?: number;
    /** 角色 */
    role?: GroupMemberRole;
    /** 专属头衔 */
    title?: string;
}

/** 匿名信息 */
export interface Anonymous {
    /** 匿名用户 ID */
    id: number;
    /** 匿名用户名称 */
    name: string;
    /** 匿名用户 flag，在调用禁言 API 时需要传入 */
    flag: string;
}

export class SenderError extends Error {
    constructor(args: Dict, url: string, retcode: number) {
        super(`Error with request ${url}, args: ${JSON.stringify(args)}, retcode: ${retcode}`);
        Object.defineProperties(this, {
            code: { value: retcode },
            args: { value: args },
            url: { value: url }
        });
    }
}
