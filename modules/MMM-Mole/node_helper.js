var NodeHelper = require("node_helper");
const PythonShell = require('python-shell');


module.exports = NodeHelper.create({
	python_start: function() {
    const self = this;
    const pyshell = new PythonShell('modules/' + this.name + '/code/eye_cascade.py', {
      mode: 'json',
      args: [JSON.stringify(this.config)]
    });

    pyshell.on('message', function(message) {
      if (message.hasOwnProperty('camera_ready')) {
        console.log("[" + self.name + "] " + 'camera ready')
        self.sendMessage("Ready to take pictures");
      } else if (message.hasOwnProperty('image_captured')) {
	      self.sendMessage("Picture taken, analysing...");
      } else if (message.hasOwnProperty('success')) {
        console.log("[" + self.name + "] " + (message.success));
        self.sendSocketNotification('FINISH', 'We are done!! Thanks!!');
      } else if (message.hasOwnProperty('error')) {
        console.log("[" + self.name + "] " + " Error message: " + (message.error));
        self.restart = true;
      } else if (message.hasOwnProperty('backend')) {
        console.log("[!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!] " + message.backend);
        self.sendSocketNotification('BACKEND', message.backend);
      } else {
        console.log("[" + self.name + "] " + message);
      }
      
    });

    pyshell.end(function(err) {
      if (err) throw err;
      if (self.restart) {
        console.log("[" + self.name + "] " + 'restarting...');
        setTimeout(function() {
          self.python_start()
        }, 30 * 1000);
      } else {
        console.log("[" + self.name + "] " + 'finished running...');
        self.sendSocketNotification('BYE', "Goodbye");
        // self.sendMessage('Your next appointment is not for 6 months would you like to send this report to your doctor?');
      }
    });
  },
  sendMessage: function(msg){
    var self = this;
    self.sendSocketNotification("MESSAGE", msg);
  },
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'START_TEST') {
      this.config = payload;
      this.python_start();
    } else if (notification === 'PASSED_TEST') {
      this.sendSocketNotification('MESSAGE', "PASSED_TEST");
    } else if (notification === 'WELCOME') {
      this.sendSocketNotification('WELCOME', 'Welcome to Reflective Health!');
    } else if (notification === 'BYE') {
      this.sendSocketNotification('BYE', "Goodbye");
    }
  }

});

