package com.lorepo.icplayer.client.module.imagesource;

import java.util.ArrayList;

import com.google.gwt.core.client.GWT;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IImageProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.properties.IStaticListProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IWCAGModuleModel;
import com.lorepo.icplayer.client.module.choice.SpeechTextsStaticListItem;

public class ImageSourceModule extends BasicModuleModel implements IWCAGModuleModel {

	private String imagePath = "";
	private boolean removable = true;
	private boolean isDisabled = false;
	private String altText = "";
	private ArrayList<SpeechTextsStaticListItem> speechTextItems = new ArrayList<SpeechTextsStaticListItem>();
	private String langAttribute = "";

	public static final int SELECTED_INDEX = 0;
	public static final int DESELECTED_INDEX = 1;
	public static final int DISABLED_INDEX = 2;
	
	public ImageSourceModule() {
		super("Image source", DictionaryWrapper.get("image_source_module"));
		
		addPropertyImage();
		addPropertyIsDisabled();
		addPropertyRemovable();
		addPropertyAltText();
		addPropertyLangAttribute();
		addPropertySpeechTexts();
	}

	public String getUrl() {
		if (imagePath.isEmpty()) {
			return GWT.getModuleBaseURL() + "media/no_image.gif";
		}
		
		String contentBaseURL = this.getContentBaseURL();
		if (contentBaseURL == null) {
			if (imagePath.startsWith("http") || imagePath.startsWith("/")) {
				return imagePath;
			}
			return this.baseURL + imagePath;
		} else {
			if (imagePath.startsWith("http")) {
				return imagePath;
			} else if (imagePath.startsWith("//")) {
				return "https:" + imagePath;
			}
			return contentBaseURL + imagePath;
		}
	}

	@Override
	protected void parseModuleNode(Element node) {
		NodeList nodes = node.getChildNodes();
		
		for (int i = 0; i < nodes.getLength(); i++) {
			Node childNode = nodes.item(i);
			if (childNode instanceof Element) {
				if (childNode.getNodeName().compareTo("image") == 0 && childNode instanceof Element) {
					Element childElement = (Element) childNode;
					imagePath = StringUtils.unescapeXML(childElement.getAttribute("src"));
					removable = XMLUtils.getAttributeAsBoolean((Element)childNode, "removable", true);
					isDisabled = XMLUtils.getAttributeAsBoolean((Element)childNode, "isDisabled", false);
					altText = XMLUtils.getAttributeAsString(childElement, "altText");
					langAttribute = XMLUtils.getAttributeAsString(childElement, "langAttribute");
					this.speechTextItems.get(SELECTED_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "selectedWCAG"));
					this.speechTextItems.get(DESELECTED_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "deselectedWCAG"));
					this.speechTextItems.get(DISABLED_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "disabledWCAG"));
				}
			}
		}
	}

	/**
	 * Convert module into XML
	 */
	@Override
	public String toXML() {
		String removableString = removable ? "True":"False";
		
		Element imageSourceModule = XMLUtils.createElement("imageSourceModule");
		this.setBaseXMLAttributes(imageSourceModule);
		imageSourceModule.appendChild(this.getLayoutsXML());

		Element image = XMLUtils.createElement("image");
		image.setAttribute("src", StringUtils.escapeHTML(imagePath));
		image.setAttribute("removable", removableString);
		image.setAttribute("isDisabled", Boolean.toString(this.isDisabled));
		image.setAttribute("altText", this.altText);
		image.setAttribute("langAttribute", this.langAttribute);
		image.setAttribute("selectedWCAG", speechTextItems.get(SELECTED_INDEX).getText());
		image.setAttribute("deselectedWCAG", speechTextItems.get(DESELECTED_INDEX).getText());
		image.setAttribute("disabledWCAG", speechTextItems.get(DISABLED_INDEX).getText());
		imageSourceModule.appendChild(image);

		return imageSourceModule.toString();

	}

	private void addPropertyIsDisabled() {
		
		IProperty property = new IBooleanProperty() {
			
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if (value!= isDisabled) {
					isDisabled = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				return isDisabled ? "True" : "False";
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("image_source_is_disabled");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("image_source_is_disabled");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};
		
		addProperty(property);	
	}
	
	public boolean isDisabled() {
		return isDisabled;
	}
	
	private void addPropertyImage() {

		IProperty property = new IImageProperty() {
				
			@Override
			public void setValue(String newValue) {
				imagePath = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return imagePath;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("image_source_image");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("image_source_image");
			}

			@Override
			public boolean isDefault() {
				return true;
			}
		};
		
		addProperty(property);
	}
	
	protected boolean isRemovable() {
		return removable;
	}
	
	private void addPropertyRemovable() {

		IProperty property = new IBooleanProperty() {
				
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if(value!= removable){
					removable = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				return removable ? "True" : "False";
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("image_source_removable");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("image_source_removable");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};
		
		addProperty(property);
	}

	private void addPropertyAltText() {
		IProperty property = new IProperty() {

			@Override
			public void setValue(String newValue) {
				altText = newValue;
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return altText;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("image_source_alt_text");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("image_source_alt_text");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	public String getAlttext() {
		return altText;
	}
	
	private void addPropertyLangAttribute() {
		IProperty property = new IProperty() {

			@Override
			public void setValue(String newValue) {
				langAttribute = newValue;
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return langAttribute;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("text_module_lang_attribute");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("text_module_lang_attribute");
			}
		};

		addProperty(property);
	}
	
	public String getLangAttribute() {
		return langAttribute;
	}
	
	private void addPropertySpeechTexts() {
		IStaticListProperty property = new IStaticListProperty() {
			@Override
			public String getName() {
				return DictionaryWrapper.get("choice_speech_texts");
			}

			@Override
			public String getValue() {
				return Integer.toString(speechTextItems.size());
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("choice_speech_texts");
			}

			@Override
			public void setValue(String newValue) {}

			@Override
			public boolean isDefault() {
				return false;
			}

			@Override
			public int getChildrenCount() {
				return speechTextItems.size();
			}

			@Override
			public void addChildren(int count) {
				speechTextItems.add(new SpeechTextsStaticListItem("selected","image_source"));
				speechTextItems.add(new SpeechTextsStaticListItem("deselected","image_source"));
				speechTextItems.add(new SpeechTextsStaticListItem("speech_text_disabled","image_source"));
			}

			@Override
			public IPropertyProvider getChild(int index) {
				return speechTextItems.get(index);
			}

			@Override
			public void moveChildUp(int index) {
			}

			@Override
			public void moveChildDown(int index) {
			}

		};

		addProperty(property);
		property.addChildren(1);
	}
	
	public String getSpeechTextItem (int index) {
		if (index < 0 || index >= this.speechTextItems.size()) {
			return "";
		}
		final String text = this.speechTextItems.get(index).getText();
		if (text.isEmpty()) {
			if (index == SELECTED_INDEX) {
				return "selected";
			}

			if (index == DESELECTED_INDEX) {
				return "deselected";
			}
			
			if (index == DISABLED_INDEX) {
				return "disabled";
			}
			
			return "";
		}
		
		return text;
	}

}
