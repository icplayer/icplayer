package com.lorepo_patchers.icfoundation;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icf.utils.JavaScriptUtils;

@PatchClass(JavaScriptUtils.class)
public class JavaScriptUtilsPatcher {
	@PatchMethod
	public static void destroyDraggable(Element e) {
	}
	
	@PatchMethod
	public static void log(String message) {
		System.out.println(message);
	}
	
	@PatchMethod
	public static void log(Object message) {
		System.out.println(message);
	}

	@PatchMethod
	public static void error(Object message) {
		System.out.println(message);
	}

	@PatchMethod
	public static void alert(String message) {
		System.out.println(message);
	}

	@PatchMethod
	public static void makeDropable(Element e, JavaScriptObject jsObject) {
		
	}
	
	@PatchMethod
	public static void addPropertyToJSArray(JavaScriptObject model, String key, String value) {	}
}
