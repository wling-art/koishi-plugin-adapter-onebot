import { type Dict } from "koishi";
import type { OneBot } from "./bot";
import type { CQCode } from "./bot/cqcode";
import type {
    EssenceMessage,
    FriendInfo,
    GetCredentialsResponse,
    GroupAtAllRemain,
    GroupFileList,
    GroupFileSystemInfo,
    GroupHonorInfo,
    GroupNotice,
    GroupSystemMsgResponse,
    ImageOcrResult,
    LoginInfo,
    ModelVariant,
    UnidirectionalFriendInfo
} from "./types";
import type { Device } from "./types/device";
import type { HonorType, SafetyLevel } from "./types/enum";
import type { GroupMessageEvent, MessageEvent } from "./types/event/message";
import type { GroupInfo, GroupMemberInfo } from "./types/group";
import { SenderError } from "./types/sender";
import type { UserInfo } from "./types/user";

export class Internal {
    _request?: (action: string, params: Dict) => Promise<any>;
    constructor(public readonly bot: OneBot) {}

    private async _get(action: string, params = {}): Promise<any> {
        this.bot.logger.debug("[request] %s %o", action, params);
        if (!this._request) {
            throw new Error("适配器未连接");
        }
        const response = await this._request(action, params);
        this.bot.logger.debug("[response] %o", response);
        const { data, retcode } = response;
        if (response.status === "failed" || retcode !== 0) {
            throw new SenderError(params, action, retcode);
        }
        return data;
    }
    // Messages
    async sendPrivateMsg(
        user_id: number,
        message: string | readonly CQCode.CQCodeUnion[],
        auto_escape?: boolean
    ): Promise<number> {
        const data = await this._get("send_private_msg", {
            user_id,
            message,
            auto_escape
        });
        return data.message_id;
    }

    async sendGroupMsg(
        group_id: number,
        message: string | readonly CQCode.CQCodeUnion[],
        auto_escape?: boolean
    ): Promise<number> {
        const data = await this._get("send_group_msg", {
            group_id,
            message,
            auto_escape
        });
        return data.message_id;
    }

    async sendGroupForwardMsg(
        group_id: number,
        messages: readonly CQCode.MergeForward[] | CQCode.Forward
    ): Promise<number> {
        const data = await this._get("send_group_forward_msg", {
            group_id,
            messages
        });
        return data.message_id;
    }

    async sendPrivateForwardMsg(
        user_id: number,
        messages: readonly CQCode.MergeForward[] | CQCode.Forward
    ): Promise<number> {
        const data = await this._get("send_private_forward_msg", {
            user_id,
            messages
        });
        return data.message_id;
    }

    async deleteMsg(message_id: number): Promise<void> {
        await this._get("delete_msg", { message_id });
    }

    async setEssenceMsg(message_id: number): Promise<void> {
        await this._get("set_essence_msg", { message_id });
    }

    async deleteEssenceMsg(message_id: number): Promise<void> {
        await this._get("delete_essence_msg", { message_id });
    }

    async markMsgAsRead(message_id: number): Promise<void> {
        await this._get("mark_msg_as_read", { message_id });
    }

    async sendLike(user_id: number, times?: number): Promise<void> {
        await this._get("send_like", { user_id, times });
    }

    async sendGroupSign(group_id: number): Promise<void> {
        await this._get("send_group_sign", { group_id });
    }

    async getMsg(message_id: number): Promise<MessageEvent> {
        return await this._get("get_msg", { message_id });
    }

    async getForwardMsg(message_id: number): Promise<CQCode.MergeForward> {
        const data = await this._get("get_forward_msg", { message_id });
        return data.messages;
    }

    async getEssenceMsgList(group_id: number): Promise<EssenceMessage[]> {
        return await this._get("get_essence_msg_list", { group_id });
    }

    async getWordSlices(content: string): Promise<string[]> {
        const data = await this._get(".get_word_slices", { content });
        return data.slices;
    }

    async ocrImage(image: string): Promise<ImageOcrResult> {
        return await this._get("ocr_image", { image });
    }

    async getGroupMsgHistory(group_id: number, message_seq?: number): Promise<{ messages: GroupMessageEvent[] }> {
        return await this._get("get_group_msg_history", {
            group_id,
            message_seq
        });
    }

    async deleteFriend(user_id: number): Promise<void> {
        await this._get("delete_friend", { user_id });
    }

    async deleteUnidirectionalFriend(user_id: number): Promise<void> {
        await this._get("delete_unidirectional_friend", { user_id });
    }

    async setFriendAddRequest(flag: string, approve: boolean, remark?: string): Promise<void> {
        await this._get("set_friend_add_request", { flag, approve, remark });
    }

    async setGroupAddRequest(
        flag: string,
        subType: "add" | "invite",
        approve: boolean,
        reason?: string
    ): Promise<void> {
        await this._get("set_group_add_request", {
            flag,
            sub_type: subType,
            approve,
            reason
        });
    }

    // Group operations
    async setGroupKick(group_id: number, user_id: number, reject_add_request?: boolean): Promise<void> {
        await this._get("set_group_kick", {
            group_id,
            user_id,
            reject_add_request
        });
    }

    async setGroupBan(group_id: number, user_id: number, duration?: number): Promise<void> {
        await this._get("set_group_ban", { group_id, user_id, duration });
    }

    async setGroupWholeBan(group_id: number, enable?: boolean): Promise<void> {
        await this._get("set_group_whole_ban", { group_id, enable });
    }

    async setGroupAdmin(group_id: number, user_id: number, enable?: boolean): Promise<void> {
        await this._get("set_group_admin", { group_id, user_id, enable });
    }

    async setGroupAnonymous(group_id: number, enable?: boolean): Promise<void> {
        await this._get("set_group_anonymous", { group_id, enable });
    }

    async setGroupCard(group_id: number, user_id: number, card?: string): Promise<void> {
        await this._get("set_group_card", { group_id, user_id, card });
    }

    async setGroupLeave(group_id: number, is_dismiss?: boolean): Promise<void> {
        await this._get("set_group_leave", { group_id, is_dismiss });
    }

    async setGroupSpecialTitle(
        group_id: number,
        user_id: number,
        special_title?: string,
        duration?: number
    ): Promise<void> {
        await this._get("set_group_special_title", {
            group_id,
            user_id,
            special_title,
            duration
        });
    }

    async setGroupName(group_id: number, name: string): Promise<void> {
        await this._get("set_group_name", { group_id, group_name: name });
    }

    async setGroupPortrait(group_id: number, file: string, cache?: boolean): Promise<void> {
        await this._get("set_group_portrait", { group_id, file, cache });
    }

    async getGroupAtAllRemain(group_id: number): Promise<GroupAtAllRemain> {
        return await this._get("get_group_at_all_remain", { group_id });
    }

    async sendGroupNotice(
        group_id: number,
        content: string,
        image?: string,
        pinned?: number,
        confirm_required?: number
    ): Promise<void> {
        await this._get("_send_group_notice", {
            group_id,
            content,
            image,
            pinned,
            confirm_required
        });
    }

    async getGroupNotice(group_id: number): Promise<GroupNotice[]> {
        return await this._get("_get_group_notice", { group_id });
    }

    async delGroupNotice(group_id: number, notice_id: number): Promise<void> {
        await this._get("_del_group_notice", { group_id, notice_id });
    }

    // Accounts
    async getLoginInfo(): Promise<LoginInfo> {
        return await this._get("get_login_info");
    }

    async setQqProfile(
        nickname: string,
        company: string,
        email: string,
        college: string,
        personal_note: string
    ): Promise<void> {
        await this._get("set_qq_profile", {
            nickname,
            company,
            email,
            college,
            personal_note
        });
    }

    async setQqAvatar(file: string): Promise<void> {
        await this._get("set_qq_avatar", { file });
    }

    async setOnlineStatus(status: string, extStatus: string, batteryStatus: string): Promise<void> {
        await this._get("set_online_status", {
            status,
            ext_status: extStatus,
            battery_status: batteryStatus
        });
    }

    async getStrangerInfo(user_id: number, no_cache?: boolean): Promise<UserInfo> {
        return await this._get("get_stranger_info", { user_id, no_cache });
    }

    async getFriendList(): Promise<FriendInfo[]> {
        return await this._get("get_friend_list");
    }

    async getUnidirectionalFriendList(): Promise<UnidirectionalFriendInfo[]> {
        return await this._get("get_unidirectional_friend_list");
    }

    async getGroupInfo(group_id: number, no_cache?: boolean): Promise<GroupInfo> {
        return await this._get("get_group_info", { group_id, no_cache });
    }

    async getGroupList(no_cache?: boolean): Promise<GroupInfo[]> {
        return await this._get("get_group_list", { no_cache });
    }

    async getGroupMemberInfo(group_id: number, user_id: number, no_cache?: boolean): Promise<GroupMemberInfo> {
        return await this._get("get_group_member_info", {
            group_id,
            user_id,
            no_cache
        });
    }

    async getGroupMemberList(group_id: number, no_cache?: boolean): Promise<GroupMemberInfo[]> {
        return await this._get("get_group_member_list", { group_id, no_cache });
    }

    async getGroupHonorInfo(group_id: number, type: HonorType | "all"): Promise<GroupHonorInfo> {
        return await this._get("get_group_honor_info", { group_id, type });
    }

    async getGroupSystemMsg(): Promise<GroupSystemMsgResponse> {
        return await this._get("get_group_system_msg");
    }

    // Files
    async getGroupFileSystemInfo(group_id: number): Promise<GroupFileSystemInfo> {
        return await this._get("get_group_file_system_info", { group_id });
    }

    async getGroupRootFiles(group_id: number): Promise<GroupFileList> {
        return await this._get("get_group_root_files", { group_id });
    }

    async getGroupFilesByFolder(group_id: number, folder_id: string): Promise<GroupFileList> {
        return await this._get("get_group_files_by_folder", {
            group_id,
            folder_id
        });
    }

    async getGroupFileUrl(group_id: number, file_id: string, busid: number): Promise<string> {
        const data = await this._get("get_group_file_url", {
            group_id,
            file_id,
            busid
        });
        return data.url;
    }

    async downloadFile(url: string, headers?: string | readonly string[], thread_count?: number): Promise<string> {
        const data = await this._get("download_file", {
            url,
            headers,
            thread_count
        });
        return data.file;
    }

    async uploadPrivateFile(user_id: number, file: string, name: string): Promise<void> {
        await this._get("upload_private_file", { user_id, file, name });
    }

    async uploadGroupFile(group_id: number, file: string, name: string, folder?: string): Promise<void> {
        await this._get("upload_group_file", { group_id, file, name, folder });
    }

    async createGroupFileFolder(group_id: number, folder_id: string, name: string): Promise<void> {
        await this._get("create_group_file_folder", {
            group_id,
            folder_id,
            name
        });
    }

    async deleteGroupFolder(group_id: number, folder_id: string): Promise<void> {
        await this._get("delete_group_folder", { group_id, folder_id });
    }

    async deleteGroupFile(group_id: number, folder_id: string, file_id: string, busid: number): Promise<void> {
        await this._get("delete_group_file", {
            group_id,
            folder_id,
            file_id,
            busid
        });
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

    async getCredentials(domain?: string): Promise<GetCredentialsResponse> {
        return await this._get("get_credentials", { domain });
    }

    async getRecord(
        file: string,
        out_format: string,
        full_path?: boolean
    ): Promise<{
        /** 转换后的语音文件路径 */
        file: string;
    }> {
        return await this._get("get_record", { file, out_format, full_path });
    }

    async getImage(file: string): Promise<{
        /** 图片源文件大小 */
        size: number;
        /** 图片文件原名 */
        filename: string;
        /** 图片下载地址 */
        url: string;
    }> {
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

    async getStatus(): Promise<Dict<string>> {
        return await this._get("get_status");
    }

    async getVersionInfo(): Promise<Dict<string>> {
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

    // Lagrange specific
    async uploadImage(file: string): Promise<string> {
        return await this._get("upload_image", { file });
    }

    async getPrivateFileUrl(user_id: number, file_id: string, file_hash?: string): Promise<string> {
        const data = await this._get("get_private_file_url", {
            user_id,
            file_id,
            file_hash
        });
        return data.url;
    }

    async moveGroupFile(
        group_id: number,
        file_id: string,
        parent_directory: string,
        target_directory: string
    ): Promise<void> {
        await this._get("move_group_file", {
            group_id,
            file_id,
            parent_directory,
            target_directory
        });
    }

    async deleteGroupFileFolder(group_id: number, folder_id: string): Promise<void> {
        await this._get("delete_group_file_folder", { group_id, folder_id });
    }

    async renameGroupFileFolder(group_id: number, folder_id: string, new_folder_name: string): Promise<void> {
        await this._get("rename_group_file_folder", {
            group_id,
            folder_id,
            new_folder_name
        });
    }
}
