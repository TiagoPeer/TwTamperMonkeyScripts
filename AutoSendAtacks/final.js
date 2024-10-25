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
      serverDateTimeStamp = await Timing.getCurrentServerTime();
      let timeout = targetDateTimeStamp - serverDateTimeStamp;
      setTimeout(() => {
        document.getElementById("troop_confirm_submit").click();
      }, timeout * 1.1);
    } else {
      requestAnimationFrame(checkLoop);
    }
  }
  checkLoop();
}

checkTargetDate();
