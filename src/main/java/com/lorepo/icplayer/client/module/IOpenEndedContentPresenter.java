package com.lorepo.icplayer.client.module;


public interface IOpenEndedContentPresenter {
	// If the presenter may but doesn't have to contain open ended content,
	// such as in the case of the AddonPresenter this method will return null
	// if there is no open ended content
	public String getOpenEndedContent();
}
