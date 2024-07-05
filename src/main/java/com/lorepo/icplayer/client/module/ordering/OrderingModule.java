package com.lorepo.icplayer.client.module.ordering;

import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IEnumSetProperty;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyListener;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.properties.IStaticListProperty;
import com.lorepo.icf.properties.IStringListProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IWCAGModuleModel;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.content.services.JsonServices;
import com.lorepo.icplayer.client.module.choice.SpeechTextsStaticListItem;
import com.lorepo.icplayer.client.printable.IPrintableModuleModel;
import com.lorepo.icplayer.client.printable.Printable;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.PrintableController;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;

public class OrderingModule extends BasicModuleModel implements IWCAGModuleModel, IPrintableModuleModel, IPrintableOrderingModule {
	public static final String ERROR_NUMBER_OF_ITEMS = "Error - only one item";
	public static final String ERROR_NO_COMBINATION = "Error - all correct combinations have been used";
	public static final String ERROR_POSITION_NOT_INTEGER = "Error - starting position not a integer";
	public static final String ERROR_POSITION_NOT_PROPER = "Error - starting position must be unique positive integer equal to item count or lower";
	public static final String ERROR_NO_AVAILABLE_COMBINATION = "Error - too few available positions to generate incorrect combination";
	

	private boolean isVertical = true;
	private boolean disableAxisLock = false;
	private final int maxScore = 1;
	private final ArrayList<OrderingItem> items = new ArrayList<OrderingItem>();
	private IListProperty itemsProperty;
	private String optionalOrder = "";
	private boolean isActivity = true;
	private boolean allElementsHasSameWidth = false;
	private boolean graduallyScore = false;
	private boolean dontGenerateCorrectOrder = false;
	private boolean showAllAnswersInGradualShowAnswersMode = false;
	private boolean disableDragging = false;
	private String langAttribute = "";
	private ArrayList<SpeechTextsStaticListItem> speechTextItems = new ArrayList<SpeechTextsStaticListItem>();
	private boolean isValid = true;
	private String validationError = "";
	private String printableValue = "";
	private PrintableController printableController = null;
	private boolean isSplitInPrintBlocked = false;
	private HashMap<String, String> printableState = null;

	public OrderingModule() {
		super("Ordering", DictionaryWrapper.get("ordering_module"));
		
		addItem(new OrderingItem(1, "1", getBaseURL(), null, null));
		addItem(new OrderingItem(2, "2", getBaseURL(), null, null));
		addItem(new OrderingItem(3, "3", getBaseURL(), null, null));

		addPropertyIsVertical();
		addPropertyItems();
		addPropertyOptionalOrder();
		addPropertyIsActivity();
		addPropertyAllElementHasSameWidth();
		addPropertyGraduallyScore();
		addPropertyDisableDragging();
		addPropertyDontGenerateCorrectOrder();
		addPropertyShowAllAnswersInGradualShowAnswersMode();
		addPropertySpeechTexts();
		addPropertyLangAttribute();
		addPropertyPrintable();
		addPropertyIsSplitInPrintBlocked();
		addPropertyDisableAxisLock();
	}

	public void validate() {
		if (this.getItemCount() <= 1) {
			this.validationError = ERROR_NUMBER_OF_ITEMS;
			this.isValid = false;
			return;
		}
		
		String optionalOrder = StringUtils.trimSpacesInside(this.getOptionalOrder());
		
		// if we have two items, there are only two combinations. If both are set as correct order,
		// we can't generate a random incorrect order to show.
		if (this.getItemCount() == 2 && this.isDontGenerateCorrectOrder() && optionalOrder.length() > 0) {
			if (optionalOrder != StringUtils.trimSpacesInside(this.getItemsOrder())) {
				this.validationError = ERROR_NO_COMBINATION;
				this.isValid = false;
				return;
			}
		}
		
		if (!this.validateStartingPositionsString()) {
			this.validationError = ERROR_POSITION_NOT_INTEGER;
			this.isValid = false;
			return;
		}
		
		if (!this.validateStartingPositions()) {
			this.validationError = ERROR_POSITION_NOT_PROPER;
			this.isValid = false;
			return;
		}
		
		if (this.isDontGenerateCorrectOrder() && this.availablePositions() <= 1) {
			this.validationError = ERROR_NO_AVAILABLE_COMBINATION;
			this.isValid = false;
			return;
		}

		this.isValid = true;
		this.validationError = "";
	}

	private void addItem(OrderingItem item) {

		items.add(item);
		item.addPropertyListener(new IPropertyListener() {
			@Override
			public void onPropertyChanged(IProperty source) {
				OrderingModule.this.sendPropertyChangedEvent(itemsProperty);
			}
		});
		
		this.validate();
	}

	public OrderingItem getItem(int index) {
		return items.get(index);
	}

	public int getItemCount() {
		return items.size();
	}

	public Boolean isVertical() {
		return isVertical;
	}

	public String getOptionalOrder() {
		return optionalOrder;
	}

	@Override
	protected void parseModuleNode(Element node) {
		items.clear();
		// Read ordering node
		NodeList nodeList = node.getElementsByTagName("ordering");
		if (nodeList.getLength() > 0) {
			Element ordering = (Element) nodeList.item(0);
			isVertical = XMLUtils.getAttributeAsBoolean(ordering, "isVertical");
			isActivity = XMLUtils.getAttributeAsBoolean(ordering, "isActivity", true);
			optionalOrder = XMLUtils.getAttributeAsString(ordering, "optionalOrder");
			allElementsHasSameWidth = XMLUtils.getAttributeAsBoolean(ordering, "allElementsHasSameWidth");
			graduallyScore = XMLUtils.getAttributeAsBoolean(ordering, "graduallyScore");
			disableDragging = XMLUtils.getAttributeAsBoolean(ordering, "disableDragging");
			dontGenerateCorrectOrder = XMLUtils.getAttributeAsBoolean(ordering, "dontGenerateCorrectOrder");
			showAllAnswersInGradualShowAnswersMode = XMLUtils.getAttributeAsBoolean(ordering, "showAllAnswersInGradualShowAnswersMode");
			this.speechTextItems.get(0).setText(XMLUtils.getAttributeAsString(ordering, "selected"));
			this.speechTextItems.get(1).setText(XMLUtils.getAttributeAsString(ordering, "deselected"));
			this.speechTextItems.get(2).setText(XMLUtils.getAttributeAsString(ordering, "replaced_with"));
			this.speechTextItems.get(3).setText(XMLUtils.getAttributeAsString(ordering, "correct"));
			this.speechTextItems.get(4).setText(XMLUtils.getAttributeAsString(ordering, "wrong"));
			this.langAttribute = XMLUtils.getAttributeAsString(ordering, "lang");
			printableValue = XMLUtils.getAttributeAsString(ordering, "printable");
			isSplitInPrintBlocked = XMLUtils.getAttributeAsBoolean(ordering, "isSplitInPrintBlocked");
			disableAxisLock = XMLUtils.getAttributeAsBoolean(ordering, "disableAxisLock");
			
		}

		// Read item nodes
		NodeList optionNodes = node.getElementsByTagName("item");

		for(int i = 0; i < optionNodes.getLength(); i++) {

			Element element = (Element) optionNodes.item(i);
			String text = XMLUtils.getCharacterDataFromElement(element);
			if (text == null) {
				text = StringUtils.unescapeXML(XMLUtils.getText(element));
			}
			
			OrderingItem item;

			String startingPositionString = XMLUtils.getAttributeAsString(element, "startingPosition");
			try {
				Integer startingPosition = startingPositionString.isEmpty() ? null : Integer.parseInt(startingPositionString); 
				item = new OrderingItem(i + 1, text, getBaseURL(), startingPosition, getContentBaseURL());
			} catch (NumberFormatException ex) {
				this.isValid = false;
				this.validationError = ERROR_POSITION_NOT_INTEGER;

				item = new OrderingItem(i+ 1, text, getBaseURL(), null, getContentBaseURL());
				item.setStartingPositionString(startingPositionString);
			}
			
			addItem(item);
		}

		if (optionalOrder.length() > 0) {
			setOptionalOrder();
		}
	}

	private void setOptionalOrder() {

		for (OrderingItem item : items) {
			item.clearAlternativeIndexes();
		}

		try {
			String[] orders = optionalOrder.split(";");
			for (int i = 0; i < orders.length; i++) {

				String[] alternativeIndexes = orders[i].split(",");
				for (int j = 0; j < items.size() && j < alternativeIndexes.length; j++) {
					int index = Integer.parseInt(alternativeIndexes[j])-1;
					if(index < items.size()){
						items.get(index).addAlternativeIndex(j+1);
					}
				}
			}
		}
		catch (NumberFormatException e) {}
	}

	public String getItemsOrder() {
		String order = "";
		int last = 0;

		for (OrderingItem item : items) {
			order += item.getIndex();
			last++;

			if (last != items.size() )
				order += ", ";
		}
		return order;
	}

	public void removeAllItems() {
		items.clear();
	}

	public void setVertical(boolean vertical) {
		isVertical = vertical;
	}

	/**
	 * Convert module into XML
	 */
	@Override
	public String toXML() {
		Element orderingModule = XMLUtils.createElement("orderingModule");
		this.setBaseXMLAttributes(orderingModule);
		orderingModule.appendChild(this.getLayoutsXML());

		Element ordering = XMLUtils.createElement("ordering");

		XMLUtils.setBooleanAttribute(ordering, "isVertical", isVertical);
		XMLUtils.setBooleanAttribute(ordering, "isActivity", isActivity);
		XMLUtils.setBooleanAttribute(ordering, "allElementsHasSameWidth", allElementsHasSameWidth);
		XMLUtils.setBooleanAttribute(ordering, "graduallyScore", graduallyScore);
		XMLUtils.setBooleanAttribute(ordering, "disableDragging", disableDragging);
		XMLUtils.setBooleanAttribute(ordering, "dontGenerateCorrectOrder", dontGenerateCorrectOrder);
		XMLUtils.setBooleanAttribute(ordering, "showAllAnswersInGradualShowAnswersMode", showAllAnswersInGradualShowAnswersMode);
		ordering.setAttribute("optionalOrder", optionalOrder);
		ordering.setAttribute("lang", this.langAttribute);
		ordering.setAttribute("selected", this.speechTextItems.get(0).getText());
		ordering.setAttribute("deselected", this.speechTextItems.get(1).getText());
		ordering.setAttribute("replaced_with", this.speechTextItems.get(2).getText());
		ordering.setAttribute("correct", this.speechTextItems.get(3).getText());
		ordering.setAttribute("wrong", this.speechTextItems.get(4).getText());
		ordering.setAttribute("printable", printableValue);
		XMLUtils.setBooleanAttribute(ordering, "isSplitInPrintBlocked", isSplitInPrintBlocked);
		XMLUtils.setBooleanAttribute(ordering, "disableAxisLock", disableAxisLock);
		
		orderingModule.appendChild(ordering);

		for (OrderingItem item : items) {
			Element itemElement = XMLUtils.createElement("item");
			itemElement.appendChild(XMLUtils.createCDATASection(item.getText()));
			
			itemElement.setAttribute("startingPosition", item.getStartingPositionString());
			orderingModule.appendChild(itemElement);
		}

		return orderingModule.toString();
	}

	public int getMaxScore() {
		return graduallyScore ? items.size() : maxScore;		
	}

	private void addPropertyIsVertical() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value!= isVertical) {
					isVertical = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isVertical ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("ordering_is_vertical");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("ordering_is_vertical");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}


	private void addPropertyItems() {

		itemsProperty = new IListProperty() {

			@Override
			public void setValue(String newValue) {}

			@Override
			public String getValue() {
				return Integer.toString(items.size());
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("ordering_item");
			}

			@Override
			public IPropertyProvider getChild(int index) {
				return items.get(index);
			}

			@Override
			public int getChildrenCount() {
				return items.size();
			}

			@Override
			public void addChildren(int count) {
				addItems(count);
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("ordering_item");
			}

			@Override
			public void removeChildren(int index) {
				removeItem(index);
				sendPropertyChangedEvent(this);
			}

			@Override
			public void moveChildUp(int index) {
				moveItemUp(index);
				sendPropertyChangedEvent(this);
			}

			@Override
			public void moveChildDown(int index) {
				moveItemDown(index);
				sendPropertyChangedEvent(this);
			}

			@Override
			public boolean isDefault() {
				return true;
			}

			@Override
			public void moveChild(int prevIndex, int nextIndex) {
				moveItem(prevIndex, nextIndex);
				sendPropertyChangedEvent(this);
			}
		};

		addProperty(itemsProperty);
	}


	private void addItems(int count) {

		if (count > 0 && count < 50) {
			for (int i = 0; i < count; i++) {
				int index = items.size()+1;
				String name = DictionaryWrapper.get("ordering_new_item");
				addItem(new OrderingItem(index, name, getBaseURL(), null, getContentBaseURL()));
			}
		}
	}

	private void removeItem(int index) {
		if (items.size() > 1) {
			items.remove(index);
		}
	}

	private void moveItemUp(int index) {
		if (index > 0) {
			OrderingItem item = items.remove(index);
			items.add(index - 1, item);
		}
	}

	private void moveItemDown(int index) {
		if (index < items.size() - 1) {
			OrderingItem item = items.remove(index);
			items.add(index + 1, item);
		}
	}

	private void moveItem(int prevIndex, int nextIndex) {
		OrderingItem item = items.remove(prevIndex);
		items.add(nextIndex, item);
	}

	private void addPropertyOptionalOrder() {

		IProperty property = new IStringListProperty() {

			@Override
			public void setValue(String newValue) {
				optionalOrder = newValue.replace("\n", ";");
				setOptionalOrder();
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return optionalOrder.replace(";", "\n");
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("optional_order");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("optional_order");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
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

	public boolean doAllElementsHasSameWidth() {
		return allElementsHasSameWidth;
	}

	private void addPropertyAllElementHasSameWidth() {
		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != allElementsHasSameWidth) {
					allElementsHasSameWidth = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return allElementsHasSameWidth ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("All_elements_has_same_width");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("All_elements_has_same_width");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}
	
	public boolean isGraduallyScore() {
		return graduallyScore;
	}
	
	private void addPropertyGraduallyScore() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != graduallyScore) {
					graduallyScore = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return graduallyScore ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("ordering_gradually_score");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("ordering_gradually_score");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}

	public boolean isDontGenerateCorrectOrder() {
		return dontGenerateCorrectOrder;
	}
	
	private void addPropertyDisableDragging() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != disableDragging) {
					disableDragging = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return disableDragging ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("ordering_disable_dragging");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("ordering_disable_dragging");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}

	public boolean isDisableDragging() {
		return disableDragging;
	}

	private void addPropertyDontGenerateCorrectOrder() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != dontGenerateCorrectOrder) {
					dontGenerateCorrectOrder = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return dontGenerateCorrectOrder ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("dont_generate_correct_order");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("dont_generate_correct_order");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}

	private void addPropertyShowAllAnswersInGradualShowAnswersMode() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != showAllAnswersInGradualShowAnswersMode) {
					showAllAnswersInGradualShowAnswersMode = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return showAllAnswersInGradualShowAnswersMode ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("show_all_answers_in_gradual_show_answers_mode");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("show_all_answers_in_gradual_show_answers_mode");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}

	public boolean isShowAllAnswersInGradualShowAnswersMode() {
		return showAllAnswersInGradualShowAnswersMode;
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
				speechTextItems.add(new SpeechTextsStaticListItem("selected"));
				speechTextItems.add(new SpeechTextsStaticListItem("deselected"));
				speechTextItems.add(new SpeechTextsStaticListItem("replaced_with"));
				speechTextItems.add(new SpeechTextsStaticListItem("correct"));
				speechTextItems.add(new SpeechTextsStaticListItem("wrong"));
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
	
	public PrintableMode getPrintable() {
		return Printable.getPrintableModeFromString(printableValue);
	}

	public boolean isPrintable() {
		return getPrintable() != PrintableMode.NO;
	}
	
	@Override
	public String getPrintableHTML(boolean showAnswers) {
		OrderingPrintable printable = new OrderingPrintable(this, printableController);
		String className = this.getStyleClass();
		return printable.getPrintableHTML(className, showAnswers);
	}

	@Override
	public PrintableMode getPrintableMode() {
		return getPrintable();
	}

	@Override
	public boolean isSection() {
		return false;
	}
	
	public String getSpeechTextItem (int index) {
		if (index < 0 || index >= this.speechTextItems.size()) {
			return "";
		}
		
		final String text = this.speechTextItems.get(index).getText();
		if (text.isEmpty()) {
			if (index == 0) {
				return "selected";
			}
			
			if (index == 1) {
				return "deselected";
			}
			
			if (index == 2) {
				return "replaced with";
			}
			
			if (index == 3) {
				return "correct";
			}
			
			if (index == 4) {
				return "wrong";
			}
			
			return "";
		}
		
		return text;
	}
	
	public String getLangAttribute () {
		return this.langAttribute;
	}
	
	public boolean validateStartingPositionsString() {
		for (OrderingItem item : this.items) {
			String startingPositionString = item.getStartingPositionString();
			
			if (startingPositionString != null) {	
				if (!startingPositionString.isEmpty()) {
					try {
						Integer startingPosition = Integer.parseInt(startingPositionString);
						item.setStartingPosition(startingPosition);
					} catch (NumberFormatException ex) {
						return false;
					}
				} else {
					item.setStartingPosition(null);
				}
			}
		}
		return true;
	}
	
	// starting positions have to be unique, bigger than 0 and lower than items count
	public boolean validateStartingPositions() {		
		Set<Integer> startingPositions = new HashSet<Integer>();

		for (OrderingItem item : this.items) {
			Integer itemStartingPosition = item.getStartingPosition();
			
			if (itemStartingPosition != null && (itemStartingPosition <= 0 || itemStartingPosition > this.items.size()))
				return false;
			
			if (itemStartingPosition != null && startingPositions.contains(itemStartingPosition))
				return false;
		
			if (itemStartingPosition != null) { 
				startingPositions.add(itemStartingPosition);
			}
		}
		
		return true;
	}
	
	public int unsetPositions() {
		int itemsWithPosition = 0;
		
		for (OrderingItem item : this.items) {
			Integer startPosition = item.getStartingPosition();
			if (startPosition != null) {
				itemsWithPosition++;
			}
		}
		
		return this.items.size() - itemsWithPosition;
	}
	
	public int availablePositions() {
		int itemsInCorrectPlace = 0;
		
		for (OrderingItem item : this.items) {
			Integer startPosition = item.getStartingPosition();
			if (startPosition != null && item.isCorrect(startPosition)) {
				itemsInCorrectPlace++;
			}
		}
		
		return this.items.size() - itemsInCorrectPlace;
	}
	
	public boolean isValid() {
		return this.isValid;
	}
	
	public String getValidationError() {
		return this.validationError;
	}

	@Override
	public JavaScriptObject getPrintableContext() {
		return null;
	}

	@Override
	public void setPrintableController(PrintableController controller) {
		this.printableController = controller;
		
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

	private void addPropertyDisableAxisLock() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != disableAxisLock) {
					disableAxisLock = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return disableAxisLock ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("ordering_disable_axis_lock");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("ordering_disable_axis_lock");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}

	public boolean isAxisLockDisabled() { return disableAxisLock; }

	@Override
	public void setPrintableState(String state) {
		if (state.equals(""))
			return;
		IJsonServices jsonServices = new JsonServices();
		this.printableState = jsonServices.decodeHashMap(state);
	}

	@Override
	public boolean isPrintableAsync() {
		return false;
	}

	@Override
	public void setPrintableAsyncCallback(String id, PrintableContentParser.ParsedListener listener) {

	}

	public HashMap<String, String> getPrintableState() {
		return this.printableState;
	}
}
