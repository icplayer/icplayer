package com.lorepo.icplayer.client.module.text;

import com.lorepo.icplayer.client.module.text.LinkInfo.LinkType;

public interface ITextViewListener {

	public void onLinkClicked(LinkType type, String link);
	public void onValueChanged(String id, String newValue);
	public void onGapClicked(String controlId);
}
