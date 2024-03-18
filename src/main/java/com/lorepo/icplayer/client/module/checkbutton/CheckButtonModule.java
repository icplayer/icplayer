package com.lorepo.icplayer.client.module.checkbutton;

import java.util.ArrayList;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
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

public class CheckButtonModule extends BasicModuleModel implements IWCAGModuleModel {

	private String checkTitle = "";
	private String unCheckTitle = "";
	private String title = "";
	private ArrayList<SpeechTextsStaticListItem> speechTextItems = new ArrayList<SpeechTextsStaticListItem>();
	private boolean disableScoreUpdate = false;
	
	public static final int SELECTED_INDEX = 0;
	public static final int CORRECT_INDEX = 1;
	public static final int WRONG_INDEX = 2;
	public static final int RESULT_INDEX = 3;
	public static final int EDIT_BLOCK_INDEX = 4;
	public static final int NO_EDIT_BLOCK_INDEX = 5;
	
	public CheckButtonModule() {
		super("Check Button", DictionaryWrapper.get("check_answers_button"));
		addPropertyCheckTitle();
		addPropertyUnCheckTitle();
		addPropertySpeechTexts();
		addPropertyDisableScoreUpdate();
	}
	
	protected void parseModuleNode(Element node) {
		NodeList nodes = node.getChildNodes();
		for (int i = 0; i < nodes.getLength(); i++) {
			
			Node childNode = nodes.item(i);
			if (childNode instanceof Element) {
				if(childNode.getNodeName().compareTo("button") == 0 && childNode instanceof Element) {
					Element childElement = (Element) childNode;
					
					title = StringUtils.unescapeXML(XMLUtils.getAttributeAsString(childElement, "text"));
					checkTitle = StringUtils.unescapeXML(XMLUtils.getAttributeAsString(childElement, "checkTitle"));
					unCheckTitle = StringUtils.unescapeXML(XMLUtils.getAttributeAsString(childElement, "unCheckTitle"));
					this.speechTextItems.get(CheckButtonModule.SELECTED_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "selected"));
					this.speechTextItems.get(CheckButtonModule.CORRECT_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "correct"));
					this.speechTextItems.get(CheckButtonModule.WRONG_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "wrong"));
					this.speechTextItems.get(CheckButtonModule.RESULT_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "percentage_result"));
					this.speechTextItems.get(CheckButtonModule.EDIT_BLOCK_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "edit_block"));
					this.speechTextItems.get(CheckButtonModule.NO_EDIT_BLOCK_INDEX).setText(XMLUtils.getAttributeAsString(childElement, "no_edit_block"));
					disableScoreUpdate = XMLUtils.getAttributeAsBoolean(childElement, "disableScoreUpdate", false);
					if (!title.equals("")) {
						checkTitle = title;
						unCheckTitle = title;
					}
				}
			}
		}
	}

	
	@Override
	public String toXML() {
		Element checkModule = XMLUtils.createElement("checkModule");
		this.setBaseXMLAttributes(checkModule);
		checkModule.appendChild(this.getLayoutsXML());
		
		String encodedCheck = StringUtils.escapeHTML(checkTitle);
		String encodedUnCheck = StringUtils.escapeHTML(unCheckTitle);
		
		Element button = XMLUtils.createElement("button");
		button.setAttribute("checkTitle", encodedCheck);
		button.setAttribute("unCheckTitle", encodedUnCheck);
		button.setAttribute("selected", this.speechTextItems.get(CheckButtonModule.SELECTED_INDEX).getText());
		button.setAttribute("correct", this.speechTextItems.get(CheckButtonModule.CORRECT_INDEX).getText());
		button.setAttribute("wrong", this.speechTextItems.get(CheckButtonModule.WRONG_INDEX).getText());
		button.setAttribute("percentage_result", this.speechTextItems.get(CheckButtonModule.RESULT_INDEX).getText());
		button.setAttribute("edit_block", this.speechTextItems.get(CheckButtonModule.EDIT_BLOCK_INDEX).getText());
		button.setAttribute("no_edit_block", this.speechTextItems.get(CheckButtonModule.NO_EDIT_BLOCK_INDEX).getText());
		button.setAttribute("disableScoreUpdate", Boolean.toString(disableScoreUpdate));
		checkModule.appendChild(button);
		
		return checkModule.toString();
	}

	public String getCheckTitle() {
		return checkTitle;
	}

	public String getUnCheckTitle() {
		return unCheckTitle;
	}

	public void setCheckTitle(String html) {
		checkTitle = html;
	}

	public void setUnCheckTitle(String html) {
		unCheckTitle = html;
	}

	private void addPropertyCheckTitle() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				checkTitle = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return checkTitle;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("check_title");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("check_title");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}

	private void addPropertyUnCheckTitle() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				unCheckTitle = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return unCheckTitle;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("uncheck_title");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("uncheck_title");
			}

			@Override
			public boolean isDefault() {
				return false;
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
				speechTextItems.add(new SpeechTextsStaticListItem("correct"));
				speechTextItems.add(new SpeechTextsStaticListItem("wrong"));
				speechTextItems.add(new SpeechTextsStaticListItem("percentage_result"));
				speechTextItems.add(new SpeechTextsStaticListItem("edit_block","check_answers_button"));
				speechTextItems.add(new SpeechTextsStaticListItem("no_edit_block","check_answers_button"));
			}

			@Override
			public IPropertyProvider getChild(int index) {
				return speechTextItems.get(index);
			}

			@Override
			public void moveChildUp(int index) {}

			@Override
			public void moveChildDown(int index) {}

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
			if (index == CheckButtonModule.SELECTED_INDEX) {
				return "selected";
			}
			
			if (index == CheckButtonModule.CORRECT_INDEX) {
				return "correct";
			}
			
			if (index == CheckButtonModule.WRONG_INDEX) {
				return "wrong";
			}
			
			if (index == CheckButtonModule.RESULT_INDEX) {
				return "percentage result";
			}
			
			if (index == CheckButtonModule.EDIT_BLOCK_INDEX) {
				return "Page is blocked for edition";
			}
			
			if (index == CheckButtonModule.NO_EDIT_BLOCK_INDEX) {
				return "Page is not blocked for edition";
			}
			
			return "";
		}
		
		return text;
	}

	private void addPropertyDisableScoreUpdate() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != disableScoreUpdate) {
					disableScoreUpdate = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return disableScoreUpdate ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("check_answers_disable_score_update");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("check_answers_disable_score_update");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	public boolean getDisableScoreUpdate () {return disableScoreUpdate;}
}
