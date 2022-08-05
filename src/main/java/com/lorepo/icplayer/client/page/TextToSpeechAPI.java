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
	
	public static native void playPageTitle (JavaScriptObject obj) /*-{
	try {
		if (obj && obj.playPageTitle) {
			obj.playPageTitle();
		}
	} catch(err) {
		alert("[TextToSpeech1] Exception in playPageTitle(): \n" + err);
	}
}-*/;

	public static native void playNextSentence (JavaScriptObject obj) /*-{
		try {
			if (obj && obj.readNextSavedSentence) {
				obj.readNextSavedSentence();
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in playNextSentence(): \n" + err);
		}
	}-*/;

	public static native void playPrevSentence (JavaScriptObject obj) /*-{
		try {
			if (obj && obj.readPrevSavedSentence) {
				obj.readPrevSavedSentence();
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in playPrevSentence(): \n" + err);
		}
	}-*/;

	public static native void saveNextSentences (JavaScriptObject obj) /*-{
		try {
			if (obj && obj.setSaveNextSentences) {
				obj.setSaveNextSentences(true);
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in saveNextSentences(): \n" + err);
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

	public static native String getAddonTitle (JavaScriptObject obj, String area, String id) /*-{
		try {
			if (obj && obj.playPageTitle) {
				var configuration = obj.getAddOnConfiguration(area, id);
				return configuration.title;
			}
		} catch(err) {
			alert("[TextToSpeech1] Exception in getAddonTitle(): \n" + err);
		}
		return "";
	}-*/;
}
