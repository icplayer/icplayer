package com.lorepo.icplayer.client.module.errorcounter;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;


/**
 * Show number of errors and/or mistakes.
 * 
 * @author Krzysztof Langner
 *
 */
public class ErrorCounterModule extends BasicModuleModel{

	private boolean showErrorCounter = true;
	private boolean showMistakeCounter = true;
	
	
	public ErrorCounterModule() {
		super(DictionaryWrapper.get("error_counter_module"));
		addPropertyShowErrors();
		addPropertyShowMistakes();
	}

	
	@Override
	public String toXML() {
		
		String xml = "<errorCounterModule " + getBaseXML() + ">" + getLayoutXML();
		xml += "<counter showErrorCounter='" + showErrorCounter + 
				"' showMistakeCounter='" + showMistakeCounter + "'/>";
		xml += "</errorCounterModule>";
		
		return xml;
	}


	@Override
	public void load(Element node, String baseUrl) {
	
		super.load(node, baseUrl);
		NodeList counters = node.getElementsByTagName("counter");
		if(counters.getLength() > 0){
			Element counterElement = (Element)counters.item(0);
			showErrorCounter = XMLUtils.getAttributeAsBoolean(counterElement, "showErrorCounter", true);
			showMistakeCounter = XMLUtils.getAttributeAsBoolean(counterElement, "showMistakeCounter", true);
		}
		
	}
	
	
	public boolean getShowErrorCounter() {
		return showErrorCounter;
	}


	public boolean getShowMistakeCounter() {
		return showMistakeCounter;
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

		};
		
		addProperty(property);	
	}
}
