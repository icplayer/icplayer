package com.lorepo.icplayer.client.page;

import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.core.client.JsArrayString;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.TextToSpeechVoice;


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
	
	public static void speak (JavaScriptObject obj, List<TextToSpeechVoice> voiceTexts) {
		nativeSpeak(obj, JavaScriptUtils.textToSpeechVoicesObjectToJavaScriptArray(voiceTexts));
	}
	
	public static native void nativeSpeak(JavaScriptObject obj, JsArray<JavaScriptObject> texts) /*-{
		try {
			if (obj && obj.speak) {
				obj.speak(texts);
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in speak(): \n" + err);
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

}
