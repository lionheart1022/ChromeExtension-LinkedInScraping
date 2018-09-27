chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.create({
		url: "https://www.linkedin.com/sales/"
	});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.message === "load") {
		var savedDetails = JSON.parse(localStorage.getItem('savedDetails') || "{}");
		sendResponse(savedDetails);
	} else if(request.message === "save") {
		if(request.toSaveDetails && Object.keys(request.toSaveDetails).length)
			localStorage.setItem('savedDetails', JSON.stringify(request.toSaveDetails));
		sendResponse();
	}

	return false;

});
