if (typeof Extension == "undefined") {
	Extension = new Object();
}

if (typeof Extension.UUIDWizard == "undefined") {
	Extension.UUIDWizard = new Object();
}

Extension.UUIDWizard.regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

Extension.UUIDWizard.detailsPaneHtml = `<div id="uuid-details-pane" style="display: none;"> 
			<h3 class="title"></h3>
	      </div>`;
$($.parseHTML(Extension.UUIDWizard.detailsPaneHtml)).appendTo('body');

initSettings();

$(function () {
	$('.chrex-uuid').on('mouseover', function (e) {
		var dpane = $('#uuid-details-pane');
		var uuid = this.innerText;

		var actions = getActions();
		$("#uuid-details-pane").empty();
		$("#uuid-details-pane").append(`<h3 class="title"></h3>`);
		var dpanetitle = $('#uuid-details-pane .title');
		
		for (var actionId in actions) {
			var action = actions[actionId];
			$("#uuid-details-pane").append(`<div><button id="uuidbutton_${actionId}" data-action-id="${actionId}">${action.name}</button></div>`);
			$("#uuidbutton_" + actionId).click(function(e) {
				executeAction(getAction(this.dataset.actionId), uuid, e);
			});
		}

		var position = { "left": e.clientX, "top": e.clientY};
		var imgwidth = 0;
		var ycoord = position.top;
		if (position.left / $(window).width() >= 0.5) {
			var xcoord = position.left - 300;
		} else {
			var xcoord = position.left + imgwidth;
		}

		dpanetitle.html(uuid);
		
		dpane.css({
			'width' : "300px"
			});
		
		dpane.css({
			'left' : xcoord,
			'top' : ycoord,
			'display' : 'block'
		});

	}).on('mouseout', function (e) {
		$('#uuid-details-pane').css('display', 'none');
	});

	$('#uuid-details-pane').on('mouseover', function (e) {
		$(this).css('display', 'block');
	});
	$('#uuid-details-pane').on('mouseout', function (e) {
		var e = e.toElement || e.relatedTarget;
		if (e.parentNode == this || e.parentNode.parentNode == this || e.parentNode.parentNode.parentNode == this || e == this || e.nodeName == 'IMG') {
			return;
		}
		$(this).css('display', 'none');
	});
});

Extension.UUIDWizard.delayedSearch = function(re) {
	Extension.UUIDWizard.uuids = [];
	var html = document.getElementsByTagName('body')[0];
	html.normalize();
	Extension.UUIDWizard.recurse(html, re);
}

Extension.UUIDWizard.recurse =  function(element, regexp) {
	if (element.nodeName == "MARK" || element.nodeName == "SCRIPT" || element.nodeName == "NOSCRIPT" || element.nodeName == "STYLE" || element.nodeType == Node.COMMENT_NODE) {
		return;
	}

	if (element.className == "chrex-uuid" || element.id == "uuid-details-pane") {
		return;
	}

	if (element.nodeType != Node.TEXT_NODE) {
		var disp = $(element).css('display');
		if (disp == 'none' || disp == 'hidden') {
			return;
		}
	}

	if (element.childNodes.length > 0) {
		for (var i = 0; i < element.childNodes.length; i++) {
			Extension.UUIDWizard.recurse(element.childNodes[i], regexp);
		}
	}

	if (element.nodeType == Node.TEXT_NODE && element.nodeValue.trim() !== '') {
		var str = element.nodeValue;
		var matches = str.match(regexp);
		var parent = element.parentNode;

		if (matches !== null) {
			var pos = 0;
			var mark;

			for (var i = matches.length - 1; i >= 0; i--) {
				var index = str.indexOf(matches[i], pos);
				var fragment = element;
				if (index > 0) {
					fragment = element.splitText(index);
				}

				if (fragment.nodeValue.length > matches[i].length) {
					fragment.splitText(matches[i].length);
				}
				
				Extension.UUIDWizard.uuids.push(matches[i]);

				if (fragment.nodeType == Node.TEXT_NODE) {
					$(fragment).wrap("<span class=\"chrex-uuid\" style=\"background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZdJREFUeNp8088rBGEYwPGdsWu3/F6/8iNJ5CAHRCm1fuRASikHF/8AVyelrPYf8Ac4uHPR1h4oSQ6Lg0KciNZK0W5rsbtj1vfdntlWO7z16e2dmfeZed7nGS2bzTrUcLlcjoKhYxDDqEAEp7iCqR7IZDK5BzWbABo6UIokytCAfllvwfgvQBd8aEM53vGAc7SozQhZAZzWLgnUjkVcYhdxVKEbczhU74IbqV9f4HTmYi3hQjYNwYs3hCXYNHbwZBhG1Dosa9QihmpJYR+bMvvk+rUcbLLwtAtzv8UIgujEqsxBuX4ja70oAKnUIYFmRDCBAMYQRRPi8MK0+wJ1OK04RgBHUgl1BjX4xDfSqg3sAtxhAfdYl1mtT9CHM/TiGV/WpsIyqvwOMC+N8yLrBGawgWXsqceLAkjUD2zjVaoygFmsSSU8klp+5PtA13PZ9MAv9Y9J44QwinGsSFc6TNO0DaBSqWRqRIn0/6S0r1/TtEfrzUUBuGml5JZTn0K9/ANhqULa+hvz+/4I4JGyalK6lCgK8CPAAKW1tG9lZ029AAAAAElFTkSuQmCC') no-repeat top left; padding-left: 20px;\"></span>");
				}

			}
		}
	}
}

Extension.UUIDWizard.delayedSearch(Extension.UUIDWizard.regex);