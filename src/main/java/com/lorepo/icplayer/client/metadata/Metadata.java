package com.lorepo.icplayer.client.metadata;



import java.util.HashMap;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;

public class Metadata implements IMetadata {
	private HashMap<String, String> metadata = new HashMap<String, String>();
	
	public String getValue(String key) {
		return this.metadata.get(key);
	}
	
	public void put(String key, String value) {
		this.metadata.put(key, value);
	}
	
	public void remove(String key) {
		this.metadata.remove(key);
	}
	
	public void clear() {
		this.metadata.clear();
	}
	
	@Override
	public boolean hasEntries() {
		return this.metadata.size() > 0;
	}
	
	public Element toXML() {
		Element metadata = XMLUtils.createElement("metadata");
		for(String key : this.metadata.keySet()){
			Element entry = createEntryElement(
					key, 
					this.metadata.get(key)
					);
			
			metadata.appendChild(entry);
		}
		
		return metadata;
	}
	
	public void parse(Element rootElement) {
		NodeList entries = rootElement.getElementsByTagName("entry");
		
		for(int i = 0; i < entries.getLength(); i++){
			Element node = (Element)entries.item(i);
			String key = StringUtils.unescapeXML(node.getAttribute("key"));
			String value = StringUtils.unescapeXML(node.getAttribute("value"));
			
			if(value == null || value.length() == 0){
				this.remove(key);
			}
			else{
				this.put(key, value);
			}
		}
	}

	private Element createEntryElement(String key, String value) {
		String encodedKey = StringUtils.escapeHTML(key);
		String encodedValue = StringUtils.escapeHTML(value);
		
		Element entry = XMLUtils.createElement("entry");
		entry.setAttribute("key", encodedKey);
		entry.setAttribute("value", encodedValue);
		
		return entry;
	}	
}
