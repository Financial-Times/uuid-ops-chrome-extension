$(function () {
	initSettings(function(items) {
		refreshSettings();
		$("#saveButton").click(function(e) {
			setApiKey($("#text_apikey").val());
		});
		
		refreshActions();
		$("#add_action_button").click(function(e) {
			var action = {};
			action.name = $("#text_name").val();
			action.id = action.name.hashCode();
			action.url = $("#text_url").val();
			action.type = "url";
			setAction(action);
			refreshActions();
			$("#text_name").val("");
			$("#text_url").val("");
			return false;
		});
		
		$("#default_actions_button").click(function(e) {
			initDefaults();
			refreshActions();
			return false;
		});
	});
	
});

function refreshActions() {
	var actions = getActions()
	if (actions == null) {
		return;
	}
	$("#current_actions").empty();
	for (var actionId in actions) {
		var action = actions[actionId];
		$("#current_actions").append(`<li id="action_${actionId}"><span class="itemName">${action.name}</span><span>${action.url}</span></li>`);
		if (action.type == "copy") {
			$("#action_" + actionId).prepend(`<button disabled>&nbsp;</button>`);
		}
		else {
			$("#action_" + actionId).prepend(`<button class="deleteButton" id="delete_${actionId}" data-action-id="${actionId}">X</button>`);
			$("#delete_" + actionId).click(function(e) {
				deleteAction(this.dataset.actionId);
				refreshActions();
				return false;
			});
		}
		
	}
}

function refreshSettings() {
	var settings = getSettings();
	if (settings != null && settings.apiKey) {
		$("#text_apikey").val(settings.apiKey);
	}
}