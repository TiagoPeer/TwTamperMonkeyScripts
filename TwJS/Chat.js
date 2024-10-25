/**** game/Chat.js_ ****/
var Chat;
!(function () {
  "use strict";
  Chat = function () {
    var e,
      t,
      n,
      a,
      i = this,
      o = {},
      r = [],
      s = {},
      c = {},
      d = {},
      h = {},
      u = {},
      l = {},
      v = 0,
      f = !0;
    (this.HISTORY_CACHE_TIME = 300),
      (this.init = function () {
        if (this.isSupported() && !(window.game_data.player.sitter > 0)) {
          -1 !== window.location.href.indexOf("intro") && this.cleanCache(),
            (this.storage = new ChatStorage()),
            (e = document.title),
            (a = $("#chat-wrapper")),
            (v = Math.floor($(document).width() / 245)),
            !1 === i.storage.get("last_connection_state") &&
              this.connectionUnavailable(!0),
            (this.contacts = new ChatContacts(this)),
            this.addWindow(this.contacts),
            this.initConversations(),
            this.initWindowState(),
            this.updateSoundStatus(),
            this.updateBlockedPlayers(),
            this.storage.addObserver("conversations", this.syncConversations),
            this.storage.addObserver("window_state", this.syncWindowState),
            Connection.registerHandler(
              "chat/playername",
              this.receivedPlayerName
            ),
            Connection.registerHandler(
              "chat/messages",
              this.receivedChatMessages
            ),
            Connection.registerHandler("chat/read", this.receivedChatRead),
            Connection.registerHandler(
              "chat/typing",
              this.receivedTypingIndication
            ),
            Connection.registerHandler("chat/error", this.handleError),
            Connection.registerHandler(
              "chat/playerconversation",
              this.receivedNewConversationData
            ),
            Connection.registerHandler(
              "chat/conversation",
              this.receivedConversationData
            ),
            $(Connection).on("disconnected", this.connectionUnavailable),
            $(Connection).on("connected", this.connectionAvailable);
          var t = function () {
            i.connectionUnavailable(), $(Connection).off("connect_error", t);
          };
          $(Connection).on("connect_error", t),
            Math.random() < 0.01 && i.cleanCache();
        }
      }),
      (this.isPlayerBlocked = function (e) {
        return -1 !== $.inArray(e, l);
      }),
      (this.updateBlockedPlayers = function () {
        var e = window.sessionStorage,
          t = "chat_blocked_players",
          n = -1 !== window.location.href.indexOf("mode=block"),
          a = !1;
        e.hasOwnProperty(t) && ((l = JSON.parse(e.getItem(t))), (a = !0)),
          (a && !n) ||
            TribalWars.get("api", { ajax: "blocked_players" }, function (n) {
              (l = n), e.setItem(t, JSON.stringify(l));
            });
      }),
      (this.cleanCache = function () {
        Object.keys(localStorage).forEach(function (e) {
          var t = e.match(/(\d+)_chat_/);
          if (
            t &&
            (parseInt(t[1]) !== parseInt(window.game_data.player.id) &&
              localStorage.removeItem(e),
            /history/.test(e))
          ) {
            var n = JSON.parse(localStorage.getItem(e));
            Timing.getCurrentServerTime() - n.timestamp >
              1e3 * i.HISTORY_CACHE_TIME && localStorage.removeItem(e);
          }
        });
      }),
      (this.connectionAvailable = function () {
        a.removeClass("chat-disconnected"),
          (f = !0),
          i.storage.set("last_connection_state", !0),
          $(".chat-header").off("click", i.showConnectionError),
          t && (clearTimeout(t), (t = 0));
      }),
      (this.connectionUnavailable = function (e) {
        if (!t) {
          var n = function () {
            a.addClass("chat-disconnected"),
              (f = !1),
              i.storage.set("last_connection_state", !1),
              $(".chat-header").on("click", i.showConnectionError);
          };
          !0 !== e ? (t = setTimeout(n, 3e3)) : n();
        }
      }),
      (this.isConnected = function () {
        return f;
      }),
      (this.showConnectionError = function (e) {
        return (
          e.stopImmediatePropagation(),
          e.preventDefault(),
          UI.ErrorMessage(ChatLang.error.unavailable),
          !1
        );
      }),
      (this.isSupported = function () {
        return (
          Connection.isSupportedBrowser() &&
          Modernizr.json &&
          Modernizr.localstorage &&
          "function" == typeof window.addEventListener
        );
      }),
      (this.handleError = function (e) {
        if (
          ("err_unknown" === e.message
            ? UI.ErrorMessage(ChatLang.error.unknown)
            : "err_spam" === e.message
            ? UI.ErrorMessage(_("d015ac2902d2feed0ccd3efa93a4a851"))
            : UI.ErrorMessage(e.message),
          "message" === e.type)
        ) {
          var t = e.metadata.head_id,
            n = i.getWindow("conversation_" + t);
          n && n.setBusy(!1);
        }
      }),
      (this.updateSoundStatus = function () {
        TribalWars.getSetting("chat_sound_enabled")
          ? a.addClass("chat-sound-enabled")
          : a.removeClass("chat-sound-enabled");
      }),
      (this.addWindow = function (e) {
        a.append(e.getWindow()),
          (o[e.getID()] = e),
          setTimeout(function () {
            e.getWindow().removeClass("chat-new-block");
          }, 200);
      }),
      (this.removeWindow = function (e) {
        delete o[e.getID()], e.getWindow().remove();
      }),
      (this.getWindow = function (e) {
        return o.hasOwnProperty(e) ? o[e] : null;
      }),
      (this.requestConversationWithPlayer = function (e) {
        e !== parseInt(window.game_data.player.id)
          ? Connection.emit("chat/playerconversation", e)
          : UI.ErrorMessage(ChatLang.error.insanity);
      }),
      (this.receivedNewConversationData = function (e) {
        1 === e.players.length
          ? i.newConversation(e.head_id, e.players[0].player_id, !1, !0)
          : i.newConversation(e.head_id, 0, !1, !0);
      }),
      (this.getConversationData = function (e, t) {
        d.hasOwnProperty(e)
          ? t(d[e])
          : ((h[e] = t), Connection.emit("chat/conversation", e));
      }),
      (this.receivedConversationData = function (e) {
        (d[e.head_id] = e),
          h.hasOwnProperty(e.head_id) && (h[e.head_id](e), delete h[e.head_id]);
      }),
      (this.newConversation = function (e, t, n, a) {
        if (
          ((e = parseInt(e)), (t = parseInt(t)), !(Object.keys(o).length >= v))
        ) {
          var r = i.getWindow("conversation_" + e);
          if (r) return r.maximize(), r.setRead(), r.focus(), r;
          var s = new ChatConversation(i, e, t);
          return (
            i.addWindow(s),
            i.conversationsChanged(n),
            u.hasOwnProperty(e) && s.updateUnreadCount(u[e]),
            a && (i.windowStateChanged(), s.setRead(), s.focus()),
            s
          );
        }
        a && UI.ErrorMessage(ChatLang.error.windows);
      }),
      (this.removeConversation = function (e, t) {
        var n = "conversation_" + e,
          a = i.getWindow(n);
        a && (i.removeWindow(a), i.conversationsChanged(t));
      }),
      (this.conversationsChanged = function (e) {
        var t = [];
        $.each(o, function (e, n) {
          n instanceof ChatConversation && t.push(n.getConversationKey());
        }),
          (r = t),
          !0 !== e && i.storage.set("conversationsv2", t);
      }),
      (this.syncConversations = function (e, t) {
        r.forEach(function (e) {
          -1 === $.inArray(e, t) && i.removeConversation(e.split("_")[0], !0);
        }),
          t.forEach(function (e) {
            if (-1 === $.inArray(e, r)) {
              var t = e.split("_");
              i.newConversation(t[0], t[1], !0);
            }
          });
      }),
      (this.initConversations = function () {
        var e = i.storage.get("conversationsv2");
        e &&
          e.forEach(function (e) {
            var t = e.split("_");
            i.newConversation(t[0], t[1], !0);
          });
      }),
      (this.addPlayerName = function (e, t) {
        (s[e] = t), c.hasOwnProperty(e) && (c[e](t), delete c[e]);
      }),
      (this.getPlayerName = function (e, t) {
        s.hasOwnProperty(e) ? t(s[e]) : ((c[e] = t), i.requestPlayerName(e));
      }),
      (this.requestPlayerName = function (e) {
        Connection.emit("chat/playername", e);
      }),
      (this.receivedPlayerName = function (e) {
        i.addPlayerName(e.id, e.name);
      }),
      (this.initWindowState = function () {
        var e = i.storage.get("window_state");
        e
          ? (this.syncWindowState(null, e), i.updateUIBufferStatus())
          : parseInt(window.game_data.player.points) < 100 &&
            i.contacts.minimize();
      }),
      (this.windowStateChanged = function () {
        var e = {};
        $.each(o, function (t, n) {
          e[t] = n.isMinimized() ? 0 : 1;
        }),
          (i.window_state = e),
          i.storage.set("window_state", e),
          i.updateUIBufferStatus();
      }),
      (this.updateUIBufferStatus = function () {
        $("#chat-wrapper").find(".chat-window:not(.chat-window-minimized)")
          .length > 0
          ? $(".chat-open-buffer").show()
          : $(".chat-open-buffer").hide();
      }),
      (this.syncWindowState = function (e, t) {
        $.each(t, function (e, t) {
          var n = i.getWindow(e);
          n &&
            (n.isMinimized() ? 0 : 1) !== t &&
            (1 === t ? n.maximize(!0) : n.minimize(!0));
        });
      }),
      (this.requestChatHistory = function (e, t) {
        var n = { head_id: e, before: t };
        Connection.emit("chat/history", n);
      }),
      (this.receivedChatMessages = function (e) {
        var t = i.getWindow("conversation_" + e.head_id);
        if (!t)
          return (
            (t = i.newConversation(e.head_id, e.player_id)).playSound(),
            void i.requestContacts()
          );
        t.receivedMessages(e);
      }),
      (this.requestContacts = function () {
        Connection.emit("chat/contacts", {});
      }),
      (this.updateConversationName = function (e, t, n) {
        var a = i.getWindow("conversation_" + e);
        a && a.updateSubject(n),
          i.contacts && i.contacts.setConversationName(e, t, n);
      }),
      (this.setUnreadMessageCount = function (t, n) {
        u[t] = n;
        var a = i.getWindow("conversation_" + t);
        if ((a && a.updateUnreadCount(n), i.contacts)) {
          i.contacts.setUnreadCount(t, n);
          var o = 0;
          $.each(u, function (e, t) {
            o += t;
          }),
            i.contacts.setTotalUnreadCount(o),
            (document.title = 0 === o ? e : "(" + o + ") " + e);
        }
      }),
      (this.receivedChatRead = function (e) {
        i.setUnreadMessageCount(e, 0);
      }),
      (this.receivedTypingIndication = function (e) {
        var t = i.getWindow("conversation_" + e);
        t && t.receivedPartnerTypingNotice();
      }),
      (this.getEmojiSelector = function (e) {
        n
          ? e(n)
          : TribalWars.get("api", { ajax: "emoji" }, function (t) {
              e((n = t));
            });
      }),
      this.init();
  };
})();
