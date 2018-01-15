package com.lorepo.icplayer.client.page;

import java.util.ArrayList;
import java.util.List;

import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.NavigationModuleIndentifier;
import com.lorepo.icplayer.client.module.api.ITextToSpeechPresenter;


public class TextToSpeechController {
	private ITextToSpeechPresenter textToSpeechModule;
	
	public TextToSpeechController (PageController pc) {
		this.textToSpeechModule = pc.getPageTextToSpeechModule();
	}
	
	public void playTitle (String area, String id) {
		if (this.isTextToSpeechModuleEnable()) {
			this.textToSpeechModule.playTitle(area, id);
		}
	}
	
	public void speak (String text) {
		if (this.isTextToSpeechModuleEnable()) {
			this.textToSpeechModule.speak(text);
		}
	}
	
	public void readGap (String text, String currentGapContent, int gapNumber) {
		if (this.isTextToSpeechModuleEnable()) {
			this.textToSpeechModule.readGap(text, currentGapContent, gapNumber);
		}
	}
	
	public void readStartText () {
		if (this.isTextToSpeechModuleEnable()) {
			this.textToSpeechModule.readStartText();
		}
	}
	
	public void readExitText () {
		if (this.isTextToSpeechModuleEnable()) {
			this.textToSpeechModule.readExitText();
		}
	}
	
	public List<NavigationModuleIndentifier> getModulesOrder () {
		if (this.isTextToSpeechModuleEnable()) {
			return JavaScriptUtils.convertJsArrayObjectsToJavaObjects(this.textToSpeechModule.getAddOnsOrder());
		} else {
			List<NavigationModuleIndentifier> result = new ArrayList<NavigationModuleIndentifier>();
			return result;
		}
	}
	
	public boolean isTextToSpeechModuleEnable () {
		return this.textToSpeechModule != null;
	}
	
}
