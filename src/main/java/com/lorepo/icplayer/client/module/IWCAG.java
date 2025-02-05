package com.lorepo.icplayer.client.module;

import java.util.Set;

import com.google.gwt.event.dom.client.KeyDownEvent;


public interface IWCAG {
	public void enter(KeyDownEvent event, boolean isExiting, Set<Integer> keysDownCodes);
	public void space(KeyDownEvent event, Set<Integer> keysDownCodes);
	public void tab(KeyDownEvent event, Set<Integer> keysDownCodes);
	public void left(KeyDownEvent event, Set<Integer> keysDownCodes);
	public void right(KeyDownEvent event, Set<Integer> keysDownCodes);
	public void down(KeyDownEvent event, Set<Integer> keysDownCodes);
	public void up(KeyDownEvent event, Set<Integer> keysDownCodes);
	public void escape(KeyDownEvent event, Set<Integer> keysDownCodes);
	public void customKeyCode(KeyDownEvent event, Set<Integer> keysDownCodes);
	public void shiftTab(KeyDownEvent event, Set<Integer> keysDownCodes);
}
