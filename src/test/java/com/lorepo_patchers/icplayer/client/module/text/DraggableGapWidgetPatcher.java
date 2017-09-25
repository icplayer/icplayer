package com.lorepo_patchers.icplayer.client.module.text;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Document;
import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.module.text.DraggableGapWidget;

@PatchClass(DraggableGapWidget.class)
public class DraggableGapWidgetPatcher {
	@PatchMethod
	public static JavaScriptObject initJSObject(DraggableGapWidget self, DraggableGapWidget x) {
		JavaScriptObject obj = Document.createObject();
		
		return obj;
	}
}
