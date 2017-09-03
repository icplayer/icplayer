package com.lorepo_patchers.icplayer.client.page;

import org.mockito.Mockito;

import com.google.gwt.core.client.JavaScriptObject;
import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;

@PatchClass(KeyboardNavigationController.class)
public class KeyboardNavigationControllerPatcher {
	@PatchMethod
	private static JavaScriptObject	getInputElement(KeyboardNavigationController x) {
		return Mockito.mock(JavaScriptObject.class);
	}
	
	@PatchMethod
	private static void focusElement(KeyboardNavigationController x, JavaScriptObject element) {
		element.createObject();
	}
	
	@PatchMethod
	private static void waitOnMessages (KeyboardNavigationController self, KeyboardNavigationController x) {
		
	}
}
