chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.data == "uuids") {
      sendResponse({message: "ok"});
	  document.body.innerHtml =  data;
	}
  });
  
 $(function () {
	initSettings(function(items) {
		$("#uuid-input").focus();
		
		var actions = getActions();
		$("#uuid-details").empty();
		for (var actionId in actions) {
			var action = actions[actionId];
			$("#uuid-details").append(`<div><button id="uuidbutton_${actionId}" data-action-id="${actionId}">${action.name}</button></div>`);
			$("#uuidbutton_" + actionId).click(function(e) {
				executeAction(getAction(this.dataset.actionId), $("#uuid-input").val(), e);
			});
		}
	});
});
