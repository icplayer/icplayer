package com.lorepo.icplayer.client.page;

import java.util.List;


public interface ITextToSpeechController {
	public void playTitle (String id);
	public void playDescription (String id);
	public void speak (String text);
	public void readGap (String text, int gapNumber);
	public List<String> getModulesOrder ();
	public List<String> getMultiPartDescription (String id);
}
