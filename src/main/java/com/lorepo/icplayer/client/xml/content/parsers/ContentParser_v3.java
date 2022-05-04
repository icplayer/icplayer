package com.lorepo.icplayer.client.xml.content.parsers;

import java.util.HashMap;

import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.Element;

public class ContentParser_v3 extends ContentParser_v2 {
    public ContentParser_v3() {
		this.version = "4";
	}
	
	@Override
	protected HashMap<String, HashMap<String, String>> parseDictionaryStructure(Element child) {
        return this.parseToDictionaryType(child);
	}

    private HashMap<String, HashMap<String, String>> parseToDictionaryType(Element xmlDictionary) {
        HashMap<String, HashMap<String, String>> dictionary = new HashMap<String, HashMap<String, String>>();
        NodeList addonNodes = xmlDictionary.getChildNodes();
        
        for (int i = 0; i < addonNodes.getLength(); i++) {
            Element addon = (Element) addonNodes.item(i);
            NodeList propertyNodes = addon.getChildNodes();
            HashMap<String, String> properties = new HashMap<String, String>();
            String addonName = addon.getAttribute("type");

            for (int j = 0; j < propertyNodes.getLength(); j++) {
                Element property = (Element) propertyNodes.item(j);
                String propertyName = property.getAttribute("type");
                String editedPropertyName = property.getAttribute("value");

                properties.put(propertyName, editedPropertyName);
            }
            
            dictionary.put(addonName, properties);
        }

        return dictionary;
    }
}