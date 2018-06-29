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
import com.lorepo.icplayer.client.module.IWCAGModuleModel;
import com.lorepo.icplayer.client.module.choice.SpeechTextsStaticListItem;


public class ReportModule extends BasicModuleModel implements IWCAGModuleModel {

	final public static int resultsWCAGIndex = 0;
	final public static int percentWCAGIndex = 1;
	final public static int checksWCAGIndex = 2;
	final public static int errorsWCAGIndex = 3;
	final public static int totalWCAGIndex = 4;
	final public static int outOfWCAGIndex = 5;
	
	private String errorsLabel = DictionaryWrapper.get("report_errors");
	private String checksLabel = DictionaryWrapper.get("report_checks");
	private String resultsLabel = DictionaryWrapper.get("report_results");
	private String totalLabel = DictionaryWrapper.get("report_total");
	private String langAttribute = "";
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
		addPropertyLangAttribute();
	}


	@Override
	protected void parseModuleNode(Element node) {
		NodeList labels = node.getElementsByTagName("labels");
		if(labels.getLength() > 0){
			Element labelsElement = (Element)labels.item(0);
			showCounters = XMLUtils.getAttributeAsBoolean(labelsElement, "showCounters", true);
			pageNameWidth = XMLUtils.getAttributeAsInt(labelsElement, "pageNameWidth");
			this.speechTextItems.get(resultsWCAGIndex).setText(XMLUtils.getAttributeAsString(labelsElement, "resultsWCAG"));
			this.speechTextItems.get(percentWCAGIndex).setText(XMLUtils.getAttributeAsString(labelsElement, "percentWCAG"));
			this.speechTextItems.get(checksWCAGIndex).setText(XMLUtils.getAttributeAsString(labelsElement, "checksWCAG"));
			this.speechTextItems.get(errorsWCAGIndex).setText(XMLUtils.getAttributeAsString(labelsElement, "errorsWCAG"));
			this.speechTextItems.get(totalWCAGIndex).setText(XMLUtils.getAttributeAsString(labelsElement, "totalWCAG"));
			this.speechTextItems.get(outOfWCAGIndex).setText(XMLUtils.getAttributeAsString(labelsElement, "outOfWCAG"));
		}
		
		NodeList labelNodes = node.getElementsByTagName("label");
		for(int i = 0; i < labelNodes.getLength(); i++){

			Element element = (Element)labelNodes.item(i);
			String labelName = XMLUtils.getAttributeAsString(element, "name");
			String labelValue = StringUtils.unescapeXML(XMLUtils.getAttributeAsString(element, "value"));
			
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
			else if(labelName.compareTo("lang") == 0){
				langAttribute = labelValue;
			}
			
		}
	}
	
	@Override
	public String toXML() {
		Element reportModule = XMLUtils.createElement("reportModule");
		
		this.setBaseXMLAttributes(reportModule);
		reportModule.appendChild(this.getLayoutsXML());
		
		Element labels = XMLUtils.createElement("labels");
		XMLUtils.setBooleanAttribute(labels, "showCounters", showCounters);
		XMLUtils.setIntegerAttribute(labels, "pageNameWidth", pageNameWidth);
		labels.setAttribute("resultsWCAG", this.speechTextItems.get(resultsWCAGIndex).getText());
		labels.setAttribute("percentWCAG", this.speechTextItems.get(percentWCAGIndex).getText());
		labels.setAttribute("checksWCAG", this.speechTextItems.get(checksWCAGIndex).getText());
		labels.setAttribute("errorsWCAG", this.speechTextItems.get(errorsWCAGIndex).getText());
		labels.setAttribute("totalWCAG", this.speechTextItems.get(totalWCAGIndex).getText());
		labels.setAttribute("outOfWCAG", this.speechTextItems.get(outOfWCAGIndex).getText());

		labels.appendChild(this.createLabel("ErrorCount", errorsLabel));
		labels.appendChild(this.createLabel("CheckCount", checksLabel));
		labels.appendChild(this.createLabel("Results", resultsLabel));
		labels.appendChild(this.createLabel("Total", totalLabel));
		labels.appendChild(this.createLabel("lang", langAttribute));
		
		reportModule.appendChild(labels);
		return reportModule.toString();
	}
	
	private Element createLabel(String name, String value) {
		Element label = XMLUtils.createElement("label");
		label.setAttribute("name", name);
		label.setAttribute("value", StringUtils.escapeHTML(value));
		
		return label;
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
				speechTextItems.add(new SpeechTextsStaticListItem("total","report"));
				speechTextItems.add(new SpeechTextsStaticListItem("out_of","report"));
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
			if (index == resultsWCAGIndex) {
				return "results for";
			}
			
			if (index == percentWCAGIndex) {
				return "percentage result";
			}
			
			if (index == checksWCAGIndex) {
				return "number of checks";
			}
			
			if (index == errorsWCAGIndex) {
				return "number of errors and mistakes";
			}
			
			if (index == totalWCAGIndex) {
				return "total";
			}
			
			if (index == outOfWCAGIndex) {
				return "out of";
			}
			
			
			return "";
		}
		
		return text;
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
	
	public String getLangAttribute () {
		return this.langAttribute;
	}
}
