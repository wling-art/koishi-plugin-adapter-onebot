import { h, omit, Universal } from "koishi";
import * as qface from "qface";
import type { OneBot } from "./bot";
import { CQCode } from "./bot/cqcode";
import { EventType, GroupMemberRole } from "./types/enum";
import type { BaseEvent } from "./types/event/base";
import { isGroupMessageEvent, isMessageEvent, type MessageEvent } from "./types/event/message";
import { isGroupPokeNotice, isNoticeEvent, NoticeType } from "./types/event/notice";
import { isFriendRequest, isGroupRequest, isRequestEvent } from "./types/event/request";
import type { GroupInfo, GroupMemberInfo } from "./types/group";
import type { UserInfo } from "./types/user";

export * from "./types";

export const convertUser = (user: UserInfo, isBot: boolean = false): Universal.User => ({
  id: user.user_id.toString(),
  name: user.nickname,
  nick: (user.remark as string) || user.nickname,
  avatar: `https://q.qlogo.cn/headimg_dl?dst_uin=${user.user_id}&spec=640`,
  isBot: isBot
});

export const decodeUser = (event: MessageEvent, isBot: boolean = false): Universal.User => ({
  id: event.user_id.toString(),
  name: event.sender.nickname,
  avatar: `https://q.qlogo.cn/headimg_dl?dst_uin=${event.user_id}&spec=640`,
  isBot: isBot
});

export function decodeGuild(group: GroupInfo): Universal.Guild {
  return {
    id: String(group.group_id),
    name: group.group_name,
    avatar: `https://p.qlogo.cn/gh/${group.group_id}/${group.group_id}/640`
  };
}

export const decodeGuildMember = (user: GroupMemberInfo, isBot: boolean = false): Universal.GuildMember => ({
  user: convertUser(user, isBot),
  name: user.nickname,
  nick: user.card || user.nickname,
  title: user.title,
  avatar: `https://q.qlogo.cn/headimg_dl?dst_uin=${user.user_id}&spec=640`,
  roles: [user.role]
});

export async function decodeMessage(
  bot: OneBot,
  event: MessageEvent,
  message: Universal.Message = {},
  payload: Universal.MessageLike = message
) {
  const [_, channelId] = decodeGroupChannelId(event);
  // message content
  const chain = CQCode.parse(event.message);

  // 映射
  message.elements = h.transform(chain, {
    text(attrs: CQCode.Text["data"]) {
      return h.text(attrs.text);
    },
    at(attrs: CQCode.At["data"]) {
      if (attrs.qq !== "all")
        return h.at(attrs.qq, {
          name: attrs.name,
          ...omit(
            attrs,
            [attrs.qq ? "qq" : undefined, attrs.name ? "name" : undefined].filter((k): k is string => !!k)
          )
        });
      return h.at("at", {
        type: "all",
        ...omit(
          attrs,
          [attrs.qq ? "qq" : undefined, attrs.name ? "name" : undefined].filter((k): k is string => !!k)
        )
      });
    },
    face(attrs: CQCode.Face["data"]) {
      const name = qface.get(attrs.id)?.QDes.slice(1);
      return h("face", { id: attrs.id, name }, [h.image(qface.getUrl(attrs.id))]);
    },
    image(attrs: CQCode.Image["data"]) {
      return h.image(attrs.url || attrs.file, {
        title: attrs.name || undefined,
        ...omit(
          [attrs.name ? "name" : undefined, attrs.url ? "url" : undefined, attrs.file ? "file" : undefined].filter(
            (k): k is string => !!k
          )
        )
      });
    },
    record(attrs: CQCode.Record["data"]) {
      return h.audio(attrs.url || attrs.file, {
        ...omit([attrs.url ? "url" : undefined, attrs.file ? "file" : undefined].filter((k): k is string => !!k))
      });
    },
    video(attrs: CQCode.Video["data"]) {
      return h.video(attrs.url || attrs.file, {
        ...omit([attrs.url ? "url" : undefined, attrs.file ? "file" : undefined].filter((k): k is string => !!k))
      });
    },
    file(attrs: CQCode.File["data"]) {
      return h.file(attrs.url || attrs.file, {
        ...omit([attrs.url ? "url" : undefined, attrs.file ? "file" : undefined].filter((k): k is string => !!k))
      });
    },
    reply(attrs: CQCode.Reply["data"]) {
      return h("reply", { id: attrs.id });
    }
  });

  if (message.elements[0] && message.elements[0].type === "reply") {
    const reply = message.elements.shift();
    if (reply) {
      message.quote = await bot.getMessage(channelId, reply.attrs.id).catch((error) => {
        bot.logger.warn(error);
        return undefined;
      });
    }
  }
  message.content = message.elements.join("");
  payload.timestamp = event.time * 1000;
  message.id = event.message_id.toString();

  payload.channel = {
    id: channelId,
    type: event.message_type === "group" ? Universal.Channel.Type.TEXT : Universal.Channel.Type.DIRECT,
    name: event.message_type === "group" ? (event.group_name as string) || undefined : event.sender.nickname
  };
  payload.user = decodeUser(event);

  if (isGroupMessageEvent(event)) {
    payload.guild = {
      id: event.group_id.toString(),
      name: (event.group_name as string) || undefined,
      avatar: `https://p.qlogo.cn/gh/${event.group_id}/${event.group_id}/640`
    };
    payload.member = {
      user: decodeUser(event),
      name: event.sender.nickname,
      nick: event.sender.card,
      avatar: `https://q.qlogo.cn/headimg_dl?dst_uin=${event.user_id}&spec=640`,
      roles: event.sender.role ? [event.sender.role] : []
    };
  }
  return message;
}

const decodeGroupChannelId = (event: MessageEvent): [string | undefined, string] => {
  if (event.message_type === "group") {
    return [event.group_id.toString(), event.group_id.toString()];
  }
  return [undefined, "private:" + event.sender.user_id];
};

export const adaptGuild = (info: GroupInfo): Universal.Guild => {
  return {
    id: info.group_id.toString(),
    name: info.group_name,
    avatar: `https://p.qlogo.cn/gh/${info.group_id}/${info.group_id}/640`
  };
};

export const adaptChannel = (info: GroupInfo): Universal.Channel => {
  return {
    id: info.group_id.toString(),
    name: info.group_name,
    type: Universal.Channel.Type.TEXT
  };
};

export async function dispatchSession(bot: OneBot, data: BaseEvent<EventType>) {
  if (data.post_type === EventType.MESSAGE_SENT) {
    bot.logger.warn("暂不支持自身消息事件的处理");
    return;
  }
  const session = await adaptSession(bot, data);
  if (!session) return;
  bot.dispatch(session);
}

export async function adaptSession(bot: OneBot, event: BaseEvent<EventType>) {
  const session = bot.session();
  session.setInternal("onebot", event);
  session.selfId = event.self_id.toString();
  session.timestamp = event.time * 1000;

  if (isMessageEvent(event)) {
    session.type = "message";
    await decodeMessage(bot, event, (session.event.message = {}), session.event);
    session.isDirect = event.message_type === "private";
    return session;
  } else if (isRequestEvent(event)) {
    session.content = event.comment;
    session.messageId = event.flag;
    session.userId = event.user_id.toString();
    if (isFriendRequest(event)) {
      session.type = "friend-request";
      session.channelId = `private:${event.user_id}`;
    } else if (isGroupRequest(event)) {
      session.channelId = event.group_id.toString();
      session.guildId = event.group_id.toString();
      if (event.sub_type === "add") {
        session.type = "guild-member-request";
      } else if (event.sub_type === "invite") {
        session.type = "guild-request";
      }
    }
  } else if (isNoticeEvent(event)) {
    switch (event.notice_type) {
      case NoticeType.GROUP_RECALL:
        session.type = "message-deleted";
        session.userId = event.user_id.toString();
        session.operatorId = event.operator_id.toString();
        session.messageId = event.message_id.toString();
        session.channelId = event.group_id.toString();
        session.guildId = event.group_id.toString();
        session.isDirect = false;
        break;
      case NoticeType.FRIEND_RECALL:
        session.type = "message-deleted";
        session.userId = event.user_id.toString();
        session.operatorId = event.user_id.toString();
        session.messageId = event.message_id.toString();
        session.channelId = `private:${event.user_id}`;
        session.isDirect = true;
        break;
      case NoticeType.FRIEND_ADD:
        session.type = "friend-added";
        session.userId = event.user_id.toString();
        break;
      case NoticeType.GROUP_ADMIN:
        session.type = "guild-role-updated";
        session.userId = event.user_id.toString();
        session.guildId = event.group_id.toString();
        session.channelId = event.group_id.toString();
        session.roleId = event.sub_type === "set" ? GroupMemberRole.admin : GroupMemberRole.member;
        break;
      case NoticeType.GROUP_BAN:
        session.type = "guild-member-updated";
        session.userId = event.user_id.toString();
        session.guildId = event.group_id.toString();
        session.channelId = event.group_id.toString();
        session.operatorId = event.operator_id.toString();
        break;
      case NoticeType.GROUP_DECREASE:
        session.type = event.sub_type === "kick_me" ? "guild-removed" : "guild-member-removed";
        session.userId = event.user_id.toString();
        session.guildId = event.group_id.toString();
        session.channelId = event.group_id.toString();
        session.operatorId = event.operator_id.toString();
        break;
      case NoticeType.GROUP_INCREASE:
        session.type = event.user_id.toString() === session.selfId ? "guild-added" : "guild-member-added";
        session.userId = event.user_id.toString();
        session.guildId = event.group_id.toString();
        session.channelId = event.group_id.toString();
        session.operatorId = event.operator_id.toString();
        break;
      case NoticeType.GROUP_CARD:
        session.type = "guild-member-updated";
        session.userId = event.user_id.toString();
        session.guildId = event.group_id.toString();
        session.channelId = event.group_id.toString();
        session.content = event.card_new;
        break;
      case NoticeType.NOTIFY:
        session.type = "onebot/notice";
        switch (event.sub_type) {
          case "poke":
            session.type += "-poke";
            session.userId = event.target_id.toString();
            if (isGroupPokeNotice(event)) {
              session.channelId = event.group_id.toString();
              session.guildId = event.group_id.toString();
              session.isDirect = false;
            }
            session.isDirect = true;
            session.channelId = `private:${event.user_id}`;
            break;
          case "honor":
            session.type += "-honor";
            session.channelId = event.group_id.toString();
            session.guildId = event.group_id.toString();
            session.userId = event.user_id.toString();
            session.content = event.honor_type;
            break;
          case "lucky_king":
            session.type += "-lucky-king";
            session.channelId = event.group_id.toString();
            session.guildId = event.group_id.toString();
            session.userId = event.target_id.toString();
            break;
          case "title":
            session.type += "-title";
            session.channelId = event.group_id.toString();
            session.guildId = event.group_id.toString();
            session.userId = event.user_id.toString();
            session.content = event.title;
            break;
        }
        break;
      case NoticeType.GROUP_ESSENCE:
        session.type = "onebot/group-essence";
        session.userId = event.sender_id.toString();
        session.guildId = event.group_id.toString();
        session.channelId = event.group_id.toString();
        session.messageId = event.message_id.toString();
        session.operatorId = event.operator_id.toString();
        break;
      // https://github.com/koishijs/koishi-plugin-adapter-onebot/issues/33
      // case 'offline_file':
      //   session.elements = [h('file', data.file)]
      //   session.type = 'message'
      //   session.subtype = 'private'
      //   session.isDirect = true
      //   session.subsubtype = 'offline-file-added'
      //   break
      // case 'group_upload':
      //   session.elements = [h('file', data.file)]
      //   session.type = 'message'
      //   session.subtype = 'group'
      //   session.subsubtype = 'guild-file-added'
      //   break
      default:
        return;
    }
  } else return;

  return session;
}
