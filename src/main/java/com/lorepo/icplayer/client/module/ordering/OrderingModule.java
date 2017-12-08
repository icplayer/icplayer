package com.lorepo.icplayer.client.module.ordering;

import java.util.ArrayList;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyListener;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.properties.IStaticListProperty;
import com.lorepo.icf.properties.IStringListProperty;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.choice.SpeechTextsStaticListItem;

public class OrderingModule extends BasicModuleModel {

	private boolean isVertical = true;
	private final int maxScore = 1;
	private final ArrayList<OrderingItem> items = new ArrayList<OrderingItem>();
	private IListProperty itemsProperty;
	private String optionalOrder = "";
	private boolean isActivity = true;
	private boolean allElementsHasSameWidth = false;
	private boolean graduallyScore = false;
	private boolean dontGenerateCorrectOrder = false;
	private String langAttribute = "";
	private ArrayList<SpeechTextsStaticListItem> speechTextItems = new ArrayList<SpeechTextsStaticListItem>();

	public OrderingModule() {
		super("Ordering", DictionaryWrapper.get("ordering_module"));

		addItem(new OrderingItem(1, "1", getBaseURL()));
		addItem(new OrderingItem(2, "2", getBaseURL()));
		addItem(new OrderingItem(3, "3", getBaseURL()));

		addPropertyIsVertical();
		addPropertyItems();
		addPropertyOptionalOrder();
		addPropertyIsActivity();
		addPropertyAllElementHasSameWidth();
		addPropertyGraduallyScore();
		addPropertyDontGenerateCorrectOrder();
		addPropertySpeechTexts();
		addPropertyLangAttribute();
	}

	private void addItem(OrderingItem item) {

		items.add(item);
		item.addPropertyListener(new IPropertyListener() {
			@Override
			public void onPropertyChanged(IProperty source) {
				OrderingModule.this.sendPropertyChangedEvent(itemsProperty);
			}
		});
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
	public void load(Element node, String baseUrl) {
		super.load(node, baseUrl);

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
			dontGenerateCorrectOrder = XMLUtils.getAttributeAsBoolean(ordering, "dontGenerateCorrectOrder");
			this.langAttribute = XMLUtils.getAttributeAsString(ordering, "lang");
			this.speechTextItems.get(0).setText(XMLUtils.getAttributeAsString(ordering, "selected"));
			this.speechTextItems.get(1).setText(XMLUtils.getAttributeAsString(ordering, "deselected"));
			this.speechTextItems.get(2).setText(XMLUtils.getAttributeAsString(ordering, "replaced_with"));
			this.speechTextItems.get(3).setText(XMLUtils.getAttributeAsString(ordering, "correct"));
			this.speechTextItems.get(4).setText(XMLUtils.getAttributeAsString(ordering, "wrong"));
		}

		// Read item nodes
		NodeList optionNodes = node.getElementsByTagName("item");

		for(int i = 0; i < optionNodes.getLength(); i++) {

			Element element = (Element)optionNodes.item(i);
			String text = XMLUtils.getCharacterDataFromElement(element);
			if (text == null) {
				text = StringUtils.unescapeXML(XMLUtils.getText(element));
			}

			OrderingItem item = new OrderingItem(i + 1, text, getBaseURL());
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

		String xml = "<orderingModule " + getBaseXML() + ">" + getLayoutXML();

		xml += "<ordering isVertical='" + Boolean.toString(isVertical) + "' optionalOrder='" +
				optionalOrder + "' isActivity='" + isActivity + "' allElementsHasSameWidth='" + 
				Boolean.toString(allElementsHasSameWidth) + "' graduallyScore='" + Boolean.toString(graduallyScore) +
				"' dontGenerateCorrectOrder='" + Boolean.toString(dontGenerateCorrectOrder) +
				"' lang='" + this.langAttribute +
				"' selected='" + this.speechTextItems.get(0).getText() +
				"' deselected='" + this.speechTextItems.get(1).getText() +
				"' replaced_with='" + this.speechTextItems.get(2).getText() +
				"' correct='" + this.speechTextItems.get(3).getText() +
				"' wrong='" + this.speechTextItems.get(4).getText() +
				"'/>";

		for (OrderingItem item : items) {
			xml += "<item><![CDATA[" + item.getText() + "]]></item>";
		}

		return xml + "</orderingModule>";
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
		};

		addProperty(itemsProperty);
	}


	private void addItems(int count) {

		if (count > 0 && count < 50) {
			for (int i = 0; i < count; i++) {
				int index = items.size()+1;
				String name = DictionaryWrapper.get("ordering_new_item");
				addItem(new OrderingItem(index, name, getBaseURL()));
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

}
