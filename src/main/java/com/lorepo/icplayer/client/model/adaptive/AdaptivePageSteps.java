package com.lorepo.icplayer.client.model.adaptive;

import com.google.gwt.core.client.JsArrayString;

import java.util.ArrayList;
import java.util.List;

public class AdaptivePageSteps {
	private AdaptivePagesStepMap pagesToStep;

	public AdaptivePageSteps(String json) {
		this.pagesToStep = this.getValues(json);
	}
	
	public int getPageStep(String pageId) {
		return this.pagesToStep.getPageStep(pageId);
	}

	// get all the pages from the step, beside the one given as parameter
	public List<String> getOtherStepPages(String pageId) {
		ArrayList<String> idsList = new ArrayList<String>();
		int stepIndex = this.pagesToStep.getPageStep(pageId);
		JsArrayString idsFromJson = this.pagesToStep.getOtherStepPages(pageId, stepIndex);

		for (int i = 0; i < idsFromJson.length(); i++) {
			idsList.add(idsFromJson.get(i));
		}

		return idsList;
	}

	private native AdaptivePagesStepMap getValues(String json) /*-{
		var map = {};
		if (json !== '' && json !== null && json !== undefined) { 
			var parsedJSON = JSON.parse(json);
			
			var pagesArray = parsedJSON.pages;
			var stepsArray = parsedJSON.steps;
			var map = {};
			
			for (var i = 0; i < pagesArray.length; i++) {
				var stepID = pagesArray[i].stepID;
				var index = stepsArray.indexOf(stepID);
				var pageID = pagesArray[i].ID;
				
				if (index >= 0) {
					map[pageID] = index;
				}
			}
		}

		return map;
	}-*/;
}
