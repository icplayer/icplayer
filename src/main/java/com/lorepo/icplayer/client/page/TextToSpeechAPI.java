package com.lorepo.icplayer.client.page;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArrayString;


public class TextToSpeechAPI {
	
	public static native void playTitle (JavaScriptObject obj, String area, String id, String langTag) /*-{
		try {
			if (obj && obj.playTitle) {
				obj.playTitle(area, id, langTag);
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in playTitle(): \n" + err);
		}
	}-*/;
	
	public static native void playDescription (JavaScriptObject obj, String id, String langTag) /*-{
		try {
			if (obj && obj.playDescription) {
				obj.playDescription('main', id, langTag);
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in playDescription(): \n" + err);
		}
	}-*/;
	
	public static native void speak (JavaScriptObject obj, String text, String langTag) /*-{
		try {
			if (obj && obj.speak) {
				obj.speak(text, langTag);
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in speak(): \n" + err);
		}
	}-*/;
	
	// TODO remove
	public static native void readGap (JavaScriptObject obj, String text, String currentGapContent, int gapNumber) /*-{
		try {
			if (obj && obj.readGap) {
				obj.readGap(text, currentGapContent, gapNumber);
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in readGap(): \n" + err);
		}
	}-*/;
	
	public static native void playEnterText (JavaScriptObject obj) /*-{
		try {
			if (obj && obj.playEnterText) {
				obj.playEnterText();
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in playEnterText(): \n" + err);
		}
	}-*/;
	
	public static native void playExitText (JavaScriptObject obj) /*-{
		try {
			if (obj && obj.playExitText) {
				obj.playExitText();
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in playExitText(): \n" + err);
		}
	}-*/;

	public static native JsArrayString getModulesOrder (JavaScriptObject obj) /*-{
		try {
			if (obj && obj.getModulesOrder) {
				return obj.getModulesOrder();
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in getModulesOrder(): \n" + err);
		}
	}-*/;

	public static native JsArrayString getMultiPartDescription (JavaScriptObject obj, String id) /*-{
		try {
			if (obj && obj.getMultiPartDescription) {
				return obj.getMultiPartDescription(id);
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in getMultiPartDescription(): \n" + err);
		}
	}-*/;

}
