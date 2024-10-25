// ==UserScript==
// @name         Incoming Atacks Client
// @version      1.0
// @author       TiagoPer
// @match        https://*/*village=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tribalwars.com.pt
// ==/UserScript==

(function () {
  const API_KEY = "";
  const serverUrl = "";
  var incomings = [];
  var renamedIncomings = [];
  var lastNumberOfIncomingsSendToServer = 0;

  function trackIncomings() {
    let currentIncomings = 0;
    setInterval(() => {
      let incomingAtacks = TribalWars.getGameData().player.incomings;
      if (incomingAtacks != currentIncomings) {
        currentIncomings = incomingAtacks;
        getAllIncomings().then(() => {
          if (incomingAtacks > 0) {
            if (lastNumberOfIncomingsSendToServer != incomingAtacks) {
              lastNumberOfIncomingsSendToServer = incomingAtacks;
              sendToServer();
            }
            renameIncomings();
          }
        });
      }
    }, 1000);
  }

  function getAllIncomings() {
    var urlParams = new URLSearchParams(window.location.href);
    var villageId = urlParams.get("village");
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://${
          TribalWars.getGameData().world
        }.tribalwars.com.pt/game.php?village=${villageId}&screen=overview_villages&mode=incomings`,
        method: "GET",
        success: function (data) {
          var elements = $(data).find("#incomings_table .nowrap");

          elements.each(function () {
            let gameId = $(this).find("td").eq(0).find("span").data("id");
            //TODO: get atack strength of the command
            let atackStrenght = $(this)
              .find("td")
              .eq(0)
              .find(".command_hover_details")
              .attr("hint");

            ///game.php?village=7095&screen=info_village&id=7095

            let destinyVillageLink = $(this)
              .find("td")
              .eq(1)
              .find("a")
              .attr("href");
            let originVillageLink = $(this)
              .find("td")
              .eq(2)
              .find("a")
              .attr("href");

            let destinyVillageLinkParams = new URLSearchParams(
              destinyVillageLink.split("?")[1]
            );
            let destinyVillageId = destinyVillageLinkParams.get("village");

            let originVillageLinkParams = new URLSearchParams(
              originVillageLink.split("?")[1]
            );
            let originVillageId = originVillageLinkParams.get("village");

            let destinyVillage = $(this).find("td").eq(1).find("a").text();
            let originVillage = $(this).find("td").eq(2).find("a").text();
            let originPlayer = $(this).find("td").eq(3).find("a").text();
            let originPlayerIdLink = $(this)
              .find("td")
              .eq(3)
              .find("a")
              .attr("href");
            const params = new URLSearchParams(originPlayerIdLink);
            let originPlayerId = params.get("id");
            let landTimeText = $(this).find("td").eq(5).text();
            let landTimeMs = $(this).find("td").eq(5).find("span").text();
            //TODO: get wallLevel of village
            let wallLevel = 20;
            //TODO: get loyalty of village
            let loyalty = 100;

            //TODO: calculate the slowest unit

            let landTime = parseDateStringWithMilliseconds(
              landTimeText,
              landTimeMs
            );

            incomings.push({
              gameId,
              originVillage,
              destinyVillage,
              originVillageId,
              destinyVillageId,
              originPlayerId,
              originPlayer,
              landTime,
              wallLevel,
              loyalty,
              // atackStrenght,
            });
          });

          resolve();
        },
        error: function (error) {
          console.error("Error fetching the page:", error);
          reject(error);
        },
      });
    });
  }

  function renameIncomings() {
    incomings.forEach((incoming) => {
      if (!renamedIncomings.includes(incoming)) {
        setTimeout(() => {
          var logoutHref = $("a.footer-link").eq(5).attr("href");
          var hUrlParams = new URLSearchParams(logoutHref);
          var h = hUrlParams.get("h");

          var urlParams = new URLSearchParams(window.location.href);
          var villageId = urlParams.get("village");

          var postData = {
            ["command_ids" + incoming.id]: true,
            ["id_" + incoming.id]: "on",
            all: "on",
            label: "Etiqueta",
            h: h,
          };

          $.ajax({
            url: `https://${
              TribalWars.getGameData().world
            }.tribalwars.com.pt/game.php?village=${villageId}&screen=overview_villages&mode=incomings&action=process&type=unignored`,
            method: "POST",
            data: postData,
            success: function (_) {
              renamedIncomings.push(incoming.id);
            },
            error: function (error) {
              console.error("Error making POST request:", error);
            },
          });
        }, Timing.offset_to_server + 50);
      }
    });
  }

  function sendToServer() {
    const protectedUrl = "http://localhost:5297/incomings/update"; // replace with your actual protected URL
    let gameData = TribalWars.getGameData();
    let playerId = gameData.player.id;
    let playerName = gameData.player.name;
    let tribeId = gameData.player.ally;

    const data = { playerId, playerName, tribeId, incomings: [] };
    let sendedCommands = [];
    let alreadySendedCommands = readLastSentValues();
    let sentCommands = 0;

    incomings.forEach((incoming) => {
      if (!alreadySendedCommands.includes(incoming.gameId)) {
        data.incomings.push(incoming);
        sendedCommands.push(incoming.gameId);
        sentCommands++;
      }
    });

    if (incomings.length > 0) {
      const serializedData = JSON.stringify(data);

      const image = new Image();
      image.src = `${protectedUrl}?data=${encodeURIComponent(serializedData)}`;

      saveLastSentValues(sendedCommands);

      if (sentCommands > 0) UI.SuccessMessage("Dados enviados para o servidor");
    }
  }

  function saveLastSentValues(values) {
    let currentValues = readLastSentValues();

    const mergeResult = [].concat(currentValues, values);

    localStorage.setItem("sended_commands", JSON.stringify(mergeResult));
  }

  function readLastSentValues() {
    let valuesFromStorage = localStorage.getItem("sended_commands");
    let values = JSON.parse(valuesFromStorage);

    console.log(values);

    return values ?? [];
  }

  function parseDateStringWithMilliseconds(dateString, ms) {
    const currentDate = new Date();

    let milliseconds = 0;

    if (dateString.includes("amanhã")) {
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (dateString.includes("hoje")) {
    } else {
      // Parse the custom format
      const match = dateString.match(
        /a (\d+\.\d+\.) às (\d+:\d+:\d+):<span class="grey small">(\d+)<\/span>/
      );
      if (match) {
        const [, datePart, timePart, millisecondsStr] = match;
        const [day, month] = datePart.split(".").map(Number);

        currentDate.setDate(day);
        currentDate.setMonth(month - 1); // Months are 0-based in JavaScript

        milliseconds = parseInt(millisecondsStr, 10);
      } else {
        // Unable to parse
        console.error("Unable to parse the date string:", dateString);
        return null;
      }
    }

    // Extract time part from the string
    const timePart = dateString.match(/\d+:\d+:\d+/)[0];

    // Set time part to the current date
    const dateTimeString = `${
      currentDate.toISOString().split("T")[0]
    }T${timePart}`;
    const finalDate = new Date(dateTimeString);

    // Set milliseconds
    finalDate.setMilliseconds(ms);

    // Format the final date in the required format
    const formattedDate = finalDate.toISOString();

    return formattedDate;
  }

  trackIncomings();
})();
