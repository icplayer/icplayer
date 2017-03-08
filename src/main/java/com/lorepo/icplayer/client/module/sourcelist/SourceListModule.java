package com.lorepo.icplayer.client.module.sourcelist;

import java.util.ArrayList;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IStringListProperty;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;


public class SourceListModule extends BasicModuleModel{

	private ArrayList<String>	items = new ArrayList<String>();
	private boolean removable = true;
	private boolean vertical = false;
	private boolean randomOrder = false;
	
	
	public SourceListModule() {
		super("Source list", DictionaryWrapper.get("source_list_module"));
		
		initData();
		addPropertyItems(true);
		addPropertyRemovable();
		addPropertyVertical();
		addPropertyRandomOrder();
	}


	private void initData() {
		items.add("Item 1");
		items.add("Item 2");
		items.add("Item 3");
	}

	
	public int getItemCount(){
		return items.size();
	}
	
	
	protected boolean isRemovable(){
		return removable;
	}
	
	@Override
	protected void parseModuleNode(Element rootElement) {
		NodeList nodeList = rootElement.getElementsByTagName("items");
		if(nodeList.getLength() > 0){
			Element itemsElement = (Element)nodeList.item(0);
			removable = XMLUtils.getAttributeAsBoolean(itemsElement, "removable", true);
			vertical = XMLUtils.getAttributeAsBoolean(itemsElement, "vertical", false);
			randomOrder = XMLUtils.getAttributeAsBoolean(itemsElement, "randomOrder", false);
		}

		items.clear();
		NodeList itemNodes = rootElement.getElementsByTagName("item");
		for(int i = 0; i < itemNodes.getLength(); i++){

			Element element = (Element)itemNodes.item(i);
			String itemText = XMLUtils.getCharacterDataFromElement(element);
		    if(itemText == null){
		    	itemText = XMLUtils.getAttributeAsString(element, "text");
		    }
			items.add(itemText);
		}
	}
	
	
	@Override
	public String toXML() {
		Element sourceListModule = XMLUtils.createElement("sourceListModule");
		
		this.setBaseXMLAttributes(sourceListModule);
		sourceListModule.appendChild(this.getLayoutsXML());
		
		Element itemsElement = XMLUtils.createElement("items");
		XMLUtils.setBooleanAttribute(itemsElement, "removable", removable);
		XMLUtils.setBooleanAttribute(itemsElement, "vertical", vertical);
		XMLUtils.setBooleanAttribute(itemsElement, "randomOrder", randomOrder);

		for(String item : items){
			Element itemElement = XMLUtils.createElement("item");
			itemElement.appendChild(XMLUtils.createCDATASection(item));
			itemsElement.appendChild(itemElement);
		}

		sourceListModule.appendChild(itemsElement);
		return sourceListModule.toString();
	}


	public String getItem(int index) {
		return items.get(index);
	}

	
	private void addPropertyItems(final boolean isDefault) {

		IProperty property = new IStringListProperty() {
				
			@Override
			public void setValue(String newValue) {
				createItemsFromString(newValue);
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return convertItemsToString();
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("source_list_items");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("source_list_items");
			}

			@Override
			public boolean isDefault() {
				return isDefault;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyRandomOrder() {
		IProperty property = new IBooleanProperty() {
			@Override
			public String getName() {
				return DictionaryWrapper.get("source_list_random_order");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("source_list_random_order");
			}

			@Override
			public String getValue() {
				return randomOrder ? "True" : "False";
			}

			@Override
			public void setValue(String newValue) {
				boolean value = newValue.compareToIgnoreCase("true") == 0; 
				
				if (value != randomOrder) {
					randomOrder = value;
					sendPropertyChangedEvent(this);
				}
				
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	public boolean isRandomOrder() {
		return randomOrder;
	}


	private String convertItemsToString() {
		
		String text = "";
		
		for(String item : items){
			
			if(!text.isEmpty()){
				text += "\n";
			}
			text += item;
		}
		
		return text;
	}


	private void createItemsFromString(String newValue) {

		items.clear();
		String[] values = newValue.split("\n");
		for(int i = 0; i < values.length; i++){
			String item = values[i].trim();
			if(!item.isEmpty()){
				items.add(values[i]);
			}
		}
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
				return DictionaryWrapper.get("source_list_removable");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("source_list_removable");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};
		
		addProperty(property);
	}


	private void addPropertyVertical() {

		IProperty property = new IBooleanProperty() {
				
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if(value!= vertical){
					vertical = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(vertical){
					return "True";
				}
				else{
					return "False";
				}
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("source_list_vertical");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("source_list_vertical");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};
		
		addProperty(property);
	}


	public boolean isVertical() {
		return vertical;
	}
}
