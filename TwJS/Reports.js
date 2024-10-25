(Report = {
  PREVIEW_DESIRED_SIZE: 518,
  PREVIEW_MIN_SCALE: 0.75,
  previewing: !1,
  Data: {},
  Memory: { toggle: {} },
  init: function () {
    $(".report-link")
      .on("mouseenter", function () {
        var e = $(this);
        (Report.previewing = e.data("id")),
          e.parents("tr").first().offset().left >=
            Report.PREVIEW_DESIRED_SIZE * Report.PREVIEW_MIN_SCALE &&
            setTimeout(function () {
              Report.showPreview(e);
            }, 100);
      })
      .on("mouseleave", function () {
        Report.closePreview();
      });
  },
  showPreview: function (e) {
    if (Report.previewing === e.data("id")) {
      var t = e.parents("tr").first();
      TribalWars.get(
        "report",
        { ajax: "view", id: e.data("id") },
        function (o) {
          if (Report.previewing === e.data("id")) {
            var r = t.offset().left,
              i =
                r > Report.PREVIEW_DESIRED_SIZE
                  ? 1
                  : r / Report.PREVIEW_DESIRED_SIZE,
              n = $(".report-preview"),
              p = $(".report-preview-content"),
              a = t.offset().left - Report.PREVIEW_DESIRED_SIZE * i,
              l = t.offset().top - 50 - $(window).scrollTop(),
              s = $(window).height();
            p.html(o.dialog),
              n.show().css({
                left: a + "px",
                top: l + "px",
                transform: "scale(" + i + ")",
              });
            var c = p.height();
            c + l > s - 100 && ((l = (s - c) / 2), n.css("top", l + "px")),
              setTimeout(function () {
                Report.markRead(e.data("id"));
              }, 2e3);
          }
        }
      );
    }
  },
  markRead: function (e) {
    Report.previewing === e &&
      ($(".report-" + e).removeClass("unread"),
      TribalWars.post(
        "report",
        { ajaxaction: "mark_read" },
        { id: e },
        function () {},
        function () {},
        !0
      ));
  },
  closePreview: function () {
    (Report.previewing = !1), $(".report-preview").hide();
  },
  registerCollapsible: function () {
    $("fieldset.collapsible > legend > a").each(function () {
      $(this).click(Report.toggleCollapsible),
        $(this).attr("id", Math.round(1e4 * Math.random()));
    });
  },
  toggleCollapsible: function (e) {
    var t = parseInt($(this).attr("id"));
    Report.Memory.toggle[t]
      ? (Report.Memory.toggle[t] += 1)
      : (Report.Memory.toggle[t] = 1),
      Report.Memory.toggle[t] % 2
        ? ($(this).children("img").attr("src", "graphic/arrow_up_padd.png?1"),
          $(this).parent().nextAll().show())
        : ($(this).children("img").attr("src", "graphic/arrow_down_padd.png?1"),
          $(this).parent().nextAll().hide());
  },
  toggleFilters: function (e, t) {
    $(".report_filter, #report_filter_hide").toggle(),
      $.ajax({ url: e, type: "POST", data: { filter_shown: t } });
  },
  RealMassForward: {
    init: function () {
      Report.registerCollapsible();
    },
  },
  Publish: {
    init: function () {
      $('input[type="checkbox"]').length - 1 == $("input:checked").length &&
        Report.Publish.toggleAll();
    },
    toggleAll: function () {
      this.toggle
        ? ($('input[type="checkbox"]').prop("checked", !1), (this.toggle = !1))
        : ((this.toggle = !0), $('input[type="checkbox"]').prop("checked", !0));
    },
  },
}),
  $(function () {
    Report.init();
  });
