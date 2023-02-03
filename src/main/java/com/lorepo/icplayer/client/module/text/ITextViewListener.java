package com.lorepo.icplayer.client.module.text;

import com.google.gwt.dom.client.Element;
import com.lorepo.icplayer.client.module.text.LinkInfo.LinkType;

public interface ITextViewListener {
	void onLinkClicked(LinkType type, String link, String target);
	void onValueEdited(String id, String newValue);
	void onValueChanged(String id, String newValue);
	void onInlineValueChanged(String id, String newValue);
	void onGapClicked(String controlId);
	void onGapFocused(String controlId, Element element);
	void onGapBlured(String gapId, Element element);
	void onDropdownClicked(String id);
	void onGapDragged(String gapId);
	void onGapStopped(String gapId);
	void onGapDropped(String id);
	void onKeyAction(String gapId, Element element);
	void onUserAction(String id, String newValue);
	void onAudioButtonClicked(AudioInfo audioInfo);
	void onAudioEnded(AudioInfo audioInfo);
	void onAudioTimeUpdate(AudioInfo audioInfo);
	void onAudioPlaying(AudioInfo audioInfo);
	void onAudioPause(AudioInfo audioInfo);
}
