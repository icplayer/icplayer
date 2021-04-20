package com.lorepo_patchers.icfoundation;

import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icf.utils.TextToSpeechVoice;

@PatchClass(TextToSpeechVoice.class)
public class TextToSpeechVoicePatcher {
	private static String lastCreatedItemText;

	public static String lastCreatedItemText() {
		return lastCreatedItemText;
	}

	@PatchMethod
	public static TextToSpeechVoice create() {
		lastCreatedItemText = null;
		return null;
	}
	
	@PatchMethod
	public static TextToSpeechVoice create (String text) {
		lastCreatedItemText = text;
		return null;
	}

	@PatchMethod
	public static TextToSpeechVoice create (String text, String lang) {
		lastCreatedItemText = text;
		return null;
	}

	@PatchMethod
	public static TextToSpeechVoice getObject ()  {
		return null;
	}
}
