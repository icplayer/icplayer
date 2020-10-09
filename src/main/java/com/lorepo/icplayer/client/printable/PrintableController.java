package com.lorepo.icplayer.client.printable;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.api.IModuleModel;

public class PrintableController {

	private JavaScriptObject jsObject = null;
	private Page page = null;
	
	PrintableController(Page page) {
		this.page = page;
	};
	
	public JavaScriptObject getPrintableContext(String addonID) {
		IModuleModel model = page.getModules().getModuleById(addonID);
		if (model instanceof IPrintableModuleModel) {
			IPrintableModuleModel printable = (IPrintableModuleModel) model;
			return printable.getPrintableContext();
		} else {
			return null;
		}
	}
	
	public JavaScriptObject getAsJavaScript() {
		if (jsObject == null) {
			jsObject = initJSObject(this);
		}

		return jsObject;
	}
	
	private native JavaScriptObject initJSObject(PrintableController x) /*-{
		var controller = function() {};
		
		controller.getPrintableContext = function(addonID) {
			return x.@com.lorepo.icplayer.client.printable.PrintableController::getPrintableContext(Ljava/lang/String;)(addonID);
		};
		
		return controller;
	}-*/;
}
