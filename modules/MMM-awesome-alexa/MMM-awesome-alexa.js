/* global Module */

/* Magic Mirror
 * Module: MMM-Awesome-Alexa
 *
 * By Dolan Miu http://www.dolan.bio
 * MIT Licensed.
 */

let alexaMirror;
let texts = [];

Module.register("MMM-awesome-alexa", {

    // Default module config.
    defaults: {
        clientId: "amzn1.application-oa2-client.81574bebfb25437595d7376f44b54f8e",
        clientSecret: "87d49f998b3a6507b8e6a08760cda274e1d44a22a2bebade9433b1e7445d66a5",
        deviceId: "magic_mirror_alexa",
        lite: false
    },

    start: function () {
        if (this.config.refreshToken === undefined) {
            texts.push("Refresh token must be set in the config before using awesome-alexa!");
        }
        // Needed to initially connect to node_helper;
        // this.sendSocketNotification("CONNECT_TEST", {});
        this.sendSocketNotification("CONFIG", this.config);
    },

    getDom: function () {
        const alexaWrapper = document.createElement("div");
        alexaWrapper.setAttribute("id", "wrapper");
        const spinner = this.createLoadingSpinner();
        alexaWrapper.appendChild(spinner);

        if (texts.length > 0) {
            alexaWrapper.classList.add("wrapper-error");

            for (const text of texts) {
                alexaWrapper.appendChild(document.createTextNode(text));
            }
        }

        alexaMirror = new AlexaVoiceService.AlexaMirror(alexaWrapper, undefined, this.config.lite, (event, payload) => {
            this.sendSocketNotification(event, payload);
        });

        alexaMirror.start();
        return alexaWrapper;
    },

    getScripts: function () {
        return [
            this.file("dist/bundle.js"),
        ];
    },

    getStyles: function () {
        return [
            this.file("styles/global.css"),
        ];
    },

    socketNotificationReceived: function (notification, payload) {
        var self = this;
        if (notification === "SKIN_TEST") {
            this.sendNotification("CHECK_MY_SKIN", {type: "notification"});
        }
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
        alexaMirror.receivedNotification(notification, payload);
        
    },

    createLoadingSpinner: function () {
        var img = document.createElement("img");
        img.setAttribute('src', 'modules/MMM-awesome-alexa/styles/loading.gif');
        img.setAttribute('id', 'loading-spinner');
        img.classList.add('loading-spinner');
        img.classList.add('hidden');
        return img;
    },

    createCanvas: function () {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 300;
        return canvas;
    }
});
