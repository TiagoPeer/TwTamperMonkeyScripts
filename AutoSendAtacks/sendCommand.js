async function checkTargetDate() {
  var targetDate = new Date(2024, 1, 18, 20, 39, 30, 250);
  var targetDateTimeStamp = targetDate.getTime();
  var serverDateTimeStamp;

  while (true) {
    serverDateTimeStamp = await Timing.getCurrentServerTime();
    if (targetDateTimeStamp <= serverDateTimeStamp) {
      console.log(serverDateTimeStamp);
      console.log("Enviar ataque");
      break; // Assuming you want to exit the loop once the condition is met
    }
  }
}

async function measureRoundTripTime() {
  const startTime = new Date().getTime();
  const _ = await fetch(
    "https://pt94.tribalwars.com.pt/game.php?screen=accountmanager"
  );
  const endTime = new Date().getTime();
  const roundTripTime = endTime - startTime;
  return roundTripTime;
}

async function checkTargetDate() {
  var targetDate = new Date();
  targetDate.setSeconds(targetDate.getSeconds() + 5);
  targetDate.setMilliseconds(0);
  var targetDateTimeStamp = targetDate.getTime();
  var serverDateTimeStamp;

  async function checkLoop() {
    serverDateTimeStamp = await Timing.getCurrentServerTime();

    var firstOffset = Timing.offset_to_server + 100;
    if (targetDateTimeStamp <= serverDateTimeStamp + firstOffset) {
      //v1  -  diferença  :  max - 10ms  min 3ms
      // while (true) {
      //   serverDateTimeStamp = await Timing.getCurrentServerTime();
      //   var offset = await measureRoundTripTime()
      //   if (targetDateTimeStamp <= serverDateTimeStamp + (offset * 1.25)) {
      //     document.getElementById("troop_confirm_submit").click();
      //     break;
      //   }
      // }

      //v2  -  diferença  :  max - 200ms
      // while (true) {
      //   serverDateTimeStamp = await Timing.getCurrentServerTime();
      //   if (targetDateTimeStamp <= serverDateTimeStamp + (Timing.offset_to_server * 1.25)) {
      //     document.getElementById("troop_confirm_submit").click();
      //     break;
      //   }
      // }

      //v3  -  160ms diferença
      serverDateTimeStamp = await Timing.getCurrentServerTime();
      // var offset = await measureRoundTripTime();
      let timeout = targetDateTimeStamp - serverDateTimeStamp;
      setTimeout(() => {
        document.getElementById("troop_confirm_submit").click();
      }, timeout * 1.1);
    } else {
      requestAnimationFrame(checkLoop);
    }
  }

  // Start the loop
  checkLoop();
}

checkTargetDate();

async function checkTargetDate() {
  var targetDate = new Date(2024, 0, 18, 20, 49, 10, 256);
  var targetDateTimeStamp = targetDate.getTime();

  async function check() {
    var serverDateTimeStamp = await Timing.getCurrentServerTime();

    if (targetDateTimeStamp <= serverDateTimeStamp) {
      console.log(serverDateTimeStamp);
      console.log("Enviar ataque");
    } else {
      // Schedule the next check immediately
      setTimeout(check, 1);
    }
  }

  // Start the check
  check();
}

// Call the async function
checkTargetDate();

const timestamp = 1705680130250;
const dateWithMilliseconds = new Date(timestamp);

const year = dateWithMilliseconds.getFullYear();
const month = dateWithMilliseconds.getMonth() + 1; // Months are zero-based
const day = dateWithMilliseconds.getDate();
const hours = dateWithMilliseconds.getHours();
const minutes = dateWithMilliseconds.getMinutes();
const seconds = dateWithMilliseconds.getSeconds();
const milliseconds = dateWithMilliseconds.getMilliseconds();

console.log(`Year: ${year}`);
console.log(`Month: ${month}`);
console.log(`Day: ${day}`);
console.log(`Hours: ${hours}`);
console.log(`Minutes: ${minutes}`);
console.log(`Seconds: ${seconds}`);
console.log(`Milliseconds: ${milliseconds}`);

function getServerTime() {
  return fetch("/getServerTime")
    .then((response) => response.json())
    .then((data) => data.serverTime);
}

function measureOffset() {
  return getServerTime().then((serverTime) => {
    const clientTime = new Date().getTime();
    const offset = serverTime - clientTime;
    return offset;
  });
}

measureOffset().then((offset) => {
  console.log(`Server offset: ${offset} milliseconds`);
  const adjustedClientTime = new Date().getTime() + offset;
  console.log(`Adjusted client time: ${adjustedClientTime}`);
});

function getServerTimeFromHeaders() {
  return fetch(
    "https://pt94.tribalwars.com.pt/game.php?village=6554&screen=overview"
  ).then((response) => {
    console.log(response.headers);
  });
}

measureRoundTripTime();
getServerTimeFromHeaders();
