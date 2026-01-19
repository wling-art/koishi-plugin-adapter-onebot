import { Dict, h } from "koishi";

export function CQCode(type: string, attrs: Dict<string>) {
    if (type === "text") return attrs.content;
    let output = "[CQ:" + type;
    for (const key in attrs) {
        if (attrs[key]) output += `,${key}=${h.escape(attrs[key], true)}`;
    }
    return output + "]";
}
export interface CQCode<T extends string = string, D = Dict<string>> {
    type: T;
    data: D;
}

export namespace CQCode {
    /** 文字 */
    export interface Text extends CQCode<
        "text",
        {
            /** 文字内容 */
            text: string;
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /** 图片 */
    export interface Image extends CQCode<
        "image",
        {
            /** 图片链接/名字 */
            file: string;
            /** 图片链接 */
            url?: string;
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /** 表情 */
    export interface Face extends CQCode<
        "face",
        {
            /** 表情 ID */
            id: string;
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /** 音乐 */
    export interface Music extends CQCode<
        "music",
        {
            /** 音乐类型 */
            type: "qq" | "163" | "xm" | string;
            /** 音乐 ID */
            id: string | number;
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /** 自定义音乐 */
    export interface CustomMusic extends CQCode<
        "music",
        {
            /** 音乐类型 */
            type: "custom";
            /** 音乐 URL */
            url: string;
            /** 音乐音频 URL */
            audio: string;
            /** 音乐标题 */
            title: string;
            /** 音乐描述 */
            content?: string;
            /** 音乐图片 URL */
            image?: string;
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /** 视频 */
    export interface Video extends CQCode<
        "video",
        {
            /** 视频文件名 */
            file: string;
            /** 视频链接 */
            url?: string;
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /**
     * 语音
     */
    export interface Record extends CQCode<
        "record",
        {
            /** 语音文件名 */
            file: string;
            /** 语音链接 */
            url?: string;
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /**
     * 艾特
     */
    export interface At extends CQCode<
        "at",
        {
            /** 被艾特的 QQ 号 */
            qq: string;
            /** 被艾特的昵称 */
            name?: string;
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /**
     * 文件（未完全定义）
     *
     * 请根据实现端补全字段
     */
    export interface File extends CQCode<
        "file",
        {
            /** 图片链接 */
            file: string;
            /** 文件链接 */
            url?: string;
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /**
     * 回复
     */
    export interface Reply extends CQCode<
        "reply",
        {
            /** 消息 ID */
            id: string;
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /**
     * 转发消息
     */
    export interface Forward extends CQCode<
        "forward",
        {
            /** 转发 ID */
            id: string;
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /**
     * 回复
     */
    export interface Reply extends CQCode<
        "reply",
        {
            /** 消息 ID */
            id: string;
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /**
     * 戳一戳
     */
    export interface Poke extends CQCode<
        "poke",
        {
            /** 戳一戳类型 */
            type: string;
            /** 戳一戳 ID */
            id: string;
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /**
     * 商城表情
     */
    export interface Mface extends CQCode<
        "mface",
        {
            /** 表情 Url */
            url?: string;
            /** 表情包/组 ID */
            emoji_package_id: string;
            /** 表情 ID */
            emoji_id: string;
            /** 表情 key */
            key: string;
            /** 表情说明 */
            summary: string;
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /**
     * 合并消息
     */
    export interface MergeForward extends CQCode<
        "node",
        {
            /** 用户 ID */
            user_id: string;
            /** 昵称 */
            nickname: string;
            /** 消息内容 */
            content: CQCodeUnion[];
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /**
     * Json 消息
     */
    export interface Json extends CQCode<
        "json",
        {
            /** Json 内容 */
            data: string | object;
            /** 更多字段 */
            [property: string]: unknown;
        }
        > { }
    /**
     * XML 消息
     */
    export interface Xml extends CQCode<
        "xml",
        {
            /** XML 内容 */
            data: string;
            /** 更多字段 */
            [property: string]: unknown;
        }
    > {}
    /** 联合类型 */
    export type CQCodeUnion =
        | Text
        | Image
        | Face
        | Music
        | CustomMusic
        | Video
        | Record
        | At
        | File
        | Reply
        | Forward
        | Poke
        | Mface
        | MergeForward
        | Json;

    const ESCAPE_MAP = { "&": "&amp;", "[": "&#91;", "]": "&#93;" };
    const UNESCAPE_MAP = Object.fromEntries(Object.entries(ESCAPE_MAP).map(([k, v]) => [v, k]));

    export function escape(source: any, inline = false) {
        let result = String(source).replace(/[&[\]]/g, (m) => ESCAPE_MAP[m]);
        if (inline) {
            result = result.replace(/,/g, "&#44;");
            result = result.replace(
                /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g,
                " "
            );
        }
        return result;
    }

    export function unescape(source: string) {
        return String(source).replace(/&#91;|&#93;|&#44;|&amp;/g, (m) => UNESCAPE_MAP[m] ?? m);
    }

    const pattern = /\[CQ:(\w+)((,\w+=[^,\]]*)*)\]/;

    export function from(source: string): CQCode & { capture: RegExpExecArray } {
        const capture = pattern.exec(source);
        if (!capture) return null;
        const [, type, attrs] = capture;
        const data = Object.fromEntries(
            (attrs?.slice(1).split(",") || []).map((str) => {
                const index = str.indexOf("=");
                return [str.slice(0, index), unescape(str.slice(index + 1))];
            })
        );
        return { type, data, capture };
    }

    export function parse(source: string | CQCode[]) {
        if (typeof source !== "string") {
            return source.map(({ type, data }) => h(type, data));
        }
        const elements: h[] = [];
        let result: ReturnType<typeof from>;
        while ((result = from(source))) {
            const { type, data, capture } = result;
            if (capture.index) {
                elements.push(h("text", { content: unescape(source.slice(0, capture.index)) }));
            }
            elements.push(h(type, data));
            source = source.slice(capture.index + capture[0].length);
        }
        if (source) elements.push(h("text", { content: unescape(source) }));
        return elements;
    }
}
