/**** game/TribalWars.js_ ****/
var TribalWars;
!(function () {
  "use strict";
  TribalWars = {
    _script: "/game.php",
    _loadedJS: [],
    _onLoadHandler: null,
    _inputCache: {},
    _previousData: {},
    _data_update_stamps: {},
    _settings: { sound: !1 },
    _tabID: null,
    _tabActive: !0,
    _tabTimeout: !1,
    _lastActivity: null,
    _lastSound: 0,
    _chat: null,
    _ah: {},
    constants: {},
    fetch: function (a, e, t) {
      this.registerOnLoadHandler(null),
        this.cacheInputVars(),
        e || this.showLoadingIndicator(),
        $.getJSON(a, function (a) {
          TribalWars.hideLoadingIndicator(),
            TribalWars.handleResponse(a),
            UI.init(),
            UnitPopup.initLinks(),
            "function" == typeof t && t();
        });
    },
    get: function (a, e, t, r, i) {
      var n = this.buildURL("GET", a, e);
      this.request("GET", n, {}, t, r, i);
    },
    post: function (a, e, t, r, i, n) {
      var s = this.buildURL("POST", a, e),
        o = s.match(/&h=([a-z0-9]+)/);
      o &&
        "string" != typeof t &&
        ((s = s.replace(/&h=([a-z0-9]+)/, "")),
        "object" == typeof t && null != t
          ? t.hasOwnProperty("0")
            ? t.push({ name: "h", value: o[1] })
            : (t.h = o[1])
          : (t = { h: o[1] })),
        this.request("POST", s, t, r, i, n);
    },
    request: function (a, e, t, r, i, n) {
      !0 !== n && this.showLoadingIndicator();
      var s = { "TribalWars-Ajax": 1 };
      Object.keys(TribalWars._ah).length &&
        ((s = $.extend(TribalWars._ah, s)), (TribalWars._ah = {})),
        $.ajax({
          url: e,
          data: t,
          type: a,
          dataType: "json",
          headers: s,
          success: function (a) {
            TribalWars.hideLoadingIndicator(),
              TribalWars.handleResponse(a, r, i);
          },
          error: function (a, e) {
            TribalWars.hideLoadingIndicator(),
              0 !== a.readyState &&
                (429 !== a.status
                  ? 503 !== a.status
                    ? (UI.ErrorMessage(_("ba628a2fb8acbf8ab7c4c24c9714d893")),
                      "function" == typeof i && i(a))
                    : UI.ErrorMessage(_("b51a6b34f8d967218773e5ec33bf8a10"))
                  : UI.ErrorMessage(
                      _("f1ac6646f49d65cbe50901b805abfbf8"),
                      3e3
                    ));
          },
          complete: function () {
            UI.ToolTip("[title]");
          },
        });
    },
    redirect: function (a, e) {
      var t = TribalWars.buildURL("GET", a, e);
      window.location.href = t;
    },
    buildURL: function (a, e, t) {
      var r = "";
      return (
        "string" == typeof e &&
          ("/" === e.charAt()
            ? ((r = e), "object" == typeof t && (e = t))
            : (e = $.extend({ screen: e }, t))),
        "" === r &&
          ("object" == typeof e && null !== e && void 0 !== e.village
            ? ((r = TribalWars._script + "?village=" + e.village),
              delete e.village)
            : (r = game_data.hasOwnProperty("village")
                ? TribalWars._script + "?village=" + game_data.village.id
                : TribalWars._script + "?village=")),
        "object" == typeof e && null !== e && (r += "&" + $.param(e)),
        ("POST" === a ||
          ("object" == typeof e && null !== e && e.hasOwnProperty("action"))) &&
          -1 === r.indexOf("&h=") &&
          (r += "&h=" + window.csrf_token),
        game_data.player.sitter > 0 && (r += "&t=" + game_data.player.id),
        r
      );
    },
    handleResponse: function (a, e, t) {
      if (
        ((TribalWars._previousData = $.extend(!0, {}, window.game_data)),
        a.hasOwnProperty("redirect"))
      ) {
        var r = String(document.location),
          i = r.indexOf(a.redirect);
        if (-1 === i || r.substring(i) !== a.redirect)
          return void (document.location = a.redirect);
      }
      if (
        a.hasOwnProperty("error") ||
        a.hasOwnProperty("response") ||
        a.hasOwnProperty("content")
      ) {
        var n;
        if (a.error)
          return (
            "object" == typeof a.error && (a.error = Object.values(a.error)),
            (n =
              Array.isArray(a.error) && a.error.length > 1
                ? '<ul style="list-style-type: none">' +
                  a.error
                    .map(function (a) {
                      return "<li>" + a + "</li>";
                    })
                    .join("") +
                  "</ul>"
                : Array.isArray(a.error)
                ? a.error[0]
                : a.error),
            UI.ErrorMessage(n),
            void ("function" == typeof t && t(n))
          );
        if (a.bot_protect && BotProtect.isForced(a.bot_protect))
          return (
            BotProtect.show(a.bot_protect), void ("function" == typeof t && t())
          );
        if (
          (a.content && $("#content_value").html(a.content),
          a.content && (UI.ToolTip(".tooltip"), TribalWars.contentLoaded()),
          a.game_data)
        ) {
          var s = window.game_data.screen;
          TribalWars.updateGameData(a.game_data),
            (window.game_data.screen = s),
            setTimeout(function () {
              Timing.resetTickHandlers();
            }, 10);
        }
        a.quest_data && Quests.setQuestData(a.quest_data, !0),
          "partial_reload" === a.response
            ? $(document).trigger("partial_reload_end")
            : null !== a.response && "function" == typeof e && e(a.response),
          mobile
            ? TribalWars.updateHeaderOnMobile()
            : TribalWars.updateHeader(),
          a.bot_protect && BotProtect.show(a.bot_protect);
      } else UI.ErrorMessage(_("ba628a2fb8acbf8ab7c4c24c9714d893"));
    },
    updateGameData: function (a) {
      void 0 === window.game_data
        ? (window.game_data = a)
        : ((TribalWars._previousData = $.extend(!0, {}, window.game_data)),
          $.each(a, function (e, t) {
            ("village" === e && t.id !== window.game_data.village.id) ||
              TribalWars.mergeGameDataProperty(
                e,
                t,
                a.time_generated,
                window.game_data,
                TribalWars._data_update_stamps
              );
          })),
        void 0 !== window.game_data.village &&
          (Village.isPrototypeOf(window.game_data.village) ||
            (window.game_data.village = $.extend(
              !0,
              Object.create(Village),
              window.game_data.village
            )));
    },
    mergeGameDataProperty: function (a, e, t, r, i) {
      "object" == typeof e && null !== e
        ? ("object" != typeof i[a] && (i[a] = {}),
          r[a] || (r[a] = {}),
          $.each(e, function (e, n) {
            TribalWars.mergeGameDataProperty(e, n, t, r[a], i[a]);
          }))
        : (!i.hasOwnProperty(a) || i[a] < t) && ((r[a] = e), (i[a] = t));
    },
    handleGameData: function (a) {
      TribalWars.updateGameData(a),
        mobile ? TribalWars.updateHeaderOnMobile() : TribalWars.updateHeader(),
        a.hasOwnProperty("village") && Timing.resetTickHandlers();
    },
    showLoadingIndicator: function () {
      $("#loading_content").show();
    },
    hideLoadingIndicator: function () {
      $("#loading_content").hide();
    },
    updateHeader: function () {
      if (window.game_data.hasOwnProperty("village")) {
        $("#storage").text(game_data.village.storage_max);
        var a = $("#pop_current_label");
        if (
          (a.text(game_data.village.pop),
          changeResStyle(
            a,
            Format.get_warn_pop_class(
              game_data.village.pop,
              game_data.village.pop_max,
              game_data.village.is_farm_upgradable
            )
          ),
          $("#pop_max_label").text(game_data.village.pop_max),
          parseInt(this._previousData.player.rank) !==
            parseInt(game_data.player.rank))
        ) {
          var e = $("#rank_rank").html(game_data.player.rank_formatted);
          this._previousData.player.rank > game_data.player.rank &&
            (e.addClass("increased"),
            setTimeout(function () {
              e.removeClass("increased");
            }, 100));
        }
        if (
          parseInt(this._previousData.player.points) !==
          parseInt(game_data.player.points)
        ) {
          var t = $("#rank_points").html(game_data.player.points_formatted);
          this._previousData.player.points < game_data.player.points &&
            (t.addClass("increased"),
            setTimeout(function () {
              t.removeClass("increased");
            }, 100));
        }
      }
      $("#premium_points").text(game_data.player.pp);
      var r = $("#new_mail"),
        i = r.hasClass("new_mail_faded"),
        n = parseInt(game_data.player.new_igm);
      n > 0 && i
        ? r.removeClass("new_mail_faded").addClass("new_mail")
        : 0 !== n || i || r.hide(),
        $(".badge-mail").text(n ? " (" + n + ")" : "");
      var s = $("#new_report"),
        o = s.hasClass("new_report_faded"),
        l = parseInt(game_data.player.new_report);
      l > 0 && o
        ? s.removeClass("new_report_faded").addClass("new_report")
        : 0 !== l || o || s.hide(),
        $(".badge-report").text(l ? " (" + l + ")" : "");
      var d = parseInt(game_data.player.new_post_notification),
        p = parseInt(game_data.player.new_forum_post),
        c = parseInt(game_data.player.new_ally_invite),
        u = parseInt(game_data.player.new_ally_application),
        g = p + c + u,
        m = $("#tribe_forum_indicator");
      m.removeClass("new_post no_new_post new_notification"),
        d
          ? m
              .addClass("new_notification")
              .attr("title", _("e55d740659fcbd1e45213ffc5a872da6"))
          : p
          ? m
              .addClass("new_post")
              .attr("title", _("3d17b7d7c59f2578040822fd6c08eee8"))
          : p ||
            m
              .addClass("no_new_post")
              .attr("title", _("fd41237025d00c9823b661d8691a3694")),
        $(".badge-ally-forum-post").text(p ? " (" + p + ")" : ""),
        $(".badge-ally-application").text(u ? " (" + u + ")" : ""),
        $(".badge-ally-invite").text(c ? " (" + c + ")" : ""),
        $("#menu_counter_ally").text(g ? " (" + g + ")" : "");
      var b = parseInt(game_data.player.sitter)
          ? 0
          : parseInt(game_data.player.new_buddy_request),
        f = parseInt(game_data.player.sitter)
          ? 0
          : parseInt(game_data.player.new_daily_bonus),
        y = parseInt(game_data.player.new_items),
        h = b + y + f;
      $(".badge-buddy").text(b ? " (" + b + ")" : ""),
        $(".badge-daily-bonus").text(f ? " (" + f + ")" : ""),
        $(".badge-inventory").text(y ? " (" + y + ")" : ""),
        $("#menu_counter_profile").text(h ? " (" + h + ")" : "");
      var v = $("#header_commands");
      game_data.player.incomings !== this._previousData.player.incomings &&
        (!v.hasClass("has_incomings") &&
        parseInt(game_data.player.incomings) > 0
          ? v.addClass("has_incomings")
          : v.hasClass("has_incomings") &&
            0 === parseInt(game_data.player.incomings) &&
            v.removeClass("has_incomings"),
        $("#incomings_amount").text(game_data.player.incomings),
        Favicon.update()),
        window.premium &&
          parseInt(game_data.player.supports) !==
            parseInt(this._previousData.player.supports) &&
          (!v.hasClass("has_supports") &&
          parseInt(game_data.player.supports) > 0
            ? v.addClass("has_supports")
            : v.hasClass("has_supports") &&
              0 === parseInt(game_data.player.supports) &&
              v.removeClass("has_supports"),
          $("#supports_amount").text(game_data.player.supports));
    },
    updateHeaderOnMobile: function () {
      $("#storage").text(game_data.village.storage_max),
        $("#pop_current_label").text(game_data.village.pop),
        $("#pop_max_label").text(game_data.village.pop_max);
      var a = $("#notify_mail");
      "none" === a.css("display") && 1 === parseInt(game_data.player.new_igm)
        ? a.show()
        : "none" !== a.css("display") &&
          0 === parseInt(game_data.player.new_igm) &&
          a.hide();
      var e = $("#notify_report");
      "none" === e.css("display") && 1 === parseInt(game_data.player.new_report)
        ? e.show()
        : "none" !== e.css("display") &&
          0 === parseInt(game_data.player.new_report) &&
          e.hide();
      var t = $("#notify_forum");
      1 === parseInt(game_data.player.new_forum_post) ? t.show() : t.hide();
      var r = $("#notify_incomings");
      parseInt(game_data.player.incomings) > 0 ? r.show() : r.hide(),
        r.find(".mNotifyNumber").last().text(game_data.player.incomings);
      var i = $("#notify_supports");
      parseInt(game_data.player.supports) > 0 ? i.show() : i.hide(),
        i.find(".mNotifyNumber").last().text(game_data.player.supports);
    },
    cacheInputVars: function () {
      this._inputCache = {};
      var a = 0;
      $("#content_value, .popup_box")
        .find("input[type=text]:visible")
        .each(function () {
          var e = $(this);
          if (e.attr("id")) {
            if (++a > 20) return !1;
            TribalWars._inputCache["#" + e.attr("id")] = e.val();
          } else if (e.attr("name")) {
            if (++a > 20) return !1;
            TribalWars._inputCache[
              "input[name=" +
                e.attr("name").replace("[", "\\[").replace("]", "\\]") +
                "]"
            ] = e.val();
          }
        });
    },
    restoreInputVars: function () {
      $.each(this._inputCache, function (a, e) {
        $(a).val(e);
      });
    },
    contentLoaded: function () {
      this._onLoadHandler && this._onLoadHandler(),
        TribalWars.restoreInputVars();
    },
    registerOnLoadHandler: function (a) {
      this._onLoadHandler = a;
    },
    shouldPartialLoad: function () {
      return !0;
    },
    showResourceIncrease: function (a, e) {
      var t = $("#" + a).offset(),
        r = $('<span id="' + a + '_gain"></span>').text("+" + e);
      r.css({ top: t.top - 8 + "px", left: t.left - 3 + "px" }),
        r.appendTo($("body")),
        r.animate({ top: t.top - 20 + "px" }, 1600, "linear", function () {
          $(this).delay(500).fadeOut().remove();
        });
    },
    dev: function () {
      TribalWars.get("dev", { ajax: "options" }, function (a) {
        $(a.options).insertAfter(".server_info");
      });
    },
    playAttackSound: function () {
      TribalWars._settings.sound &&
        (new Date().getTime() - TribalWars._lastSound < 6e4 ||
          (TribalWars.playSound("attack"),
          (TribalWars._lastSound = new Date().getTime())));
    },
    playSound: function (a, e, t) {
      e = e || 1500;
      var r =
          '<audio autoplay><source src="' +
          image_base +
          "/sound/" +
          a +
          '.ogg" type="audio/ogg" /><source src="' +
          image_base +
          "/sound/" +
          a +
          '.mp3" type="audio/mpeg" /></audio>',
        i = $(r).appendTo("body");
      setTimeout(function () {
        i.remove(), "function" == typeof t && t();
      }, e);
    },
    setSetting: function (a, e, t) {
      TribalWars.post(
        "settings",
        { ajaxaction: "toggle_setting" },
        { setting: a, value: e ? 1 : 0 },
        function (a) {
          (TribalWars._settings = $.extend(TribalWars._settings, a)), t && t();
        }
      );
    },
    suppressHint: function (a, e) {
      TribalWars.post(
        "settings",
        { ajaxaction: "suppress_hint" },
        { hint: a },
        function (a) {
          e && e();
        }
      );
    },
    getSetting: function (a) {
      return TribalWars._settings[a];
    },
    initTab: function (a) {
      QuickBar.init(),
        Modernizr.localstorage &&
          ((this._tabID = a),
          TribalWars.setActivityHappened(),
          $("body").on("click keydown mouseenter", function () {
            TribalWars.setActivityHappened(),
              TribalWars._tabTimeout &&
                (TribalWars.setActiveTab(), (TribalWars._tabTimeout = !1));
          }),
          document.hidden || TribalWars.setActiveTab(),
          $(document).on("visibilitychange", function () {
            TribalWars.setActivityHappened(),
              document.hidden
                ? TribalWars.setInactiveTab()
                : TribalWars.setActiveTab();
          }),
          STracking.init(),
          "undefined" == typeof Chat ||
            !0 !== Boolean(TribalWars.getSetting("chat_enabled")) ||
            Number(window.game_data.player.sitter) ||
            (this._chat = new Chat()));
    },
    setActiveTab: function () {
      localStorage.setItem(
        "activetab",
        JSON.stringify([this._tabID, new Date().getTime()])
      ),
        localStorage.setItem("lastactivetab", this._tabID),
        (TribalWars._tabActive = !0),
        (TribalWars._tabTimer = setTimeout(function () {
          TribalWars.getIdleTime() < 18e4
            ? TribalWars.setActiveTab()
            : (TribalWars._tabTimeout = !0);
        }, 1e3));
    },
    setInactiveTab: function () {
      TribalWars._tabTimer && clearInterval(TribalWars._tabTimer),
        localStorage.setItem("activetab", JSON.stringify(!1)),
        (TribalWars._tabActive = !1);
    },
    isTabActive: function () {
      return !document.hidden;
    },
    isAnyTabActive: function () {
      if (!this._tabID) return !0;
      var a = JSON.parse(localStorage.getItem("activetab"));
      return (
        a && new Date().getTime() - a[1] < 2500 && this.getIdleTime() < 18e4
      );
    },
    wasLastActiveTab: function () {
      return this._tabID == localStorage.getItem("lastactivetab");
    },
    setActivityHappened: function () {
      TribalWars._lastActivity = new Date().getTime();
    },
    getIdleTime: function () {
      return new Date().getTime() - TribalWars._lastActivity;
    },
    track: function (a, e) {
      TribalWars.post(
        "tracking",
        { ajaxaction: "track" },
        { event: a, params: e },
        null,
        null,
        !0
      );
    },
    getGameData: function () {
      return window.game_data;
    },
  };
})();
