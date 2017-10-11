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
			module: "updatenotification",
			position: "top_bar"
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
		// {
		// 	module: 'compliments',
		// 	position: 'lower_third'
		// },
		// {
		// 	 module: 'MMM-Smile',
		// 	 position: "middle_center",
		// 	 config: {
		// 		// recognition interval in ms, default to 8 hours
 	//          	interval: 8 * 60 * 60 * 1000,
	 //         	// total test running time in seconds
		// 	 	testRunTime: 120,
		//      	// the smiling period in seconds in order to pass the test
		// 	    smileLength: 5,
		// 		// use pi camera by default; set it to false for laptop camera
		// 		usePiCam: false
		//     }
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
				testInProgress: false
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
		// {
  //           module: 'camera',
  //           position: 'top_center',
  //           config: {
  //                       selfieInterval: 3,  // Time interval (s) before the photo will be taken.
  //                       emailConfig: {
  //                           service: 'Yahoo', // Email provider to use to send email with a photo.
  //                           auth: {
  //                               user: '', // Your email account
  //                               pass: ''        // Your password for email account
  //                           }
  //                       }
  //                   }
  //       },
        {
	       module: 'voicecontrol',
	       position: 'top_right',
	       config: {
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
	       }
        },
	]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== 'undefined') {module.exports = config;}
