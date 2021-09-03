package com.lorepo.icplayer.client.printable;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.text.TextParser;

public class PrintableController {

	private JavaScriptObject jsObject = null;
	private Page page = null;
	private SeededRandom random = new SeededRandom();
	private JavaScriptObject scoreJS = null;
	private IPrintableTextParser textParser;
	
	PrintableController(Page page) {
		this.page = page;
		this.textParser = new PrintableTextParser();
	};
	
	public void setSeededRandom(SeededRandom random) {
		this.random = random;
	}
	
	public JavaScriptObject getPrintableContext(String addonID) {
		IModuleModel model = page.getModules().getModuleById(addonID);
		if (model instanceof IPrintableModuleModel) {
			IPrintableModuleModel printable = (IPrintableModuleModel) model;
			return printable.getPrintableContext();
		} else {
			return null;
		}
	}
	
	public int nextInt(int upperBound) {
		return random.nextInt(upperBound);
	}
	
	public JavaScriptObject getAsJavaScript() {
		if (jsObject == null) {
			jsObject = initJSObject(this);
		}

		return jsObject;
	}

	public String getPageName() {
		return page.getName();
	}
	
	private native JavaScriptObject initJSObject(PrintableController x) /*-{
		var controller = function() {};
		
		controller.getPrintableContext = function(addonID) {
			return x.@com.lorepo.icplayer.client.printable.PrintableController::getPrintableContext(Ljava/lang/String;)(addonID);
		};
		
		controller.nextInt = function(upperBound) {
			return x.@com.lorepo.icplayer.client.printable.PrintableController::nextInt(I)(upperBound);
		};

		controller.getScore = function() {
			return x.@com.lorepo.icplayer.client.printable.PrintableController::scoreJS;
		};

		controller.getTextParser = function() {
			return x.@com.lorepo.icplayer.client.printable.PrintableController::getTextParser()();
		}
		
		controller.getPageName = function() {
			return x.@com.lorepo.icplayer.client.printable.PrintableController::getPageName()();
		}

		return controller;
	}-*/;

	public String getPageId () {
		return page.getId();
	}

	public void setScore(String score) {
		this.scoreJS = parseJson(score);
	}

	private JSPrintableTextParser getTextParser() {
		return this.textParser.getAsJS();
	}

	private native JavaScriptObject parseJson(String raw)/*-{
		try {
		var score = JSON.parse(raw);
		var pageIds = Object.keys(score);
		for (var i = 0; i < pageIds.length; i++) {
			var pageId = pageIds[i];
			score[pageId] = JSON.parse(score[pageId]);
		}
		return score;
		} catch (e) {
			return null;
		}
	}-*/;

}
