// ==UserScript==
// @name         TroopsCounter
// @description  Script to count all the troops, including the ones that are being recruted
// @version      1.0
// @author       TiagoPer
// @match        https://*/*screen=barracks*
// @match        https://*/*screen=garage*
// @match        https://*/*screen=stable*
// @icon         https://dspt.innogamescdn.com/asset/5b5eb006/graphic/big_buildings/barracks3.png
// ==/UserScript==

(function () {
  let recruitingTroops = {
    spear: 0,
    sword: 0,
    axe: 0,
    spy: 0,
    light: 0,
    heavy: 0,
    ram: 0,
    catapult: 0,
  };

  let existentTroops = {
    spear: 0,
    sword: 0,
    axe: 0,
    spy: 0,
    light: 0,
    heavy: 0,
    ram: 0,
    catapult: 0,
  };

  function getRecruitingTroops() {
    const regex = /\d+/g;

    let rows = $(".trainqueue_wrap tr.sortable_row");
    rows.each((key, row) => {
      let div = $(row).find("td").eq(0).find("div");
      let troopType = div
        .attr("class")
        .replace("unit_sprite unit_sprite_smaller ", "");
      let quantityText = $(row).find("td").eq(0).text();
      let quantity = parseInt(quantityText.match(regex));
      recruitingTroops[troopType] += quantity;
    });

    let currentTrainingRow = $(".trainqueue_wrap tr.lit:first");
    console.log(currentTrainingRow);
    if (currentTrainingRow.length > 0) {
      let troopType = $(currentTrainingRow)
        .find("td")
        .eq(0)
        .find("div")
        .attr("class")
        .replace("unit_sprite unit_sprite_smaller ", "");
      let quantity = parseInt(
        $(currentTrainingRow).find("td").text().match(regex)
      );
      recruitingTroops[troopType] += quantity;
    }
  }

  function getExistentTroops() {
    let rows = $("#train_form tr.row_a");
    rows.each((key, row) => {
      let troopType = $(row).find("td").eq(0).find("a").eq(0).attr("data-unit");
      let quantityText = $(row).find("td").eq(2).text();
      const regex = /(\d+)\/(\d+)/;
      let quantity = parseInt(quantityText.match(regex)[2]);
      existentTroops[troopType] += quantity;
    });
  }

  function calculateTotalNumberOfTroops() {
    const promises = [];
    const recruitingTroopsTask = new Promise((resolve) => {
      getRecruitingTroops();
      resolve();
    });
    const existentTroopsTask = new Promise((resolve) => {
      getExistentTroops();
      resolve();
    });

    promises.push(recruitingTroopsTask, existentTroopsTask);

    Promise.all(promises).then(() => createUI());
  }

  function createUI() {
    let table = $("#train_form");
    $(table).find("tr").eq(0).find("th").eq(2).after("<th>Total</th>");
    let rows = $("#train_form tr.row_a");
    rows.each((key, row) => {
      let troopType = $(row).find("td").eq(0).find("a").eq(0).attr("data-unit");
      let quantity = recruitingTroops[troopType] + existentTroops[troopType];
      $(row)
        .find("td")
        .eq(2)
        .after(`<td style="text-align: center">${quantity}</td>`);
    });

    $(table).find("tr:last").find("td").eq(0).attr("colspan", "4");
  }

  calculateTotalNumberOfTroops();
})();
