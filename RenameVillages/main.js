const tag_options = {
  id: '<span class="name_option id" data-name="id">Id</span>',
  continent:
    '<span class="name_option continent" data-name="continent">Continente</span>',
};

const new_tag_options = {
  id: {
    class: "id",
    text: "Id",
  },
  continent: {
    class: "continent",
    text: "Continente",
  },
  coord_x: {
    class: "coord_x",
    text: "Xcoord",
  },
  coord_y: {
    class: "coord_y",
    text: "Ycoord",
  },
  custom_text: {
    class: "custom_text",
    text: "Texto",
  },
};

function createUI() {
  let divWidth = $("#production_table").width() * 0.8;

  let html = `
    <table class="vis" style="width:100%; margin-bottom:20px;">
        <thead>
            <tr>
                <th colspan="2">Renomear Aldeias</th>
            </tr>
        </thead>
        <tbody>
            <tr class="nowrap">
                <td>
                    Formato:
                </td>
                <td>
                    <div id="editableDiv" contentEditable="true" style="margin:10px 0; min-width:${divWidth}px"></div>
                </td>
            </tr>
            <tr class="nowrap">
                <td colspan="2">
                    <div id="tag_options">
                    </div>
                </td>
            </tr>
            <tr class="nowrap">
                <td colspan="2">
                    <span class="btn" id="rename_villages">Renomear</span>
                </td>
            </tr>
        </tbody>
    </table>
    `;

  let style = `
        <style>
            #editableDiv{
                background-color:white;
                padding:5px;
                border-radius:10px;
                min-height:15px;
            }

            #tag_options{
                padding:10px;
            }

            .name_option{
                font-size:9px;
                border-radius:10px;
                border: 1px solid black;
                padding:3px;
                margin: 2px;
                background-color:white;
                color:black;
                overflow:clip;
                display:inline-flex;
                width:fit-content;
            }

            #tag_options .name_option{
                margin: 3px;
                cursor:pointer;
            }

            .name_option.continent{
                background-color:green;
                color:white;
            }

            .name_option.id{
                background-color:black;
                color:white;
            }

            .name_option.coord_x{
                background-color:yellow;
                color:black;
            }

            .name_option.coord_y{
                background-color:orange;
                color:black;
            }

            .custom_input{
                border: none;
            }
        </style>
    `;

  $("#paged_view_content").before(style);
  $("#paged_view_content").before(html);
  renderOptions();
  registerHandlers();
}

function renderOptions() {
  let html = ``;
  $.each(new_tag_options, function (_, value) {
    html += `<span class="name_option ${value.class}" data-name="${value.class}">${value.text}</span>`;
  });

  $("#tag_options").append(html);
}

function addCustomText() {}

function registerHandlers() {
  $(".name_option").on("click", (e) => {
    addOptionToFormatDiv($(e.target).data("name"));
  });

  $("#add_custom_text").on("click", () => {
    let text = $("#custom_text").val();
    $("#custom_text").val("");
    const editableDiv = document.getElementById("editableDiv");
    const newNode = document.createElement("span");
    const input = document.createElement("input");
    input.type = "text";
    input.value = text;
    input.classList += "custom_input";
    input.style.width = text.length + 15 + "px";
    input.addEventListener("input", function () {
      this.style.width = this.value.length * 5.75 + "px";
    });
    newNode.classList += "name_option custom_text";

    newNode.appendChild(input);
    editableDiv.appendChild(newNode);
  });

  $("#rename_villages").on("click", () => {
    renameVillages();
  });

  const editableDiv = document.getElementById("editableDiv");
  editableDiv.contentEditable = false;
}

function addOptionToFormatDiv(name) {
  let tag_option = new_tag_options[name];
  const editableDiv = document.getElementById("editableDiv");
  const newNode = document.createElement("span");
  if (tag_option.class === "custom_text") {
    let text = "texto";
    const editableDiv = document.getElementById("editableDiv");
    const newNode = document.createElement("span");
    const input = document.createElement("input");
    const div = document.createElement("div");
    input.type = "hidden";
    input.value = text;
    div.innerHTML = text;
    div.classList += "input-div";
    div.contentEditable = true;
    div.addEventListener("input", function (e) {
      div.nextSibling.value = e.target.innerHTML;
    });
    newNode.classList += "name_option custom_text";
    newNode.draggable = true;

    newNode.appendChild(div);
    newNode.appendChild(input);
    editableDiv.appendChild(newNode);
    return;
  }
  newNode.innerHTML = tag_option.text;
  newNode.classList += "name_option ";
  newNode.classList += tag_option.class;
  newNode.draggable = true;

  // Append the new <span> element to the existing content
  editableDiv.appendChild(newNode);
}

function renameVillages() {
  let numberOfVillages = parseInt(game_data.player.villages);
  let table = $("#production_table");
  for (let index = 0; index < numberOfVillages; index++) {
    let formatOptionsSpans = $("#editableDiv").find("span");
    let formatOptions = [];
    for (let i = 0; i < formatOptionsSpans.length; i++) {
      let classList = formatOptionsSpans[i].classList.value.replace(
        "name_option ",
        ""
      );
      if (classList.includes("custom_text")) {
        console.log(formatOptionsSpans[i]);
        classList += " - " + formatOptionsSpans.eq(i).find("input").val();
      }
      formatOptions.push(classList);
    }
    let villageId = table
      .find("tbody")
      .find("tr")
      .eq(0)
      .find("td")
      .eq(1)
      .find("span")
      .data("id");
    let villageInfoObj = {
      continent: "",
      x: "",
      y: "",
    };
    $.ajax({
      url: `https://${
        TribalWars.getGameData().world
      }.tribalwars.com.pt/game.php?village=${villageId}&screen=info`,
      method: "GET",
      success: function (data) {
        const html = $(data);
        let villageInfo = html
          .find("#menu_row2")
          .find("td")
          .eq(1)
          .find("b")
          .text();
        villageInfoObj.x = villageInfo.substring(1, 4);
        villageInfoObj.y = villageInfo.substring(5, 8);
        villageInfoObj.continent = villageInfo.substring(11, 13);

        let villageNameParts = [];
        for (let i = 0; i < formatOptions.length; i++) {
          console.log(formatOptions[i]);
          switch (true) {
            case formatOptions[i] === "id":
              villageNameParts.push(
                formatToPadDigits(numberOfVillages.length, index + 1)
              );
              break;
            case formatOptions[i] === "continent":
              villageNameParts.push(villageInfoObj.continent);
              break;
            case formatOptions[i] === "coord_x":
              villageNameParts.push(villageInfoObj.x);
              break;
            case formatOptions[i] === "coord_y":
              villageNameParts.push(villageInfoObj.y);
              break;
            case formatOptions[i].includes("custom_text"):
              villageNameParts.push(formatOptions[i].substring(14));
              break;
            default:
              break;
          }
        }

        let row = table.find("tbody").find("tr").eq(index);
        let nameCol = $("#production_table")
          .find("tbody")
          .find("tr")
          .eq(0)
          .find("td")
          .eq(1);
        nameCol.find(".rename-icon").click();
        nameCol.find("input").eq(0).val(villageNameParts.join(""));
        nameCol.find("input").eq(1).click();
      },
      error: function (error) {
        console.error("Error fetching the page:", error);
        reject(error);
      },
    });
  }
}

function formatToPadDigits(pad, num) {
  return num.toString().padStart(pad, "0");
}

createUI();
