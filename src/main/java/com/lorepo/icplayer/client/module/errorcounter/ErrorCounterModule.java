package com.lorepo.icplayer.client.module.errorcounter;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;


public class ErrorCounterModule extends BasicModuleModel{

	private boolean showErrorCounter = true;
	private boolean showMistakeCounter = true;
	private boolean realTimeCalculation = false;
	
	
	public ErrorCounterModule() {
		super("ErrorCounter", DictionaryWrapper.get("error_counter_module"));
		addPropertyShowErrors();
		addPropertyShowMistakes();
		addPropertyRealTimeCalculation();
	}

	
	@Override
	public String toXML() {
		
		String xml = "<errorCounterModule " + getBaseXML() + ">" + getLayoutXML();
		xml += "<counter showErrorCounter='" + showErrorCounter +
				"' showMistakeCounter='" + showMistakeCounter + 
				"' realTimeCalculation='" + realTimeCalculation + "'/>";
		xml += "</errorCounterModule>";
		
		return xml;
	}
	
	public void load(Element node, String baseUrl, String version) {
		super.load(node, baseUrl, version);
		
		parseNode(node);
	}

	@Override
	public void load(Element node, String baseUrl) {
		super.load(node, baseUrl);
		parseNode(node);
	}


	private void parseNode(Element node) {
		NodeList counters = node.getElementsByTagName("counter");
		if(counters.getLength() > 0){
			Element counterElement = (Element)counters.item(0);
			showErrorCounter = XMLUtils.getAttributeAsBoolean(counterElement, "showErrorCounter", true);
			showMistakeCounter = XMLUtils.getAttributeAsBoolean(counterElement, "showMistakeCounter", true);
			realTimeCalculation = XMLUtils.getAttributeAsBoolean(counterElement, "realTimeCalculation", false);
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
}
