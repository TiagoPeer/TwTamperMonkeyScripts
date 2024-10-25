// ==UserScript==
// @icon                https://i.imgur.com/7WgHTT8.gif
// @include             http*://*.*game.php*
// @version     	    0.0.1
// @require             http://code.jquery.com/jquery-1.12.4.min.js
// ==/UserScript==

const Min_Tempo_Espera = 60000; //	Tempo mínimo de espera entre acções (em milissegundos)
const Max_Tempo_Espera = 300000; //	Tempo máximo de espera entre acções (em milissegundos)

//const Etapa						= "";	// Etapa_1: Upar O bot automaticamente em Série Edificios
const Etapa = "Etapa_1"; // Etapa_1: Upar O bot automaticamente em Série Edificios

const Construcao_Edificios_Ordem = true; //	Opção para controlar como os edifícios são metidos na fila de construção
//		true:	constroi os edifícios na ordem especificada na função "getConstrucao_Edificios_Serie"
//		false:	constroi os edifícios assim que estiverem disponíveis

const hasPremium = TribalWars.getGameData().features["Premium"].active;
const maxOrders = hasPremium ? 5 : 2;

/* ********************************************* */
/* **** Constantes (NÃO DEVE SER ALTERADAS) **** */
/* ********************************************* */
const Visualizacao_Geral = "OVERVIEW_VIEW";
const Edificio_Principal = "HEADQUARTERS_VIEW";

(function () {
  "use strict";

  console.log("-- Script do Tribal Wars ativado --");

  if (Etapa == "Etapa_1") executarEtapa1();
})();

/* ************************ */
/* **** executarEtapa1 **** */
/* ************************ */
function executarEtapa1() {
  let Evoluir_vilas = getEvoluir_vilas();

  console.log(Evoluir_vilas);

  if (Evoluir_vilas == Edificio_Principal) {
    setInterval(function () {
      Proxima_Construcao(); //	Construir qualquer edificio custeável, se possível
    }, 1000);
  } else if (Evoluir_vilas == Visualizacao_Geral)
    document.getElementById("l_main").children[0].children[0].click();
}

/* *************************************************************************** */
/* **** Conclui a construção automaticamente se faltar menos de 3 minutos **** */
/* *************************************************************************** */
setInterval(function () {
  var text = "";
  var tr = $('[id="buildqueue"]').find("tr").eq(1);
  //	var tr			= $('[id="build_queue"]').find('tr').eq(1);

  text = tr
    .find("td")
    .eq(1)
    .find("span")
    .eq(0)
    .text()
    .split(" ")
    .join("")
    .split("\n")
    .join("");
  var timeSplit = text.split(":");

  if (timeSplit[0] * 60 * 60 + timeSplit[1] * 60 + timeSplit[2] * 1 < 3 * 60) {
    console.log("Completar Grátis");
    tr.find("td").eq(2).find("a").eq(2).click();
  }

  //missao concluida
  $('[class="btn btn-confirm-yes"]').click();
}, 500);

/* ******************************************************************************* */
/* **** Evolui a aldeia, metendo um delay aleatório entre ordens consecutivas **** */
/* **** Provavelmente para evitar ser detectado e levar ban                   **** */
/* ******************************************************************************* */
let delay = Math.floor(
  Math.random() * (Max_Tempo_Espera - Min_Tempo_Espera) + Min_Tempo_Espera
);
let Evoluir_vilas = getEvoluir_vilas();

console.log(Evoluir_vilas);

setTimeout(function () {
  if (Evoluir_vilas == Edificio_Principal)
    Proxima_Construcao(); // Construir qualquer edificio custeável, se possível
  else if (Evoluir_vilas == Visualizacao_Geral)
    document.getElementById("l_main").children[0].children[0].click(); // Página de "Visualização Geral"
}, delay);

/* ************************** */
/* **** getEvoluir_vilas **** */
/* ************************** */
function getEvoluir_vilas() {
  let currentUrl = window.location.href;

  if (
    currentUrl.endsWith("Visualização Geral") ||
    currentUrl.endsWith("overview_villages")
  )
    return Visualizacao_Geral;
  else if (currentUrl.endsWith("main")) return Edificio_Principal;
}

/* **************************** */
/* **** Proxima_Construcao **** */
/* **************************** */
function Proxima_Construcao() {
  let Construção_proximo_edificio = getConstrução_proximo_edificio();
  let numberOfOrders =
    $("#buildqueue .lit.nodrag").length + $("#buildqueue .sortable_row").length;

  if (Construção_proximo_edificio !== undefined && numberOfOrders < maxOrders) {
    Construção_proximo_edificio.click();
    console.log("Clicked on " + Construção_proximo_edificio);
  }
}

/* **************************************** */
/* **** getConstrução_proximo_edificio **** */
/* **************************************** */
function getConstrução_proximo_edificio() {
  let Clicar_Upar_Edificos = document.getElementsByClassName("btn btn-build");
  let Construcao_Edificios_Serie = getConstrucao_Edificios_Serie();
  let instituir;

  while (instituir === undefined && Construcao_Edificios_Serie.length > 0) {
    var proximo = Construcao_Edificios_Serie.shift();

    if (Clicar_Upar_Edificos.hasOwnProperty(proximo)) {
      let proximo_edificio = document.getElementById(proximo);
      var Visivel =
        proximo_edificio.offsetWidth > 0 || proximo_edificio.offsetHeight > 0;

      if (Visivel) instituir = proximo_edificio;

      if (Construcao_Edificios_Ordem) break;
    }
  }

  return instituir;
}

/* *************************************** */
/* **** getConstrucao_Edificios_Serie **** */
/* *************************************** */
function getConstrucao_Edificios_Serie() {
  var Sequencia_Construcao = [];

  // Edificios Inicial conforme figura: https://i.imgur.com/jPuHuHN.png

  Sequencia_Construcao.push("main_buildlink_main_1");
  Sequencia_Construcao.push("main_buildlink_place_1");
  Sequencia_Construcao.push("main_buildlink_wood_1");
  Sequencia_Construcao.push("main_buildlink_stone_1");
  Sequencia_Construcao.push("main_buildlink_iron_1");
  Sequencia_Construcao.push("main_buildlink_statue_1");
  Sequencia_Construcao.push("main_buildlink_farm_1");
  Sequencia_Construcao.push("main_buildlink_wood_2");
  Sequencia_Construcao.push("main_buildlink_stone_2");
  Sequencia_Construcao.push("main_buildlink_wood_3");
  Sequencia_Construcao.push("main_buildlink_stone_3");
  Sequencia_Construcao.push("main_buildlink_farm_2");
  Sequencia_Construcao.push("main_buildlink_wood_4");
  Sequencia_Construcao.push("main_buildlink_stone_4");
  Sequencia_Construcao.push("main_buildlink_iron_2");
  Sequencia_Construcao.push("main_buildlink_storage_1");
  Sequencia_Construcao.push("main_buildlink_main_3");
  Sequencia_Construcao.push("main_buildlink_barracks_1");
  Sequencia_Construcao.push("main_buildlink_storage_2");
  Sequencia_Construcao.push("main_buildlink_farm_3");
  Sequencia_Construcao.push("main_buildlink_wood_5");
  Sequencia_Construcao.push("main_buildlink_stone_5");
  Sequencia_Construcao.push("main_buildlink_iron_3");
  Sequencia_Construcao.push("main_buildlink_farm_4");
  Sequencia_Construcao.push("main_buildlink_barracks_3");
  Sequencia_Construcao.push("main_buildlink_storage_3");
  Sequencia_Construcao.push("main_buildlink_main_5");
  Sequencia_Construcao.push("main_buildlink_farm_5");
  Sequencia_Construcao.push("main_buildlink_smith_1");
  Sequencia_Construcao.push("main_buildlink_wood_6");
  Sequencia_Construcao.push("main_buildlink_stone_6");
  Sequencia_Construcao.push("main_buildlink_iron_4");
  Sequencia_Construcao.push("main_buildlink_storage_4");
  Sequencia_Construcao.push("main_buildlink_farm_6");
  Sequencia_Construcao.push("main_buildlink_smith_3");
  Sequencia_Construcao.push("main_buildlink_storage_5");
  Sequencia_Construcao.push("main_buildlink_farm_7");
  Sequencia_Construcao.push("main_buildlink_wood_7");
  Sequencia_Construcao.push("main_buildlink_stone_7");
  Sequencia_Construcao.push("main_buildlink_storage_6");
  Sequencia_Construcao.push("main_buildlink_farm_8");
  Sequencia_Construcao.push("main_buildlink_wood_8");
  Sequencia_Construcao.push("main_buildlink_stone_8");
  Sequencia_Construcao.push("main_buildlink_iron_5");
  Sequencia_Construcao.push("main_buildlink_wall_1");
  Sequencia_Construcao.push("main_buildlink_main_6");
  Sequencia_Construcao.push("main_buildlink_main_7");
  Sequencia_Construcao.push("main_buildlink_storage_7");
  Sequencia_Construcao.push("main_buildlink_farm_9");
  Sequencia_Construcao.push("main_buildlink_smith_4");
  Sequencia_Construcao.push("main_buildlink_smith_5");
  Sequencia_Construcao.push("main_buildlink_wood_9");
  Sequencia_Construcao.push("main_buildlink_stone_9");
  Sequencia_Construcao.push("main_buildlink_storage_8");
  Sequencia_Construcao.push("main_buildlink_farm_10");
  Sequencia_Construcao.push("main_buildlink_wood_10");
  Sequencia_Construcao.push("main_buildlink_stone_10");
  Sequencia_Construcao.push("main_buildlink_iron_7");
  Sequencia_Construcao.push("main_buildlink_main_10");
  Sequencia_Construcao.push("main_buildlink_storage_10");
  Sequencia_Construcao.push("main_buildlink_farm_11");
  Sequencia_Construcao.push("main_buildlink_market_1");
  Sequencia_Construcao.push("main_buildlink_barracks_5");
  Sequencia_Construcao.push("main_buildlink_stable_1");
  Sequencia_Construcao.push("main_buildlink_storage_11");
  Sequencia_Construcao.push("main_buildlink_wood_12");
  Sequencia_Construcao.push("main_buildlink_stone_12");
  Sequencia_Construcao.push("main_buildlink_iron_9");
  Sequencia_Construcao.push("main_buildlink_farm_13");
  Sequencia_Construcao.push("main_buildlink_wall_5");
  // Sequencia_Construcao.push("main_buildlink_hide_3");
  Sequencia_Construcao.push("main_buildlink_stable_3");
  Sequencia_Construcao.push("main_buildlink_market_2");
  Sequencia_Construcao.push("main_buildlink_main_12");
  Sequencia_Construcao.push("main_buildlink_farm_14");
  Sequencia_Construcao.push("main_buildlink_storage_13");
  Sequencia_Construcao.push("main_buildlink_wood_13");
  Sequencia_Construcao.push("main_buildlink_stone_13");
  Sequencia_Construcao.push("main_buildlink_iron_11");
  Sequencia_Construcao.push("main_buildlink_storage_14");
  Sequencia_Construcao.push("main_buildlink_farm_15");
  Sequencia_Construcao.push("main_buildlink_smith_8");
  Sequencia_Construcao.push("main_buildlink_wall_7");
  Sequencia_Construcao.push("main_buildlink_wood_14");
  Sequencia_Construcao.push("main_buildlink_stone_14");
  Sequencia_Construcao.push("main_buildlink_smith_10");
  Sequencia_Construcao.push("main_buildlink_garage_1");
  Sequencia_Construcao.push("main_buildlink_iron_13");
  Sequencia_Construcao.push("main_buildlink_wall_8");
  Sequencia_Construcao.push("main_buildlink_storage_15");
  Sequencia_Construcao.push("main_buildlink_farm_16");
  Sequencia_Construcao.push("main_buildlink_main_15");
  Sequencia_Construcao.push("main_buildlink_wall_10");
  Sequencia_Construcao.push("main_buildlink_market_7");
  Sequencia_Construcao.push("main_buildlink_barracks_7");
  Sequencia_Construcao.push("main_buildlink_stable_5");
  Sequencia_Construcao.push("main_buildlink_garage_3");
  Sequencia_Construcao.push("main_buildlink_wall_12");
  Sequencia_Construcao.push("main_buildlink_storage_18");
  Sequencia_Construcao.push("main_buildlink_farm_17");
  Sequencia_Construcao.push("main_buildlink_wood_15");
  Sequencia_Construcao.push("main_buildlink_stone_15");
  Sequencia_Construcao.push("main_buildlink_iron_14");
  Sequencia_Construcao.push("main_buildlink_barracks_10");
  Sequencia_Construcao.push("main_buildlink_stable_7");
  Sequencia_Construcao.push("main_buildlink_storage_20");
  Sequencia_Construcao.push("main_buildlink_farm_18");
  Sequencia_Construcao.push("main_buildlink_market_10");
  Sequencia_Construcao.push("main_buildlink_wood_16");
  Sequencia_Construcao.push("main_buildlink_stone_16");
  Sequencia_Construcao.push("main_buildlink_iron_15");
  Sequencia_Construcao.push("main_buildlink_farm_20");
  Sequencia_Construcao.push("main_buildlink_barracks_13");
  Sequencia_Construcao.push("main_buildlink_stable_10");
  Sequencia_Construcao.push("main_buildlink_wall_15");
  Sequencia_Construcao.push("main_buildlink_main_18");
  Sequencia_Construcao.push("main_buildlink_smith_12");
  Sequencia_Construcao.push("main_buildlink_main_20");
  Sequencia_Construcao.push("main_buildlink_wall_17");
  Sequencia_Construcao.push("main_buildlink_smith_15");
  Sequencia_Construcao.push("main_buildlink_storage_21");
  Sequencia_Construcao.push("main_buildlink_farm_21");
  Sequencia_Construcao.push("main_buildlink_wood_17");
  Sequencia_Construcao.push("main_buildlink_stone_17");
  Sequencia_Construcao.push("main_buildlink_iron_16");
  Sequencia_Construcao.push("main_buildlink_storage_22");
  Sequencia_Construcao.push("main_buildlink_farm_22");
  Sequencia_Construcao.push("main_buildlink_wood_18");
  Sequencia_Construcao.push("main_buildlink_stone_18");
  Sequencia_Construcao.push("main_buildlink_iron_17");
  Sequencia_Construcao.push("main_buildlink_wall_20");
  Sequencia_Construcao.push("main_buildlink_smith_17");
  Sequencia_Construcao.push("main_buildlink_storage_24");
  Sequencia_Construcao.push("main_buildlink_farm_23");
  Sequencia_Construcao.push("main_buildlink_wood_19");
  Sequencia_Construcao.push("main_buildlink_stone_19");
  Sequencia_Construcao.push("main_buildlink_iron_18");
  Sequencia_Construcao.push("main_buildlink_barracks_15");
  Sequencia_Construcao.push("main_buildlink_stable_12");
  Sequencia_Construcao.push("main_buildlink_garage_5");
  Sequencia_Construcao.push("main_buildlink_storage_25");
  Sequencia_Construcao.push("main_buildlink_farm_24");
  Sequencia_Construcao.push("main_buildlink_wood_20");
  Sequencia_Construcao.push("main_buildlink_stone_20");
  Sequencia_Construcao.push("main_buildlink_iron_19");
  Sequencia_Construcao.push("main_buildlink_smith_18");
  Sequencia_Construcao.push("main_buildlink_farm_25");
  Sequencia_Construcao.push("main_buildlink_wood_21");
  Sequencia_Construcao.push("main_buildlink_stone_21");
  Sequencia_Construcao.push("main_buildlink_iron_20");
  Sequencia_Construcao.push("main_buildlink_smith_20");
  Sequencia_Construcao.push("main_buildlink_snob_1");
  Sequencia_Construcao.push("main_buildlink_farm_26");
  Sequencia_Construcao.push("main_buildlink_wood_22");
  Sequencia_Construcao.push("main_buildlink_stone_22");
  Sequencia_Construcao.push("main_buildlink_iron_21");
  Sequencia_Construcao.push("main_buildlink_barracks_18");
  Sequencia_Construcao.push("main_buildlink_stable_15");
  Sequencia_Construcao.push("main_buildlink_wood_23");
  Sequencia_Construcao.push("main_buildlink_stone_23");
  Sequencia_Construcao.push("main_buildlink_iron_23");
  Sequencia_Construcao.push("main_buildlink_farm_27");
  Sequencia_Construcao.push("main_buildlink_barracks_20");
  Sequencia_Construcao.push("main_buildlink_wood_24");
  Sequencia_Construcao.push("main_buildlink_stone_24");
  Sequencia_Construcao.push("main_buildlink_iron_24");
  Sequencia_Construcao.push("main_buildlink_market_15");
  Sequencia_Construcao.push("main_buildlink_farm_28");
  Sequencia_Construcao.push("main_buildlink_wood_26");
  Sequencia_Construcao.push("main_buildlink_stone_26");
  Sequencia_Construcao.push("main_buildlink_iron_26");
  Sequencia_Construcao.push("main_buildlink_farm_29");
  Sequencia_Construcao.push("main_buildlink_barracks_22");
  Sequencia_Construcao.push("main_buildlink_stable_17");
  Sequencia_Construcao.push("main_buildlink_wood_27");
  Sequencia_Construcao.push("main_buildlink_stone_27");
  Sequencia_Construcao.push("main_buildlink_iron_27");
  Sequencia_Construcao.push("main_buildlink_farm_30");
  Sequencia_Construcao.push("main_buildlink_barracks_23");
  Sequencia_Construcao.push("main_buildlink_stable_18");
  Sequencia_Construcao.push("main_buildlink_wood_28");
  Sequencia_Construcao.push("main_buildlink_stone_28");
  Sequencia_Construcao.push("main_buildlink_iron_28");
  Sequencia_Construcao.push("main_buildlink_wood_29");
  Sequencia_Construcao.push("main_buildlink_stone_29");
  Sequencia_Construcao.push("main_buildlink_iron_29");
  Sequencia_Construcao.push("main_buildlink_wood_30");
  Sequencia_Construcao.push("main_buildlink_stone_30");
  Sequencia_Construcao.push("main_buildlink_iron_30");
  Sequencia_Construcao.push("main_buildlink_barracks_25");
  Sequencia_Construcao.push("main_buildlink_stable_20");
  Sequencia_Construcao.push("main_buildlink_market_20");
  Sequencia_Construcao.push("main_buildlink_storage_30");
  // Sequencia_Construcao.push("main_buildlink_hide_10");

  return Sequencia_Construcao;
}
