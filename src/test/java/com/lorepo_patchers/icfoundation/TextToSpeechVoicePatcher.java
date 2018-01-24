package com.lorepo_patchers.icfoundation;

import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icf.utils.TextToSpeechVoice;

@PatchClass(TextToSpeechVoice.class)
public class TextToSpeechVoicePatcher {

	@PatchMethod
	public static TextToSpeechVoice create() {
		return null;
	}
	
	@PatchMethod
	public static TextToSpeechVoice create (String text) {
		return null;
	}

	@PatchMethod
	public static TextToSpeechVoice create (String text, String lang) {
		return null;
	}

	@PatchMethod
	public static TextToSpeechVoice getObject ()  {
		return null;
	}
}
