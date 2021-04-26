package com.lorepo_patchers.icfoundation;

import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icf.utils.TextToSpeechVoice;

@PatchClass(TextToSpeechVoice.class)
public class TextToSpeechVoicePatcher {
	private static String lastCreatedItemText;
	private static int callCount = 0;

	public static String lastCreatedItemText() {
		return lastCreatedItemText;
	}
	public static int callCount() {
		return callCount;
	}

	public static void resetCallCount() {
		callCount = 0;
	}

	@PatchMethod
	public static TextToSpeechVoice create() {
		callCount++;
		lastCreatedItemText = null;
		return null;
	}
	
	@PatchMethod
	public static TextToSpeechVoice create (String text) {
		callCount++;
		lastCreatedItemText = text;
		return null;
	}

	@PatchMethod
	public static TextToSpeechVoice create (String text, String lang) {
		callCount++;
		lastCreatedItemText = text;
		return null;
	}

	@PatchMethod
	public static TextToSpeechVoice getObject ()  {
		return null;
	}
}
