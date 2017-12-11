/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var config = {
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],

	language: 'en',
	timeFormat: 24,
	units: 'metric',

	modules: [
		{
			module: 'alert',
		},
		{
			module: 'clock',
			position: 'top_left'
		},
		{
			module: 'calendar',
			header: 'US Holidays',
			position: 'top_left',
			config: {
				calendars: [
					{
						symbol: 'calendar-check-o ',
						url: 'webcal://www.calendarlabs.com/templates/ical/US-Holidays.ics'
					}
				]
			}
		},
		// {
		// 	module: "weatherforecast",
		// 	position: "top_right",	// This can be any of the regions.
		// 	header: 'Weather Forecast',		// Best results in left or right regions.
		// 	config: {
		// 		// See 'Configuration options' for more information.
		// 		location: "New York",
		// 		locationID: "5128581", //Location ID from http://openweathermap.org/help/city_list.txt
		// 		appid: "" //openweathermap.org API key.
		// 	}
		// },
	  	{
			module: 'MMM-Mole',
			position: "top_center",
			config: {
				text: "Welcome to Reflective Health!",
				message: "",
				// use pi camera by default; set it to false for laptop camera
				usePiCam: false,
				display: true,
				testInProgress: false,
				middleware_addr: "middleware.ddns.net:5000"
				//middleware_addr: "10.148.128.100:5000"
	    		}
		},
		// {
		// 	module: 'newsfeed',
		// 	position: 'bottom_bar',
		// 	config: {
		// 		feeds: [
		// 			{
		// 				title: "New York Times",
		// 				url: "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml"
		// 			}
		// 		],
		// 		showSourceTitle: true,
		// 		showPublishDate: true
		// 	}
		// },
/*
	        {
	       	module: 'voicecontrol',
	       	position: 'top_right',
	       	config: {
		      models: [
			     {
			     	keyword: "Check My Skin",
                    description: "Say 'Check My Skin' to start your skin test",
                    file: "alexa.umdl",
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
	       }
        },
*/
		{
			"module": "MMM-awesome-alexa",
			"position": "bottom_bar",
			"config": {
				"wakeWord": "Alexa",
				"clientId": "amzn1.application-oa2-client.64b783a057104700b89a37b5f5a2dc11",
				"clientSecret": "48cca45c1a41d900da8a1c72d031e1add961e73a4fd881405630eac4dd54796a",
				"deviceId": "ReflectiveHealth",
				"refreshToken": "Atzr|IwEBIP8nNg7OBYYK8APWrVTlqvRTKLZTM9ciH88Ngpzr51lbLnvxVyxTkPtFin7tsq2NuRjwAt_yzPBhffSFQfREIOcQclraBlq-sirq77xCPcCWR9UtxQ17i1uF-kfLZL2gbUZmMmJ3fXs_ONy_7OdqG1C11Nid8_aUWIiORrNS70fGEL3yg4t9s-TFOpSJ3tkRV8uDMSx7RIQJ4OgLp46uNffZRKYsKXPezP1wAxleGG_hpXR31OcdgwyAfraj4cs4LlQxUZHs91K-ZlLX_-erB9ffx4pLyarRJE0Dh4XTrFj41w1_ShqJvwn0DO2NE4zFMX3JJxaiVRcTQ1Qd1H1IGoogrH-jJjIf98vbVP2htBHB_ovlg-TLudNtSlcjTT88smXVksJSoL97PirlQfo7Ux_N9dpPeV_LDAsR8-7lHxaKhNSnS60TLMeEwwhGxatHYCr7rPbhBkeEZFObv74D7gUa6kK6vgjzz0Ec0NGg6OudFNvUKXr5m2NlD9F_lFxDJtbzBwuQ3fklBDomsBYfEOY6"
			}
		}
	]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== 'undefined') {module.exports = config;}
