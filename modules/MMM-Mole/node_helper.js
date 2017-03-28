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
      } else if (message.hasOwnProperty('success') && self.config['captureAngle'] < 4) {
        console.log("[" + self.name + "] " + (message.success));
        if (self.config['captureAngle'] == 0) {
          self.sendSocketNotification('MESSAGE', 'please turn to the right');
          self.config['captureAngle'] += 1;
        } else if (self.config['captureAngle'] == 1) {
          self.sendSocketNotification('MESSAGE', 'please turn to the back');
          self.config['captureAngle'] += 1;
        } else if (self.config['captureAngle'] == 2) {
          self.sendSocketNotification('MESSAGE', 'please turn to the left');
          self.config['captureAngle'] += 1;
        } else if (self.config['captureAngle'] == 3) {
          self.sendSocketNotification('MESSAGE', 'We are done!! Thanks!!');
          self.config['captureAngle'] += 1;
        } else {
          self.config['captureAngle'] = 0;
          self.sendSocketNotification('FINISH', 'We are done!! Thanks!!');
        }
        
      } else if (message.hasOwnProperty('error')) {
        console.log("[" + self.name + "] " + (message.error));
        self.restart = true
          // self.sendSocketNotification('RESULT', message.result);
      } else {
        console.log("[" + self.name + "] " + message)
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
      }
    });
  },
  sendMessage: function(msg){
    var self = this
    self.sendSocketNotification("MESSAGE", msg);
  },
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'START_TEST') {
      this.config = payload
      this.python_start();

    } else if (notification == "PASSED_TEST") {
      this.sendMessage('MESSAGE', "PASSED_TEST");
    }
  }

});

