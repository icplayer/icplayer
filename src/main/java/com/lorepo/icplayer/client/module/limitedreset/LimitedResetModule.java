package com.lorepo.icplayer.client.module.limitedreset;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import com.google.gwt.xml.client.CDATASection;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.properties.IStaticListProperty;
import com.lorepo.icf.properties.IStringListProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IWCAGModuleModel;
import com.lorepo.icplayer.client.module.ModuleUtils;
import com.lorepo.icplayer.client.module.choice.SpeechTextsStaticListItem;

public class LimitedResetModule extends BasicModuleModel implements IWCAGModuleModel {
	
	private String title = "";
	private String rawWorksWith = "";
	private List<String> modules = new LinkedList<String>();
	private boolean resetOnlyWrong = false;
	private ArrayList<SpeechTextsStaticListItem> speechTextItems = new ArrayList<SpeechTextsStaticListItem>();

	public static final int DISABLED_INDEX = 0;
	public static final int RESET_INDEX = 1;

	public LimitedResetModule() {
		super("Limited Reset", DictionaryWrapper.get("Limited_Reset_name"));
		
		addPropertyTitle();
		addPropertyWorksWith();
		addPropertyResetOnlyWrong();
		addPropertySpeechTexts();
	}
	
	public String getTitle () {
		return title;
	}
	
	public boolean getResetOnlyWrongAnswers() {
		return this.resetOnlyWrong;
	}
	
	public List<String> getModules() {
		return modules;
	}
	
	private void addPropertyResetOnlyWrong() {
		IProperty property = new IBooleanProperty() {
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value!= resetOnlyWrong) {
					resetOnlyWrong = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				return resetOnlyWrong ? "True" : "False";
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("reset_property_reset_only_wrong");
			}
			
			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("reset_property_reset_only_wrong");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyTitle() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				title = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return title;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("Limited_Reset_property_title");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Limited_Reset_property_title");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyWorksWith() {

		IStringListProperty property = new IStringListProperty() {
				
			@Override
			public void setValue(String newValue) {
				rawWorksWith = newValue.replace("\n", ";");
				
				modules = ModuleUtils.getListFromRawText(newValue);
				
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return rawWorksWith.replace(";", "\n");
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("Limited_Reset_property_works_with");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Limited_Reset_property_works_with");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertySpeechTexts() {
		IStaticListProperty property = new IStaticListProperty() {
			@Override
			public String getName() {
				return DictionaryWrapper.get("Limited_Reset_property_speech_texts");
			}

			@Override
			public String getValue() {
				return Integer.toString(speechTextItems.size());
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Limited_Reset_property_speech_texts");
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
				speechTextItems.add(new SpeechTextsStaticListItem("disabled", "Limited_Reset_speech_text"));
				speechTextItems.add(new SpeechTextsStaticListItem("reset", "Limited_Reset_speech_text"));
			}

			@Override
			public IPropertyProvider getChild(int index) {
				return speechTextItems.get(index);
			}

			@Override
			public void moveChildUp(int index) {}

			@Override
			public void moveChildDown(int index) {}
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
			if (index == LimitedResetModule.RESET_INDEX) {
				return "Activity has been reset";
			}

			if (index == LimitedResetModule.DISABLED_INDEX) {
				return "Disabled";
			}

			return "";
		}

		return text;
	}

	@Override
	protected void parseModuleNode(Element node) {
		NodeList nodes = node.getChildNodes();
		for (int i = 0; i < nodes.getLength(); i++) {
			
			Node childNode = nodes.item(i);
			if (childNode instanceof Element) {
				if(childNode.getNodeName().compareTo("limitedReset") == 0) {
					Element childElement = (Element) childNode;
					
					title = XMLUtils.getAttributeAsString(childElement, "title");
					rawWorksWith = XMLUtils.getCharacterDataFromElement(childElement);
					resetOnlyWrong = XMLUtils.getAttributeAsBoolean(childElement, "resetOnlyWrong", false);
					this.speechTextItems.get(LimitedResetModule.DISABLED_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "disabled"));
					this.speechTextItems.get(LimitedResetModule.RESET_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "reset"));
					modules = ModuleUtils.getListFromRawText(rawWorksWith);
				}
			}
		}
	}
	
	@Override
	public String toXML() {
		Element limitedResetModule = XMLUtils.createElement("limitedResetModule");
		this.setBaseXMLAttributes(limitedResetModule);
		limitedResetModule.appendChild(this.getLayoutsXML());
		limitedResetModule.appendChild(this.modelToXML());

		return limitedResetModule.toString();
	}

	protected Element modelToXML() {
		String encodedTitle = StringUtils.escapeHTML(title);
		
		Element limitedResetElement = XMLUtils.createElement("limitedReset");
		limitedResetElement.setAttribute("title", encodedTitle);
		limitedResetElement.setAttribute("resetOnlyWrong", Boolean.toString(resetOnlyWrong));
		limitedResetElement.setAttribute("disabled", this.speechTextItems.get(LimitedResetModule.DISABLED_INDEX).getText());
		limitedResetElement.setAttribute("reset", this.speechTextItems.get(LimitedResetModule.RESET_INDEX).getText());
		
		CDATASection cdata = XMLUtils.createCDATASection(rawWorksWith);

		limitedResetElement.appendChild(cdata);
		return limitedResetElement;
	}
}
