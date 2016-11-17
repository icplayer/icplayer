package com.lorepo.icplayer.client.module.choice;

import java.util.ArrayList;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyListener;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;

public class ChoiceModel extends BasicModuleModel{

	private boolean isMulti = false;
	private ArrayList<ChoiceOption>	options = new ArrayList<ChoiceOption>();	
	private IListProperty optionsProperty;
	private int maxScore = 0;
	private boolean isDisabled = false;
	private boolean isActivity = true;
	private boolean randomOrder = false;
	private boolean isHorizontal = false;

	public ChoiceModel() {
		super("Choice", DictionaryWrapper.get("choice_module"));
		
		addOption(new ChoiceOption("1", "A", 1));
		addOption(new ChoiceOption("2", "B", 0));
		
		addPropertyIsMulti();
		addPropertyOptions(true);
		addPropertyIsDisabled();
		addPropertyIsActivity();
		addPropertyRandomOrder();
		addPropertyHorizontalLayout();
	}
	
	public void addOption(ChoiceOption option) {
	
		if (isMulti && option.getValue() > 0) {
			maxScore += option.getValue();
		} else if (option.getValue() > maxScore) {
			maxScore = option.getValue();
		}
		
		options.add(option);
		option.addPropertyListener(new IPropertyListener() {
			
			@Override
			public void onPropertyChanged(IProperty source) {
				ChoiceModel.this.sendPropertyChangedEvent(optionsProperty);
			}
		});
	}

	/**
	 * @return Option at given index
	 */
	public ChoiceOption getOption(int index){
		return options.get(index);
	}
	
	/**
	 * @return ilość opcji
	 */
	public int getOptionCount(){
		return options.size();
	}
	
	public boolean isMulti() {
		return isMulti;
	}

	@Override
	public void load(Element node, String baseUrl) {
	
		super.load(node, baseUrl);
		
		options.clear();
		maxScore = 0;
		
		// Read choice node
		NodeList nodeList = node.getElementsByTagName("choice");
		if(nodeList.getLength() > 0){
			Element choice = (Element)nodeList.item(0);
			isMulti = XMLUtils.getAttributeAsBoolean(choice, "isMulti");
			isDisabled = XMLUtils.getAttributeAsBoolean(choice, "isDisabled", false);
			isActivity = XMLUtils.getAttributeAsBoolean(choice, "isActivity", true);
			randomOrder = XMLUtils.getAttributeAsBoolean(choice, "randomOrder", false);
			isHorizontal = XMLUtils.getAttributeAsBoolean(choice, "isHorizontal", false);
		}
		
		// Read options nodes
		NodeList optionNodes = node.getElementsByTagName("option");
		
		for(int i = 0; i < optionNodes.getLength(); i++){

			Element element = (Element)optionNodes.item(i);
			String optionID = Integer.toString(i+1);
			ChoiceOption option = new ChoiceOption(optionID);
			option.load(element, baseUrl);
			addOption(option);
		}
		
	}

	/**
	 * Remove all options
	 */
	public void removeAllOptions() {
		options.clear();
	}

	/**
	 * Set choice type
	 * @param multi
	 */
	public void setMulti(boolean multi) {
		isMulti = multi;
	}

	/**
	 * Convert module into XML
	 */
	@Override
	public String toXML() {
		
		String xml = "<choiceModule " + getBaseXML() + ">" + getLayoutXML();
		xml += "<choice " +
				"isMulti='" + isMulti + "' " +
				"isDisabled='" + isDisabled +  "' " +
				"isActivity='" + isActivity +  "' " +
				"randomOrder='" + randomOrder +  "' " +
				"isHorizontal='" + isHorizontal +  "' " +
				" />";
		xml += "<options>";
		for(ChoiceOption option : options){
			xml += option.toXML();
		}
		xml += "</options>";

		xml += "</choiceModule>";
		
		return xml;
	}

	
	public int calculateMaxScore() {
		int maxScore = 0;
		for (ChoiceOption option : options) {
			maxScore += option.getValue();
		}
		
		return maxScore;
	}
	
	public int getMaxScore() {		
		return calculateMaxScore();
	}


	private void addPropertyHorizontalLayout() {

		IProperty property = new IBooleanProperty() {
				
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if(value!= isHorizontal){
					isHorizontal = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				return isHorizontal ? "True" : "False";
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("horizontal_layout");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("horizontal_layout");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};
		
		addProperty(property);
	}
	
	public boolean isHorizontalLayout() {
		return isHorizontal;
	}
	
	private void addPropertyIsMulti() {

		IProperty property = new IBooleanProperty() {
				
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if(value!= isMulti){
					isMulti = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				return isMulti ? "True" : "False";
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("is_multi");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("is_multi");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};
		
		addProperty(property);
	}


	private void addPropertyOptions(final boolean isDefault) {

		optionsProperty = new IListProperty() {
				
			@Override
			public void setValue(String newValue) {
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return Integer.toString(options.size());
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("choice_item");
			}

			@Override
			public IPropertyProvider getChild(int index) {
				return options.get(index);
			}

			@Override
			public int getChildrenCount() {
				return options.size();
			}

			@Override
			public void addChildren(int count) {
				addItems(count);
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("choice_item");
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
				return isDefault;
			}

		};
		
		addProperty(optionsProperty);
	}


	protected void addItems(int count) {
		
		if(count > 0 && count < 50){
			for(int i = 0; i < count; i++){
				String optionID = Integer.toString(i+options.size()+1);
				addOption(new ChoiceOption(optionID, "New Option", 0));
			}
		}
	}

	private void removeItem(int index) {
		if(options.size() > 1){
			options.remove(index);
		}
	}

	private void moveItemUp(int index) {
		if(index > 0){
			ChoiceOption item = options.remove(index);
			options.add(index-1, item);
		}
	}

	private void moveItemDown(int index) {
		if(index < options.size()-1){
			ChoiceOption item = options.remove(index);
			options.add(index+1, item);
		}
	}

	public ArrayList<ChoiceOption> getOptions() {
		return options;
	}

	public boolean isDisabled() {
		return isDisabled;
	}

	private void addPropertyIsDisabled() {
		
		IProperty property = new IBooleanProperty() {
			
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if(value!= isDisabled){
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


	public boolean isActivity() {
		return isActivity;
	}

	private void addPropertyIsActivity() {
		
		IProperty property = new IBooleanProperty() {
			
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if(value!= isActivity){
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
	
	public boolean isRandomOrder() {
		return randomOrder;
	}
	
	private void addPropertyRandomOrder() {
	
		IProperty property = new IBooleanProperty() {
			
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if(value != randomOrder){
					randomOrder = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				return randomOrder ? "True" : "False";
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("randomOrder");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("randomOrder");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};
		
		addProperty(property);
	}
}
