import {} from "@koishijs/plugin-server";
import { createHmac } from "crypto";
import { Adapter, Context, HTTP, Schema, Universal } from "koishi";
import { OneBotBot } from "./bot";
import { dispatchSession, Payload } from "./utils";

export class HttpServer<C extends Context = Context> extends Adapter<C, OneBotBot<C>> {
    static inject = ["server"];

    declare bots: OneBotBot<C>[];

    async fork(ctx: C, bot: OneBotBot<C, OneBotBot.Config & HttpServer.Options>) {
        super.fork(ctx, bot);
        const config = bot.config;
        const { endpoint, token } = config;
        if (!endpoint) return;

        const http = ctx.http.extend({
            ...config,
            headers: {
                Authorization: `Token ${token}`
            }
        });

        bot.internal._request = async (action, params) => {
            return http.post("/" + action, params);
        };

        return bot.initialize();
    }

    async connect(bot: OneBotBot<C, OneBotBot.Config & HttpServer.Options>) {
        const { secret, path = "/onebot" } = bot.config;
        this.ctx.server.post(path, (ctx) => {
            if (secret) {
                // no signature
                const signature = ctx.headers["x-signature"];
                if (!signature) return (ctx.status = 401);

                // invalid signature
                const sig = createHmac("sha1", secret)
                    .update(ctx.request.response.body[Symbol.for("unparsedBody")])
                    .digest("hex");
                if (signature !== `sha1=${sig}`) return (ctx.status = 403);
            }

            const selfId = ctx.headers["x-self-id"].toString();
            const bot = this.bots.find((bot) => bot.selfId === selfId);
            if (!bot) return (ctx.status = 403);

            bot.logger.debug("[receive] %o", ctx.request.response.body);
            dispatchSession(bot, ctx.request.response.body as Payload);
        });
    }

    async disconnect(bot: OneBotBot<C>) {
        bot.status = Universal.Status.RECONNECT;
    }
}

export namespace HttpServer {
    export interface Options extends HTTP.Config {
        protocol: "http";
        path?: string;
        secret?: string;
    }

    export const Options: Schema<Options> = Schema.intersect([
        Schema.object({
            protocol: Schema.const("http").required(),
            path: Schema.string().description("服务器监听的路径。").default("/onebot"),
            secret: Schema.string()
                .description("接收事件推送时用于验证的字段，应该与 OneBot 的 secret 配置保持一致。")
                .role("secret")
        }).description("连接设置"),
        HTTP.createConfig(true)
    ]);
}
