/**** game/Modules/TimedCommandQueue.js ****/
define("Ig/TribalWars/Modules/TimedCommandQueue", function () {
  "use strict";
  var t = function () {
    (this.command_queue = []), (this.lock_expiry = 0);
  };
  return (
    (t.prototype = {
      isBusy: function () {
        return this.lock_expiry >= Date.now();
      },
      pushCommand: function (t, n) {
        this.command_queue.push({ run: t, duration: n }),
          this.isBusy() || this.runNextCommand();
      },
      runNextCommand: function () {
        var t = this;
        if (0 !== this.command_queue.length) {
          var n = Date.now(),
            i = this.command_queue.shift();
          (this.lock_expiry = n + i.duration), i.run();
          var u = Math.max(0, this.lock_expiry - Date.now());
          setTimeout(function () {
            t.runNextCommand();
          }, u);
        }
      },
    }),
    t
  );
});
