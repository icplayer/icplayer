package com.lorepo.icplayer.client.module.text;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.Anchor;
import com.lorepo.icplayer.client.module.text.TextPresenter.NavigationTextElement;

public class LinkWidget extends Anchor implements NavigationTextElement{
	protected final LinkInfo linkInfo;
	private int state = 8;
	
	public LinkWidget(LinkInfo info){
		super(DOM.getElementById(info.getId()));
		setStyleName("ic_pageLink ic_definitionLink");
		onAttach();
		linkInfo = info;
	}

	@Override
	public void setElementFocus(boolean focus) {
		if (focus) {
			this.select();
		} else {
			this.deselect();
		}
	}

	private void select() {
		this.addStyleName("keyboard_navigation_active_element");
	}

	@Override
	public void deselect() {
		this.removeStyleName("keyboard_navigation_active_element");
		DOM.getElementById(this.getId()).blur();
	}

	@Override
	public String getId() {
		return linkInfo.getId();
	}

	@Override
	public String getElementType() {
		return "link";
	}

	@Override
	public String getLangTag() {
		return linkInfo.getLang();
	}

	@Override
	public int getGapState() {
		return this.state;
	}

	protected LinkInfo getLinkInfo() {
		return linkInfo;
	}

	public String getHref() {
		return linkInfo.getHref();
	}
}
