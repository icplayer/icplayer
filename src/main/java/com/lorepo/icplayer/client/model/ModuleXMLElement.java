package com.lorepo.icplayer.client.model;

import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.XMLParser;

public class ModuleXMLElement {
    private Element module = null;

    public ModuleXMLElement(String addonName) {
        Document document = XMLParser.createDocument();
        this.module = document.createElement("module");
        this.module.setAttribute("type", addonName);
    }
    
    public void addSpeechTextElement(Element element) {
        this.module.appendChild(element);
    }

    public Element toXML() {
        return this.module;
    }
}
