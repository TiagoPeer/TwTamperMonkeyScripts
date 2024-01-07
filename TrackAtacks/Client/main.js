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

  function trackIncomings() {
    setInterval(() => {
      let incomings = TribalWars.getGameData().player.incomings;
      console.log(incomings);
    }, 2000);
  }

  function getAllIncomings(){}

  function sendToServer() {}

  function saveLastSentValues() {}

  function readLastSentValues() {}
  trackIncomings();
})();
