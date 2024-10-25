function createTabBar() {
  var bar = `
        <div id="tabAIO" class="memo-tab"><span class="memo-tab-label">
            <a id="aioButton" href="javascript:void(0)">All In One TW</a>
        </span></div>
    `;

  $("#tab-bar").after(bar);

  $("#aioButton").on("click", function (e) {
    $(".memo-tab.memo-tab-selected").each((_, elem) => {
      let id = $(elem).attr("id").replace("tab_", "");
      let text = $(elem).find("strong").text();
      let html = `<a href="#" onclick="Memo.selectTab(${id}); return false">${text}</a>`;
      $(elem).removeClass("memo-tab-selected");
      $(elem).find(".memo-tab-label").html(html);
    });

    $(".memo_container").each((_, elem) => {
      $(elem).css("display", "none");
    });

    $("#aioTw").css("display", "block");
  });

  createContentDiv();
}

function createContentDiv() {
  var div = `
    <div id="aioTw" class="memo_container" style="display: block;">
        <div id="aioTwDiv" class="memo_script" style="clear: both; display: block;">
            <br>
            <div id="aioTwAds">
                <div id="AIO_TW_Menu">
                    <div class="forum-content" style="padding: 0;">
                        <table class="vis nowrap" style="width: 100%;">
                            <thead>
                                <tr>
                                    <th>
                                        <span class="column-title" style="font-size:16px;display: flex;justify-content: center;align-items: center;">AIO Tribalwars</span>
                                    </th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
            <br>
        </div>
    </div>
    `;

  $("#content_value").append(div);
  createAutoBuilderUI();
}

function createAutoBuilderUI() {
  createPluginDiv("Auto Builder", "", "#aioTw");
}

function createAutoRecruiterUI() {
  createPluginDiv("Auto Recruiter", "", "#aioTw");
}

function createPluginDiv(title, content, elem) {
  var div = `
      <div id="aioTwAutoBuilderDiv">
          <div class="forum-content" style="padding: 0;">
              <table class="vis nowrap" style="width: 100%;">
                  <thead>
                      <tr>
                          <th>
                              <span class="column-title" style="font-size:14px;display: flex;justify-content: left;align-items: center;">${title}</span>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                        ${content}
                  </tbody>
              </table>
          </div>
      </div>
      <br>
      `;

  $(elem).append(div);
}

createTabBar();
