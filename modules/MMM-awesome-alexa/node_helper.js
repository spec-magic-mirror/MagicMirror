const fs = require("fs");
const NodeHelper = require("node_helper");
const Main = require("./dist/main/index.js");
const PythonShell = require('python-shell');


let main;

process.env.CWD = `${process.env.PWD}/modules/MMM-awesome-alexa`;

module.exports = NodeHelper.create({
    python_start: function() {
        console.log("python started");
        
        var pyshell = new PythonShell('modules/' + this.name + '/code/check_queue.py', {
            mode: 'json',
            args: [JSON.stringify(this.config)]
        });
        console.log(this.name);
        const self = this;
        pyshell.on('message', function(message) {
            console.log("PYSHELL ON");
            if (message.hasOwnProperty('mole')) {
                console.log("[" + self.name + "] " + 'receive open mole module command');
                self.sendSocketNotification("SKIN_TEST", "");
            } else if (message.hasOwnProperty("message")) {
                console.log("[" + self.name + "] " + message.message);
            } else {
                console.log("[" + self.name + "] " + message);
            }
        });

        pyshell.end(function(err) {
            if (err) throw err;
            console.log("[" + self.name + "] " + 'restarting...');
            setTimeout(function() {
                self.python_start()
            }, 30 * 1000);
        });
    },


    start: function () {
        this.expressApp.get("/output.mpeg", function (req, res) {
            res.setHeader("Expires", new Date().toUTCString());
            const path = `${process.env.CWD}/temp/output.mpeg`;

            if (!fs.existsSync(path)) {
                const rstream = fs.createReadStream(`${process.env.CWD}/resources/alexa/sorry-im-not-sure.mpeg`);
                rstream.pipe(res);
                return;
            }

            const rstream = fs.createReadStream(path);
            rstream.pipe(res);
        });
    },

    // Because this.config is not accessible from node_helper for some reason. Need to pass from the js file.
    socketNotificationReceived: function (notification, payload) {

        if (notification === "CONFIG") {
            this.python_start();
            main = new Main(payload, (event, payload) => {
                this.sendSocketNotification(event, payload);
            }, this.socketNotificationReceived);
            return;
        }
        // } else if (notification === "FINISH") {
        //     var pyshell = new PythonShell('modules/' + this.name + '/code/check_queue.py', {
        //         mode: 'text'
        //     });
        //     pyshell.send("Exit");
        // }

        main.receivedNotification(notification, payload);
    },
});
