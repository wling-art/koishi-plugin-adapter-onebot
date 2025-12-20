import { Dict } from "koishi";
import { BaseBot, CQCode } from "./bot";

export interface Response {
    status: string;
    retcode: number;
    data: any;
    echo?: number;
}

export interface MessageId {
    message_id: number;
}

export interface AccountInfo {
    user_id: number;
    tiny_id?: string;
    nickname: string;
}

export interface QidianAccountInfo {
    master_id: number;
    ext_name: string;
    create_time: number;
}

export interface StrangerInfo extends AccountInfo {
    sex: "male" | "female" | "unknown";
    age: number;
}

export interface TalkativeMemberInfo extends AccountInfo {
    avatar: string;
    day_count: number;
}

export type GroupRole = "member" | "admin" | "owner";
export type HonorType = "talkative" | "performer" | "legend" | "strong_newbie" | "emotion";

export interface HonoredMemberInfo {
    avatar: string;
    description: string;
}

export interface HonorInfo {
    current_talkative: TalkativeMemberInfo;
    talkative_list: HonoredMemberInfo[];
    performer_list: HonoredMemberInfo[];
    legend_list: HonoredMemberInfo[];
    strong_newbie_list: HonoredMemberInfo[];
    emotion_list: HonoredMemberInfo[];
}

export interface SenderInfo extends StrangerInfo {
    area?: string;
    level?: string;
    title?: string;
    role?: GroupRole;
    card?: string;
}

export interface Message extends MessageId {
    real_id?: number;
    time: number;
    message_seq: number;
    message_type: "private" | "group" | "guild";
    sender: SenderInfo;
    group_id?: number;
    guild_id?: string;
    channel_id?: string;
    message: string | CQCode[];
    anonymous?: AnonymousInfo;
}

export interface AnonymousInfo {
    id: number;
    name: string;
    flag: string;
}

export type RecordFormat = "mp3" | "amr" | "wma" | "m4a" | "spx" | "ogg" | "wav" | "flac";
export type DataDirectory = "image" | "record" | "show" | "bface";

export interface FriendInfo extends AccountInfo {
    remark: string;
}

export interface UnidirectionalFriendInfo extends AccountInfo {
    source: string;
}

export interface GroupBase {
    group_id: number;
    group_name: string;
}

export interface GroupInfo extends GroupBase {
    member_count: number;
    max_member_count: number;
}

export interface GroupMemberInfo extends SenderInfo {
    card_changeable: boolean;
    group_id: number;
    join_time: number;
    last_sent_time: number;
    title_expire_time: number;
    unfriendly: boolean;
}

export interface Credentials {
    cookies: string;
    csrf_token: number;
}

export interface ImageInfo {
    file: string;
}

export interface RecordInfo {
    file: string;
}

export interface VersionInfo {
    app_name?: string;
    app_version?: string;
    app_full_name?: string;
    protocol_version?: string;
    coolq_edition?: "air" | "pro";
    coolq_directory?: string;
    plugin_version?: string;
    plugin_build_number?: number;
    plugin_build_configuration?: "debug" | "release";
    version?: string;
    go_cqhttp?: boolean;
    runtime_version?: string;
    runtime_os?: string;
    protocol?: string;
}

export interface ImageInfo {
    size?: number;
    filename?: string;
    url?: string;
}

export interface ForwardMessage {
    sender: AccountInfo;
    time: number;
    content: string;
}

export interface EssenceMessage extends MessageId {
    sender_id: number;
    sender_nick: string;
    sender_time: number;
    operator_id: number;
    operator_nick: string;
    operator_time: number;
}

export interface VipInfo extends AccountInfo {
    level: number;
    level_speed: number;
    vip_level: number;
    vip_growth_speed: number;
    vip_growth_total: string;
}

export interface GroupNotice {
    notice_id: string;
    sender_id: number;
    publish_time: number;
    message: {
        text: string;
        images: GroupNoticeImage[];
    };
}

export interface GroupNoticeImage {
    height: string;
    width: string;
    id: string;
}

export interface Statistics {
    packet_received: number;
    packet_sent: number;
    packet_lost: number;
    message_received: number;
    message_sent: number;
    disconnect_times: number;
    lost_times: number;
}

export interface StatusInfo {
    app_initialized: boolean;
    app_enabled: boolean;
    plugins_good: boolean;
    app_good: boolean;
    online: boolean;
    good: boolean;
    stat: Statistics;
}

export interface TextDetection {
    text: string;
    confidence: string;
    coordinates: any;
}

export interface OcrResult {
    language: string;
    texts: TextDetection[];
}

export interface GroupRequest extends GroupBase {
    request_id: number;
    invitor_uin: number;
    invitor_nick: string;
    checked: boolean;
    actor: number;
}

export interface InvitedRequest extends GroupRequest {}

export interface JoinRequest extends GroupRequest {
    message: string;
}

export interface GroupSystemMessageInfo {
    invited_qequests: InvitedRequest[];
    join_requests: JoinRequest[];
}

export interface GroupFileSystemInfo {
    file_count: number;
    limit_count: number;
    used_space: number;
    total_space: number;
}

export interface GroupFile {
    file_id: string;
    file_name: string;
    busid: number;
    file_size: number;
    upload_time: number;
    dead_time: number;
    modify_time: number;
    download_time: number;
    uploader: number;
    uploader_name: string;
}

export interface GroupFolder {
    folder_id: string;
    folder_name: string;
    create_time: number;
    creator: number;
    creator_name: string;
    total_file_count: number;
}

export interface GroupFileList {
    files: GroupFile[];
    folders: GroupFolder[];
}

export interface AtAllRemain {
    can_at_all: boolean;
    remain_at_all_count_for_group: number;
    remain_at_all_count_for_uin: number;
}

export interface Device {
    app_id: number;
    device_name: string;
    device_kind: string;
}

export interface ModelVariant {
    model_show: string;
    need_pay: boolean;
}

export enum SafetyLevel {
    safe,
    unknown,
    danger
}

export interface GuildServiceProfile {
    nickname: string;
    tiny_id: string;
    avatar_url: string;
}

export interface GuildBaseInfo {
    guild_id: string;
    guild_name: string;
}

export interface GuildInfo extends GuildBaseInfo {
    guild_display_id: string;
}

export interface GuildMeta extends GuildBaseInfo {
    guild_profile: string;
    create_time: number;
    max_member_count: number;
    max_robot_count: number;
    max_admin_count: number;
    member_count: number;
    owner_id: string;
}

export interface ChannelInfo {
    owner_guild_id: string;
    channel_id: string;
    channel_type: number;
    channel_name: string;
    create_time: number;
    creator_id: string;
    creator_tiny_id: string;
    talk_permission: number;
    visible_type: number;
    current_slow_mode: number;
    slow_modes: SlowModeInfo[];
}

export interface SlowModeInfo {
    slow_mode_key: number;
    slow_mode_text: string;
    speak_frequency: number;
    slow_mode_circle: number;
}

export interface GuildMemberListData {
    members: GuildMemberInfo[];
    finished: boolean;
    next_token: string;
}

export interface GuildMemberRole {
    role_id: string;
    role_name: string;
}

export interface GuildMemberInfo extends GuildMemberRole {
    tiny_id: string;
    title: string;
    nickname: string;
    role: number;
}

export interface GuildMemberProfile {
    tiny_id: string;
    nickname: string;
    avatar_url: string;
    join_time: number;
    roles: GuildMemberRole[];
}

export interface ReactionInfo {
    emoji_id: string;
    emoji_index: number;
    emoji_type: number;
    emoji_name: string;
    count: number;
    clicked: boolean;
}

export interface Payload extends Message {
    time: number;
    self_id: number;
    self_tiny_id?: string;
    post_type: string;
    request_type: string;
    notice_type: string;
    meta_event_type: string;
    honor_type: string;
    sub_type: string;
    message_id: number;
    user_id: number;
    target_id: number;
    operator_id: number;
    raw_message: string;
    font: number;
    comment: string;
    flag: string;
    old_info: ChannelInfo;
    new_info: ChannelInfo;
    channel_info: ChannelInfo;
    current_reactions: ReactionInfo[];
    file: File;
}

export interface File {
    name: string;
    size: number;
    url: string;
}

type id = string | number;

export class TimeoutError extends Error {
    constructor(args: Dict, url: string) {
        super(`Timeout with request ${url}, args: ${JSON.stringify(args)}`);
        Object.defineProperties(this, {
            args: { value: args },
            url: { value: url }
        });
    }
}

class SenderError extends Error {
    constructor(args: Dict, url: string, retcode: number) {
        super(`Error with request ${url}, args: ${JSON.stringify(args)}, retcode: ${retcode}`);
        Object.defineProperties(this, {
            code: { value: retcode },
            args: { value: args },
            url: { value: url }
        });
    }
}

export class Internal {
    _request?(action: string, params: Dict): Promise<Response>;

    constructor(public readonly bot: BaseBot) {}

    private async _get<T = any>(action: string, params = {}): Promise<T> {
        this.bot.logger.debug("[request] %s %o", action, params);
        const response = await this._request(action, params);
        this.bot.logger.debug("[response] %o", response);
        const { data, retcode } = response;
        if (retcode === 0) return data;
        throw new SenderError(params, action, retcode);
    }

    async setGroupAnonymousBan(group_id: string, meta: string | object, duration?: number) {
        const args = { group_id, duration };
        args[typeof meta === "string" ? "flag" : "anonymous"] = meta;
        await this._get("set_group_anonymous_ban", args);
    }

    async setGroupAnonymousBanAsync(group_id: string, meta: string | object, duration?: number) {
        const args = { group_id, duration };
        args[typeof meta === "string" ? "flag" : "anonymous"] = meta;
        await this._get("set_group_anonymous_ban_async", args);
    }

    // Messages
    async sendPrivateMsg(user_id: id, message: string | readonly CQCode[], auto_escape?: boolean): Promise<number> {
        const data = await this._get("send_private_msg", { user_id, message, auto_escape });
        return data.message_id;
    }

    async sendPrivateMsgAsync(user_id: id, message: string | readonly CQCode[], auto_escape?: boolean): Promise<void> {
        await this._get("send_private_msg_async", { user_id, message, auto_escape });
    }

    async sendGroupMsg(group_id: id, message: string | readonly CQCode[], auto_escape?: boolean): Promise<number> {
        const data = await this._get("send_group_msg", { group_id, message, auto_escape });
        return data.message_id;
    }

    async sendGroupMsgAsync(group_id: id, message: string | readonly CQCode[], auto_escape?: boolean): Promise<void> {
        await this._get("send_group_msg_async", { group_id, message, auto_escape });
    }

    async sendGroupForwardMsg(group_id: id, messages: readonly CQCode[]): Promise<number> {
        const data = await this._get("send_group_forward_msg", { group_id, messages });
        return data.message_id;
    }

    async sendGroupForwardMsgAsync(group_id: id, messages: readonly CQCode[]): Promise<void> {
        await this._get("send_group_forward_msg_async", { group_id, messages });
    }

    async sendPrivateForwardMsg(user_id: id, messages: readonly CQCode[]): Promise<number> {
        const data = await this._get("send_private_forward_msg", { user_id, messages });
        return data.message_id;
    }

    async sendPrivateForwardMsgAsync(user_id: id, messages: readonly CQCode[]): Promise<void> {
        await this._get("send_private_forward_msg_async", { user_id, messages });
    }

    async deleteMsg(message_id: id): Promise<void> {
        await this._get("delete_msg", { message_id });
    }

    async deleteMsgAsync(message_id: id): Promise<void> {
        await this._get("delete_msg_async", { message_id });
    }

    async setEssenceMsg(message_id: id): Promise<void> {
        await this._get("set_essence_msg", { message_id });
    }

    async setEssenceMsgAsync(message_id: id): Promise<void> {
        await this._get("set_essence_msg_async", { message_id });
    }

    async deleteEssenceMsg(message_id: id): Promise<void> {
        await this._get("delete_essence_msg", { message_id });
    }

    async deleteEssenceMsgAsync(message_id: id): Promise<void> {
        await this._get("delete_essence_msg_async", { message_id });
    }

    async markMsgAsRead(message_id: id): Promise<void> {
        await this._get("mark_msg_as_read", { message_id });
    }

    async sendLike(user_id: id, times?: number): Promise<void> {
        await this._get("send_like", { user_id, times });
    }

    async sendLikeAsync(user_id: id, times?: number): Promise<void> {
        await this._get("send_like_async", { user_id, times });
    }

    async sendGroupSign(group_id: id): Promise<void> {
        await this._get("send_group_sign", { group_id });
    }

    async sendGroupSignAsync(group_id: id): Promise<void> {
        await this._get("send_group_sign_async", { group_id });
    }

    async getMsg(message_id: id): Promise<Message> {
        return await this._get("get_msg", { message_id });
    }

    async getForwardMsg(message_id: id): Promise<ForwardMessage[]> {
        const data = await this._get("get_forward_msg", { message_id });
        return data.messages;
    }

    async getEssenceMsgList(group_id: id): Promise<EssenceMessage[]> {
        return await this._get("get_essence_msg_list", { group_id });
    }

    async getWordSlices(content: string): Promise<string[]> {
        const data = await this._get(".get_word_slices", { content });
        return data.slices;
    }

    async ocrImage(image: string): Promise<OcrResult> {
        return await this._get("ocr_image", { image });
    }

    async getGroupMsgHistory(group_id: id, message_seq?: number): Promise<{ messages: Message[] }> {
        return await this._get("get_group_msg_history", { group_id, message_seq });
    }

    async deleteFriend(user_id: id): Promise<void> {
        await this._get("delete_friend", { user_id });
    }

    async deleteFriendAsync(user_id: id): Promise<void> {
        await this._get("delete_friend_async", { user_id });
    }

    async deleteUnidirectionalFriend(user_id: id): Promise<void> {
        await this._get("delete_unidirectional_friend", { user_id });
    }

    async deleteUnidirectionalFriendAsync(user_id: id): Promise<void> {
        await this._get("delete_unidirectional_friend_async", { user_id });
    }

    async setFriendAddRequest(flag: string, approve: boolean, remark?: string): Promise<void> {
        await this._get("set_friend_add_request", { flag, approve, remark });
    }

    async setFriendAddRequestAsync(flag: string, approve: boolean, remark?: string): Promise<void> {
        await this._get("set_friend_add_request_async", { flag, approve, remark });
    }

    async setGroupAddRequest(
        flag: string,
        subType: "add" | "invite",
        approve: boolean,
        reason?: string
    ): Promise<void> {
        await this._get("set_group_add_request", { flag, sub_type: subType, approve, reason });
    }

    async setGroupAddRequestAsync(
        flag: string,
        subType: "add" | "invite",
        approve: boolean,
        reason?: string
    ): Promise<void> {
        await this._get("set_group_add_request_async", { flag, sub_type: subType, approve, reason });
    }

    // Group operations
    async setGroupKick(group_id: id, user_id: id, reject_add_request?: boolean): Promise<void> {
        await this._get("set_group_kick", { group_id, user_id, reject_add_request });
    }

    async setGroupKickAsync(group_id: id, user_id: id, reject_add_request?: boolean): Promise<void> {
        await this._get("set_group_kick_async", { group_id, user_id, reject_add_request });
    }

    async setGroupBan(group_id: id, user_id: id, duration?: number): Promise<void> {
        await this._get("set_group_ban", { group_id, user_id, duration });
    }

    async setGroupBanAsync(group_id: id, user_id: id, duration?: number): Promise<void> {
        await this._get("set_group_ban_async", { group_id, user_id, duration });
    }

    async setGroupWholeBan(group_id: id, enable?: boolean): Promise<void> {
        await this._get("set_group_whole_ban", { group_id, enable });
    }

    async setGroupWholeBanAsync(group_id: id, enable?: boolean): Promise<void> {
        await this._get("set_group_whole_ban_async", { group_id, enable });
    }

    async setGroupAdmin(group_id: id, user_id: id, enable?: boolean): Promise<void> {
        await this._get("set_group_admin", { group_id, user_id, enable });
    }

    async setGroupAdminAsync(group_id: id, user_id: id, enable?: boolean): Promise<void> {
        await this._get("set_group_admin_async", { group_id, user_id, enable });
    }

    async setGroupAnonymous(group_id: id, enable?: boolean): Promise<void> {
        await this._get("set_group_anonymous", { group_id, enable });
    }

    async setGroupAnonymousAsync(group_id: id, enable?: boolean): Promise<void> {
        await this._get("set_group_anonymous_async", { group_id, enable });
    }

    async setGroupCard(group_id: id, user_id: id, card?: string): Promise<void> {
        await this._get("set_group_card", { group_id, user_id, card });
    }

    async setGroupCardAsync(group_id: id, user_id: id, card?: string): Promise<void> {
        await this._get("set_group_card_async", { group_id, user_id, card });
    }

    async setGroupLeave(group_id: id, is_dismiss?: boolean): Promise<void> {
        await this._get("set_group_leave", { group_id, is_dismiss });
    }

    async setGroupLeaveAsync(group_id: id, is_dismiss?: boolean): Promise<void> {
        await this._get("set_group_leave_async", { group_id, is_dismiss });
    }

    async setGroupSpecialTitle(group_id: id, user_id: id, special_title?: string, duration?: number): Promise<void> {
        await this._get("set_group_special_title", { group_id, user_id, special_title, duration });
    }

    async setGroupSpecialTitleAsync(
        group_id: id,
        user_id: id,
        special_title?: string,
        duration?: number
    ): Promise<void> {
        await this._get("set_group_special_title_async", { group_id, user_id, special_title, duration });
    }

    async setGroupName(group_id: id, name: string): Promise<void> {
        await this._get("set_group_name", { group_id, group_name: name });
    }

    async setGroupNameAsync(group_id: id, name: string): Promise<void> {
        await this._get("set_group_name_async", { group_id, group_name: name });
    }

    async setGroupPortrait(group_id: id, file: string, cache?: boolean): Promise<void> {
        await this._get("set_group_portrait", { group_id, file, cache });
    }

    async setGroupPortraitAsync(group_id: id, file: string, cache?: boolean): Promise<void> {
        await this._get("set_group_portrait_async", { group_id, file, cache });
    }

    async getGroupAtAllRemain(group_id: id): Promise<AtAllRemain> {
        return await this._get("get_group_at_all_remain", { group_id });
    }

    async sendGroupNotice(
        group_id: id,
        content: string,
        image?: string,
        pinned?: id,
        confirm_required?: id
    ): Promise<void> {
        await this._get("_send_group_notice", { group_id, content, image, pinned, confirm_required });
    }

    async sendGroupNoticeAsync(
        group_id: id,
        content: string,
        image?: string,
        pinned?: id,
        confirm_required?: id
    ): Promise<void> {
        await this._get("_send_group_notice_async", { group_id, content, image, pinned, confirm_required });
    }

    async getGroupNotice(group_id: id): Promise<GroupNotice[]> {
        return await this._get("_get_group_notice", { group_id });
    }

    async delGroupNotice(group_id: id, notice_id: id): Promise<void> {
        await this._get("_del_group_notice", { group_id, notice_id });
    }

    // Accounts
    async getLoginInfo(): Promise<AccountInfo> {
        return await this._get("get_login_info");
    }

    async qidianGetLoginInfo(): Promise<QidianAccountInfo> {
        return await this._get("qidian_get_login_info");
    }

    async setQqProfile(
        nickname: string,
        company: string,
        email: string,
        college: string,
        personal_note: string
    ): Promise<void> {
        await this._get("set_qq_profile", { nickname, company, email, college, personal_note });
    }

    async setQqProfileAsync(
        nickname: string,
        company: string,
        email: string,
        college: string,
        personal_note: string
    ): Promise<void> {
        await this._get("set_qq_profile_async", { nickname, company, email, college, personal_note });
    }

    async setQqAvatar(file: string): Promise<void> {
        await this._get("set_qq_avatar", { file });
    }

    async setOnlineStatus(status: string, extStatus: string, batteryStatus: string): Promise<void> {
        await this._get("set_online_status", { status, ext_status: extStatus, battery_status: batteryStatus });
    }

    async getVipInfo(): Promise<VipInfo> {
        return await this._get("_get_vip_info");
    }

    async getStrangerInfo(user_id: id, no_cache?: boolean): Promise<StrangerInfo> {
        return await this._get("get_stranger_info", { user_id, no_cache });
    }

    async getFriendList(): Promise<FriendInfo[]> {
        return await this._get("get_friend_list");
    }

    async getUnidirectionalFriendList(): Promise<UnidirectionalFriendInfo[]> {
        return await this._get("get_unidirectional_friend_list");
    }

    async getGroupInfo(group_id: id, no_cache?: boolean): Promise<GroupInfo> {
        return await this._get("get_group_info", { group_id, no_cache });
    }

    async getGroupList(no_cache?: boolean): Promise<GroupInfo[]> {
        return await this._get("get_group_list", { no_cache });
    }

    async getGroupMemberInfo(group_id: id, user_id: id, no_cache?: boolean): Promise<GroupMemberInfo> {
        return await this._get("get_group_member_info", { group_id, user_id, no_cache });
    }

    async getGroupMemberList(group_id: id, no_cache?: boolean): Promise<GroupMemberInfo[]> {
        return await this._get("get_group_member_list", { group_id, no_cache });
    }

    async getGroupHonorInfo(group_id: id, type: HonorType): Promise<HonorInfo> {
        return await this._get("get_group_honor_info", { group_id, type });
    }

    async getGroupSystemMsg(): Promise<GroupSystemMessageInfo> {
        return await this._get("get_group_system_msg");
    }

    // Files
    async getGroupFileSystemInfo(group_id: id): Promise<GroupFileSystemInfo> {
        return await this._get("get_group_file_system_info", { group_id });
    }

    async getGroupRootFiles(group_id: id): Promise<GroupFileList> {
        return await this._get("get_group_root_files", { group_id });
    }

    async getGroupFilesByFolder(group_id: id, folder_id: string): Promise<GroupFileList> {
        return await this._get("get_group_files_by_folder", { group_id, folder_id });
    }

    async getGroupFileUrl(group_id: id, file_id: string, busid: number): Promise<string> {
        const data = await this._get("get_group_file_url", { group_id, file_id, busid });
        return data.url;
    }

    async downloadFile(url: string, headers?: string | readonly string[], thread_count?: number): Promise<string> {
        const data = await this._get("download_file", { url, headers, thread_count });
        return data.file;
    }

    async uploadPrivateFile(user_id: id, file: string, name: string): Promise<void> {
        await this._get("upload_private_file", { user_id, file, name });
    }

    async uploadGroupFile(group_id: id, file: string, name: string, folder?: string): Promise<void> {
        await this._get("upload_group_file", { group_id, file, name, folder });
    }

    async createGroupFileFolder(group_id: id, folder_id: string, name: string): Promise<void> {
        await this._get("create_group_file_folder", { group_id, folder_id, name });
    }

    async deleteGroupFolder(group_id: id, folder_id: string): Promise<void> {
        await this._get("delete_group_folder", { group_id, folder_id });
    }

    async deleteGroupFile(group_id: id, folder_id: string, file_id: string, busid: number): Promise<void> {
        await this._get("delete_group_file", { group_id, folder_id, file_id, busid });
    }

    async getOnlineClients(no_cache?: boolean): Promise<Device[]> {
        const data = await this._get("get_online_clients", { no_cache });
        return data.clients;
    }

    async checkUrlSafely(url: string): Promise<SafetyLevel> {
        const data = await this._get("check_url_safely", { url });
        return data.level;
    }

    async getModelShow(model: string): Promise<ModelVariant[]> {
        const data = await this._get("_get_model_show", { model });
        return data.variants;
    }

    async setModelShow(model: string, model_show: string): Promise<void> {
        await this._get("_set_model_show", { model, model_show });
    }

    async getCookies(domain?: string): Promise<string> {
        const data = await this._get("get_cookies", { domain });
        return data.cookies;
    }

    async getCsrfToken(): Promise<number> {
        const data = await this._get("get_csrf_token");
        return data.token;
    }

    async getCredentials(domain?: string): Promise<Credentials> {
        return await this._get("get_credentials", { domain });
    }

    async getRecord(file: string, out_format: RecordFormat, full_path?: boolean): Promise<RecordInfo> {
        return await this._get("get_record", { file, out_format, full_path });
    }

    async getImage(file: string): Promise<ImageInfo> {
        return await this._get("get_image", { file });
    }

    async canSendImage(): Promise<boolean> {
        const data = await this._get("can_send_image");
        return data.yes;
    }

    async canSendRecord(): Promise<boolean> {
        const data = await this._get("can_send_record");
        return data.yes;
    }

    async getStatus(): Promise<StatusInfo> {
        return await this._get("get_status");
    }

    async getVersionInfo(): Promise<VersionInfo> {
        return await this._get("get_version_info");
    }

    async setRestart(delay?: number): Promise<void> {
        await this._get("set_restart", { delay });
    }

    async reloadEventFilter(): Promise<void> {
        await this._get("reload_event_filter");
    }

    async cleanCache(): Promise<void> {
        await this._get("clean_cache");
    }

    // Guild
    async getGuildServiceProfile(): Promise<GuildServiceProfile> {
        return await this._get("get_guild_service_profile");
    }

    async getGuildList(): Promise<GuildInfo[]> {
        return await this._get("get_guild_list");
    }

    async getGuildMetaByGuest(guild_id: id): Promise<GuildMeta> {
        return await this._get("get_guild_meta_by_guest", { guild_id });
    }

    async getGuildChannelList(guild_id: id, no_cache: boolean): Promise<ChannelInfo[]> {
        return await this._get("get_guild_channel_list", { guild_id, no_cache });
    }

    async getGuildMemberList(guild_id: id, next_token?: string): Promise<GuildMemberListData> {
        return await this._get("get_guild_member_list", { guild_id, next_token });
    }

    async getGuildMemberProfile(guild_id: id, user_id: id): Promise<GuildMemberProfile> {
        return await this._get("get_guild_member_profile", { guild_id, user_id });
    }

    async sendGuildChannelMsg(guild_id: id, channel_id: id, message: string | readonly CQCode[]): Promise<number> {
        const data = await this._get("send_guild_channel_msg", { guild_id, channel_id, message });
        return data.message_id;
    }

    // Lagrange specific
    async uploadImage(file: string): Promise<string> {
        return await this._get("upload_image", { file });
    }

    async getPrivateFileUrl(user_id: id, file_id: string, file_hash?: string): Promise<string> {
        const data = await this._get("get_private_file_url", { user_id, file_id, file_hash });
        return data.url;
    }

    async moveGroupFile(
        group_id: id,
        file_id: string,
        parent_directory: string,
        target_directory: string
    ): Promise<void> {
        await this._get("move_group_file", { group_id, file_id, parent_directory, target_directory });
    }

    async deleteGroupFileFolder(group_id: id, folder_id: string): Promise<void> {
        await this._get("delete_group_file_folder", { group_id, folder_id });
    }

    async renameGroupFileFolder(group_id: id, folder_id: string, new_folder_name: string): Promise<void> {
        await this._get("rename_group_file_folder", { group_id, folder_id, new_folder_name });
    }
}
