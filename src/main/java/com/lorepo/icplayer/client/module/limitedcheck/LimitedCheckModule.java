package com.lorepo.icplayer.client.module.limitedcheck;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Arrays;

import com.google.gwt.xml.client.CDATASection;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.*;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IWCAGModuleModel;
import com.lorepo.icplayer.client.module.ModuleUtils;
import com.lorepo.icplayer.client.module.checkbutton.CheckButtonModule;
import com.lorepo.icplayer.client.module.choice.SpeechTextsStaticListItem;

public class LimitedCheckModule extends BasicModuleModel implements IWCAGModuleModel {
	
	private String checkText = "";
	private String unCheckText = "";
	private String rawWorksWith = "";
	private List<String> modules = new LinkedList<String>();
	private boolean mistakesFromProvidedModules = false;
	private boolean maintainState = false;
	private ArrayList<SpeechTextsStaticListItem> speechTextItems = new ArrayList<SpeechTextsStaticListItem>();

	public static final int SELECTED_INDEX = 0;
	public static final int CORRECT_INDEX = 1;
	public static final int WRONG_INDEX = 2;
	public static final int RESULT_INDEX = 3;
	public static final int EDIT_BLOCK_INDEX = 4;
	public static final int NO_EDIT_BLOCK_INDEX = 5;

	public LimitedCheckModule() {
		super("Limited Check", DictionaryWrapper.get("Limited_Check_name"));
		
		addPropertyCheckText();
		addPropertyUnCheckText();
		addPropertyWorksWith();
		addPropertyCountMistakesFromProvidedModules();
		addPropertyMaintainState();
		addPropertySpeechTexts();
	}

	protected void setCheckText(String checkText) {
		this.checkText = checkText;
	}
	
	protected String getCheckText() {
		return checkText;
	}

	protected void setUnCheckText(String unCheckText) {
		this.unCheckText = unCheckText;
	}
	
	protected String getUnCheckText() {
		return unCheckText;
	}
	
	protected void setRawWorksWith(String worksWith) {
		this.rawWorksWith = worksWith;
	}

	protected String getRawWorksWith() {
		return rawWorksWith;
	}
	
	public List<String> getModules() {
		return modules;
	}

	public String getWorksWithModulesList() {
		return this.getRawWorksWith();
    }

	private void addPropertyCheckText() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				checkText = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return checkText;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("Limited_Check_property_check_text");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Limited_Check_property_check_text");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}

	private void addPropertyUnCheckText() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				unCheckText = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return unCheckText;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("Limited_Check_property_uncheck_text");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Limited_Check_property_uncheck_text");
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
				
				modules = ModuleUtils.getListFromRawText(rawWorksWith);
				
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return rawWorksWith.replace(";", "\n");
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("Limited_Check_property_works_with");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Limited_Check_property_works_with");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyCountMistakesFromProvidedModules() {
		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != mistakesFromProvidedModules) {
					mistakesFromProvidedModules = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return mistakesFromProvidedModules ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("Limited_Check_property_mistakes_from_provided_modules");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Limited_Check_property_mistakes_from_provided_modules");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}

	public boolean getMistakesFromProvidedModules() {
		return mistakesFromProvidedModules;
	}
	
	private void addPropertyMaintainState() {
		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != maintainState) {
					maintainState = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return maintainState ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("Limited_Check_property_maintain_state");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Limited_Check_property_maintain_state");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}

	public boolean getMaintainState() {
		return maintainState;
	}

	@Override
	protected void parseModuleNode(Element node) {
		NodeList nodes = node.getChildNodes();
		for (int i = 0; i < nodes.getLength(); i++) {
			
			Node childNode = nodes.item(i);
			if (childNode instanceof Element) {
				if(childNode.getNodeName().compareTo("limitedCheck") == 0) {
					Element childElement = (Element) childNode;
					
					checkText = StringUtils.unescapeXML(XMLUtils.getAttributeAsString(childElement, "checkText"));
					unCheckText = StringUtils.unescapeXML(XMLUtils.getAttributeAsString(childElement, "unCheckText"));
					rawWorksWith = XMLUtils.getCharacterDataFromElement(childElement);
					mistakesFromProvidedModules = XMLUtils.getAttributeAsBoolean(childElement, "mistakesFromProvidedModules");
					maintainState = XMLUtils.getAttributeAsBoolean(childElement, "maintainState");
					this.speechTextItems.get(CheckButtonModule.SELECTED_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "selected"));
					this.speechTextItems.get(CheckButtonModule.CORRECT_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "correct"));
					this.speechTextItems.get(CheckButtonModule.WRONG_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "wrong"));
					this.speechTextItems.get(CheckButtonModule.RESULT_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "percentage_result"));
					this.speechTextItems.get(CheckButtonModule.EDIT_BLOCK_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "edit_block"));
					this.speechTextItems.get(CheckButtonModule.NO_EDIT_BLOCK_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "no_edit_block"));

					modules = ModuleUtils.getListFromRawText(rawWorksWith);
				}
			}
		}
	}

	@Override
	public String toXML() {
		Element limitedCheckModule = XMLUtils.createElement("limitedCheckModule");
		this.setBaseXMLAttributes(limitedCheckModule);
		limitedCheckModule.appendChild(this.getLayoutsXML());
		limitedCheckModule.appendChild(this.modelToXML());

		return limitedCheckModule.toString();
	}

	protected Element modelToXML() {
		String encodedCheck = StringUtils.escapeHTML(checkText);
		String encodedUnCheck = StringUtils.escapeHTML(unCheckText);

		Element limitedCheckElement = XMLUtils.createElement("limitedCheck");
		limitedCheckElement.setAttribute("checkText", encodedCheck);
		limitedCheckElement.setAttribute("unCheckText", encodedUnCheck);
		XMLUtils.setBooleanAttribute(limitedCheckElement, "mistakesFromProvidedModules", mistakesFromProvidedModules);
		XMLUtils.setBooleanAttribute(limitedCheckElement, "maintainState", maintainState);
		limitedCheckElement.setAttribute("selected", this.speechTextItems.get(CheckButtonModule.SELECTED_INDEX).getText());
		limitedCheckElement.setAttribute("correct", this.speechTextItems.get(CheckButtonModule.CORRECT_INDEX).getText());
		limitedCheckElement.setAttribute("wrong", this.speechTextItems.get(CheckButtonModule.WRONG_INDEX).getText());
		limitedCheckElement.setAttribute("percentage_result", this.speechTextItems.get(CheckButtonModule.RESULT_INDEX).getText());
		limitedCheckElement.setAttribute("edit_block", this.speechTextItems.get(CheckButtonModule.EDIT_BLOCK_INDEX).getText());
		limitedCheckElement.setAttribute("no_edit_block", this.speechTextItems.get(CheckButtonModule.NO_EDIT_BLOCK_INDEX).getText());

		CDATASection cdata = XMLUtils.createCDATASection(rawWorksWith);

		limitedCheckElement.appendChild(cdata);
		return limitedCheckElement;
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
				speechTextItems.add(new SpeechTextsStaticListItem("selected","Limited_Check"));
				speechTextItems.add(new SpeechTextsStaticListItem("correct","Limited_Check"));
				speechTextItems.add(new SpeechTextsStaticListItem("wrong","Limited_Check"));
				speechTextItems.add(new SpeechTextsStaticListItem("percentage_result","Limited_Check"));
				speechTextItems.add(new SpeechTextsStaticListItem("edit_block","Limited_Check"));
				speechTextItems.add(new SpeechTextsStaticListItem("no_edit_block","Limited_Check"));
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
			if (index == CheckButtonModule.SELECTED_INDEX) {
				return "selected";
			}

			if (index == CheckButtonModule.CORRECT_INDEX) {
				return "correct";
			}

			if (index == CheckButtonModule.WRONG_INDEX) {
				return "wrong";
			}

			if (index == CheckButtonModule.RESULT_INDEX) {
				return "percentage result";
			}

			if (index == CheckButtonModule.EDIT_BLOCK_INDEX) {
				return "Following addons are blocked for edition";
			}

			if (index == CheckButtonModule.NO_EDIT_BLOCK_INDEX) {
				return "Following addons are no longer blocked for edition";
			}

			return "";
		}

		return text;
	}
}
