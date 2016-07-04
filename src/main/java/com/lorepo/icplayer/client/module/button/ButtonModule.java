package com.lorepo.icplayer.client.module.button;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IEventProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.ITextProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;


public class ButtonModule extends BasicModuleModel {

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
	
	public ButtonModule() {
		super("Button", DictionaryWrapper.get("button_module"));
		addPropertyTitle();
	}

	String getAdditionalClasses() {
		return additionalClasses;
	}
	
	@Override
	public void load(Element node, String baseUrl) {

		super.load(node, baseUrl);
		
		NodeList nodes = node.getChildNodes();
		for(int i = 0; i < nodes.getLength(); i++) {
			
			Node childNode = nodes.item(i);
			if(childNode instanceof Element) {
				if(childNode.getNodeName().compareTo("button") == 0 && childNode instanceof Element) {
					Element childElement = (Element) childNode;
					text = childElement.getAttribute("text");
					setType(childElement.getAttribute("type"));
					onClick = childElement.getAttribute("onclick");
					additionalClasses = childElement.getAttribute("additionalClasses");
					pageIndex = childElement.getAttribute("pageIndex");
					popupTopPosition = childElement.getAttribute("popupTopPosition");
					popupLeftPosition = childElement.getAttribute("popupLeftPosition");
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
		String encodedText = StringUtils.escapeHTML(text);
		String xml = 
				"<buttonModule " + getBaseXML() + ">" + getLayoutXML() + 
				"<button type='" + type + "' text='" + encodedText + "'";
		
		xml += " onclick='" + StringUtils.escapeXML(onClick) + "'";

		if (type == ButtonType.popup) {
			xml += " additionalClasses='" + StringUtils.escapeXML(additionalClasses) + "'";
			xml += " popupLeftPosition='" + StringUtils.escapeXML(popupLeftPosition) + "'";
			xml += " popupTopPosition='" + StringUtils.escapeXML(popupTopPosition) + "'";
		}
		if (type == ButtonType.gotoPage) {
			xml += " pageIndex='" + StringUtils.escapeXML(pageIndex) + "'";
		}
		
		xml += "/></buttonModule>";

		return xml;
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

}
