package com.lorepo.icplayer.client.model;

import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.XMLParser;

public class SpeechTextXMLElement {
    private Element speechText = null;

    public SpeechTextXMLElement(String propertyName, String editedPropertyName) {
        Document document = XMLParser.createDocument();
        this.speechText = document.createElement("speechText");
        this.speechText.setAttribute("type", propertyName);
        this.speechText.setAttribute("value", editedPropertyName);
    }

    public Element toXML() {
        return this.speechText;
    }
}
