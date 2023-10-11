// ==UserScript==
// @name         Enviar Ataques
// @version      0.2
// @author       TiagoPer
// @match        https://*&screen=place&try=confirm*
// @include      https://*&screen=place&try=confirm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tribalwars.com.pt
// ==/UserScript==

(function () {
    "use strict";

    const refreshPageSecondsBeforeAtack = 5 * 1000;
    const offset = 0;
    const storageData = localStorage.getItem("autosend_commands");
    let data = storageData != null ? JSON.parse(storageData) : null;
    const waitingAtack = data != null && data.command.commandDate > Date.now();
    let refreshTimeout;
    let atackTimeout;

    init();
    function init() {
        sanitazeStoredCommands();
        createUI();
        if (data != null && data.command != null) {
            addCommandsToUI(data.command.date);
            const serverTimeElement = document.querySelector("#serverTime");
            const serverDateElement = document.querySelector("#serverDate");

            var targetDate = new Date(data.command.commandDate).getTime();

            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === "childList") {
                        const serverTime = mutation.target.innerText;

                        observer.disconnect();

                        const [serverDay, serverMonth, serverYear] =
                            serverDateElement.innerText.split("/");

                        const [serverHour, serverMinute, serverSecond] =
                            serverTime.split(":");

                        const serverDate = new Date(
                            serverYear,
                            serverMonth - 1,
                            serverDay,
                            serverHour,
                            serverMinute,
                            serverSecond
                        );

                        var timeRemaining = targetDate - serverDate.getTime();

                        atackTimeout = setTimeout(atackButtonClick, timeRemaining);
                    }

                    break;
                }
            });

            const observerConfig = { childList: true };

            observer.observe(serverTimeElement, observerConfig);

            data.atacksRows.forEach((item, i) => {
                $("#troop_confirm_train").click();
                item.units.forEach((unit, index) => {
                    $(".unit-row").eq(i).find("input").eq(index).val(unit)
                    console.log(`Unit at index ${index}: ${unit}`);
                });
            });
            // TODO: Add remaining rows
            console.log(data.atacksRows)
        }
    }

    function sanitazeStoredCommands() {
        if (data != null && data.command != null) {
            let command_date = new Date(data.command.commandDate);
            if (command_date > Date.now())
                return;
        }
        data = null;
        localStorage.setItem("autosend_commands", null)
    }

    function createUI() {
        var html = `
        <div style="margin: 10px 0">
            <table class="vis" width="360">
                <tbody class="schedule_table">
                    <tr>
                        <th colspan="3">
                            <span>Agendar Ataque</span>
                        </th>
                    </tr>
                    <tr>
                        <td>
                            <input
                                type="text"
                                id="time_input"
                                class="target-input-field"
                                value=""
                                autocomplete="off"
                                placeholder="dd-mm-yyyy hh:mm:ss:ms"
                                style="width:-webkit-fill-available"
                                ${waitingAtack ? 'readonly="readonly"' : ''}
                            />
                        </td>
                        <td colspan="2" style="text-align:center">
                            <span class="btn" id="schedule_command">
                                Agendar
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        `;

        $("#place_confirm_units").before(html);
        initFields();
        registerHandlers();
    }

    function addCommandsToUI(date) {
        var html =
            `
            <tr>
                <td>
                    <span>Tempo de envio:</span>
                </td>
                <td>
                    ${date}
                </td>
                <td>
                    <span class="cancel_schedule">
                        <img src="https://dspt.innogamescdn.com/asset/82fdfe80/graphic/delete.png" alt="" class="cancel_link_icon">
                        </span>
                </td>
            </tr>
            `;
        $(".schedule_table").append(html);
        $(".cancel_schedule").on("click", (i, elem) => {
            cancelSchedule(i.target.closest("tr"))
        });
    }

    function registerHandlers() {
        if (!waitingAtack) {
            $("#schedule_command").on("click", scheduleCommand);
        }
    }

    function initFields() {
        var currentDate = new Date();

        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        var hours = currentDate.getHours();
        var minutes = currentDate.getMinutes();
        var seconds = currentDate.getSeconds();
        var milliseconds = currentDate.getMilliseconds();

        var formattedDay = day < 10 ? "0" + day : day;
        var formattedMonth = month < 10 ? "0" + month : month;
        var formattedHours = hours < 10 ? "0" + hours : hours;
        var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
        var formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

        var formattedDate = formattedDay + "-" + formattedMonth + "-" + year;
        var formattedTime = formattedHours + ":" + formattedMinutes + ":" + formattedSeconds + ":" + milliseconds;

        var formattedDateTime = formattedDate + " " + formattedTime;

        $("#time_input").val(waitingAtack ? JSON.parse(storageValue).date : formattedDateTime);
    }

    function parseDate(date) {
        var parts = date.split(/[ :\-]+/);

        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10);
        var year = parseInt(parts[2], 10);
        var hours = parseInt(parts[3], 10);
        var minutes = parseInt(parts[4], 10);
        var seconds = parseInt(parts[5], 10);
        var milliseconds = parseInt(parts[6], 10);

        return [day, month, year, hours, minutes, seconds, milliseconds];
    }

    async function scheduleCommand() {
        let timeValue = $("#time_input").val();
        let [day, month, year, hours, minutes, seconds, milliseconds] = parseDate(timeValue);
        let date = new Date(year, (month - 1), day, hours, minutes, seconds, milliseconds);
        let calculatedDate = await calculateTime(date);

        // TODO: Be able to send more than one command
        // Get the number of commands to send
        // var numberAtacks = document.getElementById("place_confirm_units").getElementsByClassName("units-row").length;
        // sessionStorage.setItem("number_atacks", numberAtacks);

        let atackRows = [];

        $(".units-row:not(:first)").each((i, elem) => {
            let units = [];
            $(elem).find("input").each((_, elem) => {
                units.push($(elem).val() == '' ? "0" : $(elem).val())
            })

            atackRows.push({ i, units })
        });

        addCommandsToUI(timeValue);

        let dataToStore = { command: { date: timeValue, commandDate: date }, atacksRows: atackRows };
        localStorage.setItem("autosend_commands", JSON.stringify(dataToStore));

        let refreshTime = calculatedDate - refreshPageSecondsBeforeAtack;

        refreshTimeout = setTimeout(function () {
            window.location.reload();
        }, refreshTime);
    }

    function cancelSchedule(elem){
        clearTimeout(refreshTimeout);
        clearTimeout(atackTimeout);

        $(elem).remove();
        data = null;
        localStorage.setItem("autosend_commands", data)
    }

    function calculateTime(targetDate) {
        return new Promise((resolve) => {
            const serverTimeElement = document.querySelector("#serverTime");
            const serverDateElement = document.querySelector("#serverDate");

            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === "childList") {
                        const serverTime = mutation.target.innerText;

                        observer.disconnect();

                        const [serverDay, serverMonth, serverYear] =
                            serverDateElement.innerText.split("/");

                        const [serverHour, serverMinute, serverSecond] =
                            serverTime.split(":");

                        const serverDate = new Date(
                            serverYear,
                            serverMonth - 1,
                            serverDay,
                            serverHour,
                            serverMinute,
                            serverSecond
                        );

                        let timeRemaining = targetDate - serverDate.getTime();

                        resolve(timeRemaining);
                    }

                    break;
                }
            });
            const observerConfig = { childList: true };
            observer.observe(serverTimeElement, observerConfig);
        });
    }

    function atackButtonClick() {
        var btn = document.getElementById("troop_confirm_submit");
        btn.click();
    }
})();