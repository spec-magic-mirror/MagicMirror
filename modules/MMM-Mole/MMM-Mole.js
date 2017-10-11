/* global Module */

/* Magic Mirror
 * Module: MMM-Mole
 *
 * Yating Zhan
 * Cornell Tech
 */

Module.register("MMM-Mole", {
	defaults: {
		text: "Welcome to Reflective Health!",
    usePiCam: false,
    display: true
	},

  start: function() {
    Log.info('Starting module: ' + this.name);
    var self = this
    this.show(1000, function() {
      Log.log(this.name + ' is shown.');
    });
    this.message = '';
    this.image = null;
    this.getMoleTestResult();   
  },

  getMoleTestResult: function() {
    var self = this;    
    this.pythonStarted = false;
    this.sendSocketNotification('WELCOME', this.config);
  },

  socketNotificationReceived: function(notification, payload) {
    var self = this;
    self.display = true;
    if (notification === "MESSAGE") {
      this.message = payload;
    } else if (notification === "BACKEND") {
      this.message = "Great photo! Analyzing...";
      this.image = "data:image/png;base64," + payload;
    } else if (notification === "FINISH"){
      this.message = payload;
      this.image = null;
    } else if (notification === 'WELCOME') {
      this.message = "";
    } else if (notification === 'BYE') {
      var callback = function() {
        self.message = "Goodbye! Next test is in 3 month.";
        self.image = null;
        self.updateDom();
      }
      setTimeout(callback, 3000);
      setTimeout(function() {
        self.message = "";
        self.updateDom();
      }, 6000);
    }
    this.updateDom();
  },

  notificationReceived: function(notification, payload, sender) {
    var self = this;
    if (notification === "CHECK_MY_SKIN"){
      self.show(function() {
        Log.log(self.name + ' is shown.');
      });
      self.image = null;
      self.message = "Please stand still while taking the test.";
      self.display = true;
      this.updateDom();
      this.sendSocketNotification('START_TEST', this.config);
    } else if (notification === "YES") {
      self.message = "Your skin test has been send to your doctor.";
      this.updateDom();

      this.sendSocketNotification('BYE', this.config);
    } else if (notification === "NO") {
      this.sendSocketNotification('BYE', this.config);
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