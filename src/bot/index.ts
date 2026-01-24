import type { Context } from "koishi";
import { Bot, Schema, type Session, Universal } from "koishi";
import { HttpServer } from "../http";
import { Internal } from "../internal";
import { type MessageEvent } from "../types/event/message";
import { adaptChannel, adaptGuild, convertUser, decodeGuildMember, decodeMessage } from "../utils";
import { WsClient, WsServer } from "../ws";
import { OneBotMessageEncoder, PRIVATE_PFX } from "./message";
export { CQCode } from "./cqcode";

export class OneBot<C extends Context = Context> extends Bot<C> {
    static MessageEncoder = OneBotMessageEncoder;
    static inject = ["http"];

    public parent?: OneBot;
    public internal: Internal;

    constructor(ctx: C, config: OneBot.Config) {
        super(ctx, config, "onebot");
        this.selfId = this.userId = config.selfId;
        this.internal = new Internal(this);
        if (config.protocol === "http") {
            ctx.plugin(HttpServer, this);
        } else if (config.protocol === "ws" && config.responseTimeout) {
            ctx.plugin(WsClient, this);
        } else if (config.protocol === "ws-reverse" && config.responseTimeout && config.path) {
            ctx.plugin(WsServer, this);
        }
    }

    async stop() {
        await super.stop();
    }

    async initialize() {
        await Promise.all([this.getLogin()]).then(
            () => this.online(),
            (error) => this.offline(error)
        );
    }

    async createDirectChannel(userId: string) {
        return {
            id: `${PRIVATE_PFX}${userId}`,
            type: Universal.Channel.Type.DIRECT
        };
    }

    async getMessage(channelId: string, messageId: string) {
        const data = await this.internal.getMsg(Number(messageId));
        return await decodeMessage(this, data);
    }

    async deleteMessage(channelId: string, messageId: string) {
        await this.internal.deleteMsg(Number(messageId));
    }

    async getLogin() {
        const data = await this.internal.getLoginInfo();
        this.user = {
            id: data.user_id.toString(),
            name: data.nickname,
            avatar: `http://q.qlogo.cn/headimg_dl?dst_uin=${data.user_id}&spec=640`,
            isBot: true
        };
        return this.toJSON();
    }

    async getUser(userId: string) {
        const data = await this.internal.getStrangerInfo(Number(userId));
        return convertUser(data, this.selfId === data.user_id.toString());
    }

    async getFriendList() {
        const data = await this.internal.getFriendList();
        return {
            data: data.map((item) => convertUser(item, this.selfId === item.user_id.toString()))
        };
    }

    async handleFriendRequest(messageId: string, approve: boolean, comment?: string) {
        await this.internal.setFriendAddRequest(messageId, approve, comment);
    }

    async handleGuildRequest(messageId: string, approve: boolean, comment?: string) {
        await this.internal.setGroupAddRequest(messageId, "invite", approve, comment);
    }

    async handleGuildMemberRequest(messageId: string, approve: boolean, comment?: string) {
        await this.internal.setGroupAddRequest(messageId, "add", approve, comment);
    }

    async deleteFriend(userId: string) {
        await this.internal.deleteFriend(Number(userId));
    }

    async getMessageList(channelId: string, next?: string, direction: Universal.Direction = "before") {
        if (direction !== "before") throw new Error("Unsupported direction.");
        // include `before` message
        let list: MessageEvent[];
        if (next) {
            const msg = await this.internal.getMsg(Number(next));
            if (msg?.message_seq) {
                list = (await this.internal.getGroupMsgHistory(Number(channelId), msg.message_id)).messages;
            }
        } else {
            list = (await this.internal.getGroupMsgHistory(Number(channelId))).messages;
        }

        // 从旧到新
        return {
            data: await Promise.all(list.map((item) => decodeMessage(this, item)))
        };
    }

    async getChannel(channelId: string) {
        const data = await this.internal.getGroupInfo(Number(channelId));
        return adaptChannel(data);
    }

    async getGuild(guildId: string) {
        const data = await this.internal.getGroupInfo(Number(guildId));
        return adaptGuild(data);
    }

    async getGuildList() {
        const data = await this.internal.getGroupList();
        return { data: data.map(adaptGuild) };
    }

    async getChannelList(guildId: string) {
        return { data: [await this.getChannel(guildId)] };
    }

    async getGuildMember(guildId: string, userId: string) {
        const data = await this.internal.getGroupMemberInfo(Number(guildId), Number(userId));
        return decodeGuildMember(data);
    }

    async getGuildMemberList(guildId: string) {
        const data = await this.internal.getGroupMemberList(Number(guildId));
        return { data: data.map((item) => decodeGuildMember(item)) };
    }

    async kickGuildMember(guildId: string, userId: string, permanent?: boolean) {
        return this.internal.setGroupKick(Number(guildId), Number(userId), permanent);
    }

    async muteGuildMember(guildId: string, userId: string, duration: number) {
        return this.internal.setGroupBan(Number(guildId), Number(userId), Math.round(duration / 1000));
    }

    async muteChannel(channelId: string, guildId?: string, enable?: boolean) {
        return this.internal.setGroupWholeBan(Number(channelId), enable);
    }

    async checkPermission(name: string, session: Partial<Session>) {
        if (name === "onebot.group.admin") {
            return session.author?.roles?.[0] === "admin";
        } else if (name === "onebot.group.owner") {
            return session.author?.roles?.[0] === "owner";
        }
        return super.checkPermission(name, session);
    }
}

export namespace OneBot {
    export interface BaseConfig {
        selfId: string;
        password?: string;
        token?: string;
    }

    export const BaseConfig: Schema<BaseConfig> = Schema.object({
        selfId: Schema.string().description("机器人的账号。").required(),
        token: Schema.string()
            .role("secret")
            .description("发送信息时用于验证的字段，应与 OneBot 配置文件中的 `access_token` 保持一致。"),
        protocol: Schema.union(["http", "ws", "ws-reverse"]).description("选择要使用的协议。").default("ws-reverse")
    });

    export type Config = BaseConfig & (HttpServer.Options | WsServer.Options | WsClient.Options);

    export const Config: Schema<Config> = Schema.intersect([
        BaseConfig,
        Schema.union([HttpServer.Options, WsClient.Options, WsServer.Options])
    ]);
}
