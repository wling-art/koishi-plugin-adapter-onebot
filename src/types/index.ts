import type { Dict } from "koishi";
import type { CQCode } from "../bot/cqcode";

/** OneBot API 响应格式 */
export interface ApiResponse<T = Dict> {
    /** 请求状态 */
    status: "ok" | "async" | "failed";
    /** 返回码 */
    retcode: number;
    /** 返回数据 */
    data: T;

    /* 以下为可选字段 */

    /**
     * 部分协议端实现的扩展字段
     *
     * '回声', 如果请求时指定了 echo, 那么响应也会包含 echo
     * */
    echo?: string;
    /** go-cqhttp 字段，错误信息 */
    wording?: string;
}

/** 请求超时错误 */
export class TimeoutError extends Error {
    constructor(args: Dict, url: string) {
        super(`Timeout with request ${url}, args: ${JSON.stringify(args)}`);
        Object.defineProperties(this, {
            args: { value: args },
            url: { value: url }
        });
    }
}

/**
 * 获取凭证响应
 */
export interface GetCredentialsResponse {
    /** Cookies */
    cookies: string;
    /** CSRF Token */
    csrf_token: number;
}

/**
 * 获取在线机型
 */
export interface ModelVariant {
    /** 展示内容 */
    model_show: string;
    /** 是否需要付费 */
    need_pay: boolean;
}

/**
 * 群文件对象
 */
export interface File {
    /** 群号 */
    group_id: number;
    /** 文件ID */
    file_id: string;
    /** 文件名 */
    file_name: string;
    /** 文件类型 */
    busid: number;
    /** 文件大小 */
    file_size: number;
    /** 上传时间 */
    upload_time: number;
    /** 过期时间,永久文件恒为0 */
    dead_time: number;
    /** 最后修改时间 */
    modify_time: number;
    /** 下载次数 */
    download_times: number;
    /** 上传者ID */
    uploader: number;
    /** 上传者名字 */
    uploader_name: string;
}

/**
 * 群文件夹对象
 */
export interface Folder {
    /** 群号 */
    group_id: number;
    /** 文件夹ID */
    folder_id: string;
    /** 文件名 */
    folder_name: string;
    /** 创建时间 */
    create_time: number;
    /** 创建者 */
    creator: number;
    /** 创建者名字 */
    creator_name: string;
    /** 子文件数量 */
    total_file_count: number;
}

/**
 * 获取群根目录文件列表响应
 */
export interface GroupFileList {
    /** 文件列表 */
    files: File[];
    /** 文件夹列表 */
    folders: Folder[];
}

/**
 * 获取群文件系统信息
 */
export interface GroupFileSystemInfo {
    /** 文件总数 */
    file_count: number;
    /** 文件上限 */
    limit_count: number;
    /** 已使用空间 */
    used_space: number;
    /** 空间上限 */
    total_space: number;
}

/**
 * 精华消息列表（cqhttp 扩展）
 *
 * get_essence_msg_list API 的响应数据
 */
export interface EssenceMessage {
    /** 发送者 QQ 号 */
    sender_id: number;
    /** 发送者昵称· */
    sender_nick: string;
    /** 消息发送时间 */
    sender_time: number;
    /** 操作者昵称 */
    operator_nick: string;
    /** 精华设置时间 */
    operator_time: number;
    /** 消息 ID */
    message_id: number;
    /**
     * 消息内容
     *
     * 此字段被其它实现端实现，原始 cqhttp 中并不存在该字段
     */
    content?: CQCode.CQCodeUnion[];
}

/**
 * 图片 OCR 识别结果
 */
export interface ImageOcrResult {
    /** 识别到的文本数组 */
    texts: TextDetection[];
    /** 识别到的语言 */
    language: string;
}

/**
 * 单个文本检测结果
 */
export interface TextDetection {
    /** 检测到的文本内容 */
    text: string;
    /** 置信度 */
    confidence: number;
    /** 文本在图片中的坐标点数组 */
    coordinates: Coordinate[];
}

/**
 * 坐标点
 */
export interface Coordinate {
    /** 横坐标 */
    x: number;
    /** 纵坐标 */
    y: number;
}

/**
 * 获取群 @全体成员 剩余次数 API 的响应类型
 */
export interface GroupAtAllRemain {
    /** 是否可以 @全体成员 */
    can_at_all: boolean;
    /** 群内所有管理当天剩余 @全体成员 次数 */
    remain_at_all_count_for_group: number;
    /** Bot 当天剩余 @全体成员 次数 */
    remain_at_all_count_for_uin: number;
}

/**
 * 获取群公告
 */
export interface GroupNotice {
    /** 文本内容 */
    text: string;
    /** 图片内容列表 */
    image: NoticeMessageImage[];
}

/**
 * 公告图片信息
 */
export interface NoticeMessageImage {
    /** 图片 ID */
    id: string;
    /** 高度 */
    height: string;
    /** 宽度 */
    width: string;
}

/**
 * 公告结构
 */
export interface Notice {
    /** 公告 ID */
    notice_id: string;
    /** 发送人 QQ 号 */
    sender_id: number;
    /** 发布时间 */
    publish_time: number;
    /** 公告消息内容 */
    message: GroupNotice;
}

/**
 * 获取登录号信息
 */
export interface LoginInfo {
    /** 登录号 QQ 号 */
    user_id: number;
    /** 登录号昵称 */
    nickname: string;
}

/**
 * 好友信息
 */
export interface FriendInfo {
    /** QQ 号 */
    user_id: number;
    /** 昵称 */
    nickname: string;
    /** 备注名 */
    remark: string;
    /** 更多字段 */
    [property: string]: unknown;
}

/**
 * 单向好友信息
 */
export interface UnidirectionalFriendInfo {
    /** QQ 号 */
    user_id: number;
    /** 昵称 */
    nickname: string;
    /** 来源 */
    source: string;
}

/**
 * 当前龙王信息
 */
export interface GroupHonorCurrentTalkative {
    /** QQ 号 */
    user_id: number;
    /** 昵称 */
    nickname: string;
    /** 头像 URL */
    avatar: string;
    /** 持续天数 */
    day_count: number;
}

/**
 * 群荣誉成员信息
 */
export interface GroupHonorItem {
    /** QQ 号 */
    user_id: number;
    /** 昵称 */
    nickname: string;
    /** 头像 URL */
    avatar: string;
    /** 荣誉描述 */
    description: string;
}

/**
 * 群荣誉信息
 */
export interface GroupHonorInfo {
    /** 群号 */
    group_id: number;
    /** 当前龙王 */
    current_talkative?: GroupHonorCurrentTalkative;
    /** 历史龙王列表 */
    talkative_list: GroupHonorItem[];
    /** 群聊之火列表 */
    performer_list: GroupHonorItem[];
    /** 群聊炽焰列表 */
    legend_list: GroupHonorItem[];
    /** 冒尖小春笋列表 */
    strong_newbie_list: GroupHonorItem[];
    /** 快乐之源列表 */
    emotion_list: GroupHonorItem[];
}

/**
 * 群邀请消息
 */
export interface InvitedRequest {
    /** 请求ID */
    request_id: number;
    /** 邀请者 QQ 号 */
    invitor_uin: number;
    /** 邀请者昵称 */
    invitor_nick: string;
    /** 群号 */
    group_id: number;
    /** 群名 */
    group_name: string;
    /** 是否已被处理 */
    checked: boolean;
    /** 处理者，未处理为0 */
    actor: number;
}

/**
 * 进群请求消息
 */
export interface JoinRequest {
    /** 请求ID */
    request_id: number;
    /** 请求者 QQ 号 */
    requester_uin: number;
    /** 请求者昵称 */
    requester_nick: string;
    /** 验证消息 */
    message: string;
    /** 群号 */
    group_id: number;
    /** 群名 */
    group_name: string;
    /** 是否已被处理 */
    checked: boolean;
    /** 处理者，未处理为0 */
    actor: number;
}

/**
 * 群系统消息响应
 */
export interface GroupSystemMsgResponse {
    /** 邀请消息列表 */
    invited_requests: InvitedRequest[] | null;
    /** 进群消息列表 */
    join_requests: JoinRequest[] | null;
}
