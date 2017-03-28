/* global Module */

/* Magic Mirror
 * Module: MMM-Mole
 *
 * Yating Zhan
 * Cornell Tech
 */

Module.register("MMM-Mole", {
	defaults: {
		text: "Hello to Magic Mole Monitor!",
    captureAngle: 0,
    usePiCam: false
	},

  start: function() {
    Log.info('Starting module: ' + this.name);
    var self = this
    this.show(1000, function() {
      Log.log(this.name + ' is shown*********************.');
    })
    this.message = 'Starting mole test...'
    this.getMoleTestResult();
    
    // setTimeout(function() {
    //   self.start()
    // }, this.config.interval);
  },
  getMoleTestResult: function() {
    Log.info("Start mole test.");

    this.pythonStarted = false
    this.sendSocketNotification('START_TEST', this.config);
    this.message = "Time to take pictures~";
  },

  socketNotificationReceived: function(notification, payload) {
    var self = this;
    if (notification === "MESSAGE") {
      this.message = payload;
      Log.info(payload);
      if (payload === "We are done!! Thanks!!") {
        setTimeout(function() {
            self.hide(1000, function() {
              Log.log(self.name + ' is hidden.');
            })
          }, 5000);
      }
    } else {
      if (payload === "We are done!! Thanks!!") {
        setTimeout(function() {
            self.hide(1000, function() {
              Log.log(self.name + ' is hidden.');
            })
          }, 5000);
      }
    }
    Log.log("payload in mole mapper!!!!", payload);

    // var div = document.createElement("p");
    // var t = document.createTextNode(payload);

    this.updateDom();
  },

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = this.config.text;
    var h = document.createElement("p");
    var t = document.createTextNode(this.message);
    h.appendChild(t);
    wrapper.appendChild(h);
		return wrapper;
	}
});