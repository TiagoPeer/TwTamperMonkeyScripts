Accountmanager = {
  buildings: {},
  techs: {},
  valid: !0,
  queue_type: "building",
  initQueue: function (e) {
    "string" == typeof e && (Accountmanager.queue_type = e);
    var a = $("#template_queue");
    a.find(".bqremove").click(Accountmanager.removeQueue),
      a.disableSelection(),
      a.sortable({
        axis: "y",
        handle: ".bqhandle",
        start: function (e, a) {
          a.item.addClass("selected");
        },
        stop: function (e, a) {
          a.item.removeClass("selected"), Accountmanager.recalcQueue();
        },
      }),
      $.each(
        $("#" + Accountmanager.queue_type + "_summary")
          .children()
          .not(".total"),
        function (e, a) {
          var t = (a = $(a)).data(Accountmanager.queue_type);
          Accountmanager.levelStorage()[t] = parseInt(a.find("a").text());
        }
      ),
      mobile &&
        (a.find(".order_up").click(function () {
          Accountmanager.moveQueueItemUp($(this).closest("li"));
        }),
        a.find(".order_down").click(function () {
          Accountmanager.moveQueueItemDown($(this).closest("li"));
        })),
      $("#auto_demolish").on("change", function (e) {
        $("#auto_demolish_exclude").toggle($(this).is(":checked"));
      }),
      Accountmanager.recalcQueue();
  },
  levelStorage: function () {
    return "building" == Accountmanager.queue_type
      ? Accountmanager.buildings
      : Accountmanager.techs;
  },
  recalcQueue: function () {
    var e;
    for (e in Accountmanager.levelStorage())
      Accountmanager.levelStorage().hasOwnProperty(e) &&
        (Accountmanager.levelStorage()[e] = 0);
    Accountmanager.valid = !0;
    var a = 0,
      t = 0;
    $.each($("#template_queue").children(), function (e, n) {
      var r = (n = $(n)).data(Accountmanager.queue_type),
        i = parseInt(n.find(".level_relative").text());
      if (
        ((Accountmanager.levelStorage()[r] += i),
        "building" == Accountmanager.queue_type)
      ) {
        var o, c;
        Accountmanager.hasRequ(r) &&
        Accountmanager.buildings[r] <= max_levels[r]
          ? n.removeClass("error")
          : (n.addClass("error"), (Accountmanager.valid = !1)),
          0 == e
            ? ((o = 0), (c = i))
            : (o = (c = Accountmanager.levelStorage()[r]) - i);
        for (var u = o + 1; u <= c; u++)
          building_data[r].hasOwnProperty(u) &&
            ((a += building_data[r][u].pop), (t += building_data[r][u].points));
        n.find(".pop").text(a),
          n
            .find(".points")
            .text(_("807427d3fa493e6981f40ed5ba70c48c").replace("%1", t)),
          current[r] >= c ? n.find("img").show() : n.find("img").hide();
      }
      n.find(".level_absolute").text(
        " (" +
          _("a0db49ba470c1c9ae2128c3470339153") +
          " " +
          Accountmanager.levelStorage()[r] +
          ")"
      );
    }),
      Accountmanager.updateSummary(),
      mobile && Accountmanager.updateQueueOrderButtons();
  },
  hasRequ: function (e) {
    if (!buildings[e]) return !0;
    var a;
    for (a in buildings[e])
      if (
        buildings[e].hasOwnProperty(a) &&
        buildings[e][a] > Accountmanager.buildings[a]
      )
        return !1;
    return !0;
  },
  saveQueue: function () {
    if (!Accountmanager.valid)
      return UI.ErrorMessage(_("9bc16ec63251f460c33fd2a966bb9e9b")), !1;
    var e = [],
      a = 0;
    return (
      $.each($("#template_queue").children(), function (t, n) {
        var r = (n = $(n)).data(Accountmanager.queue_type),
          i = parseInt(n.find(".level_relative").text());
        e[a++] = r + ":" + i;
      }),
      $("#queue_data").val(e.join(";")),
      !0
    );
  },
  updateSummary: function () {
    var e = 0;
    $.each(
      $("#" + Accountmanager.queue_type + "_summary")
        .children()
        .not(".total"),
      function (a, t) {
        var n = (t = $(t)).data(Accountmanager.queue_type);
        t.find("a").text(Accountmanager.levelStorage()[n]),
          (e += Accountmanager.levelStorage()[n]);
      }
    ),
      "tech" == Accountmanager.queue_type &&
        $("#" + Accountmanager.queue_type + "_summary")
          .find(".total")
          .text(e + " / " + tech_max);
  },
  addQueueItem: function (e, a, t, n) {
    if (isNaN(t))
      return UI.ErrorMessage(_("69da2485c0a5c7116d1e54afe10a62e1")), !1;
    if ("tech" == Accountmanager.queue_type) {
      if (Accountmanager.levelStorage()[e] + t > techs[e].max)
        return UI.ErrorMessage(_("9ee7d56f5c00e5f40ccaab159d2e6907")), !1;
      if (tech_max > 0)
        if (
          parseInt(
            $("#" + Accountmanager.queue_type + "_summary")
              .find(".total")
              .text()
          ) >= tech_max
        )
          return void UI.ErrorMessage(_("b2b00a25fe7812bab41875c07c38350d"));
    }
    var r = $("#base_link")
        .val()
        .replace("screen=", "screen=" + e),
      i = $("<li>")
        .data(Accountmanager.queue_type, e)
        .addClass("vis_item sortable_row");
    if (mobile) {
      var o = $("<div>").addClass("reorder").css("float", "right");
      o.append(
        $("<img>")
          .addClass("order_up")
          .attr("src", image_base + "m/arrow_up.png")
          .click(function () {
            Accountmanager.moveQueueItemUp($(this).closest("li"));
          })
      ),
        o.append(
          $("<img>")
            .addClass("order_down")
            .attr("src", image_base + "m/arrow_down.png")
            .click(function () {
              Accountmanager.moveQueueItemDown($(this).closest("li"));
            })
        ),
        i.append(o);
    } else
      i.append(
        $("<div>")
          .addClass("bqhandle")
          .css("float", "right ")
          .attr("title", _("de7db559b88170c428a53444cb45ce2e"))
      ),
        i.append(
          $("<div>")
            .addClass("bqremove")
            .css("float", "right ")
            .attr("title", _("1063e38cb53d94d386f21227fcd84717"))
            .click(Accountmanager.removeQueue)
        );
    var c = $("<div>").css("float", "left").css("width", "70%");
    "building" == Accountmanager.queue_type
      ? c.append(
          $("<a>")
            .addClass("inline-icon " + Accountmanager.queue_type + "-" + e)
            .attr("href", r)
            .text(a)
        )
      : c.append(
          $("<span>")
            .addClass("inline-icon " + Accountmanager.queue_type + "-" + e)
            .text(a)
        ),
      c.append(
        $("<span>")
          .addClass("level_relative")
          .text(" +" + t)
      ),
      c.append(
        $("<span>")
          .addClass("level_absolute")
          .text(
            " (" +
              _("a0db49ba470c1c9ae2128c3470339153") +
              " " +
              Accountmanager.levelStorage()[e] +
              ")"
          )
      ),
      c.append(
        $("<span>")
          .addClass("requ_error")
          .text(_("2ba2f16ee8bd8409feabe47a7efea0e0"))
      ),
      c.append(
        $(
          '<img src="/graphic/confirm.png" style="width: 14px; height: 14px; display: none" title="' +
            _("3edcebd869e4ab426ed66613ceef48eb") +
            '"/>'
        )
      ),
      i.append(c);
    var u = $("<div>").css("float", "left");
    "building" == Accountmanager.queue_type &&
      (u.append(
        $(
          '<div style="width: 70px; float: left"><span class="icon header population"> </span> <span class="pop"></span></div>'
        )
      ),
      u.append($('<span class="points"></span>'))),
      i.append(u),
      i.append('<br style="clear: both" />'),
      $("#template_queue").append(i),
      Accountmanager.recalcQueue(),
      UI.ToolTip("[title]"),
      n &&
        0 == Accountmanager.valid &&
        UI.ErrorMessage($(".requ_error").first().text());
  },
  moveQueueItemUp: function (e) {
    e.insertBefore(e.prev()), Accountmanager.recalcQueue();
  },
  moveQueueItemDown: function (e) {
    e.insertAfter(e.next()), Accountmanager.recalcQueue();
  },
  updateQueueOrderButtons: function () {
    var e = $("#template_queue");
    e.find(".order_up, .order_down").show(),
      e.find(".order_up").first().hide(),
      e.find(".order_down").last().hide();
  },
  addQueue: function () {
    var e = parseInt($("#add_levels").val());
    if (isNaN(e))
      return UI.ErrorMessage(_("69da2485c0a5c7116d1e54afe10a62e1")), !1;
    var a = $("#add_" + Accountmanager.queue_type).val(),
      t = $("#add_" + Accountmanager.queue_type + " option:selected").text();
    Accountmanager.addQueueItem(a, t, e, !1);
  },
  removeQueue: function (e) {
    if ("tech" == Accountmanager.queue_type) {
      var a = $(this).parent(),
        t = a.data("tech"),
        n = parseInt(a.find(".level_relative").text());
      if (Accountmanager.levelStorage()[t] - n < techs[t].min)
        return UI.ErrorMessage(_("923b9a91663ec20885f76d8aa416aaee")), !1;
    }
    $(this).parent().remove(), Accountmanager.recalcQueue();
  },
  editTroops: function (e) {
    (e = $(e)).parent().find("input").attr("checked", !0),
      $("#template_name").val(e.parent().find("span").text());
    var a = e.parent().parent();
    $.each(a.find("span"), function (e, a) {
      info = $(a);
      var t = info.data("field");
      t && (document.forms.trooplate.elements[t].value = info.text());
    }),
      Accountmanager.calcPop();
  },
  toggleFarmPriority: function (e) {
    $('select[name="population_upgrades"]').prop("disabled", !e.checked);
  },
  applyTrooplate: function (element, check) {
    var option = $(element).find("option:selected"),
      data = eval(option.data("json"));
    $.each(document.forms.trooplate.elements, function (e, a) {
      var t = $(a);
      if ("text" == t.attr("type")) {
        a = data ? data[t.attr("name")] : "";
        t.val(a);
      }
      if ("template_id" == t.attr("name")) {
        a = data ? data.id : "";
        t.val(a);
      }
    }),
      check &&
        ($(".am_troops_edit").prop("checked", !1),
        $(".am_troops_edit[value=" + data.id + "]").prop("checked", !0)),
      Accountmanager.calcPop();
  },
  calcPop: function () {
    var e = 0;
    $.each($("input[data-pop]"), function (a, t) {
      var n = $(t),
        r = n.data("pop") * n.val();
      r && (e += r);
    }),
      $("#calced_pop").text(e),
      e > 24e3
        ? $("#calced_pop").addClass("red")
        : $("#calced_pop").removeClass("red");
  },
  setVillageManagerStatus: function (e, a) {
    var t = (a = $(a)).data("status");
    if ("1" == t) t = 0;
    else {
      if ("0" != t) return !0;
      t = 1;
    }
    return (
      $.get(
        Accountmanager.change_village_status_link,
        { status: t, village_id: e },
        function (e) {
          var n = $(".village_status", a);
          a.data("status", "" + t == "1"),
            n.attr(
              "src",
              n
                .attr("src")
                .replace(/green|yellow/, "1" == t ? "yellow" : "green")
            );
        }
      ),
      !1
    );
  },
  ignoreWarning: function (e, a, t) {
    return (
      $.post(
        Accountmanager.ignore_all_link,
        { village_id: e, type: a },
        function (e) {
          $(t).parent("td").parent("tr").remove();
        }
      ),
      !1
    );
  },
  initTooltips: function () {
    UI.ToolTip($(".tooltip"));
  },
  editTemplateName: function (e, a) {
    var t = $(e).parent(),
      n = $.trim(t.find("a").text()),
      r = $('<input type="text" name="name" />').attr("value", n),
      i = $(
        '<input type="submit" class="btn" value="' +
          _("c9cc8cce247e49bae79f15173ce97354") +
          '" />'
      ),
      o = $('<form method="post"></form>')
        .attr("action", e.href)
        .append(r)
        .append(i);
    return t.children().remove(), t.append(o), !1;
  },
  setWidgetPageSize: function (e) {
    var a = parseInt(prompt(_("af6ced79f495cebd4a7e62da2b192a84")));
    if (!a) return !1;
    var t = {
      widget_id: $(e).parents(".am_widget").data("widget"),
      page_size: a,
    };
    return (
      $.post(
        Accountmanager.change_pagesize_link,
        t,
        function (e) {
          e.success && location.reload();
        },
        "json"
      ),
      !1
    );
  },
  changeTroops: function () {
    var e = $("#farm_units").serialize();
    return (
      $.post(
        Accountmanager.change_troops_link,
        e + "&target_screen=" + Accountmanager.target_screen,
        function (e) {
          e.widget &&
            ($("#am_widget_Farm .body").html(e.widget),
            UI.ToolTip($("#am_widget_Farm .tooltip")));
        },
        "json"
      ),
      !0
    );
  },
  farm: {
    display_queue: [],
    templates: [],
    current_units: [],
    page: null,
    page_size: null,
    hide_attacked: !1,
    should_update_queue: !0,
    plunders_exhausted: !1,
    waiting_for_display_queue_load: !1,
    no_remove: [],
    last_queued_class: null,
    extended: !0,
    nav_heuristic_threshold: 20,
    init: function () {
      this.hide_attacked &&
        (this.last_queued_class = /row_a/.test(
          $("#plunder_list > tbody > tr:last-child").attr("class")
        )
          ? "row_a"
          : "row_b"),
        $(".filter_display_toggler").click(function () {
          return $("#plunder_list_filters").toggle(), !1;
        }),
        "object" == typeof CommandPopup &&
          CommandPopup.hookCommandSent(function (e) {
            e.source_village.id === game_data.village.id &&
              (Accountmanager.farm.updateOwnUnitsAvailable(
                e.source_village.units
              ),
              Accountmanager.farm.hide_attacked &&
                "attack" === e.type &&
                Accountmanager.farm.updateNonAttacked(e.target_village.id));
          }),
        (this.page_size = parseInt($("#farm_pagesize").val()));
    },
    setPageSize: function (e) {
      if (e < 5)
        return UI.ErrorMessage(_("09f04dddb6f7a2d2680b3c11f75b0813")), !1;
      var a = { widget_id: "Farm", page_size: e };
      return (
        TribalWars.post(
          "am_overview",
          { ajaxaction: "set_page_size" },
          a,
          function (e) {
            location.reload();
          }
        ),
        !1
      );
    },
    unitsAppearAvailableAB: function (e) {
      try {
        return this.validateUnitsAppearAvailable(this.templates["t_" + e]), !0;
      } catch (e) {
        return !1;
      }
    },
    validateUnitsAppearAvailable: function (e) {
      for (unit_name in this.current_units)
        if (e[unit_name] && this.current_units[unit_name] < e[unit_name])
          throw "not enough units";
    },
    sendUnits: function (e, a, t) {
      var n = Timing.getElapsedTimeSinceLoad();
      if (!(this.last_click && n - this.last_click < 200)) {
        this.last_click = n;
        var r = $(e);
        if (r.hasClass("farm_icon_disabled") || r.data("clickhappy_lock"))
          return !1;
        if (!this.unitsAppearAvailableAB(t))
          return UI.ErrorMessage(_("8c51142762038a5b8e6c677aabcbedff")), !1;
        Accountmanager.farm.clickhappyLock(r);
        var i = { target: a, template_id: t, source: game_data.village.id };
        return (
          TribalWars.post(
            Accountmanager.send_units_link,
            null,
            i,
            function (e) {
              $(".farm_village_" + a)
                .addClass("farm_icon_disabled")
                .addClass("done"),
                Accountmanager.farm.updateOwnUnitsAvailable(e.current_units);
            },
            function () {
              var e = $(".report_" + a);
              e.find("*").stop().css({ height: "", "font-size": "" }),
                e.show(),
                Accountmanager.farm.no_remove.hasOwnProperty(a) &&
                  delete Accountmanager.farm.no_remove[a];
            }
          ),
          Accountmanager.farm.hide_attacked &&
            Accountmanager.farm.updateNonAttacked(a),
          !1
        );
      }
      UI.ErrorMessage(_("9a07c3a91c3f2b7a6a8bc675d1bcb913"));
    },
    sendUnitsFromReport: function (e, a, t, n) {
      if (
        (($link = $(e)),
        $link.hasClass("farm_icon_disabled") || $link.data("clickhappy_lock"))
      )
        return !1;
      Accountmanager.farm.clickhappyLock($link);
      var r = { report_id: t };
      return (
        TribalWars.post(
          Accountmanager.send_units_link_from_report,
          null,
          r,
          function (e) {
            "string" == typeof e.success &&
              (UI.SuccessMessage(e.success, 4e3),
              Accountmanager.farm.updateOwnUnitsAvailable(e.current_units)),
              $(".farm_village_" + a).addClass("farm_icon_disabled"),
              Accountmanager.farm.hide_attacked &&
                Accountmanager.farm.updateNonAttacked(a);
          }
        ),
        !1
      );
    },
    clickhappyLock: function (e) {
      e.data("clickhappy_lock", 1),
        setTimeout(function () {
          e.data("clickhappy_lock", 0);
        }, 400);
    },
    updateOwnUnitsAvailable: function (e) {
      for (unitName in e) {
        if (e.hasOwnProperty(unitName) && e[unitName] >= 0)
          $("#units_home #" + unitName).text(e[unitName]),
            (this.current_units[unitName] = e[unitName]);
      }
    },
    updateNavigation: function (e) {
      TribalWars.get("am_farm", { ajax: "nav", Farm_page: e }, function (e) {
        $("#plunder_list_nav").find("td").first().html(e.navigation);
      });
    },
    deleteReport: function (e) {
      return (
        $.post(
          Accountmanager.delete_report_link,
          { id: e },
          function (a) {
            a.error ? UI.ErrorMessage(a.error) : $(".report_" + e).remove();
          },
          "json"
        ),
        !1
      );
    },
    addPlundersToDisplayQueue: function (e, a) {
      var t = {
        ajax: "page_entries",
        Farm_page: e,
        class: Accountmanager.farm.last_queued_class,
        extended: Number(Accountmanager.farm.extended),
      };
      TribalWars.get("am_farm", t, function (e) {
        (Accountmanager.farm.last_queued_class = e.last_queued_class),
          $.merge(Accountmanager.farm.display_queue, e.plunder_list),
          a && a();
      });
    },
    appendPlunderFromQueue: function () {
      Accountmanager.farm.waiting_for_display_queue_load
        ? setTimeout(function () {
            Accountmanager.farm.appendPlunderFromQueue();
          }, 16)
        : Accountmanager.farm.display_queue.length > 0 &&
          (($new_entry = $(
            Accountmanager.farm.display_queue.shift()
          ).insertAfter($("#plunder_list > tbody > tr:last-child"))),
          UI.ToolTip($new_entry.find(".tooltip")));
    },
    loadPlundersIfNeeded: function (e) {
      Accountmanager.farm.should_update_queue &&
        0 == Accountmanager.farm.display_queue.length &&
        ((Accountmanager.farm.should_update_queue = !1),
        (Accountmanager.farm.waiting_for_display_queue_load = !0),
        Accountmanager.farm.addPlundersToDisplayQueue(
          Accountmanager.farm.page + 1,
          function () {
            Accountmanager.farm.display_queue.length > 0 &&
              (Accountmanager.farm.should_update_queue = !0),
              (Accountmanager.farm.waiting_for_display_queue_load = !1);
          }
        ),
        e &&
          ($(".paged-nav-item").length <
          Accountmanager.farm.nav_heuristic_threshold
            ? $(".paged-nav-item:last").remove()
            : Accountmanager.farm.updateNavigation(Accountmanager.farm.page)));
    },
    updateNonAttacked: function (e) {
      if (this.no_remove[e]) return !1;
      this.no_remove[e] = !0;
      var a = $("#plunder_list").find("tr:visible").length;
      a <= this.page_size + 1 &&
        (this.appendPlunderFromQueue(), this.loadPlundersIfNeeded(!0)),
        $(".report_" + e)
          .find("*")
          .animate({ height: "0px", "font-size": 0 }, 120, function () {
            $(".report_" + e).hide(),
              a < 2 &&
                (this.plunders_exhausted ||
                  ((this.plunders_exhausted = !0),
                  0 === this.page && $("#plunder_list_nav").remove(),
                  $("#plunder_list > tbody > tr:last").html(
                    '<td colspan="12"><i>' +
                      _("9ef623b3ded0e768943b7edf3a09ab5b") +
                      "</i></td>"
                  )));
          });
    },
    reloadPlunderWidget: function (e) {
      $("#am_widget_Farm .body").html(e),
        Accountmanager.initTooltips(),
        Accountmanager.farm.setPageHistory(0),
        (this.display_queue = []),
        (this.plunders_exhausted = !1),
        (this.waiting_for_display_queue_load = !1),
        (this.no_remove = []),
        (this.should_update_queue = !0),
        this.loadPlundersIfNeeded();
    },
    setPageHistory: function (e) {
      var a = document.location.href;
      "#" === a.substr(-1) && (a = a.substr(0, a.length - 1));
      var t = /Farm_page=[0-9]{1,}/;
      t.test(a)
        ? (a = a.replace(t, "Farm_page=" + e))
        : (a += "&Farm_page=" + e),
        Modernizr.history && history.replaceState({}, "", a);
    },
    toggleFilter: function (e, a, t) {
      var n = { extended: 0 + t, target_screen: Accountmanager.target_screen };
      return (
        (n[e.key] = 0 + a.checked),
        TribalWars.post(e.url, null, n, function (e) {
          e.widget && Accountmanager.farm.reloadPlunderWidget(e.widget);
        }),
        !0
      );
    },
    toggleAllVillages: function (e, a) {
      var t = {
        key: "all_villages",
        url: Accountmanager.toggle_all_villages_link,
      };
      this.toggleFilter(t, e, a);
    },
    toggleShowFullLosses: function (e, a) {
      var t = {
        key: "full_losses",
        url: Accountmanager.toggle_show_full_losses_link,
      };
      this.toggleFilter(t, e, a);
    },
    toggleShowPartialLosses: function (e, a) {
      var t = {
        key: "partial_losses",
        url: Accountmanager.toggle_show_partial_losses_link,
      };
      this.toggleFilter(t, e, a);
    },
    toggleShowAttacked: function (e, a) {
      var t = {
        key: "show_attacked",
        url: Accountmanager.toggle_show_attacked_link,
      };
      this.toggleFilter(t, e, a);
    },
    toggleOnlyFullHauls: function (e, a) {
      var t = {
        key: "only_full_hauls",
        url: Accountmanager.toggle_only_full_hauls_link,
      };
      this.toggleFilter(t, e, a);
    },
    openRallyPoint: function (e, a) {
      1 != a.which ||
        a.ctrlKey ||
        a.shiftKey ||
        (a.preventDefault(), CommandPopup.openRallyPoint({ target: e }));
    },
  },
  warehouse: {
    init: function () {
      $("#power_button").data("init")
        ? $("#power_button_link").on("click", Accountmanager.warehouse.disable)
        : $("#power_button_link").on("click", Accountmanager.warehouse.enable),
        $("#save_advanced_settings").click(
          Accountmanager.warehouse.saveAdvancedSettings
        );
    },
    enable: function () {
      return (
        TribalWars.post(
          "am_warehouse",
          { ajaxaction: "enable" },
          {},
          function () {
            $("#power_button_status_text").html(
              _("4d3d769b812b6faa6b76e1a8abaece2d")
            ),
              $("#power_button_link").html(
                _("11a755d598c0c417f9a36758c3da7481")
              ),
              $("#power_button_link")
                .off("click")
                .on("click", Accountmanager.warehouse.disable);
          }
        ),
        !1
      );
    },
    disable: function () {
      return (
        TribalWars.post(
          "am_warehouse",
          { ajaxaction: "disable" },
          {},
          function () {
            $("#power_button_status_text").html(
              _("3cab03c00dbd11bc3569afa0748013f0")
            ),
              $("#power_button_link").html(
                _("2faec1f9f8cc7f8f40d521c4dd574f49")
              ),
              $("#power_button_link")
                .off("click")
                .on("click", Accountmanager.warehouse.enable);
          }
        ),
        !1
      );
    },
    showAllSettings: function (e) {
      return $(e).hide(), $("#scary_looking_settings").show(), !1;
    },
    editGroups: function () {
      return (
        $("#edit_group_reserves").hide(),
        $("#save_group_reserves").show(),
        $(".am_stockpile_group_no_send_item").show().find("input").show(),
        !1
      );
    },
    editGroupsPriorityReceive: function () {
      return (
        $("#edit_groups_priority_receive").hide(),
        $("#save_groups_priority_receive").show(),
        $(".am_stockpile_group_priority_receive_item")
          .show()
          .find("input")
          .show(),
        !1
      );
    },
    saveAdvancedSettings: function () {
      var e = $("#advanced_settings").serializeArray();
      return (
        TribalWars.post(
          "am_warehouse",
          { ajaxaction: "save_advanced_settings" },
          e,
          function (e) {
            document.location = e;
          }
        ),
        !1
      );
    },
  },
};
