package com.lorepo.icplayer.client.module.errorcounter;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IWCAGModuleModel;


public class ErrorCounterModule extends BasicModuleModel implements IWCAGModuleModel{

	private boolean showErrorCounter = true;
	private boolean showMistakeCounter = true;
	private boolean realTimeCalculation = false;
	private String langAttribute = "";
	
	
	public ErrorCounterModule() {
		super("ErrorCounter", DictionaryWrapper.get("error_counter_module"));
		addPropertyShowErrors();
		addPropertyShowMistakes();
		addPropertyRealTimeCalculation();
		addPropertyLangAttribute();
	}

	
	@Override
	public String toXML() {
		Element errorCounterModule = XMLUtils.createElement("errorCounterModule");
		
		this.setBaseXMLAttributes(errorCounterModule);
		errorCounterModule.appendChild(this.getLayoutsXML());
		
		Element counter = XMLUtils.createElement("counter");
		counter.setAttribute("showErrorCounter", Boolean.toString(this.showErrorCounter));
		counter.setAttribute("showMistakeCounter", Boolean.toString(this.showMistakeCounter));
		counter.setAttribute("realTimeCalculation", Boolean.toString(this.realTimeCalculation));
		counter.setAttribute("langAttribute", langAttribute);
		
		errorCounterModule.appendChild(counter);

		return errorCounterModule.toString();
	}
	
	@Override
	protected void parseModuleNode(Element node) {
		NodeList counters = node.getElementsByTagName("counter");
		if(counters.getLength() > 0){
			Element counterElement = (Element)counters.item(0);
			showErrorCounter = XMLUtils.getAttributeAsBoolean(counterElement, "showErrorCounter", true);
			showMistakeCounter = XMLUtils.getAttributeAsBoolean(counterElement, "showMistakeCounter", true);
			realTimeCalculation = XMLUtils.getAttributeAsBoolean(counterElement, "realTimeCalculation", false);
			langAttribute = XMLUtils.getAttributeAsString(counterElement, "langAttribute");
		}
	}
	
	public boolean getShowErrorCounter() {
		return showErrorCounter;
	}

	public boolean getShowMistakeCounter() {
		return showMistakeCounter;
	}
	
	public boolean isRealTimeCalculation() {
		return realTimeCalculation;
	}

	
	private void addPropertyShowErrors() {
		
		IProperty property = new IBooleanProperty() {
			
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if(value!= showErrorCounter){
					showErrorCounter = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(showErrorCounter){
					return "True";
				}
				else{
					return "False";
				}
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("errors_property");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("errors_property");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};
		
		addProperty(property);	
	}

	
	private void addPropertyShowMistakes() {
		
		IProperty property = new IBooleanProperty() {
			
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if(value!= showMistakeCounter){
					showMistakeCounter = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(showMistakeCounter){
					return "True";
				}
				else{
					return "False";
				}
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("mistakes_property");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("mistakes_property");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};
		
		addProperty(property);	
	}
	
	private void addPropertyRealTimeCalculation() {
		
		IProperty property = new IBooleanProperty() {
			
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if(value!= realTimeCalculation){
					realTimeCalculation = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				return realTimeCalculation ? "True" : "False";
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("real_time_calculation_property");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("real_time_calculation_property");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};
		
		addProperty(property);	
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
				return DictionaryWrapper.get("choice_lang_attribute");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("choice_lang_attribute");
			}
		};

		addProperty(property);
	}
	
	public String getLangAttribute() {
		return langAttribute;
	}
}
