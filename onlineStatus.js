// onlineStatus.js - connectivity & connection monitor for frontend apps
// https://github.com/crobinson42/online-status
// Cory Robinson

// Here's what we are able to do:
// - know when we're connected/disconnected by onlineStatus.status
// - pass a callback to be triggered on status change
// - notify only when we're disconnected
// - ^ or show constant connection status
// - pass a DOM element to be used as the container for status
// - ^ or ^ have onlineStatus module create a generic element to use for status
//		* looks for an element with class of 'onlineStatusText' to write status
// - get the connection status history log by onlineStatus.log

// TODO:
/*
	-readme for init
	-add init to write connection history to localStorage
	-add support for a socket connection monitor (passed to init)
	-make a REACT class that can be extended (aka new style mixin)
	// - notify only when we're disconnected
	// - ^ or show constant connection status
*/


(function () {

	var config = {
		writeLogToLocalStorage : true,
		el : {
			textClassName : 'onlineStatusText',
			online : {
				backgroundColor : 'green',
				textColor : 'white',
				text : 'Connected',
			},
			offline : {
				backgroundColor : 'red',
				textColor : 'white',
				text : 'Disconnected',
			}
		}
	};

	// local use error logger
	var error = function(msg,options) {
		throw new Error('onlineStatus.js: ' + msg, options || null);
	};

	var status = navigator && (typeof navigator.onLine == "boolean")
				? navigator.onLine
				: error('expected "navigator.onLine" is not an accessible property in the browser.');
	// log will be set with a strict pattern so that devs can use it with regex
	var log = function (msg) {
		log.log += '[' + new Date() + '] : ' + msg + ' :';
	};
	log.log = '[' + new Date() + '] : script loaded :';

	var init = function (options) {
		if (status == null) {// navigator.onLine not available
			return false;
		}
		/*
			options - optional
				{
					online/offline : { queue : *callback OR array of callbacks* },
					el OR element : DOM element
				}
		*/
		if (options) {
			if (options.online) {// set online callbacks
				if (typeof options.online == 'function') { init.online.queue.push(options.online); }
				if (typeof options.online == 'array') { options.online.forEach(function(i) { init.online.queue.push(options.online[i]); }); }
			}
			if (options.offline) {// set offline callbacks
				if (typeof options.offline == 'function') { init.offline.queue.push(options.offline); }
				if (typeof options.offline == 'array') { options.offline.forEach(function(i) { init.offline.queue.push(options.offline[i]); }); }
			}
			if (options.el) {// set element to use for notifications
				// check if it is a jquery element and get the DOM el
				if (typeof $ !== 'undefined' || typeof jQuery !== 'undefined') {
					if (options.el instanceof jQuery || options.el instanceof $) {
				 		init.el = options.el[0];
					}
			 	}
				else {
					init.el = options.el;
				}
				updateElement();//trigger update element
			}
		}

	};
	init.online = { queue : [] };// callbacks will be placed in queue from init
	init.offline = { queue : [] };// callbacks will be placed in queue from init
	init.el = null;

	var updateElement = function () {
		if (!init.el) { return }//stop this method if no el
		var el = init.el.querySelectorAll('.' + config.el.textClassName )[0];
		var currentStatus = (status ? 'online' : 'offline');
		// set text
		el.innerHTML = config.el[currentStatus].text;
		// set background color
		el.style.backgroundColor = config.el[currentStatus].backgroundColor;
		// set text color
		el.style.color = config.el[currentStatus].textColor;
	};

	// this is called when connection is detected or tested
	var online = function () {
		status = true;
		log('connected/online status');
		updateElement();
		// run any callback methods in init queue
		init.online.queue.forEach(function(i) { init.online.queue[i](); });
	};

	// this is called when offline status is detected or tested
	var offline = function () {
		status = false;
		log('DISCONNECTED/offline status');
		updateElement();
		// run any callback methods in init queue
		init.offline.queue.forEach(function(i) { init.offline.queue[i](); });
	};

	window.ononline = online;
	window.onoffline = offline;


	// Exposed methods
	window.onlineStatus = {
		init 		: init,
		status 	: status,
		log 		: log.log
	};
})();
