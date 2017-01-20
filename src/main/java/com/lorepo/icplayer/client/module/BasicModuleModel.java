package com.lorepo.icplayer.client.module;


import java.util.HashMap;

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
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.INameValidator;
import com.lorepo.icplayer.client.xml.module.ModuleXMLParsersFactory;
import com.lorepo.icplayer.client.xml.module.parsers.IModuleModelBuilder;

public abstract class BasicModuleModel extends StyledModule implements IModuleModel, IModuleModelBuilder {
	private String moduleTypeName;
	private String moduleName;
	private String id;
	private HashMap<String, Boolean> isVisible = new HashMap<String, Boolean>();
	private HashMap<String, Boolean> isLocked = new HashMap<String, Boolean>();
	private HashMap<String, Boolean> isModuleVisibleInEditor = new HashMap<String, Boolean>();
	private String baseURL;
	private INameValidator nameValidator;
	private String buttonType;

	
	protected BasicModuleModel(String typeName, String name){
		super(name);
		this.isVisible.put(this.positionType, true);
		this.isLocked.put(this.positionType, false);
		this.isModuleVisibleInEditor.put(this.positionType, true);
		this.moduleTypeName = typeName;
		this.moduleName = name;
		id = UUID.uuid(6);
		addPropertyId();
		registerPositionProperties();
		addPropertyIsVisible();
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
	
	@Override
	public void setInlineStyle(String style) {
		String css = URLUtils.resolveCSSURL(this.baseURL, style);
		super.setInlineStyle(css);
	}
	
	@Override
	public void load(Element element, String baseUrl, String version) {
		this.baseURL = baseUrl;
		
		ModuleXMLParsersFactory factory = new ModuleXMLParsersFactory(this);
		factory.produce(element, version);
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
		isVisible.put(this.positionType, XMLUtils.getAttributeAsBoolean(element, "isVisible", true));
		isLocked.put(this.positionType, XMLUtils.getAttributeAsBoolean(element, "isLocked", false));
		isModuleVisibleInEditor.put(this.positionType, XMLUtils.getAttributeAsBoolean(element, "isModuleVisibleInEditor", true));
		setLeft(left);
		setTop(top);
		setWidth(width);
		setHeight(height);
		setRight(right);
		setBottom(bottom);
		String style = StringUtils.unescapeXML(element.getAttribute("style"));
		setInlineStyle(style);
		setStyleClass(StringUtils.unescapeXML( element.getAttribute("class") ));
		
		NodeList nodes = element.getChildNodes();
		for(int i = 0; i < nodes.getLength(); i++){
			Node childNode = nodes.item(i);
			
			if(childNode.getNodeName().compareTo("button") == 0 && childNode instanceof Element){
				buttonType = StringUtils.unescapeXML(((Element) childNode).getAttribute("type"));
				setButtonType(buttonType);
			}else if(childNode.getNodeName().compareTo("layout") == 0 && childNode instanceof Element){
				this.loadLayout((Element) childNode);
			}else if(childNode.getNodeName().compareTo("layouts") == 0 && childNode instanceof Element) {
				parseLayouts((Element) childNode);
			}
		}
	}

	private void parseLayouts(Element childNode) {
	}

	public void setButtonType(String type) {
		this.buttonType = type;
	}

	public String getButtonType() {
		return buttonType;
	}
	
	protected String getBaseXML(){
		
		String escapedId = StringUtils.escapeXML(id);
		String xml = "id='" + escapedId + "' left='" + getLeft() + "' top='" + getTop();
		xml += "' width='" + getWidth() + "' height='" + getHeight() + "' ";
		xml += "right='" + getRight();
		xml += "' bottom='" + getBottom() + "' ";
		xml += "isVisible='" + isVisible.get(this.positionType) + "' isLocked='" + isLocked.get(this.positionType) +"'" + " isModuleVisibleInEditor='" + isModuleVisibleInEditor.get(this.positionType) +"'";
		
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
				
				if (value != isVisible()) {
					setIsVisible(value);
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				return isVisible() ? "True" : "False";
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
	
	public boolean isVisible() {
		return this.isVisible.get(this.positionType);
	}

	public void lock(boolean state) {
		this.isLocked.put(this.positionType, state);
	}
	
	public boolean isLocked() {
		return isLocked.get(this.positionType);
	}
	
	public String getBaseURL() {
		return baseURL;
	}
	
	public boolean isModuleInEditorVisible() {
		return this.isModuleVisibleInEditor.get(this.positionType);
	}
	
	public void setModuleInEditorVisibility(boolean moduleInEditorVisibility) {
		this.isModuleVisibleInEditor.put(this.positionType, moduleInEditorVisibility);
	}
	
	public void setBaseUrl(String baseUrl) {
		this.baseURL = baseUrl;
	}
	
	@Override
	public void addNameValidator(INameValidator validator) {
		this.nameValidator = validator;
	}
	
	@Override
	public void setID(String id) {
		this.id = id;
	}
	
	@Override
	public void setIsVisible(Boolean isVisible) {
		this.isVisible.put(this.positionType, isVisible);
	}
	
	@Override
	public void setIsLocked(Boolean isLocked) {
		this.isLocked.put(this.positionType, isLocked);
	}
	
	@Override
	public void setIsModuleVisibleInEditor(Boolean isVisibleInEditor) {
		this.isModuleVisibleInEditor.put(this.positionType, isVisibleInEditor);
	}
	
	@Override
	public void setIsVisible(String name, boolean isVisible) {
		this.isVisible.put(name, isVisible);
	}
	
	@Override
	public void setIsLocked(String name, boolean isLocked) {
		this.isLocked.put(name, isLocked);
	}
	
	@Override
	public void setIsVisibleInEditor(String name, boolean isVisibleInEditor) {
		this.isModuleVisibleInEditor.put(name, isVisibleInEditor);
	}
}
