/**** game/ChatContacts.js_ ****/
var ChatContacts;
!(function () {
  "use strict";
  (ChatContacts = function (t) {
    ChatWindow.call(this, t);
    var a = this,
      n = {},
      e = {},
      o = {},
      i = {},
      c = {};
    (this.init = function () {
      this.buildWindow("chat-contacts"),
        this.setTitle(
          ChatLang.general.title + ' <span class="chat-total-unread"></span>'
        ),
        this.addButton("close", this.close),
        this.addButton("minimize", this.minimize),
        this.addButton("maximize", this.maximize),
        this.addButton("sound-off", this.toggleSound),
        this.addButton("sound-on", this.toggleSound),
        this.addButton("group-chat", GroupChat.openCreateWindow),
        this.buildFooter(),
        this.loadGroupState(),
        this.renderContactsFromCache(),
        this.getWindow().on("click", ".chat-contact", this.clickContact),
        Connection.registerHandler("chat/contacts", this.receivedContacts),
        Connection.registerHandler(
          "chat/playerdata",
          this.receivedNewPlayerData
        ),
        t.storage.addObserver("group_state", this.remoteGroupStateChanged);
    }),
      (this.getID = function () {
        return "contacts";
      }),
      (this.didMinimize = function () {
        a.getWindow().addClass("chat-mini-block");
      }),
      (this.didMaximize = function () {
        a.getWindow().removeClass("chat-mini-block");
      }),
      (this.toggleSound = function () {
        var a = TribalWars.getSetting("chat_sound_enabled");
        return (
          TribalWars.setSetting("chat_sound_enabled", !a, function () {
            t.updateSoundStatus();
          }),
          !1
        );
      }),
      (this.close = function () {
        var t = [
          {
            text: ChatLang.general.close_confirm,
            callback: function () {
              TribalWars.setSetting("chat_enabled", 0, function () {
                window.location.reload();
              });
            },
            confirm: !0,
          },
        ];
        UI.ConfirmationBox(ChatLang.general.close, t);
      }),
      (this.clickContact = function () {
        var a = $(this).data("player_id"),
          n = $(this).data("head_id");
        return (
          n
            ? t.newConversation(n, a, !1, !0)
            : t.requestConversationWithPlayer(a),
          !1
        );
      }),
      (this.sortContactsByName = function (t, a) {
        return t.name.localeCompare(a.name);
      }),
      (this.sortContactsByLastPost = function (t, a) {
        return t.last_post > a.last_post;
      }),
      (this.renderContactsFromCache = function () {
        var e = t.storage.get("contacts");
        e && ((n = e), a.renderContacts());
      }),
      (this.renderContacts = function () {
        var r = a.getWindow().find(".chat-body");
        (i = {}),
          0 === Object.keys(n).length &&
          0 === r.find(".chat-no-contacts").length
            ? (r.append(
                '<div class="chat-no-contacts"><p>' +
                  ChatLang.contacts.none +
                  "</p><p>" +
                  s(
                    ChatLang.contacts.find_ally,
                    TribalWars.buildURL("GET", "ally")
                  ) +
                  "</p></div>"
              ),
              r.find(".chat-contact-group").remove())
            : Object.keys(n).length > 0 && r.find(".chat-no-contacts").remove(),
          $.each(n, function (n, s) {
            s =
              "recent" === n || "group" === n
                ? s.sort(a.sortContactsByLastPost)
                : s.sort(a.sortContactsByName);
            var d,
              h = r.find("#chat-contact-group-" + n);
            if (h.length) d = h.find(".chat-contact-group-contacts");
            else {
              o.hasOwnProperty(n) || (o[n] = 1),
                (h = $(
                  '<div class="chat-contact-group chat-contact-group-open" id="chat-contact-group-' +
                    n +
                    '"/>'
                ).appendTo(r));
              var u = $(
                '<div class="chat-contact-group-header"><span>' +
                  ChatLang.contacts[n] +
                  "</span></div>"
              ).appendTo(h);
              u.data("group", n),
                u.on("click", a.toggleGroup),
                (d = $('<div class="chat-contact-group-contacts" />').appendTo(
                  h
                )),
                0 === o[n] && a.hideGroup(n);
            }
            e.hasOwnProperty(n) || (e[n] = {});
            var l,
              p = e[n],
              g = {},
              f = {};
            $.each(s, function (a, e) {
              if (!e.player_id || !f.hasOwnProperty(e.player_id)) {
                var o,
                  s = e.head_id + "_" + e.player_id;
                e.player_id
                  ? t.addPlayerName(e.player_id, e.name)
                  : t.receivedConversationData({
                      head_id: e.head_id,
                      subject: e.name,
                      group_creator: e.group_creator,
                    }),
                  p.hasOwnProperty(s) ||
                    ((o = $(
                      '<a class="chat-contact chat-status chat-status-' +
                        e.player_id +
                        '" data-head_id="' +
                        e.head_id +
                        '" data-player_id="' +
                        e.player_id +
                        '" id="chat-contact-' +
                        s +
                        '" href="#"><span class="chat-contact-name">' +
                        escapeHtml(e.name) +
                        '</span> <span class="chat-contact-count"></span></a>'
                    ).data("online", -2)),
                    l
                      ? l.after(o)
                      : "recent" === n
                      ? d.prepend(o)
                      : d.append(o)),
                  t.setUnreadMessageCount(e.head_id, e.new_count),
                  c.hasOwnProperty(s) || (c[s] = e.name),
                  e.name !== c[s] &&
                    t.updateConversationName(e.head_id, e.player_id, e.name),
                  (i.hasOwnProperty[e.player_id] && -1 === e.online) ||
                    (i[e.player_id] = e.online),
                  (g[s] = !0),
                  (f[e.player_id] = !0),
                  (l = o);
              }
            }),
              $.each(p, function (t) {
                g.hasOwnProperty(t) || r.find("#chat-contact-" + t).remove();
              }),
              (e[n] = g);
          }),
          a.renderOnlineState();
      }),
      (this.renderOnlineState = function () {
        $.each(i, function (t, n) {
          a.getWindow()
            .parent()
            .find(".chat-status-" + t)
            .each(function () {
              var t = $(this);
              parseInt(t.data("online")) !== n &&
                (1 === n
                  ? t
                      .removeClass("chat-status-offline")
                      .addClass("chat-status-online")
                      .attr("title", ChatLang.online.online)
                  : 0 === n
                  ? t
                      .removeClass("chat-status-online")
                      .addClass("chat-status-offline")
                      .attr("title", ChatLang.online.offline)
                  : t
                      .removeClass("chat-status-online chat-status-offline")
                      .attr("title", ChatLang.online.unknown),
                t.data("online", n));
            });
        });
      }),
      (this.getOnlineState = function (t) {
        return i.hasOwnProperty(t) ? i[t] : -1;
      }),
      (this.loadGroupState = function () {
        var a = t.storage.get("group_state");
        a && (o = a);
      }),
      (this.toggleGroup = function () {
        var t = $(this).data("group");
        $(this).parent().hasClass("chat-contact-group-open")
          ? a.hideGroup(t)
          : a.showGroup(t);
      }),
      (this.showGroup = function (t) {
        a
          .getWindow()
          .find("#chat-contact-group-" + t)
          .addClass("chat-contact-group-open"),
          a.setLocalGroupState(t, 1);
      }),
      (this.hideGroup = function (t) {
        a
          .getWindow()
          .find("#chat-contact-group-" + t)
          .removeClass("chat-contact-group-open"),
          a.setLocalGroupState(t, 0);
      }),
      (this.setLocalGroupState = function (a, n) {
        (o[a] = n), t.storage.set("group_state", o);
      }),
      (this.remoteGroupStateChanged = function (t, n) {
        $.each(n, function (t, n) {
          n !== o[t] && (n ? a.showGroup(t) : a.hideGroup(t));
        });
      }),
      (this.buildFooter = function () {
        var t = $(
          '<input class="chat-input chat-search" type="text" placeholder="' +
            ChatLang.contacts.enter_name +
            '" />'
        ).appendTo(a.getWindow().find(".chat-footer"));
        t.on("keyup", function (n) {
          if (13 === n.keyCode)
            return a.newChatWithUnknownPlayer(t.val()), t.val(""), !1;
        });
      }),
      (this.newChatWithUnknownPlayer = function (t) {
        Connection.emit("chat/playerdata", t);
      }),
      (this.receivedNewPlayerData = function (a) {
        !1 === a.status
          ? UI.ErrorMessage(ChatLang.contacts.does_not_exist)
          : (t.addPlayerName(a.result.id, a.result.name),
            t.requestConversationWithPlayer(a.result.id));
      }),
      (this.receivedContacts = function (e) {
        (n = e), t.storage.set("contacts", n), a.renderContacts();
      }),
      (this.setUnreadCount = function (t, n) {
        a.getWindow()
          .find(".chat-contact[data-head_id=" + t + "]")
          .find(".chat-contact-count")
          .text(n > 0 ? "(" + n + ")" : "");
      }),
      (this.setConversationName = function (t, n, e) {
        (c[t + "_" + n] = e),
          a
            .getWindow()
            .find(".chat-contact[data-head_id=" + t + "]")
            .find(".chat-contact-name")
            .text(e);
      }),
      (this.setTotalUnreadCount = function (t) {
        this.getWindow()
          .find(".chat-total-unread")
          .text(t > 0 ? "(" + t + ")" : "");
      }),
      this.init();
  }).prototype = new ChatWindow();
})();
