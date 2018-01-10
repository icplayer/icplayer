package com.lorepo.icplayer.client.utils;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;

public class DomElementManipulator {
	private Element gwtElement = null;
	
	public DomElementManipulator(String name) {
		this.createGwtElement(name);
	}
	
	protected void createGwtElement(String name) {
		this.gwtElement = DOM.createElement(name);
	}
	
	public void appendElement(DomElementManipulator element) {
		this.gwtElement.appendChild(element.getGWTElement());
	}
	
	public void setHTMLAttribute(String attributeName, String attributeValue) {
		this.gwtElement.setAttribute(attributeName, attributeValue);
	}
	
	public void setHTMLAttribute(String attributeName, boolean attributeValue) {
		this.gwtElement.setAttribute(attributeName, String.valueOf(attributeValue));
	}

	public void setHTMLAttribute(String attributeName, int attributeValue) {
		this.gwtElement.setAttribute(attributeName, String.valueOf(attributeValue));
	}
	
	public void setInnerHTMLText(String text) {
		this.gwtElement.setInnerText(text);
	}
	
	public String getHTMLCode() {
		DomElementManipulator wrapper = new DomElementManipulator("div");
		wrapper.appendElement(this);
		return wrapper.getGWTElement().getInnerHTML();
	}
	
	public Element getGWTElement() {
		return this.gwtElement;
	}
	
	public static String getFromHTMLCodeUnicode(String code) {
		String strNumber = code.substring(2);
		return Character.toString((char)Integer.parseInt(strNumber));
	}

	public void addClass(String className) {
		this.gwtElement.addClassName(className);
	}
}
