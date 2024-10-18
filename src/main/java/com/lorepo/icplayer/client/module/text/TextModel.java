package com.lorepo.icplayer.client.module.text;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.*;
import com.lorepo.icf.utils.*;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IWCAGModuleModel;
import com.lorepo.icplayer.client.module.choice.SpeechTextsStaticListItem;
import com.lorepo.icplayer.client.module.text.TextParser.ParserResult;
import com.lorepo.icplayer.client.printable.IPrintableModuleModel;
import com.lorepo.icplayer.client.printable.Printable;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.PrintableController;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

// in old lessons some characters aren't escaped (e.g: > or <), in new lessons they are
// only after editing and saving text in old lessons characters will be escaped

public class TextModel extends BasicModuleModel implements IWCAGModuleModel, IPrintableModuleModel {
	public static final int NUMBER_INDEX = 0;
	public static final int GAP_INDEX = 1;
	public static final int DROPDOWN_INDEX = 2;
	public static final int CORRECT_INDEX = 3;
	public static final int WRONG_INDEX = 4;
	public static final int EMPTY_INDEX = 5;
	public static final int INSERT_INDEX = 6;
	public static final int REMOVED_INDEX = 7;
	public static final int LINK_INDEX = 8;
	
	public String parsedText;
	public List<GapInfo> gapInfos = new ArrayList<GapInfo>();
	public List<InlineChoiceInfo> choiceInfos = new ArrayList<InlineChoiceInfo>();
	public List<LinkInfo> linkInfos = new ArrayList<LinkInfo>();
	public List<AudioInfo> audioInfos = new ArrayList<AudioInfo>();

	public String moduleText = "";
	public String defaultModuleText = "";
	private boolean useDraggableGaps;
	private boolean useMathGaps;
	private boolean openLinksinNewTab = true;
	private int gapWidth = 0;
	private int gapMaxLength = 0;
	private boolean isActivity = true;
	private boolean isDisabled = false;
	private boolean isCaseSensitive = false;
	private boolean useNumericKeyboard = false;
	private boolean isIgnorePunctuation = false;
	private boolean isKeepOriginalOrder = false;
	private boolean isClearPlaceholderOnFocus = false;
	public String rawText;
	public String gapUniqueId = "";
	private String valueType = "All";
	private String printableValue = "No";
	private boolean isSection = false;
	private boolean isSplitInPrintBlocked = false;
	private boolean ignoreDefaultPlaceholderWhenCheck = false;
	private HashMap<String, String> printableState = null;
	private boolean blockWrongAnswers = false;
	private boolean userActionEvents = false;
	private boolean useEscapeCharacterInGap = false;
	private boolean syntaxError = false;
	private String originalText;
	private ArrayList<SpeechTextsStaticListItem> speechTextItems = new ArrayList<SpeechTextsStaticListItem>();
	private String langAttribute = "";
	IListProperty groupGapsListProperty = null;
	private ArrayList<GroupGapsListItem> groupGaps = new ArrayList<GroupGapsListItem>();
	private boolean allCharactersGapSizeStyle = true;
	private PrintableController printableController = null;
	
	final static String GAP_SIZE_CALCULATION_STYLE_LABEL = "text_module_gap_size_calculation";
	final static String ALL_CHARACTES_CALCULATION_STYLE = "text_module_gap_calculation_all_characters_method"; // old method
	final static String LONGEST_ANSWER_CALCULATION_STYLE = "text_module_gap_calculation_longest_answer_method"; // new method

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
		addPropertyUseNumericKeyboard();
		addPropertyIsIgnorePunctuation();
		addPropertyOpenLinksinNewTab();
		addPropertyText(true);
		addPropertyKeepOriginalOrder();
		addPropertyClearPlaceholderOnFocus();
		addPropertyValueType();
		addPropertyBlockWrongAnswers();
		addPropertyUserActionEvents();
		addPropertyUseEscapeCharacterInGap();
		addPropertySpeechTexts();
		addPropertyLangAttribute();
		addPropertyGapSizeCalculationMethod();
		addPropertyPrintable();
		addPropertyIsSection();
		addPropertyIsSplitInPrintBlocked();
		addPropertyIgnoreDefaultPlaceholderWhenCheck();
		addPropertyGroupGaps();
		addGroupGapsItems(1);
	}

	@Override
	public void setId(String id) {
		super.setId(id);
		if (rawText != null) {
			setText(rawText);
		}
	}

	public String getDefaultModuleText() {
		return defaultModuleText;
	}

	public String getGapUniqueId() {
		return gapUniqueId;
	}

	public String getParsedText() {
		return parsedText;
	}

	public boolean hasDraggableGaps() {
		return useDraggableGaps;
	}

	public int getGapWidth() {
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
				useNumericKeyboard = XMLUtils.getAttributeAsBoolean(textElement, "useNumericKeyboard", false);
				isIgnorePunctuation = XMLUtils.getAttributeAsBoolean(textElement, "isIgnorePunctuation", false);
				isKeepOriginalOrder = XMLUtils.getAttributeAsBoolean(textElement, "isKeepOriginalOrder", false);
				isClearPlaceholderOnFocus = XMLUtils.getAttributeAsBoolean(textElement, "isClearPlaceholderOnFocus", false);
				openLinksinNewTab = XMLUtils.getAttributeAsBoolean(textElement, "openLinksinNewTab", true);
				rawText = XMLUtils.getCharacterDataFromElement(textElement);

				valueType = XMLUtils.getAttributeAsString(textElement, "valueType");
				blockWrongAnswers = XMLUtils.getAttributeAsBoolean(textElement, "blockWrongAnswers", false);
				userActionEvents = XMLUtils.getAttributeAsBoolean(textElement, "userActionEvents", false);
				useEscapeCharacterInGap = XMLUtils.getAttributeAsBoolean(textElement, "useEscapeCharacterInGap", false);
				langAttribute = XMLUtils.getAttributeAsString(textElement, "langAttribute");
				printableValue = XMLUtils.getAttributeAsString(textElement, "printable");
				isSection = XMLUtils.getAttributeAsBoolean(textElement, "isSection", false);
				isSplitInPrintBlocked = XMLUtils.getAttributeAsBoolean(textElement, "isSplitInPrintBlocked", false);
				ignoreDefaultPlaceholderWhenCheck = XMLUtils.getAttributeAsBoolean(textElement, "ignoreDefaultPlaceholderWhenCheck", false);
				allCharactersGapSizeStyle = XMLUtils.getAttributeAsBoolean(textElement, "allAnswersGapSizeCalculationStyle", true);
				this.speechTextItems.get(TextModel.NUMBER_INDEX).setText(XMLUtils.getAttributeAsString(textElement, "number"));
				this.speechTextItems.get(TextModel.GAP_INDEX).setText(XMLUtils.getAttributeAsString(textElement, "gap"));
				this.speechTextItems.get(TextModel.DROPDOWN_INDEX).setText(XMLUtils.getAttributeAsString(textElement, "dropdown"));
				this.speechTextItems.get(TextModel.CORRECT_INDEX).setText(XMLUtils.getAttributeAsString(textElement, "correct"));
				this.speechTextItems.get(TextModel.WRONG_INDEX).setText(XMLUtils.getAttributeAsString(textElement, "wrong"));
				this.speechTextItems.get(TextModel.EMPTY_INDEX).setText(XMLUtils.getAttributeAsString(textElement, "empty"));
				this.speechTextItems.get(TextModel.INSERT_INDEX).setText(XMLUtils.getAttributeAsString(textElement, "insert"));
				this.speechTextItems.get(TextModel.REMOVED_INDEX).setText(XMLUtils.getAttributeAsString(textElement, "removed"));
				this.speechTextItems.get(TextModel.LINK_INDEX).setText(XMLUtils.getAttributeAsString(textElement, "link"));

				this.parseModuleGroupsGapsNode(node);
				if (rawText == null) {
					rawText = StringUtils.unescapeXML(XMLUtils.getText(textElement));
				}

				defaultModuleText = rawText;
				setText(rawText);
			}
		}
	}

	private void parseModuleGroupsGapsNode(Element node) {
		NodeList groupsGapsNodes = node.getElementsByTagName("groupsGaps");
		if (groupsGapsNodes.getLength() == 0) {
			return;
		}
		
		groupGaps.clear();
		
		Element groupsGapsElement = (Element) groupsGapsNodes.item(0);
		NodeList groupGapsNodes = groupsGapsElement.getElementsByTagName("groupGaps");
		for (int groupGapIndex = 0; groupGapIndex < groupGapsNodes.getLength(); groupGapIndex++) {
			GroupGapsListItem groupGapsItem = new GroupGapsListItem(groupGapsListProperty);
			Element groupGapsElement = (Element) groupGapsNodes.item(groupGapIndex);
			groupGapsItem.load(groupGapsElement);
			this.addGroupGapsItem(groupGapsItem);
		}
	}

	public void setText(String text) {
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
		parser.setLangTag(this.getLangAttribute());
		parser.setIsNumericOnly(useNumericKeyboard);
		parser.setBaseURL(getBaseURL());

		ParserResult parsedTextInfo = parser.parse(moduleText);
		parsedText = parsedTextInfo.parsedText;
		originalText = parsedTextInfo.originalText;

		if (parsedText.equals("#ERROR#")) {
			parsedText = DictionaryWrapper.get("text_parse_error");
			this.clearInfos();
			return;
		}
		
		Integer gapsNumber = parsedTextInfo.gapInfos.size() + parsedTextInfo.choiceInfos.size();
		String groupGapsErrorCode = validateGroupGapsProperty(gapsNumber);
		if (!groupGapsErrorCode.isEmpty()) {
			parsedText = DictionaryWrapper.get(groupGapsErrorCode);
			this.clearInfos();
			return;
		}

		gapInfos = parsedTextInfo.gapInfos;
		choiceInfos = parsedTextInfo.choiceInfos;
		linkInfos = parsedTextInfo.linkInfos;
        audioInfos = parsedTextInfo.audioInfos;
		syntaxError = parsedTextInfo.hasSyntaxError;
		if (this.getContentBaseURL() != null) {
		    parsedText = StringUtils.updateLinks(parsedText, this.getContentBaseURL(), true);
			for (LinkInfo link: linkInfos) {
				link.setBaseUrl(getContentBaseURL(), true);
			}
		} else if (getBaseURL() != null) {
			parsedText = StringUtils.updateLinks(parsedText, getBaseURL());
			for (LinkInfo link: linkInfos) {
				link.setBaseUrl(getBaseURL());
			}
		} else if (ExtendedRequestBuilder.getSigningPrefix() != null) {
			parsedText = StringUtils.updateLinks(parsedText, null);
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
		XMLUtils.setBooleanAttribute(text, "isSection", this.isSection);
		XMLUtils.setBooleanAttribute(text, "isSplitInPrintBlocked", this.isSplitInPrintBlocked);
		XMLUtils.setBooleanAttribute(text, "ignoreDefaultPlaceholderWhenCheck", this.ignoreDefaultPlaceholderWhenCheck);
		XMLUtils.setBooleanAttribute(text, "isCaseSensitive", this.isCaseSensitive);
		XMLUtils.setBooleanAttribute(text, "useNumericKeyboard", this.useNumericKeyboard);
		XMLUtils.setBooleanAttribute(text, "openLinksinNewTab", this.openLinksinNewTab);
		XMLUtils.setBooleanAttribute(text, "blockWrongAnswers", this.blockWrongAnswers);
		XMLUtils.setBooleanAttribute(text, "userActionEvents", this.userActionEvents);
		XMLUtils.setBooleanAttribute(text, "useEscapeCharacterInGap", this.useEscapeCharacterInGap);
		XMLUtils.setBooleanAttribute(text, "allAnswersGapSizeCalculationStyle", this.allCharactersGapSizeStyle);
		if (this.langAttribute.compareTo("") != 0) {
			text.setAttribute("langAttribute", this.langAttribute);
		}
		text.setAttribute("valueType", this.valueType);
		text.setAttribute("printable", printableValue);
		text.setAttribute("number", this.speechTextItems.get(TextModel.NUMBER_INDEX).getText());
		text.setAttribute("gap", this.speechTextItems.get(TextModel.GAP_INDEX).getText());
		text.setAttribute("dropdown", this.speechTextItems.get(TextModel.DROPDOWN_INDEX).getText());
		text.setAttribute("correct", this.speechTextItems.get(TextModel.CORRECT_INDEX).getText());
		text.setAttribute("wrong", this.speechTextItems.get(TextModel.WRONG_INDEX).getText());
		text.setAttribute("empty", this.speechTextItems.get(TextModel.EMPTY_INDEX).getText());
		text.setAttribute("insert", this.speechTextItems.get(TextModel.INSERT_INDEX).getText());
		text.setAttribute("removed", this.speechTextItems.get(TextModel.REMOVED_INDEX).getText());
		text.setAttribute("link", this.speechTextItems.get(TextModel.LINK_INDEX).getText());
		text.appendChild(XMLUtils.createCDATASection(this.moduleText));

		textModule.appendChild(text);

		Element groupGapsElement = XMLUtils.createElement("groupsGaps");
		for (GroupGapsListItem listItem : groupGaps) {
			groupGapsElement.appendChild(listItem.toXML());
		}
		textModule.appendChild(groupGapsElement);

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

	public String getGapType() {
		if(useDraggableGaps){
			return "Draggable";
		} else if (useMathGaps) {
			return "Math";
		} else {
			return "Editable";
		}
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

	public List<AudioInfo> getAudioInfos() {
		return audioInfos;
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

				if (value != isDisabled) {
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
	
	private void addPropertyUseNumericKeyboard() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value!= useNumericKeyboard) {
					useNumericKeyboard = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return useNumericKeyboard ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("text_module_use_numeric_keyboard");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("text_module_use_numeric_keyboard");
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
				speechTextItems.add(new SpeechTextsStaticListItem("number"));
				speechTextItems.add(new SpeechTextsStaticListItem("gap"));
				speechTextItems.add(new SpeechTextsStaticListItem("dropdown"));
				speechTextItems.add(new SpeechTextsStaticListItem("correct"));
				speechTextItems.add(new SpeechTextsStaticListItem("wrong"));
				speechTextItems.add(new SpeechTextsStaticListItem("empty"));
				speechTextItems.add(new SpeechTextsStaticListItem("insert","text"));
				speechTextItems.add(new SpeechTextsStaticListItem("removed","text"));
				speechTextItems.add(new SpeechTextsStaticListItem("link"));
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
	
	private void addPropertyGapSizeCalculationMethod() {
		IProperty property = new IEnumSetProperty() {

			@Override
			public void setValue(String newValue) {
				// handling lacking or same labels
				boolean isLongestSizeCalculationStyle = newValue.equals(DictionaryWrapper.get(LONGEST_ANSWER_CALCULATION_STYLE));
				boolean isAllAnswersSizeCalculationStyle = newValue.equals(DictionaryWrapper.get(ALL_CHARACTES_CALCULATION_STYLE));
				
				if (isLongestSizeCalculationStyle && isAllAnswersSizeCalculationStyle) { 
					// special case, when labels are the same
					allCharactersGapSizeStyle = true;
				} else if (isLongestSizeCalculationStyle && !isAllAnswersSizeCalculationStyle) {
					// user selected new method
					allCharactersGapSizeStyle = false;
				} else {
					allCharactersGapSizeStyle = true;
				}
				
				valueType = newValue;
			}

			@Override
			public String getValue() {
				return valueType;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get(GAP_SIZE_CALCULATION_STYLE_LABEL);
			}

			@Override
			public int getAllowedValueCount() {
				return 2;
			}

			@Override
			public String getAllowedValue(int index) {
				if (index == 0){
					return DictionaryWrapper.get(ALL_CHARACTES_CALCULATION_STYLE);
				} else {
					return DictionaryWrapper.get(LONGEST_ANSWER_CALCULATION_STYLE);
				}
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(GAP_SIZE_CALCULATION_STYLE_LABEL);
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}
	
	private void addPropertyPrintable() {
		IProperty property = new IEnumSetProperty() {

			@Override
			public void setValue(String newValue) {	
				printableValue = newValue;
			}

			@Override
			public String getValue() {
				return printableValue;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get(Printable.NAME_LABEL);
			}

			@Override
			public int getAllowedValueCount() {
				return 3;
			}

			@Override
			public String getAllowedValue(int index) {
				return Printable.getStringValues(index);
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(Printable.NAME_LABEL);
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
	
	public boolean getUseNumericKeyboard() {
		return useNumericKeyboard;
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
	
	public boolean isOldGapSizeCalculation() {
		return this.allCharactersGapSizeStyle;
	}
	
	public String getSpeechTextItem (int index) {
		if (index < 0 || index >= this.speechTextItems.size()) {
			return "";
		}
		
		final String text = this.speechTextItems.get(index).getText();
		if (text.isEmpty()) {
			if (index == TextModel.NUMBER_INDEX) {
				return "number";
			}
			
			if (index == TextModel.GAP_INDEX) {
				return "gap";
			}
			
			if (index == TextModel.DROPDOWN_INDEX) {
				return "dropdown";
			}
			
			if (index == TextModel.CORRECT_INDEX) {
				return "correct";
			}
			
			if (index == TextModel.WRONG_INDEX) {
				return "wrong";
			}
			
			if (index == TextModel.EMPTY_INDEX) {
				return "empty";
			}
			
			if (index == TextModel.INSERT_INDEX) {
				return "inserted";
			}
			
			if (index == TextModel.REMOVED_INDEX) {
				return "removed";
			}

			if (index == TextModel.LINK_INDEX) {
				return "link";
			}
			
			return "";
		}
		
		return text;
	}
	
	public String getLangAttribute () {
		return langAttribute;
	}
	
	public String getOriginalText () {
		return this.originalText;
	}
	
	public boolean hasSyntaxError () {
		return syntaxError;
	}
	
	public PrintableMode getPrintable() {
		return Printable.getPrintableModeFromString(printableValue);
	}

	@Override
	public String getPrintableHTML(boolean showAnswers) {
		TextPrintable printable = new TextPrintable(this);
		String className = this.getStyleClass();
		String result = printable.getPrintableHTML(className, showAnswers);
		return result;
	}

	@Override
	public PrintableMode getPrintableMode() {
		return getPrintable();
	}

	private void addPropertyIsSection() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != isSection) {
					isSection = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isSection ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("printable_is_section");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("printable_is_section");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}
	
	public boolean isSection() {
		return isSection;
	}
	
	private void addPropertyIsSplitInPrintBlocked() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != isSplitInPrintBlocked) {
					isSplitInPrintBlocked = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isSplitInPrintBlocked ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("printable_block_split_label");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("printable_block_split_label");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}
	
	public boolean isSplitInPrintBlocked() {
		return isSplitInPrintBlocked;
	}

	private void addPropertyIgnoreDefaultPlaceholderWhenCheck() {

	    IProperty property = new IBooleanProperty() {

	        @Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != ignoreDefaultPlaceholderWhenCheck) {
					ignoreDefaultPlaceholderWhenCheck = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return ignoreDefaultPlaceholderWhenCheck ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("text_module_ignore_default_placeholder_when_check");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("text_module_ignore_default_placeholder_when_check");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
	    };

	    addProperty(property);
	}

	public boolean ignoreDefaultPlaceholderWhenCheck() {
		return ignoreDefaultPlaceholderWhenCheck;
	}

	private void addPropertyGroupGaps() {

		groupGapsListProperty = new IListProperty() {
			
			@Override
			public void setValue(String newValue) {
			    // Use this function to validate property
			    setText(moduleText);
			}

			@Override
			public String getValue() {
				return Integer.toString(groupGaps.size());
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("text_module_group_gaps");
			}

			@Override
			public IPropertyProvider getChild(int index) {
				return groupGaps.get(index);
			}

			@Override
			public int getChildrenCount() {
				return groupGaps.size();
			}

			@Override
			public void addChildren(int count) {
				addGroupGapsItems(count);
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("text_module_group_gaps");
			}

			@Override
			public void removeChildren(int index) {
				removeGroupGapsItem(index);
				sendPropertyChangedEvent(this);
			}

			@Override
			public void moveChildUp(int index) {
				moveGroupGapsItemUp(index);
				sendPropertyChangedEvent(this);
			}

			@Override
			public void moveChildDown(int index) {
				moveGroupGapsItemDown(index);
				sendPropertyChangedEvent(this);
			}
			
			public void onMoveTop(int index) {
				moveGroupGapsItemTop(index);
				sendPropertyChangedEvent(this);
			}
			
			public void onMoveBottom(int index) {
				moveGroupGapsItemBottom(index);
				sendPropertyChangedEvent(this);
			}

			@Override
			public boolean isDefault() {
				return false;
			}

			@Override
			public void moveChild(int prevIndex, int nextIndex) {
				moveGroupGapsItem(prevIndex, nextIndex);
				sendPropertyChangedEvent(this);
			}
		};

		addProperty(groupGapsListProperty);
	}

	private void addGroupGapsItems(int count) {
		if (count < 1 || count >= 50) {
			return;
		}
		
		for (int i = 0; i < count; i++) {
			addGroupGapsItem(new GroupGapsListItem(groupGapsListProperty));
		}
	}

	private void addGroupGapsItem(GroupGapsListItem item) {
		groupGaps.add(item);
		item.addPropertyListener(new IPropertyListener() {
			@Override
			public void onPropertyChanged(IProperty source) {
				TextModel.this.sendPropertyChangedEvent(groupGapsListProperty);
			}
		});
		setText(moduleText);
	}

	private String validateGroupGapsProperty(Integer gapsNumber) {
		ArrayList<Integer> allIndexes = new ArrayList<Integer>();
		
		for (GroupGapsListItem item : groupGaps) {
			boolean isValidItem = item.validate(gapsNumber);
			if (!isValidItem) {
				return item.getErrorCode();
			}
			
			ArrayList<Integer> itemGroupIndexes = item.getParsedGapsIndexes();
			for (Integer indexInGroup : itemGroupIndexes) {
				if (allIndexes.contains(indexInGroup)) {
					return "text_module_group_gaps_duplication_error";
				}
				allIndexes.add(indexInGroup);
			}
		}
		return "";
	}

	private void removeGroupGapsItem(int index) {
		if (groupGaps.size() > 1) {
			groupGaps.remove(index);
		}
	}

	private void moveGroupGapsItemUp(int index) {
		if (index > 0) {
			GroupGapsListItem item = groupGaps.remove(index);
			groupGaps.add(index - 1, item);
		}
	}

	private void moveGroupGapsItemDown(int index) {
		if (index < groupGaps.size() - 1) {
			GroupGapsListItem item = groupGaps.remove(index);
			groupGaps.add(index + 1, item);
		}
	}

	private void moveGroupGapsItemTop(int index) {
		if (index > 0) {
			GroupGapsListItem item = groupGaps.remove(index);
			groupGaps.add(0, item);
		}
	}

	private void moveGroupGapsItemBottom(int index) {
		if (index < groupGaps.size() - 1) {
			GroupGapsListItem item = groupGaps.remove(index);
			groupGaps.add(groupGaps.size() - 1, item);
		}
	}

	private void moveGroupGapsItem(int prevIndex, int nextIndex) {
		GroupGapsListItem item = groupGaps.remove(prevIndex);
		groupGaps.add(nextIndex, item);
	}

	private void clearInfos() {
		gapInfos.clear();
		choiceInfos.clear();
		linkInfos.clear();
		audioInfos.clear();
	}

	public ArrayList<GroupGapsListItem> getGroupGaps() {
		return this.groupGaps;
	}

	public Integer findGapGroupIndex(Integer gapIndex) {
		for (int i = 0; i < this.getGroupGaps().size(); i++) {
			GroupGapsListItem group = this.getGroupGaps().get(i);
			if (group.isGapInGroup(gapIndex)) {
				return i;
			}
		}
		return -1;
	}

	@Override
	public JavaScriptObject getPrintableContext() {
		return null;
	}

	@Override
	public void setPrintableController(PrintableController controller) {
		this.printableController = controller;
		
	}

	@Override
	public void setPrintableState(String stateObj) {
		if (stateObj.length() == 0) {
			return;
		}
		HashMap<String, String> state = JSONUtils.decodeHashMap(stateObj);
		HashMap<String, String> values = new HashMap<String, String>();
		String oldGapId = state.get("gapUniqueId") + "-";
		HashMap<String, String> oldValues = JSONUtils.decodeHashMap(state.get("values"));
		for (String key : oldValues.keySet()) {
			String newKey = key.replace(oldGapId, getGapUniqueId()+"-");
			values.put(newKey, oldValues.get(key));
		}

		this.printableState = values;
	}

	public HashMap<String, String> getPrintableState() {
		return this.printableState;
	}

	@Override
	public boolean isPrintableAsync() {
		return false;
	}

	@Override
	public void setPrintableAsyncCallback(String id, PrintableContentParser.ParsedListener listener) {

	}
}
