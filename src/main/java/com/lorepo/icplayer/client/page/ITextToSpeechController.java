package com.lorepo.icplayer.client.page;

import java.util.List;

import com.lorepo.icf.utils.NavigationModuleIndentifier;
import com.lorepo.icf.utils.TextToSpeechVoice;


public interface ITextToSpeechController {
	public void playTitle (String area, String id, String lagTag);
	public void speak (List<TextToSpeechVoice> voiceTexts);
	public void readStartText ();
	public void readExitText ();
	public List<NavigationModuleIndentifier> getModulesOrder ();
	public boolean isTextToSpeechModuleEnable ();
}
