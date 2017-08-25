package com.lorepo.icplayer.client.module;

import com.google.gwt.event.dom.client.KeyDownEvent;

public interface IWCAG {
	public void enter(boolean isExiting);
	public void space();
	public void tab();
	public void left();
	public void right();
	public void down();
	public void up();
	public void escape();
	public void customKeyCode(KeyDownEvent event);
}
