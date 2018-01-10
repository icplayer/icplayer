package com.lorepo.icplayer.client.mockup.utils;


import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Element;
import org.w3c.dom.Document;
import org.w3c.dom.ls.DOMImplementationLS;
import org.w3c.dom.ls.LSSerializer;

import com.lorepo.icplayer.client.utils.DomElementManipulator;


public class DomElementManipulatorMockup extends DomElementManipulator {
	Element element;

	
	public DomElementManipulatorMockup(String name) throws ParserConfigurationException {
		super(name);
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = dbf.newDocumentBuilder();
		Document doc = db.newDocument();
		element = doc.createElement(name);
	}

	@Override
	protected void createGwtElement(String name) {
		
	}
	
	@Override
	public void appendElement(DomElementManipulator element) {
		DomElementManipulatorMockup mock = (DomElementManipulatorMockup) element;
		this.element.appendChild(mock.getElement());
	}
	
	@Override
	public void setHTMLAttribute(String attributeName, String attributeValue) {
		this.element.setAttribute(attributeName, attributeValue);
	}
	
	@Override
	public void setHTMLAttribute(String attributeName, boolean attributeValue) {
		this.element.setAttribute(attributeName, String.valueOf(attributeValue));
	}

	@Override
	public void setHTMLAttribute(String attributeName, int attributeValue) {
		this.element.setAttribute(attributeName, String.valueOf(attributeValue));
	}
	
	@Override
	public void setInnerHTMLText(String text) {
		this.element.setNodeValue(text);
	}
	
	
	@Override
	public String getHTMLCode() {
		DOMImplementationLS lsImpl = (DOMImplementationLS)this.element.getOwnerDocument().getImplementation().getFeature("LS", "3.0");
		LSSerializer serializer = lsImpl.createLSSerializer();
		serializer.getDomConfig().setParameter("xml-declaration", false); //by default its true, so set it to false to get String without xml-declaration
		String str = serializer.writeToString(this.element);
		return str;
	}
		
	public Element getElement() {
		return this.element;
	}
	
}
