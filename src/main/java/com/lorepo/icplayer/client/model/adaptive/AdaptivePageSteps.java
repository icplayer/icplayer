package com.lorepo.icplayer.client.model.adaptive;

public class AdaptivePageSteps {
	private AdaptivePagesStepMap pagesToStep;
	
	public AdaptivePageSteps(String json) {
		this.pagesToStep = getValues(json);
	}
	
	public int getPageStep(String pageId) {
		return this.pagesToStep.getPageStep(pageId);
	}
	
	private native AdaptivePagesStepMap getValues(String json) /*-{
		var map = {};
		if (json !== ''&& json !== null && json !== undefined) { 
			var parsedJSON = JSON.parse(json);
			
			var pagesArray = parsedJSON.pages;
			var stepsArray = parsedJSON.steps;
			var map = {};
			
			for (var i = 0; i < pagesArray.length; i++) {
				var stepID = pagesArray[i].stepID;
				var index = stepsArray.indexOf(stepID);
				
				if (index >= 0) {
					map[pagesArray[i].ID] = index;
				}
			}
		}

		return map;
	}-*/;
}
