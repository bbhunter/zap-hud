var INFORMATIONAL_FLAG = "<img src='<<ZAP_HUD_API>>OTHER/hud/other/image/?name=flag-blue.png' >&nbsp";
var LOW_FLAG = "<img src='<<ZAP_HUD_API>>OTHER/hud/other/image/?name=flag-yellow.png' >&nbsp";
var MEDIUM_FLAG = "<img src='<<ZAP_HUD_API>>OTHER/hud/other/image/?name=flag-orange.png' >&nbsp";
var HIGH_FLAG = "<img src='<<ZAP_HUD_API>>OTHER/hud/other/image/?name=flag-red.png' >&nbsp";


document.addEventListener("DOMContentLoaded", function() {
	if (typeof alertify != "undefined") {
		alertify.maxLogItems(5);
		alertify.logPosition("bottom right");
	} 
	else {
		console.log('hubInjectScript alertify is null :(');
	}
});

navigator.serviceWorker.addEventListener("message", function(event) {
	var message = event.data;
	
	switch(message.action) {
		case "showGrowlerAlert":
			showGrowlerAlert(message.alert, event.ports[0]);
			break;

		default:
			break;
	}
});

function showGrowlerAlert(alert, port) {
	port.postMessage({action: "alertsReceived"});

	// expands growler frame for one alert
	expandFrame();

	// build notification content
	var content = getRiskFlag(alert.risk) + alert.alert + getHiddenId(alert.id);

	// display and handle click
	alertify
		.delay(3000)
		.closeLogOnClick(true)
		.log(content, function(event) {
			var alertId = event.target.querySelector("#alertId").value;

			// todo: show alert details
			navigator.serviceWorker.controller.postMessage({tool: "site-alerts", action: "showAlertDetails", "id": alertId});
		});

	// shrinks frame for one alert
	setTimeout(function() {shrinkFrame();}, 3500);
}

function expandFrame() {	
	parent.postMessage({action: "heightenGrowlerFrame"}, document.referrer);
}

function shrinkFrame() {	
	parent.postMessage({action: "shortenGrowlerFrame"}, document.referrer);
}

function getRiskFlag(risk) {
	switch(risk) {
		case "Informational":
			return INFORMATIONAL_FLAG;

		case "Low":
			return LOW_FLAG;

		case "Medium":
			return MEDIUM_FLAG;

		case "High":
			return HIGH_FLAG;

		default:
			return "";
	}
}

function getHiddenId(alertId) {
	return "<input id='alertId' type='hidden' name='alertId' value=" + alertId + ">"
}