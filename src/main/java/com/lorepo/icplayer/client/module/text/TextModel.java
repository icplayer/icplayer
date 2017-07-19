package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IEnumSetProperty;
import com.lorepo.icf.properties.IHtmlProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.UUID;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.text.TextParser.ParserResult;

public class TextModel extends BasicModuleModel {
	public String parsedText;
	public List<GapInfo> gapInfos = new ArrayList<GapInfo>();
	public List<InlineChoiceInfo> choiceInfos = new ArrayList<InlineChoiceInfo>();
	public List<LinkInfo> linkInfos = new ArrayList<LinkInfo>();

	private String moduleText = "";
	private boolean useDraggableGaps;
	private boolean useMathGaps;
	private boolean openLinksinNewTab = true;
	private int gapWidth = 0;
	private int gapMaxLength = 0;
	private boolean isActivity = true;
	private boolean isDisabled = false;
	private boolean isCaseSensitive = false;
	private boolean isIgnorePunctuation = false;
	private boolean isKeepOriginalOrder = false;
	private boolean isClearPlaceholderOnFocus = false;
	public String rawText;
	public String gapUniqueId = "";
	private String valueType = "All";
	private boolean blockWrongAnswers = false;
	private boolean userActionEvents = false;
	private boolean useEscapeCharacterInGap = false;

	public TextModel() {
		super("Text", DictionaryWrapper.get("text_module"));
		gapUniqueId = UUID.uuid(6);
		setText(DictionaryWrapper.get("text_module_default"));
		addPropertyGapType();
		addPropertyGapWidth();
		addPropertyGapMaxLength();
		addPropertyIsActivity();
		addPropertyIsDisabled();
		addPropertyIsCaseSensitive();
		addPropertyIsIgnorePunctuation();
		addPropertyOpenLinksinNewTab();
		addPropertyText(true);
		addPropertyKeepOriginalOrder();
		addPropertyClearPlaceholderOnFocus();
		addPropertyValueType();
		addPropertyBlockWrongAnswers();
		addPropertyUserActionEvents();
		addPropertyUseEscapeCharacterInGap();
	}

	@Override
	public void setId(String id) {
		super.setId(id);
		if (rawText != null) {
			setText(rawText);
		}
	}

	public String getGapUniqueId(){
		return gapUniqueId;
	}

	public String getParsedText(){
		return parsedText;
	}

	public boolean hasDraggableGaps(){
		return useDraggableGaps;
	}

	public int getGapWidth(){
		return gapWidth;
	}

	@Override
	protected void parseModuleNode(Element node) {
		NodeList nodes = node.getChildNodes();
		for(int i = 0; i < nodes.getLength(); i++){
			Node childNode = nodes.item(i);
			if (childNode instanceof Element && childNode.getNodeName().compareTo("text") == 0) {
				Element textElement = (Element) childNode;
				useDraggableGaps = XMLUtils.getAttributeAsBoolean(textElement, "draggable");
				useMathGaps = XMLUtils.getAttributeAsBoolean(textElement, "math");
				gapWidth = XMLUtils.getAttributeAsInt(textElement, "gapWidth");
				gapMaxLength = XMLUtils.getAttributeAsInt(textElement, "gapMaxLength");
				isActivity = XMLUtils.getAttributeAsBoolean(textElement, "isActivity", true);
				isDisabled = XMLUtils.getAttributeAsBoolean(textElement, "isDisabled", false);
				isCaseSensitive = XMLUtils.getAttributeAsBoolean(textElement, "isCaseSensitive", false);
				isIgnorePunctuation = XMLUtils.getAttributeAsBoolean(textElement, "isIgnorePunctuation", false);
				isKeepOriginalOrder = XMLUtils.getAttributeAsBoolean(textElement, "isKeepOriginalOrder", false);
				isClearPlaceholderOnFocus = XMLUtils.getAttributeAsBoolean(textElement, "isClearPlaceholderOnFocus", false);
				openLinksinNewTab = XMLUtils.getAttributeAsBoolean(textElement, "openLinksinNewTab", true);
				rawText = XMLUtils.getCharacterDataFromElement(textElement);
				
				valueType = XMLUtils.getAttributeAsString(textElement, "valueType");
				blockWrongAnswers = XMLUtils.getAttributeAsBoolean(textElement, "blockWrongAnswers", false);
				userActionEvents = XMLUtils.getAttributeAsBoolean(textElement, "userActionEvents", false);
				useEscapeCharacterInGap = XMLUtils.getAttributeAsBoolean(textElement, "useEscapeCharacterInGap", false);

				if (rawText == null) {
					rawText = StringUtils.unescapeXML(XMLUtils.getText(textElement));
				}
				setText(rawText);
			}
		}
	}

	private void setText(String text) {
		moduleText = text;
		TextParser parser = new TextParser();
		parser.setId(gapUniqueId);
		parser.setUseDraggableGaps(useDraggableGaps);
		parser.setUseMathGaps(useMathGaps);
		parser.setCaseSensitiveGaps(isCaseSensitive);
		parser.setIgnorePunctuationGaps(isIgnorePunctuation);
		parser.setKeepOriginalOrder(isKeepOriginalOrder);
		parser.setGapWidth(gapWidth);
		parser.setGapMaxLength(gapMaxLength);
		parser.setOpenLinksinNewTab(openLinksinNewTab);
		parser.setUseEscapeCharacterInGap(this.useEscapeCharacterInGap);
		ParserResult parsedTextInfo = parser.parse(moduleText);
		parsedText = parsedTextInfo.parsedText;

		if (parsedText.equals("#ERROR#")) {
			parsedText = DictionaryWrapper.get("text_parse_error");
			gapInfos.clear();
			choiceInfos.clear();
			linkInfos.clear();
			
			return;
		}
		gapInfos = parsedTextInfo.gapInfos;
		choiceInfos = parsedTextInfo.choiceInfos;
		linkInfos = parsedTextInfo.linkInfos;
		if (getBaseURL() != null) {
			parsedText = StringUtils.updateLinks(parsedText, getBaseURL());
		}
	}

	@Override
	public String toXML() {
		Element textModule = XMLUtils.createElement("textModule");
		this.setBaseXMLAttributes(textModule);
		textModule.appendChild(this.getLayoutsXML());

		Element text = XMLUtils.createElement("text");

		XMLUtils.setBooleanAttribute(text, "draggable", this.useDraggableGaps);
		XMLUtils.setBooleanAttribute(text, "math", this.useMathGaps);
		XMLUtils.setIntegerAttribute(text, "gapMaxLength", this.gapMaxLength);
		XMLUtils.setIntegerAttribute(text, "gapWidth", this.gapWidth);
		XMLUtils.setBooleanAttribute(text, "isActivity", this.isActivity);
		XMLUtils.setBooleanAttribute(text, "isIgnorePunctuation", this.isIgnorePunctuation);
		XMLUtils.setBooleanAttribute(text, "isKeepOriginalOrder", this.isKeepOriginalOrder);
		XMLUtils.setBooleanAttribute(text, "isClearPlaceholderOnFocus", this.isClearPlaceholderOnFocus);
		XMLUtils.setBooleanAttribute(text, "isDisabled", this.isDisabled);
		XMLUtils.setBooleanAttribute(text, "isCaseSensitive", this.isCaseSensitive);
		XMLUtils.setBooleanAttribute(text, "openLinksinNewTab", this.openLinksinNewTab);
		XMLUtils.setBooleanAttribute(text, "blockWrongAnswers", this.blockWrongAnswers);
		XMLUtils.setBooleanAttribute(text, "userActionEvents", this.userActionEvents);
		XMLUtils.setBooleanAttribute(text, "useEscapeCharacterInGap", this.useEscapeCharacterInGap);
		text.setAttribute("valueType", this.valueType);
		text.appendChild(XMLUtils.createCDATASection(this.moduleText));

		textModule.appendChild(text);

		return StringUtils.removeIllegalCharacters(textModule.toString());
	}

	private void addPropertyText(final boolean is_default) {

		IHtmlProperty property = new IHtmlProperty() {
			@Override
			public void setValue(String newValue) {
				setText(newValue);
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return moduleText;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("text_module_text");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("text_module_text");
			}

			@Override
			public boolean isDefault() {
				return is_default;
			}
		};

		addProperty(property);
	}

	private void addPropertyGapType() {
		IProperty property = new IEnumSetProperty() {

			@Override
			public void setValue(String newValue) {
				useDraggableGaps = newValue.compareTo("Draggable") == 0;
				useMathGaps = newValue.compareTo("Math") == 0;
				setText(moduleText);
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				if(useDraggableGaps){
					return "Draggable";
				} else if (useMathGaps) {
					return "Math";
				} else {
					return "Editable";
				}
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("text_module_gap_type");
			}

			@Override
			public int getAllowedValueCount() {
				return 3;
			}

			@Override
			public String getAllowedValue(int index) {
				if(index == 0) {
					return "Editable";
				} else if (index == 1) {
					return "Draggable";
				} else {
					return "Math";
				}
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("text_module_gap_type");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	private void addPropertyOpenLinksinNewTab() {
		IProperty property = new IEnumSetProperty() {

			@Override
			public void setValue(String newValue) {
				openLinksinNewTab = newValue.compareTo("New Tab") == 0;
				setText(moduleText);
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return openLinksinNewTab ? "New Tab" : "Same Tab";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("open_links_in_new_tab");
			}

			@Override
			public int getAllowedValueCount() {
				return 2;
			}

			@Override
			public String getAllowedValue(int index) {
				return index == 0 ? "New Tab" : "Same Tab";
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("open_links_in_new_tab");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}
	
	private void addPropertyValueType() {
		IProperty property = new IEnumSetProperty() {

			@Override
			public void setValue(String newValue) {
				valueType = newValue;
			}

			@Override
			public String getValue() {
				return valueType;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("text_module_value_type");
			}

			@Override
			public int getAllowedValueCount() {
				return 4;
			}

			@Override
			public String getAllowedValue(int index) {
				if (index == 0){
					return "All";
				}else if(index == 1) {
					return "Number only";
				} else if (index == 2) {
					return "Letters only";
				} else {
					return "Alphanumeric";
				}
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("text_module_value_type");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	private void addPropertyGapWidth() {
		IProperty property = new IProperty() {

			@Override
			public void setValue(String newValue) {
				gapWidth = Integer.parseInt(newValue);
				setText(moduleText);
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return Integer.toString(gapWidth);
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("text_module_gap_width");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("text_module_gap_width");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	private void addPropertyGapMaxLength() {
		IProperty property = new IProperty() {

			@Override
			public void setValue(String newValue) {
				gapMaxLength = Integer.parseInt(newValue);
				setText(moduleText);
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return Integer.toString(gapMaxLength);
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("text_module_gap_max_length");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("text_module_gap_max_length");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	public List<GapInfo> getGapInfos() {
		return gapInfos;
	}

	public List<InlineChoiceInfo> getChoiceInfos() {
		return choiceInfos;
	}

	public List<LinkInfo> getLinkInfos() {
		return linkInfos;
	}

	public boolean isActivity() {
		return isActivity;
	}

	private void addPropertyIsActivity() {
		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != isActivity) {
					isActivity = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isActivity ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("is_activity");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("is_activity");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
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
				return DictionaryWrapper.get("is_disabled");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("is_disabled");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}
	
	private void addPropertyBlockWrongAnswers() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);
				if (value!= blockWrongAnswers) {
					blockWrongAnswers = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return blockWrongAnswers ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("block_wrong_answers");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("block_wrong_answers");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	private void addPropertyIsCaseSensitive() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value!= isCaseSensitive) {
					isCaseSensitive = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isCaseSensitive ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("case_sensitive");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("case_sensitive");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}

	private void addPropertyIsIgnorePunctuation() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value!= isIgnorePunctuation) {
					isIgnorePunctuation = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isIgnorePunctuation ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("Ignore_punctuation");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Ignore_punctuation");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	private void addPropertyKeepOriginalOrder() {
		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value!= isKeepOriginalOrder) {
					isKeepOriginalOrder = value;
					setText(moduleText);
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isKeepOriginalOrder ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("Keep_original_order");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Keep_original_order");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}
	
	private void addPropertyClearPlaceholderOnFocus() {
		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != isClearPlaceholderOnFocus) {
					isClearPlaceholderOnFocus = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isClearPlaceholderOnFocus ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("Clear_placeholder_on_focus");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Clear_placeholder_on_focus");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}
	
	private void addPropertyUseEscapeCharacterInGap() {
		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != useEscapeCharacterInGap) {
					useEscapeCharacterInGap = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return useEscapeCharacterInGap ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("Text_use_escape_character_in_gap_property");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Text_use_escape_character_in_gap_property");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}

	private void addPropertyUserActionEvents() {
		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != userActionEvents) {
					userActionEvents = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return userActionEvents ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("user_action_events");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("user_action_events");
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
	
	public boolean shouldBlockWrongAnswers() {
		return blockWrongAnswers;
	}
	
	public boolean isUserActionEvents() {
		return userActionEvents;
	}

	public void setIsDisabled(boolean value) {
		isDisabled = value;
	}

	public boolean isCaseSensitive() {
		return isCaseSensitive;
	}

	public boolean isIgnorePunctuation() {
		return isIgnorePunctuation;
	}

	public boolean openLinksinNewTab() {
		return openLinksinNewTab;
	}

	public boolean isKeepOriginalOrder() {
		return isKeepOriginalOrder;
	}
	
	public boolean isClearPlaceholderOnFocus() {
		return isClearPlaceholderOnFocus;
	}

	public boolean hasMathGaps() {
		return useMathGaps;
	}
	
	public String getValueType() {
		return valueType;
	}

	public boolean isUsingEscapeCharacterInGap() {
		return this.useEscapeCharacterInGap;
	}

}
