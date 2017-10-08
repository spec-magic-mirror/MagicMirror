
'use strict';
/* Magic Mirror
 * Module: voicecontrol
 *
 * By Alex Yakhnin
 * MIT Licensed.
 */

Module.register("voicecontrol", {

	// Default module config.

    defaults: {
		models: [
                    {
                        keyword: "Check My Skin",
                        description: "Say 'Check My Skin' to start your skin test",
                        file: "checkMySkin.pmdl",
                        message: "CHECK_MY_SKIN"
                    },
                    {
                        keyword: "Yes",
                        description: "Say 'Yes' to send your skin test",
                        file: "YES.pmdl",
                        message: "YES"
                    },
                    {
                        keyword: "No",
                        description: "Say 'No' to finish your skin test",
                        file: "NO.pmdl",
                        message: "NO"
                    }
				]
	},
    display: false,
    header_command: null,
    command_desc: null,

    start: function() { 
        this.display=true;
        this.sendSocketNotification("CONNECT", this.config);

    },

    getStyles: function() {
		return ['voicecontrol.css'];
	},

    socketNotificationReceived: function(notification, payload){
        if (notification === "KEYWORD_SPOTTED"){
            //Broadcast the message
            this.sendNotification(payload.message, {type: "notification"});
        }
	},
    notificationReceived: function(notification, payload){
        
        if (notification === "HIDE_VOICE_CONTROL"){
            this.display = false;
			this.updateDom(500);   
        }
        if (notification === "SHOW_VOICE_CONTROL"){
            this.display = true;
			this.updateDom(500);   
        }
	},

    getDom: function() {
        var wrapper = document.createElement("div");
        if (this.display)
            {
                this.header_command = document.createElement("header");
                this.header_command.innerHTML = "Voice Commands";
                wrapper.appendChild(this.header_command);
                var models = this.config.models;

                models.forEach(function(model) 
                {
                    this.command_desc = document.createElement("div");
                    this.command_desc.innerHTML = model.description;
                    this.command_desc.className = "small dimmed top";
                    wrapper.appendChild(this.command_desc);
                }, this);
            }
        else
            {
                this.header_command.style = "visibility:hidden;";
                this.command_desc.style = "visibility:hidden;";
                
            }
        

        return wrapper;
    }

});