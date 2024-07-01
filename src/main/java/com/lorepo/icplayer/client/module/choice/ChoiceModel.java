package com.lorepo.icplayer.client.module.choice;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IEnumSetProperty;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyListener;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.properties.IStaticListProperty;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.content.services.JsonServices;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IWCAGModuleModel;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.printable.IPrintableModuleModel;
import com.lorepo.icplayer.client.printable.Printable;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.PrintableController;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;

public class ChoiceModel extends BasicModuleModel implements IWCAGModuleModel, IPrintableModuleModel{

	private boolean isMulti = false;
	private ArrayList<ChoiceOption>	options = new ArrayList<ChoiceOption>();	
	private IListProperty optionsProperty;
	private int maxScore = 0;
	private boolean isDisabled = false;
	private boolean isActivity = true;
	private boolean randomOrder = false;
	private boolean isHorizontal = false;
	private String langAttribute = "";
	private ArrayList<SpeechTextsStaticListItem> speechTextItems = new ArrayList<SpeechTextsStaticListItem>();
	private String printableValue = "";
	private PrintableController printableController = null;
	private HashMap<String, String> printableState = null;
	
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
		addPropertyLangAttribute();
		addPropertySpeechTexts();
		addPropertyPrintable();
	}
	
	public void addOption(ChoiceOption option) {
		option.setParentId(getId());
	
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

	public int getCorrectOptionCount() {
		int count = 0;

		for (ChoiceOption option : options) {
			count += option.getValue() > 0 ? 1 : 0;
		}

		return count;
	}
	
	public boolean isMulti() {
		return isMulti;
	}

	@Override
	protected void parseModuleNode(Element node) {
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
			langAttribute = XMLUtils.getAttributeAsString(choice, "langAttribute");
			printableValue = XMLUtils.getAttributeAsString(choice, "printable");
			this.speechTextItems.get(0).setText(XMLUtils.getAttributeAsString(choice, "selected"));
			this.speechTextItems.get(1).setText(XMLUtils.getAttributeAsString(choice, "deselected"));
			this.speechTextItems.get(2).setText(XMLUtils.getAttributeAsString(choice, "correct"));
			this.speechTextItems.get(3).setText(XMLUtils.getAttributeAsString(choice, "incorrect"));
		}
		
		// Read options nodes
		NodeList optionNodes = node.getElementsByTagName("option");
		
		for(int i = 0; i < optionNodes.getLength(); i++){

			Element element = (Element)optionNodes.item(i);
			String optionID = Integer.toString(i+1);
			ChoiceOption option = new ChoiceOption(optionID);
			option.setContentBaseURL(this.getContentBaseURL());
			option.load(element, this.getBaseURL());
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
	public String toXML () {
		Element choiceModule = XMLUtils.createElement("choiceModule");
		
		this.setBaseXMLAttributes(choiceModule);
		choiceModule.appendChild(this.getLayoutsXML());
		
		Element choice = XMLUtils.createElement("choice");
		choice.setAttribute("isMulti", Boolean.toString(isMulti));
		choice.setAttribute("isDisabled", Boolean.toString(isDisabled));
		choice.setAttribute("isActivity", Boolean.toString(isActivity));
		choice.setAttribute("randomOrder", Boolean.toString(randomOrder));
		choice.setAttribute("isHorizontal", Boolean.toString(isHorizontal));
		choice.setAttribute("langAttribute", langAttribute);
		choice.setAttribute("printable", printableValue);
		choice.setAttribute("selected", this.speechTextItems.get(0).getText());
		choice.setAttribute("deselected", this.speechTextItems.get(1).getText());
		choice.setAttribute("correct", this.speechTextItems.get(2).getText());
		choice.setAttribute("incorrect", this.speechTextItems.get(3).getText());
		
		choiceModule.appendChild(choice);
		
		Element optionsElement = XMLUtils.createElement("options");

		for (ChoiceOption option : options) {
			optionsElement.appendChild(option.toXML());
		}
		
		choiceModule.appendChild(optionsElement);
		return choiceModule.toString();
	}
	
	public int calculateMaxScore() {
		int maxScore = 0;

		if(isMulti) {
			for (ChoiceOption option : options) {
				maxScore += option.getValue();
			}
		} else {
			for (ChoiceOption option : options) {
				if(option.getValue() > maxScore) {
					maxScore = option.getValue();
				}
			}
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

			@Override
			public void moveChild(int prevIndex, int nextIndex) {
				moveItem(prevIndex, nextIndex);
				sendPropertyChangedEvent(this);
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

	private void moveItem(int prevIndex, int nextIndex) {
		ChoiceOption item = options.remove(prevIndex);
		options.add(nextIndex, item);
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
				speechTextItems.add(new SpeechTextsStaticListItem("correct"));
				speechTextItems.add(new SpeechTextsStaticListItem("incorrect"));
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
	
	public String getSpeechTextItem(int index) {
		return this.speechTextItems.get(index).getText();
	}
	
	public String getLangAttribute() {
		return langAttribute;
	}
	
	private void addPropertyPrintable() {
		IProperty property = new IEnumSetProperty() {

			@Override
			public void setValue(String newValue) {	
				printableValue = newValue;
			}

			@Override
			public String getValue() {
				return printableValue;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get(Printable.NAME_LABEL);
			}

			@Override
			public int getAllowedValueCount() {
				return 3;
			}

			@Override
			public String getAllowedValue(int index) {
				return Printable.getStringValues(index);
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(Printable.NAME_LABEL);
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}
	
	public PrintableMode getPrintable() {
		return Printable.getPrintableModeFromString(printableValue);
	}

	@Override
	public String getPrintableHTML(boolean showAnswers) {
		ChoicePrintable printable = new ChoicePrintable(this, printableController);
		String className = this.getStyleClass();
		String result = printable.getPrintableHTML(className, showAnswers);
		return result;
	}

	@Override
	public PrintableMode getPrintableMode() {
		return getPrintable();
	}

	@Override
	public boolean isSection() {
		return false;
	}

	@Override
	public JavaScriptObject getPrintableContext() {
		return null;
	}

	@Override
	public void setPrintableController(PrintableController controller) {
		this.printableController = controller;
	}

	@Override
	public void setPrintableState(String state) {
		if (state.equals(""))
			return;
		IJsonServices jsonServices = new JsonServices();
		this.printableState = jsonServices.decodeHashMap(state);
	}

	@Override
	public boolean isPrintableAsync() {
		return false;
	}

	@Override
	public void setPrintableAsyncCallback(String id, PrintableContentParser.ParsedListener listener) {

	}

	public HashMap<String, String> getPrintableState() {
		return this.printableState;
	}
}
