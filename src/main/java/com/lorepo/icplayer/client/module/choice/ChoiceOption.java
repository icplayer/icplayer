package com.lorepo.icplayer.client.module.choice;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.BasicPropertyProvider;
import com.lorepo.icf.properties.IEventProperty;
import com.lorepo.icf.properties.IHtmlProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;

public class ChoiceOption extends BasicPropertyProvider{

	private String	text;
	private int		value;
	private String feedback = "";
	private String id;
	
	
	public ChoiceOption(String id){
		
		super(DictionaryWrapper.get("choice_option"));
		
		this.id = id;
		addPropertyValue();
		addPropertyText();
		addPropertyFeedback();
	}
	
	
	public ChoiceOption(String id, String html, int value){

		this(id);
		this.value = value;
		this.text = html;
	}
	
	
	public String getID(){
		return id;
	}
	
	
	public String getText(){
		return text;
	}
	
	
	public int getValue(){
		return value;
	}

	
	public String getFeedback(){
		return feedback;
	}
	
	
	protected void setFeedback(String feedback){
		this.feedback = feedback;
	}

	
	private void addPropertyText() {

		IHtmlProperty property = new IHtmlProperty() {
				
			@Override
			public void setValue(String newValue) {
				text = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return text;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("choice_item_text");
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyValue() {

		IProperty property = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				value = Integer.parseInt(newValue);
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return Integer.toString(value);
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("choice_item_value");
			}
		};
		
		addProperty(property);
	}

	private void addPropertyFeedback() {

		IProperty property = new IEventProperty() {
				
			public void setValue(String newValue) {
				feedback = newValue;
				sendPropertyChangedEvent(this);
			}
			
			public String getValue() {
				return feedback;
			}
			
			public String getName() {
				return DictionaryWrapper.get("choice_item_event");
			}
		};
		
		addProperty(property);
	}


	public void load(Element element, String baseUrl) {
		
		value = XMLUtils.getAttributeAsInt(element, "value");
		String rawFeedback = "";
		
		NodeList textNodes = element.getElementsByTagName("text"); 
		if(textNodes.getLength() > 0){
			Element textElement = (Element) textNodes.item(0);
			text = XMLUtils.getCharacterDataFromElement(textElement);
			if(text == null){
				text = XMLUtils.getText(textElement);
				text = StringUtils.unescapeXML(text);
			}
			if(baseUrl != null){
				text = StringUtils.updateLinks(text, baseUrl);
			}
			
			NodeList feedbackNodes = element.getElementsByTagName("feedback");
			if(feedbackNodes.getLength() > 0){
				rawFeedback = XMLUtils.getText((Element) feedbackNodes.item(0));
			}
		}
		else{
			text = XMLUtils.getText((Element) element);
		}
		
		if(!rawFeedback.isEmpty()){
			feedback = StringUtils.unescapeXML(rawFeedback);
		}
	}
	
	
	public String toXML() {
		
		String xml = "<option value='" + value + "'>";
		xml += "<text><![CDATA[" + text + "]]></text>";
		xml += "<feedback>" + StringUtils.escapeHTML(feedback) + "</feedback>";
		xml += "</option>";
		
		return xml;
	}
	
}
