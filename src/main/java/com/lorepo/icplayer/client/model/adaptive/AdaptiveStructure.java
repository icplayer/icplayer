package com.lorepo.icplayer.client.model.adaptive;

import com.google.gwt.core.client.JsArray;
import com.google.gwt.core.client.JsArrayString;


public class AdaptiveStructure {
	private AdaptiveAdjacencyList adjacencyList;
	private AdaptivePageInformations pagesInfo;
	private JsArrayString stepsIDs;
	
	public AdaptiveStructure(String json) {
		this.adjacencyList = getListValues(json);
		this.pagesInfo = getPageInfos(json);
		this.stepsIDs = getStepsIDs(json);
	}

	public JsArray<AdaptiveConnection> getConnectionsForPage(String pageID) {
		return this.adjacencyList.getConnectionsForPage(pageID);
	}
	
	public String getDifficultyForPage(String pageID) {
		return this.pagesInfo.getDifficultyDescription(pageID);
	}

	public int getStepsLength() {
		return this.stepsIDs.length();
	}

	private native AdaptiveAdjacencyList getListValues(String json) /*-{
		if (json && json !== '') {
			var parsedJSON = JSON.parse(json);
			
			return parsedJSON.edges;
		} else {
			return {};
		}
	}-*/;
	
	private native AdaptivePageInformations getPageInfos(String json) /*-{
	if (json && json !== '') { 
		var parsedJSON = JSON.parse(json);
		
//ex:	difficulty: {
//       	"0":"Informative",
//          "1":"Assessment",
//          "2":"Easy"
//      }
//      pages:[
//      	{"ID":"PAGE_ID_1","stepID":"STEP_ID_1","pageName":"Page 1","previewURL":"","difficulty":1},
//          {"ID":"PAGE_ID_2","stepID":"STEP_ID_2","pageName":"Page 2","previewURL":"","difficulty":2},
//      ]
// 		steps: ["STEP_ID_1", "STEP_ID_2"]

		var difficultiesDefinitions = parsedJSON.difficulty;
		var pagesInfos = parsedJSON.pages;


		var adaptivePageInformations = {};

		for (var i = 0; i < pagesInfos.length; i++) {
			var pageID = pagesInfos[i].ID;
			var pageDifficulty = pagesInfos[i].difficulty;
			var pageDifficultyDefinition = difficultiesDefinitions[pageDifficulty];
			
			adaptivePageInformations[pageID] = {
				'difficulty': pageDifficultyDefinition
			};
		}
		
		return adaptivePageInformations;
	} else {
		return {};
	}
}-*/;

	private native JsArrayString getStepsIDs(String json) /*-{
		if (json && json !== '') {
			var parsedJSON = JSON.parse(json);

			return parsedJSON.steps;
		} else {
			return [];
		}
	}-*/;
}
