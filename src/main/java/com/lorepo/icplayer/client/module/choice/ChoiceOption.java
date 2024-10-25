package com.lorepo.icplayer.client.module.choice;

import com.google.gwt.xml.client.CDATASection;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.BasicPropertyProvider;
import com.lorepo.icf.properties.IEventProperty;
import com.lorepo.icf.properties.IHtmlProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.ExtendedRequestBuilder;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;

public class ChoiceOption extends BasicPropertyProvider{

	private String	text;
	private int		value;
	private String feedback = "";
	private String id;
	private String parentId = "";
	private String baseURL;
	private String contentBaseURL;
	
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

	public void setParentId(String id) {
		parentId = id;
	}

	public String getParentId() {
		return parentId;
	}

	public boolean isCorrect() {
		return value > 0;
	}

	protected void setFeedback(String feedback){
		this.feedback = feedback;
	}

	
	private void addPropertyText() {

		IHtmlProperty property = new IHtmlProperty() {
				
			@Override
			public void setValue(String newValue) {
				text = newValue;
			}
			
			@Override
			public String getValue() {
				return text;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("choice_item_text");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("choice_item_text");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyValue() {

		IProperty property = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				value = Integer.parseInt(newValue);
			}
			
			@Override
			public String getValue() {
				return Integer.toString(value);
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("choice_item_value");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("choice_item_value");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}

	private void addPropertyFeedback() {

		IProperty property = new IEventProperty() {
				
			public void setValue(String newValue) {
				feedback = newValue;
			}
			
			public String getValue() {
				return feedback;
			}
			
			public String getName() {
				return DictionaryWrapper.get("choice_item_event");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("choice_item_event");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}


	public void load(Element element, String baseUrl) {
		this.baseURL = baseUrl;
		value = XMLUtils.getAttributeAsInt(element, "value");
		String rawFeedback = "";
		
		NodeList textNodes = element.getElementsByTagName("text"); 
		if (textNodes.getLength() > 0){
			Element textElement = (Element) textNodes.item(0);
			text = XMLUtils.getCharacterDataFromElement(textElement);
			if (text == null){
				text = XMLUtils.getText(textElement);
				text = StringUtils.unescapeXML(text);
			}
			if (baseUrl != null || contentBaseURL != null || ExtendedRequestBuilder.getSigningPrefix() != null){
				text = StringUtils.updateLinks(text, baseUrl, contentBaseURL);
			}

			NodeList feedbackNodes = element.getElementsByTagName("feedback");
			if (feedbackNodes.getLength() > 0){
				rawFeedback = XMLUtils.getText((Element) feedbackNodes.item(0));
			}
		} else {
			text = XMLUtils.getText((Element) element);
		}
		
		if (!rawFeedback.isEmpty()){
			feedback = StringUtils.unescapeXML(rawFeedback);
		}

		text = text.replaceAll("<!--[\\s\\S]*?-->", "");
	}
	
	
	public Element toXML() {
		Element optionElement = XMLUtils.createElement("option");
		XMLUtils.setIntegerAttribute(optionElement, "value", value);
		
		Element textElement = XMLUtils.createElement("text");
		CDATASection cdataText = XMLUtils.createCDATASection(text);
		textElement.appendChild(cdataText);
		
		Element feedbackElement = XMLUtils.createElement("feedback");		
		feedbackElement.appendChild(XMLUtils.createTextNode(StringUtils.escapeHTML(feedback)));

		optionElement.appendChild(textElement);
		optionElement.appendChild(feedbackElement);
		
		return optionElement;
	}

	public String getBaseURL() {
		return this.baseURL;
	}

	public void setContentBaseURL(String baseURL) {
		this.contentBaseURL = baseURL;
	}

	public String getContentBaseURL() {
		return this.contentBaseURL;
	}

}
