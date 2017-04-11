String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

var cachedStorage = {}
chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (key in changes) {
          var storageChange = changes[key];
		  cachedStorage[key] = storageChange.newValue;
        }
});

function initSettings(callback) {
	chrome.storage.local.get(["uuid-settings", "uuid-actions"], function(items) {
		cachedStorage = items;
		if (cachedStorage == null || cachedStorage["uuid-settings"] == null || cachedStorage["uuid-settings"]["initialized"] != true) {
			initDefaults();
			var settings = cachedStorage["uuid-settings"];
			if (settings == null) {
				settings = {};
			}
			settings.initialized = true;
			setSettings(settings);
		}
		if (callback) {
			callback(items);
		}
	});
	
}

function initDefaults() {
	setAction({name: "Copy", id: "Copy".hashCode(), url: "", type: "copy"});
	setAction({name: "CAPI V2", id: "CAPI V2".hashCode(), url: "http://api.ft.com/content/%uuid?apiKey=%apiKey", type: "url"});
	setAction({name: "CAPI V1", id: "CAPI V1".hashCode(), url: "http://api.ft.com/content/items/v1/%uuid?apiKey=%apiKey", type: "url"});
	setAction({name: "DPAPI V1", id: "DPAPI V1".hashCode(), url: "http://ftcomrender-web-data.svc.ft.com/cms/platform/rest/items/%uuid.json", type: "url"});
	setAction({name: "Spyglass", id: "Spyglass".hashCode(), url: "http://spyglass.ft.com/view/%uuid", type: "url"});
	setAction({name: "Lantern", id: "Lantern".hashCode(), url: "https://lantern.ft.com/realtime/articles/%uuid/sincePublicationDate", type: "url"});
	setAction({name: "Content Comparator", id: "Content Comparator".hashCode(), url: "https://ft-content-comparator.herokuapp.com/#/content/%uuid", type: "url"});
	setAction({name: "Splunk", id: "Splunk".hashCode(), url: "https://financialtimes.splunkcloud.com/en-US/app/financial_times_production/search?q=\"%uuid\"", type: "url"});
}

function getSettings() {
	var settings = cachedStorage["uuid-settings"];
	if (settings == null) {
		settings = {};
	}
	return settings;
}

function setSettings(settings) {
	chrome.storage.local.set({"uuid-settings": settings});
	cachedStorage["uuid-settings"] = settings;
}

function getApiKey() {
	return getSettings().apiKey;
}

function setApiKey(apiKey) {
	var settings = getSettings();
	settings.apiKey = apiKey;
	setSettings(settings);
}

function getActions() {
	var actions = cachedStorage["uuid-actions"];
	if (actions == null) {
		actions = {};
	}
	return actions;
}

function setActions(actions) {
	chrome.storage.local.set({"uuid-actions": actions});
	cachedStorage["uuid-actions"] = actions;
}

function getAction(id) {
	return getActions()[id];
}

function setAction(action) {
	var actions = getActions();
	actions[action.id] = action;
	setActions(actions);
}


function deleteAction(actionId) {
	var actions = getActions();
	delete actions[actionId];
	setActions(actions);
}

function executeAction(action, uuid, e) {
	switch (action.type) {
		case "url":
			urlAction(action, uuid, e);
			break;
		case "copy":
			copyAction(action, uuid, e);
			break;
	}

}

function urlAction(action, uuid, e) {
	var url = action.url;
	url = url.replace("%uuid", uuid);
	url = url.replace("%apiKey", getApiKey())
	window.open(url,  "_blank");
}

function copyAction(action, uuid, e) {
	var copyHandler = function (e) {
		e.clipboardData.setData('text/plain', uuid);
		e.preventDefault();
	};

	document.addEventListener('copy', copyHandler)

	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
	} catch (err) {
		console.log('Oops, unable to copy');
	}
	document.removeEventListener('copy', copyHandler)
}