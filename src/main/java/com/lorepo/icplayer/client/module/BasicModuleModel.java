package com.lorepo.icplayer.client.module;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icf.utils.UUID;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.EnableTabindex;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.INameValidator;

public abstract class BasicModuleModel extends StyledModule implements IModuleModel {
	private String moduleTypeName;
	private String moduleName;
	private String id;
	private boolean isVisible = true;
	private boolean isLocked = false;
	private String baseURL;
	private INameValidator nameValidator;
	private String buttonType;
	private boolean isModuleVisibleInEditor = true;
	private boolean isTabindexEnabled = false;
	
	protected BasicModuleModel(String typeName, String name){
		super(name);
		this.moduleTypeName = typeName;
		this.moduleName = name;
		id = UUID.uuid(6);
		addPropertyId();
		registerPositionProperties();
		addPropertyIsVisible();
		this.addPropertyIsTabindexEnabled();
	}
	
	@Override
	public String getModuleName() {
		return moduleName;
	}
	
	@Override
	public String getModuleTypeName() {
		return moduleTypeName;
	} 
	
	@Override
	public String getClassNamePrefix() {
		return getModuleTypeName();
	};
	
	@Override
	public String getId() {
		return id;
	}

	@Override
	public void setId(String newId) {
		id = newId;
	}
	
	@Override
	public void release() {
	}
	
	/**
	 * Load attributes common to all modules:
	 * - position
	 * - style
	 */
	@Override
	public void load(Element element, String baseUrl) {

		this.baseURL = baseUrl;
		id = element.getAttribute("id");
		if (id == null || id.compareTo("null") == 0) {
			id = UUID.uuid(6);
		} else {
			id = StringUtils.unescapeXML(id);
		}
		
		int left = XMLUtils.getAttributeAsInt(element, "left");
		int top = XMLUtils.getAttributeAsInt(element, "top");
		int width = XMLUtils.getAttributeAsInt(element, "width");
		int height = XMLUtils.getAttributeAsInt(element, "height");
		int right = XMLUtils.getAttributeAsInt(element, "right");
		int bottom = XMLUtils.getAttributeAsInt(element, "bottom");
		isVisible = XMLUtils.getAttributeAsBoolean(element, "isVisible", true);
		isLocked = XMLUtils.getAttributeAsBoolean(element, "isLocked", false);
		isModuleVisibleInEditor = XMLUtils.getAttributeAsBoolean(element, "isModuleVisibleInEditor", true);

		if(EnableTabindex.getInstance().isTabindexEnabled) {
			this.isTabindexEnabled = XMLUtils.getAttributeAsBoolean(element, "isTabindexEnabled", false);
		}
		setLeft(left);
		setTop(top);
		setWidth(width);
		setHeight(height);
		setRight(right);
		setBottom(bottom);
		String style = StringUtils.unescapeXML(element.getAttribute("style"));
		String css = URLUtils.resolveCSSURL(baseURL, style);
		setInlineStyle(css);
		setStyleClass(StringUtils.unescapeXML( element.getAttribute("class") ));
		
		NodeList nodes = element.getChildNodes();
		for(int i = 0; i < nodes.getLength(); i++){
			Node childNode = nodes.item(i);
			
			if(childNode.getNodeName().compareTo("button") == 0 && childNode instanceof Element){
				buttonType = StringUtils.unescapeXML(((Element) childNode).getAttribute("type"));
				setButtonType(buttonType);
			}
			if(childNode.getNodeName().compareTo("layout") == 0 && childNode instanceof Element){
				layout.load((Element) childNode);
			}
		}
	}

	private void setButtonType(String type) {
		this.buttonType = type;
	}

	public String getButtonType() {
		return buttonType;
	}
	
	protected String getBaseXML(){
		
		String escapedId = StringUtils.escapeXML(id);
		String xml = "id='" + escapedId + "' left='" + getLeft() + "' top='" + getTop()  +
				"' width='" + getWidth() + "' height='" + getHeight() + "' " +
				"right='" + getRight() + "' bottom='" + getBottom() + "' " +
				"isVisible='" + isVisible + "' isLocked='" + isLocked +"'" + " isModuleVisibleInEditor='" + isModuleVisibleInEditor +"' " + 
				"isTabindexEnabled='" + isTabindexEnabled + "'";
		
		if (!getInlineStyle().isEmpty()) {
			String encodedStyle = StringUtils.escapeXML(getInlineStyle());
			xml += " style='" + encodedStyle + "'";
		}
		
		if (!getStyleClass().isEmpty()) {
			String encodedStyleClass = StringUtils.escapeXML(getStyleClass());
			xml += " class='" + encodedStyleClass + "'";
		}
		
		return xml;
	}

	protected String getLayoutXML() {
		return layout.toXML();
	}

	private void addPropertyId() {

		IProperty property = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				if (nameValidator != null && nameValidator.canChangeName(newValue)) {
					id = newValue;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				return id;
			}
			
			@Override
			public String getName() {
				return "ID";
			}
			
			public String getDisplayName() {
				return "ID";
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}

	private void addPropertyIsVisible() {
		IProperty property = new IBooleanProperty() {
			
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if (value != isVisible) {
					isVisible = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				return isVisible ? "True" : "False";
			}
			
			@Override
			public String getName() {
				return "Is Visible";
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("is_visible");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};
		
		addProperty(property);
	}
	
	private void addPropertyIsTabindexEnabled() {
		IProperty property = new IBooleanProperty() {
			
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if (value != isTabindexEnabled) {
					isTabindexEnabled = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				return isTabindexEnabled ? "True" : "False";
			}
			
			@Override
			public String getName() {
				return "Is Tabindex Enabled";
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("is_tabindex_enabled");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};
		
		addProperty(property);
	}
	
	public boolean isVisible() {
		return isVisible;
	}

	public void lock(boolean state) {
		isLocked = state;
	}
	
	public boolean isLocked() {
		return isLocked;
	}
	
	public String getBaseURL() {
		return baseURL;
	}
	
	public boolean isModuleInEditorVisible() {
		return this.isModuleVisibleInEditor;
	}
	
	public void setModuleInEditorVisibility(boolean moduleInEditorVisibility) {
		this.isModuleVisibleInEditor = moduleInEditorVisibility;
	}
	
	@Override
	public void addNameValidator(INameValidator validator) {
		this.nameValidator = validator;
	}
	
	public boolean isTabindexEnabled() {
		return this.isTabindexEnabled;
	}
	
	public void setIsTabindexEnabled(boolean value) {
		this.isTabindexEnabled = value;
	}
}
