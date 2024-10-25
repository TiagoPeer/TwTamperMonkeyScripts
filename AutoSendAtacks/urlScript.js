// ==UserScript==
// @name         Enviar Ataques
// @version      0.3
// @author       TiagoPer
// @match        https://*&screen=place&try=confirm*
// @include      https://*&screen=place&try=confirm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tribalwars.com.pt
// ==/UserScript==

$.ajax({
  type: "GET",
  url: "http://localhost:8888/mainv2.js",
  dataType: "script",
  cache: false,
});
