package com.lorepo.icplayer.client.module;

import com.google.gwt.event.dom.client.KeyDownEvent;


public interface IWCAG {
	public void enter(KeyDownEvent event, boolean isExiting);
	public void space(KeyDownEvent event);
	public void tab(KeyDownEvent event);
	public void left(KeyDownEvent event);
	public void right(KeyDownEvent event);
	public void down(KeyDownEvent event);
	public void up(KeyDownEvent event);
	public void escape(KeyDownEvent event);
	public void customKeyCode(KeyDownEvent event);
	public void shiftTab(KeyDownEvent event);
}
