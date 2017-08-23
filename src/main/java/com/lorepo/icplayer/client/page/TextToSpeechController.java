package com.lorepo.icplayer.client.page;

import java.util.ArrayList;
import java.util.List;

import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.api.ITextToSpeechPresenter;


public class TextToSpeechController {
	private ITextToSpeechPresenter textToSpeechModule;
	
	public TextToSpeechController (PageController pc) {
		this.textToSpeechModule = pc.getPageTextToSpeechModule();
	}
	
	public void playTitle (String id) {
		if (this.isTextToSpeechModuleEnable()) {
			this.textToSpeechModule.playTitle(id);
		}
	}
	
	public void playDescription (String id) {
		if (this.isTextToSpeechModuleEnable()) {
			this.textToSpeechModule.playDescription(id);
		}
	}
	
	public void speak (String text) {
		if (this.isTextToSpeechModuleEnable()) {
			this.textToSpeechModule.speak(text);
		}
	}
	
	public void readGap (String text, int gapNumber) {
		if (this.isTextToSpeechModuleEnable()) {
			this.textToSpeechModule.readGap(text, gapNumber);
		}
	}
	
	public List<String> getModulesOrder () {
		if (this.isTextToSpeechModuleEnable()) {
			return JavaScriptUtils.convertJsArrayToArrayList(this.textToSpeechModule.getAddOnsOrder());
		} else {
			List<String> result = new ArrayList<String>();
			return result;
		}
	}

	public List<String> getMultiPartDescription (String id) {
		if (this.isTextToSpeechModuleEnable()) {
			return JavaScriptUtils.convertJsArrayToArrayList(this.textToSpeechModule.getMultiPartDescription(id));
		} else {
			List<String> result = new ArrayList<String>();
			return result;
		}
	}
	
	public boolean isTextToSpeechModuleEnable () {
		return this.textToSpeechModule != null;
	}
	
}
