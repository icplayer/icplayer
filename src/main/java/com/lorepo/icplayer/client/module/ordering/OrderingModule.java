package com.lorepo.icplayer.client.module.ordering;

import java.util.ArrayList;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyListener;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.properties.IStringListProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;


/**
 * Posiada elementy, które należy ułożyć w odpowiedniej kolejności
 * 
 * @author Krzysztof Langner
 *
 */
public class OrderingModule extends BasicModuleModel {

	private boolean isVertical = true;
	private int maxScore = 1;
	private ArrayList<OrderingItem>	items = new ArrayList<OrderingItem>();
	private IListProperty itemsProperty;
	private String optionalOrder = "";
	private boolean isActivity = true;

	public OrderingModule() {
		super(DictionaryWrapper.get("ordering_module"));
		
		addItem(new OrderingItem(1, "1", getBaseURL()));
		addItem(new OrderingItem(2, "2", getBaseURL()));
		addItem(new OrderingItem(3, "3", getBaseURL()));
		
		addPropertyIsVertical();
		addPropertyItems();
		addPropertyOptionalOrder();
		addPropertyIsActivity();
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
		if(nodeList.getLength() > 0){
			Element choice = (Element)nodeList.item(0);
			isVertical = XMLUtils.getAttributeAsBoolean(choice, "isVertical");
			optionalOrder = XMLUtils.getAttributeAsString(choice, "optionalOrder");
			isActivity = XMLUtils.getAttributeAsBoolean(choice, "isActivity", true);
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
					items.get(index).addAlternativeIndex(j+1);
				}
			}
		}
		catch (NumberFormatException e) {}
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
				optionalOrder + "' isActivity='" + isActivity + "'/>";
		
		for (OrderingItem item : items) {
			xml += "<item><![CDATA[" + item.getText() + "]]></item>";
		}
		
		return xml + "</orderingModule>";
	}

	public int getMaxScore() {
		return maxScore;
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
				return "Item";
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
				return "Item";
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

		};
		
		addProperty(property);	
	}

}
