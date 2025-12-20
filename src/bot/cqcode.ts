import { Dict, h } from "koishi";

export function CQCode(type: string, attrs: Dict<string>) {
    if (type === "text") return attrs.content;
    let output = "[CQ:" + type;
    for (const key in attrs) {
        if (attrs[key]) output += `,${key}=${h.escape(attrs[key], true)}`;
    }
    return output + "]";
}

export interface CQCode {
    type: string;
    data: Dict<string>;
    capture?: RegExpExecArray;
}

export namespace CQCode {
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

    export function from(source: string): CQCode {
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
            return source.map(({ type, data }) =>
                h(type === "text" ? "text" : type, type === "text" ? { content: data.text } : data)
            );
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
