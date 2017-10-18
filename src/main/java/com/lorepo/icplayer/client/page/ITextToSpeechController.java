package com.lorepo.icplayer.client.page;

import java.util.List;

import com.lorepo.icf.utils.NavigationModuleIndentifier;


public interface ITextToSpeechController {
	public void playTitle (String area, String id);
	public void playDescription (String id);
	public void speak (String text);
	public void readGap (String text, String currentGapContent, int gapNumber);
	public void readStartText();
	public void readExitText();
	public List<NavigationModuleIndentifier> getModulesOrder ();
	public List<String> getMultiPartDescription (String id);
	public boolean isTextToSpeechModuleEnable ();
}
