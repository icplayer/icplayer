package com.lorepo.icplayer.client.page;

import java.util.ArrayList;
import java.util.List;

import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.api.ITextToSpeechPresenter;


public final class TextToSpeech {
	public static void playTitle (String id, PageController pageController) {
		ITextToSpeechPresenter TTS = pageController.getPageTextToSpeechModule();
		
		if (TTS != null) {
			TTS.playTitle(id);
		}
	}
	
	public static void playDescription (String id, PageController pageController) {
		ITextToSpeechPresenter TTS = pageController.getPageTextToSpeechModule();
		
		if (TTS != null) {
			TTS.playDescription(id);
		}
	}
	
	public static void speak (String text, PageController pageController) {
		ITextToSpeechPresenter TTS = pageController.getPageTextToSpeechModule();
		if (TTS != null) {
			TTS.speak(text);
		}
	}
	
	public static void readGap (String text, int gapNumber, PageController pageController) {
		ITextToSpeechPresenter TTS = pageController.getPageTextToSpeechModule();
		if (TTS != null) {
			TTS.readGap(text, gapNumber);
		}
	}
	
	public static List<String> getModulesOrder (PageController pageController) {
		ITextToSpeechPresenter TTS = pageController.getPageTextToSpeechModule();
		
		if (TTS != null) {
			return JavaScriptUtils.convertJsArrayToArrayList(TTS.getAddOnsOrder());
		} else {
			List<String> result = new ArrayList<String>();
			return result;
		}
	}

	public static List<String> getMultiPartDescription (String id, PageController pageController) {
		ITextToSpeechPresenter TTS = pageController.getPageTextToSpeechModule();
		
		if (TTS != null) {
			return JavaScriptUtils.convertJsArrayToArrayList(TTS.getMultiPartDescription(id));
		} else {
			List<String> result = new ArrayList<String>();
			return result;
		}
	}
}
