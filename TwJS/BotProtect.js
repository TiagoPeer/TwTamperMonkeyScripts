/**** game/BotProtect.js_ ****/
var BotProtect;
function botProtectLoaded() {
  BotProtect.libraryLoaded();
}
!(function () {
  "use strict";
  BotProtect = {
    key: "b413369f-bb15-4015-bacd-dd180021827c",
    load_callback: null,
    forced: !1,
    loading: !1,
    getLibrary: function () {
      var e =
        "https://hcaptcha.com/1/api.js?onload=botProtectLoaded&render=explicit&custom=true";
      return (e += "&hl=");
    },
    ensureLibraryLoaded: function (e) {
      if (!this.loading)
        return "undefined" == typeof hcaptcha
          ? ((this.loading = !0),
            (this.load_callback = e),
            void $.getScript(this.getLibrary()))
          : void e();
    },
    libraryLoaded: function () {
      (this.loading = !1),
        this.load_callback &&
          (this.load_callback(), (this.load_callback = null));
    },
    show: function (e) {
      (this.forced = this.isForced(e)),
        this.ensureLibraryLoaded(function () {
          "forced_dialog" === e
            ? BotProtect.showDialog(!1)
            : "pending" === e
            ? BotProtect.showPending()
            : BotProtect.showInline("throttled" === e);
        });
    },
    isForced: function (e) {
      return "forced" === e || "throttled" === e;
    },
    showInline: function (e) {
      const t = $("#content_value");
      let o = t.find("#bot_check");
      if (o.length) return;
      o = $('<div id="bot_check" />').prependTo(t);
      const c = "<p>" + _("5476ee72254113de26d44629493d9981") + "</p>";
      if (e) {
        const e = $(
          '<a href="#" class="btn btn-default">' +
            _("75b866de3edad911eff7418e3bd155ed") +
            "</a>"
        );
        o.append(
          "<h2>" +
            _("7ea8e5ac9c30746ad4a82f3cf3fd8f78") +
            "</h2>" +
            c +
            '<div class="captcha"></div>'
        ),
          o.append(e),
          e.on("click", () => {
            e.remove(), this.render();
          });
      } else
        o.append(
          "<h2>" +
            _("7ea8e5ac9c30746ad4a82f3cf3fd8f78") +
            "</h2>" +
            c +
            '<div class="captcha"></div>'
        ),
          this.render();
    },
    showPending: function () {
      const e = $(".questlog");
      if (e.find("#botprotection_quest").length) return;
      const t = $(
        `<div class="quest" id="botprotection_quest" title="${_(
          "7ea8e5ac9c30746ad4a82f3cf3fd8f78"
        )}">\n                    <div class="quest_new ${
          game_data.market
        }">${_(
          "d6d01ab10ebf52d8f696db8a2f3097c3"
        )}</div>\n                </div>`
      );
      e.append(t),
        t.on("click", () => {
          BotProtect.showDialog(!0);
        });
    },
    showDialog: function (e) {
      if (!$("#popup_box_bot_protection").length) {
        var t = $(".captcha");
        if ((Dialog.close(!1), t.length))
          $(document).scrollTop(t.offset().top - 100);
        else {
          var o = "<h2>" + _("7ea8e5ac9c30746ad4a82f3cf3fd8f78") + "</h2>";
          (o += '<div class="captcha"></div>'),
            Dialog.show("bot_protection", o, null, {
              close_from_fader: e,
              allow_close: e,
            }),
            BotProtect.render();
        }
      }
    },
    render: function () {
      hcaptcha.render($(".captcha")[0], {
        callback: BotProtect.check,
        sitekey: BotProtect.key,
        theme: BotProtect.theme,
      });
    },
    check: function (e) {
      TribalWars.post(
        "botcheck",
        { ajaxaction: "verify" },
        { response: e },
        function (e) {
          e.success
            ? BotProtect.forced
              ? window.location.reload()
              : (Dialog.close(),
                $("#botprotection_quest").remove(),
                $("#bot_check").remove())
            : (UI.ErrorMessage(_("82e50c727674f251464fc7520f5bde26")),
              hcaptcha.reset());
        }
      );
    },
    theme: {
      palette: { text: { heading: "#000", body: "#000" } },
      component: {
        checkbox: {
          main: { fill: "#F4E4BC", border: "#7D510F" },
          hover: { fill: "#f5e6c2" },
        },
        challenge: {
          main: { fill: "#F4E4BC", border: "#7D510F" },
          hover: { fill: "#FAFAFA" },
        },
        breadcrumb: { main: { fill: "#7D510F" }, active: { fill: "#590505" } },
        button: {
          main: { fill: "#6c4824", icon: "#fff", text: "#fff" },
          hover: { fill: "#855b31" },
          focus: { icon: "#fff", text: "#fff", outline: "transparent" },
          active: { fill: "#F5F5F5", icon: "#555555", text: "#555555" },
        },
        link: { focus: { outline: "#0074BF" } },
        list: { main: { fill: "#fff3d3", border: "#6c4824" } },
        listItem: {
          main: { fill: "#fff3d3", line: "#f8eac6", text: "#000000" },
          hover: { fill: "#F4E4BC" },
          selected: { fill: "#eadcb5" },
          focus: { outline: "#0074BF" },
        },
        input: {
          main: { fill: "#fff3d3", border: "#7D510F" },
          focus: { fill: "#590505", border: "#333333", outline: "#94271a" },
        },
        radio: {
          main: { file: "#F5F5F5", border: "#919191", check: "#F5F5F5" },
          selected: { check: "#00838F" },
          focus: { outline: "#0074BF" },
        },
        task: {
          main: { fill: "#F5F5F5" },
          selected: { badge: "#00838F", outline: "#00838F" },
          report: { badge: "#EB5757", outline: "#EB5757" },
          focus: { badge: "#00838F", outline: "#00838F" },
        },
        prompt: {
          main: { fill: "#fff3d3", border: "#fff3d3", text: "#000000" },
          report: { fill: "#EB5757", border: "#EB5757", text: "#FFFFFF" },
        },
        skipButton: {
          main: { fill: "#919191", border: "#919191", text: "#FFFFFF" },
          hover: { fill: "#555555", border: "#919191", text: "#FFFFFF" },
          focus: { outline: "#7D510F" },
        },
        verifyButton: {
          main: { fill: "#9b0101", border: "#9b0101", text: "#FFFFFF" },
          hover: { fill: "#d62a0f", border: "#d62a0f", text: "#FFFFFF" },
          focus: { outline: "#7D510F" },
        },
        slider: {
          main: { bar: "#C4C4C4", handle: "#0F8390" },
          focus: { handle: "#0F8390" },
        },
        textarea: {
          main: { fill: "#F4E4BC", border: "#7D510F" },
          focus: { fill: "#F4E4BC", outline: "#0074BF" },
          disabled: { fill: "#919191" },
        },
      },
    },
  };
})(),
  $(function () {
    var e = $("body").data("bot-protect");
    e && BotProtect.show(e);
  });
