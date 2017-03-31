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
		{
			module: 'compliments',
			position: 'lower_third'
		},
		{
			 module: 'MMM-Smile',
			 position: "middle_center",
			 config: {
				// recognition interval in ms, default to 8 hours
 	         	interval: 8 * 60 * 60 * 1000,
	         	// total test running time in seconds
			 	testRunTime: 120,
		     	// the smiling period in seconds in order to pass the test
			    smileLength: 5,
				// use pi camera by default; set it to false for laptop camera
				usePiCam: false
		    }
		},
		{
			module: 'MMM-Mole',
			position: "top_center",
			config: {
				text: "Hello to Magic Mole Monitor",
				// use pi camera by default; set it to false for laptop camera
				usePiCam: false
	    	}
		},
		{
			module: 'newsfeed',
			position: 'bottom_bar',
			config: {
				feeds: [
					{
						title: "New York Times",
						url: "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml"
					}
				],
				showSourceTitle: true,
				showPublishDate: true
			}
		},
	]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== 'undefined') {module.exports = config;}
