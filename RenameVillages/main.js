
const tag_options = {
    id: '<span class="name_option id" data-name="id">Id</span>',
    continent: '<span class="name_option continent" data-name="continent">Continente</span>',
};

const new_tag_options = {
    id: {
        class: "id",
        text: "Id"
    },
    continent: {
        class: "continent",
        text: "Continente"
    },
    coord_x: {
        class: "coord_x",
        text: "Xcoord"
    },
    coord_y: {
        class: "coord_y",
        text: "Ycoord"
    }
}

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
            <tr>
                <td>Texto personalizado:</td>
                <td>
                    <input type="text" id="custom_text" />
                    <span class="btn" id="add_custom_text">Adicionar</span>
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

function addCustomText(){

}

function registerHandlers() {
    $(".name_option").on("click", (e) => {
        addOptionToFormatDiv($(e.target).data("name"));
    });

    $("#add_custom_text").on("click", () => {
        let text = $("#custom_text").val();
        $("#custom_text").val("");
        const editableDiv = document.getElementById("editableDiv");
        const newNode = document.createElement("span");
        newNode.innerHTML = text;
        newNode.classList += "name_option";

        editableDiv.appendChild(newNode);
    })

    const editableDiv = document.getElementById("editableDiv");
    editableDiv.contentEditable = false;
}

function addOptionToFormatDiv(name) {
    let tag_option = new_tag_options[name];
    const editableDiv = document.getElementById("editableDiv");
    const newNode = document.createElement("span");
    newNode.innerHTML = tag_option.text;
    newNode.classList += "name_option ";
    newNode.classList += tag_option.class;

    // Append the new <span> element to the existing content
    editableDiv.appendChild(newNode);
}

createUI()