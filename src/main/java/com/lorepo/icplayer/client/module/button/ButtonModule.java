package com.lorepo.icplayer.client.module.button;

import java.util.ArrayList;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IEventProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.properties.IStaticListProperty;
import com.lorepo.icf.properties.ITextProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IWCAGModuleModel;
import com.lorepo.icplayer.client.module.checkbutton.CheckButtonModule;
import com.lorepo.icplayer.client.module.choice.SpeechTextsStaticListItem;


public class ButtonModule extends BasicModuleModel implements IWCAGModuleModel {
	
	public static final int RESET_BUTTON_RESET_INDEX = 0;
	public static final int RESET_BUTTON_SKIP_RESET_INDEX = 1;

	public enum ButtonType {
		standard,
		nextPage,
		prevPage,
		checkAnswers,
		reset,
		sendResults,
		popup,
		cancel, 
		gotoPage,
	}
	
	private ButtonType type = ButtonType.nextPage;
	private String text = "";
	private String onClick;
	private String pageIndex;
	private String additionalClasses = "";
	private String popupTopPosition = "";
	private String popupLeftPosition = "";
	private boolean confirmReset = false;
	private boolean resetOnlyWrong = false;
	private String confirmInfo = "";
	private String confirmYesInfo = "";
	private String confirmNoInfo = "";
	private boolean goToLastVisitedPage = false;
	private ArrayList<SpeechTextsStaticListItem> resetSpeechTextItems = new ArrayList<SpeechTextsStaticListItem>();
	private IStaticListProperty resetSpeechTextProperty = null;
	
	public ButtonModule() {
		super("Button", DictionaryWrapper.get("button_module"));
		addPropertyTitle();
		initializeResetSpeechTexts();
	}

	String getAdditionalClasses() {
		return additionalClasses;
	}
	
	protected void parseModuleNode(Element node) {
		NodeList nodes = node.getChildNodes();
		for(int i = 0; i < nodes.getLength(); i++) {
			
			Node childNode = nodes.item(i);
			if(childNode instanceof Element) {
				if(childNode.getNodeName().compareTo("button") == 0 && childNode instanceof Element) {
					Element childElement = (Element) childNode;
					text = StringUtils.unescapeXML(childElement.getAttribute("text"));
					setType(childElement.getAttribute("type"));
					onClick = StringUtils.unescapeXML(childElement.getAttribute("onclick"));
					additionalClasses = StringUtils.unescapeXML(childElement.getAttribute("additionalClasses"));
					pageIndex = StringUtils.unescapeXML(childElement.getAttribute("pageIndex"));
					popupTopPosition = StringUtils.unescapeXML(childElement.getAttribute("popupTopPosition"));
					popupLeftPosition = StringUtils.unescapeXML(childElement.getAttribute("popupLeftPosition"));
					confirmReset = XMLUtils.getAttributeAsBoolean(childElement, "confirmReset", false);
					confirmInfo = StringUtils.unescapeXML(childElement.getAttribute("confirmInfo"));
					confirmYesInfo = StringUtils.unescapeXML(childElement.getAttribute("confirmYesInfo"));
					confirmNoInfo = StringUtils.unescapeXML(childElement.getAttribute("confirmNoInfo"));
					resetOnlyWrong = XMLUtils.getAttributeAsBoolean(childElement, "resetOnlyWrong", false);
					goToLastVisitedPage = XMLUtils.getAttributeAsBoolean(childElement, "goToLastVisitedPage", false);
					if (type == ButtonType.reset) {
						this.resetSpeechTextItems.get(ButtonModule.RESET_BUTTON_RESET_INDEX).setText(StringUtils.unescapeXML(XMLUtils.getAttributeAsString(childElement, "resetReset")));
						this.resetSpeechTextItems.get(ButtonModule.RESET_BUTTON_SKIP_RESET_INDEX).setText(StringUtils.unescapeXML(XMLUtils.getAttributeAsString(childElement, "resetSkipReset")));
					}
				}
			}
		}
		
		addPropertiesFromType();
	}

	/**
	 * Get on click event code
	 * @return
	 */
	public String getOnClick() {
		return onClick == null ? "" : onClick;
	}

	@Override
	public String toXML() {
		Element buttonModule = XMLUtils.createElement("buttonModule");
		this.setBaseXMLAttributes(buttonModule);
		
		String encodedText = StringUtils.escapeHTML(text);
		buttonModule.appendChild(this.getLayoutsXML());
		
		Element button = XMLUtils.createElement("button");
		button.setAttribute("onclick", StringUtils.escapeXML(onClick));
		button.setAttribute("type", type.toString());
		button.setAttribute("text", encodedText);

		if (type == ButtonType.popup) {
			button.setAttribute("additionalClasses", StringUtils.escapeXML(additionalClasses));
			button.setAttribute("popupLeftPosition", StringUtils.escapeXML(popupLeftPosition));
			button.setAttribute("popupTopPosition", StringUtils.escapeXML(popupTopPosition));
		}
		
		if (type == ButtonType.gotoPage) {
			button.setAttribute("pageIndex", StringUtils.escapeXML(pageIndex));
		}
		
		if (type == ButtonType.reset) {
			button.setAttribute("resetOnlyWrong", Boolean.toString(resetOnlyWrong));
			button.setAttribute("confirmReset", Boolean.toString(confirmReset));
			button.setAttribute("confirmInfo", StringUtils.escapeXML(confirmInfo));
			button.setAttribute("confirmYesInfo", StringUtils.escapeXML(confirmYesInfo));
			button.setAttribute("confirmNoInfo", StringUtils.escapeXML(confirmNoInfo));
			button.setAttribute("resetReset", StringUtils.escapeXML(this.resetSpeechTextItems.get(ButtonModule.RESET_BUTTON_RESET_INDEX).getText()));
			button.setAttribute("resetSkipReset", StringUtils.escapeXML(this.resetSpeechTextItems.get(ButtonModule.RESET_BUTTON_SKIP_RESET_INDEX).getText()));
		}
		if (type == ButtonType.prevPage) {
			XMLUtils.setBooleanAttribute(button, "goToLastVisitedPage", this.goToLastVisitedPage);
		}
		
		buttonModule.appendChild(button);
		
		return buttonModule.toString();
	}

	/**
	 * Set button type based on given string
	 * 
	 * @param typeName
	 */
	protected void setType(String typeName) {
		for(ButtonType bt : ButtonType.values()){
			if(bt.toString().compareTo(typeName) == 0){
				type = bt;
			}
		}
	}

	public String getText() {
		return text;
	}

	public ButtonType getType() {
		return type;
	}

	public void setText(String html) {
		text = html;
	}

	public void setType(ButtonType newType) {
		type = newType;
		addPropertiesFromType();
	}

	private void addPropertiesFromType() {
		if(type == ButtonType.popup) {
			addPropertyPage();
			addPropertyAdditionalClasses();
			addPropertyPopupTopPosition();
			addPropertyPopupLeftPosition();
		}
		else if(type == ButtonType.gotoPage) {
			addPropertyPage();
			addPropertyPageIndex();
		} 
		else if(type == ButtonType.standard) {
			addPropertyOnClick();
		}
		else if(type == ButtonType.reset) {
			addPropertyResetOnlyWrong();
			addPropertyConfirmReset();
			addPropertyConfirmInfo();
			addPropertyConfirmYesInfo();
			addPropertyConfirmNoInfo();
			addPropertyResetSpeechTexts();
		}
		else if(type == ButtonType.prevPage){
			this.addGoToLastPageProperty();
		}
	}

	private void addGoToLastPageProperty(){
		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value!= goToLastVisitedPage) {
					goToLastVisitedPage = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				return goToLastVisitedPage ? "True" : "False";
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("prev_property_go_to_last_visited_page");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("prev_property_go_to_last_visited_page");
			}

			@Override
			public boolean isDefault() {
				return false;
			}	
		};
		
		this.addProperty(property);
	}

	private void addPropertyTitle() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				text = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return text;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("title");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("title");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}

	private void addPropertyPage() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				onClick = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return onClick;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("page");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("page");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	public String getPageIndex() {
		return pageIndex == null ? "" : pageIndex;
	}

	
	private void addPropertyPageIndex() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				pageIndex = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return pageIndex;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("page_index");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("page_index");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	public String getPopupTopPosition() {
		return popupTopPosition;
	}
	
	public String getPopupLeftPosition() {
		return popupLeftPosition;
	}
	
	private void addPropertyPopupTopPosition() {
		
		IProperty property = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				popupTopPosition = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return popupTopPosition;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("popup_top_position");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("popup_top_position");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyPopupLeftPosition() {
		
		IProperty property = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				popupLeftPosition = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return popupLeftPosition;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("popup_left_position");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("popup_left_position");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyAdditionalClasses() {
		
		ITextProperty property = new ITextProperty() {
			
			@Override
			public void setValue(String newValue) {
				additionalClasses = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return additionalClasses;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("additional_classes");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("additional_classes");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyConfirmInfo() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				confirmInfo = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return confirmInfo;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("reset_property_confirm_info");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("reset_property_confirm_info");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyConfirmYesInfo() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				confirmYesInfo = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return confirmYesInfo;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("reset_property_confirm_yes");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("reset_property_confirm_yes");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyConfirmNoInfo() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				confirmNoInfo = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return confirmNoInfo;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("reset_property_confirm_no");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("reset_property_confirm_no");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyResetOnlyWrong() {
		IProperty property = new IBooleanProperty() {
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value!= resetOnlyWrong) {
					resetOnlyWrong = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				return resetOnlyWrong ? "True" : "False";
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("reset_property_reset_only_wrong");
			}
			
			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("reset_property_reset_only_wrong");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyConfirmReset() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value!= confirmReset) {
					confirmReset = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return confirmReset ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("reset_property_confirm_reset");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("reset_property_confirm_reset");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}
	
	public String getConfirmInfo() {
		return confirmInfo;
	}
	
	public String getConfirmYesInfo() {
		return confirmYesInfo;
	}
	
	public String getConfirmNoInfo() {
		return confirmNoInfo;
	}
	
	public boolean getConfirmReset() {
		return confirmReset;
	}
	
	public boolean getGoToLastPage(){
		return this.goToLastVisitedPage;
	}
	
	public boolean getResetOnlyWrong() {
		return this.resetOnlyWrong;
	}
	
	private void addPropertyOnClick() {

		IProperty property = new IEventProperty() {
				
			@Override
			public void setValue(String newValue) {
				onClick = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return onClick == null ? "" : onClick;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("on_click");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("on_click");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	

	@Override
	public String getProviderName() {
		
		String name = "";
		
		if(type == ButtonType.standard){
			name = DictionaryWrapper.get("standard");
		}
		else if(type == ButtonType.nextPage){
			name = DictionaryWrapper.get("next_page_button");
		} 
		else if(type == ButtonType.prevPage){
			name = DictionaryWrapper.get("previous_page_button");
		}
		else if(type == ButtonType.checkAnswers){
			name = DictionaryWrapper.get("check_answers_button");
		}
		else if(type == ButtonType.reset){
			name = DictionaryWrapper.get("reset_button");
		}
		else if(type == ButtonType.sendResults){
			name = DictionaryWrapper.get("send_results_button");
		}
		else if(type == ButtonType.popup){
			name = DictionaryWrapper.get("open_popup_button");
		}
		else if(type == ButtonType.cancel){
			name = DictionaryWrapper.get("close_popup_button");
		}
		else if(type == ButtonType.gotoPage){
			name = DictionaryWrapper.get("go_to_page_button");
		}
		
		return name + " " + super.getProviderName();
	}
	
	@Override
	public String getClassNamePrefix() {
		return getType().toString();
	}
	
	private void initializeResetSpeechTexts() {
		resetSpeechTextProperty = new IStaticListProperty() {
			@Override
			public String getName() {
				return DictionaryWrapper.get("choice_speech_texts");
			}

			@Override
			public String getValue() {
				return Integer.toString(resetSpeechTextItems.size());
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
				return resetSpeechTextItems.size();
			}

			@Override
			public void addChildren(int count) {
				resetSpeechTextItems.add(new SpeechTextsStaticListItem("reset","reset_button"));
				resetSpeechTextItems.add(new SpeechTextsStaticListItem("skip_reset","reset_button"));
			}

			@Override
			public IPropertyProvider getChild(int index) {
				return resetSpeechTextItems.get(index);
			}

			@Override
			public void moveChildUp(int index) {
			}

			@Override
			public void moveChildDown(int index) {
			}

		};
		resetSpeechTextProperty.addChildren(2);
	}
	
	private void addPropertyResetSpeechTexts(){
		if(resetSpeechTextProperty == null) {
		    initializeResetSpeechTexts();
		}
		addProperty(resetSpeechTextProperty);
	}
	
	public String getResetSpeechTextItem (int index) {
		if (index < 0 || index >= this.resetSpeechTextItems.size()) {
			return "";
		}
		
		final String text = this.resetSpeechTextItems.get(index).getText();
		if (text.isEmpty()) {
			if (index == ButtonModule.RESET_BUTTON_RESET_INDEX) {
				return "Page has been reset";
			} else if (index == ButtonModule.RESET_BUTTON_SKIP_RESET_INDEX) {
				return "Page has not been reset";
			}
			
			return "";
		}
		
		return text;
	}

	public static String[] getWCAGButtonTitles() {
		return new String[]{"close popup", "open popup", "reset page", "go to page", "next page", "previous page"};
	}

	public String getWCAGButtonTitle() {
		switch (type) {
			case nextPage:
				return "next page";
			case prevPage:
				return "previous page";
			case gotoPage:
				return "go to page";
			case popup:
				return "open popup";
			case cancel:
				return "close popup";
			case reset:
				return "reset page";
		}
		return "";
	}

}
