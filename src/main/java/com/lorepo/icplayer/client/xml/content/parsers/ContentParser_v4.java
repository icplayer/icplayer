package com.lorepo.icplayer.client.xml.content.parsers;

import java.util.HashMap;

import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.Element;

public class ContentParser_v4 extends ContentParser_v3 {
    public ContentParser_v4() {
        this.version = "5";
    }
    
    @Override
    protected HashMap<String, String> parseDefaultTTSTitlesDictionary(Element xml) {
        return this.parseToDefaultTTSTitlesDictionaryType(xml);
    }

    private HashMap<String, String> parseToDefaultTTSTitlesDictionaryType(Element xmlDictionary) {
        HashMap<String, String> dictionary = new HashMap<String, String>();
        NodeList moduleNodes = xmlDictionary.getChildNodes();
        
        for (int i = 0; i < moduleNodes.getLength(); i++) {
            if (!(moduleNodes.item(i) instanceof Element)) continue;

            Element module = (Element) moduleNodes.item(i);
            String addonName = module.getAttribute("type");
            String defaultTitle = module.getAttribute("value");
            dictionary.put(addonName, defaultTitle);
        }

        return dictionary;
    }
}
