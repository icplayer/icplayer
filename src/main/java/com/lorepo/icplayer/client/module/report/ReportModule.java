package com.lorepo.icplayer.client.module.report;

import java.util.ArrayList;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.properties.IStaticListProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.choice.SpeechTextsStaticListItem;


public class ReportModule extends BasicModuleModel {

	private String errorsLabel = DictionaryWrapper.get("report_errors");
	private String checksLabel = DictionaryWrapper.get("report_checks");
	private String resultsLabel = DictionaryWrapper.get("report_results");
	private String totalLabel = DictionaryWrapper.get("report_total");
	private ArrayList<SpeechTextsStaticListItem> speechTextItems = new ArrayList<SpeechTextsStaticListItem>();
	private boolean showCounters = true;
	private int pageNameWidth = 0;
	
	
	public ReportModule() {
		super("Report", DictionaryWrapper.get("report_module"));
		
		addErrorsLabel();
		addChecksLabel();
		addResultsLabel();
		addTotalLabel();
		addPropertyShowCounters();
		addPropertyTitleWidth();
		addPropertySpeechTexts();
	}

	
	@Override
	public void load(Element node, String baseUrl) {

		super.load(node, baseUrl);
		
		NodeList labels = node.getElementsByTagName("labels");
		if(labels.getLength() > 0){
			Element labelsElement = (Element)labels.item(0);
			showCounters = XMLUtils.getAttributeAsBoolean(labelsElement, "showCounters", true);
			pageNameWidth = XMLUtils.getAttributeAsInt(labelsElement, "pageNameWidth");
			this.speechTextItems.get(0).setText(XMLUtils.getAttributeAsString(labelsElement, "resultsWCAG"));
			this.speechTextItems.get(1).setText(XMLUtils.getAttributeAsString(labelsElement, "percentWCAG"));
			this.speechTextItems.get(2).setText(XMLUtils.getAttributeAsString(labelsElement, "checksWCAG"));
			this.speechTextItems.get(3).setText(XMLUtils.getAttributeAsString(labelsElement, "errorsWCAG"));
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
		
		xml = "<reportModule " + getBaseXML() + ">" + getLayoutXML();
		xml += "<labels showCounters='" + showCounters + 
				"' pageNameWidth='" + pageNameWidth + 
				"' resultsWCAG='" + this.speechTextItems.get(0).getText() +
				"' percentWCAG='" + this.speechTextItems.get(1).getText() +
				"' checksWCAG='" + this.speechTextItems.get(2).getText() +
				"' errorsWCAG='" + this.speechTextItems.get(3).getText() +
				"'>";
		
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

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("report_error_label");
			}

			@Override
			public boolean isDefault() {
				return false;
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

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("report_checks_label");
			}

			@Override
			public boolean isDefault() {
				return false;
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

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("report_results_label");
			}

			@Override
			public boolean isDefault() {
				return false;
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

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("report_total_label");
			}

			@Override
			public boolean isDefault() {
				return false;
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

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("showCounters");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};
		
		addProperty(property);
	}

	
	private void addPropertyTitleWidth() {
		
IProperty property = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				pageNameWidth = Integer.parseInt(newValue);
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return Integer.toString(pageNameWidth);
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("report_title_width");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("report_title_width");
			}

			@Override
			public boolean isDefault() {
				return false;
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
	
	public int getPageNameWidth(){
		return pageNameWidth;
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
				speechTextItems.add(new SpeechTextsStaticListItem("results_for"));
				speechTextItems.add(new SpeechTextsStaticListItem("percentage_result"));
				speechTextItems.add(new SpeechTextsStaticListItem("number_of_checks"));
				speechTextItems.add(new SpeechTextsStaticListItem("number_of_errors"));
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
	
	public String getSpeechTextItem (int index) {
		if (index < 0 || index >= this.speechTextItems.size()) {
			return "";
		}
		
		final String text = this.speechTextItems.get(index).getText();
		if (text.isEmpty()) {
			if (index == 0) {
				return "results for";
			}
			
			if (index == 1) {
				return "percentage result";
			}
			
			if (index == 2) {
				return "number of checks";
			}
			
			if (index == 3) {
				return "number of errors and mistakes";
			}
			
			
			return "";
		}
		
		return text;
	}
}
