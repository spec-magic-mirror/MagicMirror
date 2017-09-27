
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
						keyword: "Show Camera",
						description: "Say 'Show Camera' to display camera",
						file: "showCamera.pmdl",
						message: "SHOW_CAMERA"
					},
					{
						keyword: "Hide Camera",
						description: "Say 'Hide Camera' to hide camera",
						file: "hideCamera.pmdl",
						message: "HIDE_CAMERA"
					},
					{
						keyword: "Selfie",
						description: "Say 'Selfie' when camera is visible",
						file: "selfie.pmdl",
						message: "SELFIE"
					},
                    {
						keyword: "Show Weather",
						description: "Say 'Show Weather' to display weather",
						file: "showWeather.pmdl",
						message: "SHOW_WEATHER"
					},
                    {
						keyword: "Hide Weather",
						description: "Say 'Hide Weather' when weather is visible",
						file: "hideWeather.pmdl",
						message: "HIDE_WEATHER"
					},
                    {
                        keyword: "Check My Skin",
                        description: "Say 'Check My Skin' to start your skin test",
                        file: "checkMySkin.pmdl",
                        message: "CHECK_MY_SKIN"
                    },
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