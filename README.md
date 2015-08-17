# Online Status (onlineStatus)

A utility that monitors your connection status.

Heres what we can do:
// - know when we're connected/disconnected by onlineStatus.status
// - pass a callback to be triggered on status change
//    or show constant connection status
// - pass a DOM element to be used as the container for status
//		* looks for an element with class of 'onlineStatusText' to write status
// - get the connection status history log by onlineStatus.log

```
window.onlineStatus
```

Config is at the top of the main onlineStatus.js file:
```
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
```

You can initialize the module with optional params:
```
onlineStatus.init({
  el : **DOM element or jQuery elment**,
  online : function(){ ..do something when online is triggered }
  offline : function (){ ...do something when offline is triggered }
});
```
* when passing in an element to show connection status, this element should be a container that contains an element to show the connection status - looks for an element with class of 'onlineStatusText' to write status.
