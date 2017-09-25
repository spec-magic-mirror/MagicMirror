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
    usePiCam: false,
    display: false
	},

  getMoleTestResult: function() {
    var self = this;    
    
    self.image = null;
    self.message = "Please stand still while taking the test.";
    self.display = true;
    self.updateDom();
    self.show(function() {
      Log.log(self.name + ' is shown.');
    });

    this.pythonStarted = false;
    this.sendSocketNotification('START_TEST', this.config);
  },

  socketNotificationReceived: function(notification, payload) {
    var self = this;
    self.display = true;
    if (notification === "MESSAGE") {
      this.message = payload;
      Log.info(payload);
    } else if (notification === "BACKEND") {
      this.image = "data:image/png;base64," + payload;
    } else if (notification === "FINISH"){
      this.message = payload;
      if (payload === "We are done!! Thanks!!") {
        setTimeout(function() {
          self.hide(5000, function() {
            Log.log(self.name + ' is hidden.');
          })
        }, 5000);
      }
    }
    this.updateDom();
  },

  notificationReceived: function(notification, payload, sender) {

    if (notification === "CHECK_MY_SKIN"){
      this.getMoleTestResult();
    }
  },

	getDom: function() {
		var wrapper = document.createElement("div");
    if (this.display) {
  		wrapper.innerHTML = this.config.text;
      var message_p = document.createElement("p");
      var message_text = document.createTextNode(this.message);
      message_p.appendChild(message_text);
      wrapper.appendChild(message_p);
      if (this.image != null) {
        var imageTab = document.createElement('img');
        imageTab.setAttribute('src', this.image);
        imageTab.setAttribute('height', '100%');
        imageTab.setAttribute('width', '100%');
        wrapper.appendChild(imageTab);
      } 
    }
		return wrapper;
	}
});