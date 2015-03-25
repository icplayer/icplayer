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
	private String additionalClasses = "";
	
	public ButtonModule() {
		super(DictionaryWrapper.get("button_module"));
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
		}
		else if(type == ButtonType.gotoPage) {
			addPropertyPage();
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
