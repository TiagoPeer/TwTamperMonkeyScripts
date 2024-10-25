/**** game/UI.js_ ****/
var UI;
!(function () {
  "use strict";
  UI = {
    init: function () {
      if ("undefined" != typeof game_data) {
        var e = this;
        this.initUIElements(),
          this.initDialogs(),
          $(".evt-confirm").on("click", UI.getConfirmHandler()),
          $(".error_box").on("click", function () {
            window.getSelection().toString() ||
              $(this).fadeOut(500, function () {
                $(this).remove();
              });
          }),
          this.InitProgressBars(),
          $.widget(
            "ui.autocomplete",
            $.ui.autocomplete,
            UI.AutoComplete.extension_targeted_suggestions
          ),
          "undefined" == typeof mobile ||
            mobile ||
            $(".autocomplete").autocomplete({
              minLength: 2,
              source: UI.AutoComplete.source,
              focus: UI.AutoComplete.handleFocus,
              delay: 0,
            }),
          UI.ToolTip("[title]"),
          UI.ToolTip(".tooltip-delayed", { delay: 400 }),
          window.mobile &&
            $(".mds-tooltip").on("click", function () {
              return Dialog.show("tooltip", $(this).attr("title")), !1;
            }),
          UI.checkForMessages(),
          UI.FormAbandon.init(),
          UI.FormAllowOneSubmission.init(),
          UI.Help.init(),
          UI.initHintToggle(),
          UI.ConfirmationSkipping.supported() &&
            void 0 !== game_data.player.confirmation_skipping_hash &&
            UI.ConfirmationSkipping.init(
              game_data.player.confirmation_skipping_hash
            ),
          UI.fixupCSRFInUrl(),
          require(["Ig/TribalWars/Modules/UI/FormSubmit"], function (e) {
            new e();
          }),
          game_data.two_factor &&
            !this.two_factor &&
            require(["Ig/TribalWars/Modules/TwoFactor"], function (t) {
              e.two_factor = new t();
            });
      }
    },
    fixupCSRFInUrl: function () {
      $('form[action*="&h="]').each(function () {
        var e = $(this),
          t = e.attr("action"),
          i = t.match(/&h=([a-f0-9]+)/)[1];
        0 === e.find("input[name=h]").length &&
          e.append('<input type="hidden" name="h" value="' + i + '" />'),
          e.attr("action", t.replace(/&h=([a-f0-9]+)/, ""));
      });
    },
    initHintToggle: function () {
      $(".hint-toggle")
        .off("click.hints")
        .on("click.hints", function () {
          var e = $(this);
          e.closest(".info_box").fadeOut(),
            e.closest(".mobileNotification").fadeOut(),
            e.data("setting")
              ? TribalWars.setSetting(e.data("setting"), 0)
              : TribalWars.suppressHint(e.data("hint"));
        });
    },
    AutoComplete: {
      url: null,
      source: function (e, t) {
        var i = this.element.data("type");
        -1 !== e.term.indexOf(";") && t([]),
          $.post(
            UI.AutoComplete.url,
            { type: i, text: e.term },
            function (e) {
              t(e);
            },
            "json"
          );
      },
      handleFocus: function (e, t) {
        UI.AutoComplete.highlightMenuItem(t.item.label);
      },
      highlightMenuItem: function (e) {
        var t = $(".ui-autocomplete.ui-menu > li > a");
        $.each(t, function (t, i) {
          var n = $(i);
          n.html() == e ? n.addClass("selected") : n.removeClass("selected");
        });
      },
      extension_targeted_suggestions: {
        _renderMenu: function (e, t) {
          var i = this,
            n = t[0];
          if (
            i.element.data("ignore-single-exact-match") &&
            n.targeted.length + n.common.length === 1 &&
            (n.targeted.length
              ? n.targeted[0]
              : n.common[0]
            ).label.toUpperCase() === i.element.val().toUpperCase()
          )
            return void e.addClass("no-suggestions");
          if (n.targeted.length || n.common.length)
            e.removeClass("no-suggestions"),
              n.targeted.length &&
                $.each(n.targeted, function (t, n) {
                  i._renderItemData(e, n);
                }),
              n.targeted.length &&
                n.common.length &&
                e.append("<li><hr/></li>"),
              $.each(n.common, function (t, n) {
                i._renderItemData(e, n);
              });
          else {
            var o = this.element.data("no-suggestions-hint");
            if (o) {
              var a = $("<li>" + o + "</li>");
              return (
                a.data("ui-autocomplete-item", { label: o, value: "" }),
                void e.append(a)
              );
            }
            e.addClass("no-suggestions");
          }
        },
      },
    },
    Throbber: $(
      '<img alt="' +
        _("8524de963f07201e5c086830d370797f") +
        '" title="' +
        _("8524de963f07201e5c086830d370797f") +
        '" />'
    ).attr("src", "/graphic/throbber.gif"),
    initDialogs: function () {
      $(".dialog-opener")
        .off("click.dialog")
        .on("click.dialog", function () {
          var e = $(this),
            t = e.data("name"),
            i = e.data("screen"),
            n = e.data("ajax"),
            o = e.data("params");
          return Dialog.fetch(t, i, $.extend({ ajax: n }, o)), !1;
        });
    },
    initUIElements: function () {
      $("#premium_points_buy, .premium-buy")
        .off("click")
        .click(function (e) {
          mobile || (Premium.buy(), e.preventDefault());
        }),
        Premium.initChecks();
    },
    InitProgressBars: function () {
      $(".progress-bar:not(.progress-bar-alive)").each(function () {
        UI.initProgressBar($(this));
      });
    },
    initProgressBar: function (e) {
      var t = e.children(":first").html(),
        i = (e.data("prefix") || "") + " ",
        n = " " + (e.data("suffix") || ""),
        o = e.find("div");
      "100%" === o[0].style.width && o.addClass("full");
      var a = $("<span>" + (i + t + n).trim() + "</span>")
        .addClass("label")
        .css("width", e.width() + "px");
      UI.onResizeEnd(e, function () {
        a.css("width", e.width() + "px");
      }),
        o.first().append(a),
        e.addClass("progress-bar-alive");
    },
    updateProgressBar: function (e, t, i) {
      var n = (t / i) * 100,
        o = (e.data("prefix") || "") + " ",
        a = " " + (e.data("suffix") || ""),
        s = e.find("div");
      s.css("width", n + "%"),
        100 == n && s.addClass("full"),
        e
          .find(".label")
          .html((o + Format.number(t) + " / " + Format.number(i) + a).trim());
    },
    checkForMessages: function () {
      var e = $.cookie("success_message");
      e && UI.SuccessMessage(e.replace(/\+/g, " ")),
        $.removeCookie("success_message");
    },
    Image: function (e, t) {
      var i = { src: image_base + e };
      return $.extend(i, t), $('<img alt="" />').attr(i);
    },
    CommandIcon: function (e, t) {
      var i = $("<span>").attr("data-command-id", t.unit);
      e.class && i.addClass(e.class);
      var n = e.tooltip || "";
      return (
        t.own_command || t.is_shared
          ? (i.addClass("command_hover_details"),
            i.attr("data-icon-hint", escapeHtml(n, !0)),
            i.attr("data-command-type", t.type),
            Command.initHoverDetails(i))
          : (i.addClass("tooltip"), i.attr("title", escapeHtml(n, !0))),
        i.append(UI.Image(e.img, {})),
        i
      );
    },
    ToolTip: function (e, t) {
      if (!mobile) {
        $(e).tooltip(
          $.extend(
            {
              showURL: !1,
              track: !0,
              fade: 0,
              delay: 0,
              showBody: " :: ",
              extraClass: "tooltip-style",
            },
            t
          )
        );
      }
    },
    Draggable: function (e, t) {
      var i = {
          savepos: !0,
          cursor: "move",
          handle: $(e).find("div:first"),
          appendTo: "body",
          containment: [0, 60],
        },
        n = $.extend(i, t);
      $(e).draggable(n),
        n.savepos &&
          $(e).bind("dragstop", function () {
            var t = $(document),
              i = $(e).offset().left - t.scrollLeft(),
              n = $(e).offset().top - t.scrollTop();
            $.cookie("popup_pos_" + $(e).attr("id"), i + "x" + n);
          });
    },
    Sortable: function (e, t) {
      var i = {
        cursor: "move",
        handle: $(e).find("div:first"),
        opacity: 0.6,
        helper: function (e, t) {
          return (
            t.children().each(function () {
              $(this).width($(this).width());
            }),
            t
          );
        },
      };
      $(e).sortable($.extend(i, t));
    },
    SlimScroll: function (e, t) {
      var i = $(e);
      t.maxHeight &&
        (i.css({ height: "", "max-height": t.maxHeight }), (t.height = "auto")),
        i.parent(".slimScrollDiv").length > 0 && i.parent().replaceWith(i),
        i.slimScroll(t),
        i.css("height", i.height() - (i.innerHeight() - i.height()));
    },
    ErrorMessage: function (e, t, i, n) {
      return UI.InfoMessage(e, t, "error", i, n);
    },
    SuccessMessage: function (e, t, i, n) {
      return UI.InfoMessage(e, t, "success", i, n);
    },
    InfoMessage: function (e, t, i, n, o) {
      $(".autoHideBox").remove(), (t = t || 2e3);
      var a =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement;
      function s(e) {
        e.remove(), "function" == typeof o.onRemoved && o.onRemoved();
      }
      (n = n || a || $("body")), (o = o || {}), !0 === i && (i = "error");
      var r = o.hasOwnProperty("is_html") && o.is_html ? e : "<p>" + e + "</p>";
      $("<div/>", {
        class: i ? "autoHideBox " + i : "autoHideBox",
        click: function () {
          s($(this));
        },
        html: r,
      })
        .appendTo(n)
        .delay(t)
        .fadeOut("slow", function () {
          s($(this));
        });
    },
    OmgMessage: function (e, t, i, n, o) {
      (i = i || ""), (o = o || $("#ds_body"));
      var a = e.offset().left - o.offset().left + e.width() / 2,
        s = e.offset().top - o.offset().top,
        r = s + e.height() / 2,
        c = s + e.height() - 5,
        d = $('<div class="omg-message-container">')
          .css({ top: Math.min(r - 10, c - 20), left: a - 150 })
          .appendTo(o),
        l = $('<span class="omg-message ' + i + '"></span>').text(t);
      "object" == typeof n && null !== n && l.css(n),
        l.appendTo(d),
        setTimeout(function () {
          d.remove();
        }, 2e3);
    },
    BanneredRewardMessage: function (e, t) {
      var i = s(
          '<div class="bannered-reward"><div class="bannered-reward-message">' +
            e +
            "</div></div>"
        ),
        n = $(i).appendTo("body");
      (t = t || 1800),
        setTimeout(function () {
          n.fadeOut(300, function () {
            n.remove();
          });
        }, t);
    },
    ConfirmationBox: function (e, t, i, n, o, a) {
      var r;
      if (
        ((i = i || "confirmation-box"),
        (n = n || !1),
        (o = o || !1),
        (a = a && UI.ConfirmationSkipping.supported()),
        $("#fader").remove(),
        a && UI.ConfirmationSkipping.shouldSkip(i))
      )
        return (
          $.each(t, function (e, t) {
            !0 === t.confirm && (r = t.callback);
          }),
          void r()
        );
      if (0 === $("#" + i).length) {
        !0 !== n &&
          t.push({
            text: _("ea4788705e6873b424c65e91c2846b19"),
            callback: function () {},
            cancel: !0,
          });
        var c = o ? "div" : "p";
        $(
          "<div id='fader'><div class='confirmation-box' id='" +
            i +
            "' role='dialog' aria-labelledby='confirmation-msg'><div class='confirmation-box-content-pane'><div class='confirmation-box-content'>" +
            s(
              "<%1 id='confirmation-msg' class='confirmation-msg'>%2</%3>",
              c,
              e,
              c
            ) +
            (a
              ? '<div class="skip-container"><label><input type="checkbox" id="confirmation-skip"/>' +
                _("7019f1ebdfd76051fdae9fc39cd668f4") +
                "</label></div>"
              : "") +
            "<div class='confirmation-buttons'></div></div></div></div></div>"
        )
          .appendTo("body")
          .css("z-index", "14999");
        var d = $("#" + i);
        d.outerWidth() % 2 == 1 && d.css("width", d.outerWidth() + 1 + "px");
        var l = d.find(".confirmation-buttons");
        $("#mNotifyContainer").hide();
        var f = function (e, t) {
          return function (n) {
            return (
              $("#fader > .confirmation-box").parent().hide(),
              $("#mNotifyContainer").show(),
              $(document).off("keydown.confirmbox"),
              a && t && $("#confirmation-skip").is(":checked")
                ? UI.ConfirmationSkipping.setShouldSkip(i, !0, function () {
                    e(n);
                  })
                : e(n),
              !1
            );
          };
        };
        $(t).each(function (e, t) {
          var i = $(
            "<button class='btn' aria-label'" +
              t.text +
              "'>" +
              t.text +
              "</button>"
          )
            .bind("click", f(t.callback, !0 === t.confirm))
            .appendTo(l);
          0 === e && i.focus(),
            !0 === t.confirm &&
              i.addClass("evt-confirm-btn").addClass("btn-confirm-yes"),
            !0 === t.cancel &&
              (i.addClass("evt-cancel-btn").addClass("btn-confirm-no"),
              $(document).on("keydown.confirmbox", null, "esc", f(t.callback)));
        });
        var u = d.find(".confirmation-box-content-pane"),
          m = window.innerHeight;
        if ("ios" === window.game_data.device) {
          m -= 50;
        }
        u.css({ "max-height": m - 60 + "px" });
        var p = u.find(".confirmation-box-content");
        p.outerHeight() > u.height() &&
          UI.SlimScroll(p, { height: "auto", alwaysVisible: !0 });
      }
    },
    ConfirmationSkipping: {
      STORAGE_KEY: "confirmation_skipping_preferences",
      STORAGE_HASH_KEY: "confirmation_skipping_preferences_hash",
      preferences: {},
      preferences_hash: "",
      supported: function () {
        return Modernizr.localstorage;
      },
      init: function (e) {
        this.loadFromClientStorage(),
          this.preferences_hash !== e && this.fetchPreferences();
      },
      shouldSkip: function (e) {
        return 1 === this.preferences[e];
      },
      setShouldSkip: function (e, t, i) {
        var n = { confirmation_box_id: e, should_skip: t },
          o = this;
        TribalWars.post(
          "api",
          { ajaxaction: "skip_confirmation" },
          n,
          function (e) {
            o.updateFromServerData(e.preferences, e.preferences_hash),
              "function" == typeof i && i();
          }
        );
      },
      fetchPreferences: function () {
        var e = this;
        TribalWars.get(
          "api",
          { ajax: "skip_confirmation_preferences" },
          function (t) {
            e.updateFromServerData(t.preferences, t.preferences_hash);
          }
        );
      },
      updateFromServerData: function (e, t) {
        (this.preferences = e),
          (this.preferences_hash = t),
          this.updateClientStorage(e, t);
      },
      updateClientStorage: function (e, t) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(e)),
          localStorage.setItem(this.STORAGE_HASH_KEY, t);
      },
      loadFromClientStorage: function () {
        var e = localStorage.getItem(this.STORAGE_KEY);
        null !== e &&
          "undefined" !== e &&
          ((this.preferences = JSON.parse(e)),
          (this.preferences_hash = localStorage.getItem(
            this.STORAGE_HASH_KEY
          )));
      },
    },
    getConfirmHandler: function (e) {
      return function (t) {
        t.preventDefault();
        var i = $(t.target);
        i.hasClass("evt-confirm") || (i = i.parents(".evt-confirm"));
        var n = e || i.data("confirm-msg");
        return (
          i.is("input, button") && UI.confirmSubmit(t, n),
          i.is("a") && UI.confirmLink(t, n),
          !1
        );
      };
    },
    confirmLink: function (e, t) {
      UI.addConfirmBox(t, function () {
        var t = $(e.target).attr("href");
        void 0 === t && (t = $(e.target).closest("a").attr("href")),
          (window.location = t);
      });
    },
    confirmSubmit: function (e, t) {
      var i = $(e.target),
        n = i.attr("name"),
        o = i.attr("value");
      n &&
        o &&
        ($("#submit-value-container").remove(),
        i.before(
          "<input id='submit-value-container' type='hidden' name='" +
            n +
            "' value='" +
            o +
            "' />"
        ));
      UI.addConfirmBox(t, function () {
        $(e.target).closest("form").submit();
      });
    },
    addConfirmBox: function (e, t) {
      var i = [
        {
          text: _("70d9be9b139893aa6c69b5e77e614311"),
          callback: t,
          confirm: !0,
        },
      ];
      UI.ConfirmationBox(e, i);
    },
    AjaxPopup: function (e, t, i, n, o, a, s, r, c, d, l) {
      var f = $(".top_bar").height(),
        u = $.extend(
          { dataType: "json", saveDragPosition: !0, container: "#ds_body" },
          a
        );
      if (u.reload || 0 === $("#" + t).length) {
        var m = null;
        if (e && (!c || !d)) {
          m = e.srcElement ? e.srcElement : e.target;
          var p = $(m).offset();
          c || (c = p.left), d || (d = p.top + $(m).height() + 1);
        }
        r || (r = "auto"), s || (s = "auto");
        var h,
          g = "#" + t;
        if (void 0 !== l)
          if (l.length > 0)
            for (h in l) l.hasOwnProperty(h) && (g = g + ", " + l[h]);
        var v = function (e) {
          var i = null;
          if (0 === $("#" + t).length) {
            i = $("<div>")
              .attr("id", t)
              .addClass("popup_style")
              .css({ width: s, position: "fixed" });
            var a = $("<div>")
                .attr("id", t + "_menu")
                .addClass("popup_menu")
                .html(n + '<a id="closelink_' + t + '" href="#">X</a>'),
              l = $("<div>")
                .attr("id", t + "_content")
                .addClass("popup_content")
                .css("height", r)
                .css("overflow-y", "auto");
            i.append(a).append(l),
              UI.Draggable(i, { savepos: u.saveDragPosition }),
              i.bind("dragstart", function () {
                document.onselectstart = function (e) {
                  e.preventDefault();
                };
              }),
              i.bind("dragstop", function () {
                document.onselectstart = function (e) {
                  $(e.target).trigger("select");
                };
              }),
              $(u.container).append(
                $('<div class="popup_helper"></div>').append(i)
              ),
              $("#closelink_" + t).click(function (e) {
                e.preventDefault(), $(g).toggle();
              });
          } else i = $("#" + t);
          if (
            (o
              ? o.call(this, e, $("#" + t + "_content"))
              : $("#" + t + "_content").html(e),
            $.cookie("popup_pos_" + t))
          ) {
            var m = $.cookie("popup_pos_" + t).split("x");
            (c = parseInt(m[0], 10)), (d = parseInt(m[1], 10));
          } else u.saveDragPosition && $.cookie("popup_pos_" + t, c + "x" + d);
          var p = i.outerHeight(),
            h = i.outerWidth(),
            v = $(window).width(),
            b = $(window).height();
          d + p > b && (d = b - p),
            c + h > v && (c = v - h),
            c < 0 && (c = 0),
            d < f && (d = f),
            i.css("top", d).css("left", c);
          var _ = function (e, t) {
            var i = $(document).height() - $(e).outerHeight(),
              n = [0, t, $(document).width() - $(e).outerWidth(), i];
            e.draggable("option", "containment", n);
          };
          _(i, f),
            $(window).resize(function () {
              _(i, f);
            }),
            i.show(),
            UI.init();
        };
        "json" === u.dataType
          ? TribalWars.get(i, {}, v)
          : "prerendered" === u.dataType
          ? v(i)
          : $.ajax({ url: i, dataType: u.dataType, success: v });
      } else $("#" + t).show();
    },
    Notification: {
      SHOW_TIME: 6e3,
      _queue: [],
      _displayed_notifications: 0,
      show: function (e, t, i, n) {
        if (!window.mobile) {
          var o = $("#side-notification-container");
          if (
            (o.length ||
              (o = $('<div id="side-notification-container"></div>').appendTo(
                "body"
              )),
            o.position().top > 100 || this._displayed_notifications < 1)
          ) {
            var a = $(
              '<div class="side-notification"><div class="img-container"><img src="' +
                e +
                '" alt="" /></div><div class="content"><strong>' +
                t +
                "</strong><p>" +
                i +
                "</p></div></div>"
            );
            a.on("click", n).prependTo(o).addClass("side-notification-visible"),
              this._displayed_notifications++;
            var s = this;
            setTimeout(function () {
              s.removeNotification(a);
            }, this.SHOW_TIME);
          } else
            this._queue.push({ img: e, title: t, content: i, callback: n });
        }
      },
      showNext: function () {
        if (!(this._queue.length < 1)) {
          var e = this._queue.shift();
          this.show(e.img, e.title, e.content, e.callback);
        }
      },
      removeNotification: function (e) {
        var t = this,
          i = function () {
            e.remove(), t._displayed_notifications--, t.showNext();
          };
        Modernizr.cssanimations
          ? (e
              .removeClass("side-notification-visible")
              .addClass("side-notification-hide"),
            e.on("transitionend webkitTransitionEnd", function (t) {
              e.off(t)
                .addClass("side-notification-shrink")
                .on("transitionend webkitTransitionEnd", function () {
                  i();
                });
            }))
          : i();
      },
      debug: function () {
        this.show(
          "/user_image.php?award=award1&level=4",
          "Achievement unlocked!",
          "Demolisher (Gold - Level 4) - Destroy 10.000 building levels using catapults"
        );
      },
    },
    FormAbandon: {
      active: !1,
      verify: function (e) {
        if (UI.FormAbandon.active)
          return (
            e.stopImmediatePropagation(), _("a8658061929ca8148ce4bf95935e72c6")
          );
      },
      init: function () {
        if ("steam" !== window.game_data.device) {
          $(window).on("beforeunload", UI.FormAbandon.verify);
          var e = $(".confirm_abandonment");
          e.change(function () {
            UI.FormAbandon.active = !0;
          }),
            e.submit(function () {
              UI.FormAbandon.active = !1;
            });
        }
      },
    },
    FormAllowOneSubmission: {
      init: function () {
        $(".submit-once").each(function () {
          UI.FormAllowOneSubmission.registerForm(this);
        });
      },
      registerForm: function (e) {
        var t = $(e);
        t.submit(function (e) {
          t.data("lock-submission")
            ? e.preventDefault()
            : UI.FormAllowOneSubmission.lockForm(t);
        }),
          t.removeClass("submit-once");
      },
      lockForm: function (e) {
        e.data("lock-submission", 1),
          e.find("input[type=submit]").addClass("btn-disabled");
      },
    },
    onResizeEnd: function (e, t) {
      UI.Resize.end_handlers.push(t),
        $(e).on("resize.end", function (e) {
          clearTimeout(UI.Resize.timeout),
            (UI.Resize.timeout = setTimeout(function () {
              UI.Resize.callEndHandlers(e);
            }, 50));
        });
    },
    Resize: {
      timeout: null,
      end_handlers: [],
      callEndHandlers: function (e) {
        for (var t = 0; t < this.end_handlers.length; t++)
          this.end_handlers[t](e);
      },
    },
    Help: {
      init: function () {
        $(".help_link")
          .off("click")
          .click(function (e) {
            e.preventDefault();
            var t = $(this);
            UI.Help.open(t.data("topic"), t.data("section"));
          });
      },
      open: function (e, t) {
        Dialog.fetch("ingame_help", "api", {
          ajax: "help",
          topic: e,
          section: t,
        });
      },
    },
  };
})(),
  $(document).ready(function () {
    UI.init();
  });
