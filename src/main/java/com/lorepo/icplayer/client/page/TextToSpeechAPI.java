package com.lorepo.icplayer.client.page;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArrayString;


public class TextToSpeechAPI {
	
	public static native void playTitle (JavaScriptObject obj, String area, String id) /*-{
		try {
			if (obj && obj.playTitle != undefined) {
				obj.playTitle(area, id);
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in playTitle(): \n" + err);
		}
	}-*/;
	
	public static native void playDescription (JavaScriptObject obj, String id) /*-{
		try {
			if (obj && obj.playDescription != undefined) {
				obj.playDescription(id);
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in playDescription(): \n" + err);
		}
	}-*/;
	
	public static native void speak (JavaScriptObject obj, String text) /*-{
		try {
			if (obj && obj.speak != undefined) {
				obj.speak(text);
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in speak(): \n" + err);
		}
	}-*/;
	
	public static native void readGap (JavaScriptObject obj, String text, String currentGapContent, int gapNumber) /*-{
		try {
			if (obj && obj.readGap != undefined) {
				obj.readGap(text, currentGapContent, gapNumber);
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in readGap(): \n" + err);
		}
	}-*/;
	
	public static native void playEnterText (JavaScriptObject obj) /*-{
		try {
			if (obj && obj.playEnterText != undefined) {
				obj.playEnterText();
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in playEnterText(): \n" + err);
		}
	}-*/;
	
	public static native void playExitText (JavaScriptObject obj) /*-{
		try {
			if (obj && obj.playExitText != undefined) {
				obj.playExitText();
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in playExitText(): \n" + err);
		}
	}-*/;

	public static native JsArrayString getModulesOrder (JavaScriptObject obj) /*-{
		try {
			if (obj && obj.getModulesOrder != undefined) {
				return obj.getModulesOrder();
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in getModulesOrder(): \n" + err);
		}
	}-*/;

	public static native JsArrayString getMultiPartDescription (JavaScriptObject obj, String id) /*-{
		try {
			if (obj && obj.getMultiPartDescription != undefined) {
				return obj.getMultiPartDescription(id);
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in getMultiPartDescription(): \n" + err);
		}
	}-*/;

}
