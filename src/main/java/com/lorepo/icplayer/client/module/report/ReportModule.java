package com.lorepo.icplayer.client.module.report;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;


/**
 * Moduł raportu lekcji
 * 
 * @author Krzysztof Langner
 *
 */
public class ReportModule extends BasicModuleModel {

	private String errorsLabel = DictionaryWrapper.get("report_errors");
	private String checksLabel = DictionaryWrapper.get("report_checks");
	private String resultsLabel = DictionaryWrapper.get("report_results");
	private String totalLabel = DictionaryWrapper.get("report_total");
	private boolean showCounters = true;
	
	
	public ReportModule() {
		super(DictionaryWrapper.get("report_module"));
		
		addErrorsLabel();
		addChecksLabel();
		addResultsLabel();
		addTotalLabel();
		addPropertyShowCounters();
	}

	
	@Override
	public void load(Element node, String baseUrl) {

		super.load(node, baseUrl);
		
		NodeList labels = node.getElementsByTagName("labels");
		if(labels.getLength() > 0){
			Element choice = (Element)labels.item(0);
			showCounters = XMLUtils.getAttributeAsBoolean(choice, "showCounters", true);
		}
		
		NodeList labelNodes = node.getElementsByTagName("label");
		for(int i = 0; i < labelNodes.getLength(); i++){

			Element element = (Element)labelNodes.item(i);
			String labelName = XMLUtils.getAttributeAsString(element, "name");
			String labelValue = XMLUtils.getAttributeAsString(element, "value");
			
			if(labelName.compareTo("ErrorCount") == 0){
				errorsLabel = labelValue;
			}
			else if(labelName.compareTo("CheckCount") == 0){
				checksLabel = labelValue;
			}
			else if(labelName.compareTo("Results") == 0){
				resultsLabel = labelValue;
			}
			else if(labelName.compareTo("Total") == 0){
				totalLabel = labelValue;
			}
			
		}
	}
	
	
	@Override
	public String toXML() {
		
		String xml; 
		
		xml = "<reportModule " + getBaseXML() + ">";
		xml += "<labels showCounters='" + showCounters + "'>";
		
		xml += "<label name='ErrorCount' value='" + StringUtils.escapeHTML(errorsLabel) +"'/>";
		xml += "<label name='CheckCount' value='" + StringUtils.escapeHTML(checksLabel) +"'/>";
		xml += "<label name='Results' value='" + StringUtils.escapeHTML(resultsLabel) +"'/>";
		xml += "<label name='Total' value='" + StringUtils.escapeHTML(totalLabel) +"'/>";
		
		xml += "</labels>";
		xml += "</reportModule>";
		
		return xml;
	}

	private void addErrorsLabel() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				errorsLabel = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return errorsLabel;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("report_error_label");
			}
		};
		
		addProperty(property);
	}


	private void addChecksLabel() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				checksLabel = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return checksLabel;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("report_checks_label");
			}
		};
		
		addProperty(property);
	}


	private void addResultsLabel() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				resultsLabel = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return resultsLabel;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("report_results_label");
			}
		};
		
		addProperty(property);
	}


	private void addTotalLabel() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				totalLabel = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return totalLabel;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("report_total_label");
			}
		};
		
		addProperty(property);
	}

	
	private void addPropertyShowCounters() {

		IProperty property = new IBooleanProperty() {
				
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if(value != showCounters){
					showCounters = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(showCounters){
					return "True";
				}
				else{
					return "False";
				}
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("showCounters");
			}

		};
		
		addProperty(property);
	}


	public String getErrorsLabel(){
		return errorsLabel;
	}

	
	public String getChecksLabel(){
		return checksLabel;
	}

	
	public String getResultLabel(){
		return resultsLabel;
	}

	
	public String getTotalLabel(){
		return totalLabel;
	}
	
	
	public boolean isShowCounters(){
		return showCounters;
	}
}
