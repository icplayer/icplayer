package com.lorepo.icplayer.client.module;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.UUID;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.INameValidator;

/**
 * Klasa implementuje bazowe functionalności potrzebne wszystkim modułom
 * 
 * @author Krzysztof Langner
 */
public abstract class BasicModuleModel extends StyledModule implements IModuleModel{

	private String  moduleTypeName;
	private String	id;
	private boolean isVisible = true;
	private boolean isLocked = false;
	private String baseURL;
	private INameValidator nameValidator;

	
	protected BasicModuleModel(String typeName){
		
		super(typeName);
		this.moduleTypeName = typeName;
		id = UUID.uuid(6);
		addPropertyId();
		registerPositionProperties();
		addPropertyIsVisible();
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
	public void release(){
		
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
		if(id == null || id.compareTo("null") == 0){
			id = UUID.uuid(6);
		}
		else{
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
		setLeft(left);
		setTop(top);
		setWidth(width);
		setHeight(height);
		setRight(right);
		setBottom(bottom);
		setInlineStyle(StringUtils.unescapeXML( element.getAttribute("style") ));
		setStyleClass(StringUtils.unescapeXML( element.getAttribute("class") ));
		
		NodeList nodes = element.getChildNodes();
		for(int i = 0; i < nodes.getLength(); i++){
			Node childNode = nodes.item(i);
			if(childNode.getNodeName().compareTo("layout") == 0 && childNode instanceof Element){
				layout.load((Element) childNode);
			}
		}
	}

	
	protected String getBaseXML(){
		
		String escapedId = StringUtils.escapeXML(id);
		String xml = "id='" + escapedId + "' left='" + getLeft() + "' top='" + getTop()  +
				"' width='" + getWidth() + "' height='" + getHeight() + "' " +
				"right='" + getRight() + "' bottom='" + getBottom() + "' " +
				"isVisible='" + isVisible + "' isLocked='" + isLocked +"'";
		
		if(!getInlineStyle().isEmpty()){
			String encodedStyle = StringUtils.escapeXML(getInlineStyle());
			xml += " style='" + encodedStyle + "'";
		}
		
		if(!getStyleClass().isEmpty()){
			String encodedStyleClass = StringUtils.escapeXML(getStyleClass());
			xml += " class='" + encodedStyleClass + "'";
		}
		
		return xml;
	}
	
	
	protected String getLayoutXML(){
		return layout.toXML();
	}
	
	
	private void addPropertyId() {

		IProperty property = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				
				if(nameValidator != null && nameValidator.canChangeName(newValue)){
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
		};
		
		addProperty(property);
	}

	private void addPropertyIsVisible() {

		IProperty property = new IBooleanProperty() {
			
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if(value!= isVisible){
					isVisible = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(isVisible){
					return "True";
				}
				else{
					return "False";
				}
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("is_visible");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("is_visible");
			}

		};
		
		addProperty(property);
	}

	
	public boolean isVisible(){
		return isVisible;
	}

	public void lock(boolean state){
		isLocked = state;
	}
	
	public boolean isLocked(){
		return isLocked;
	}
	
	public String getBaseURL(){
		return baseURL;
	}
	

	@Override
	public void addNameValidator(INameValidator validator){
		this.nameValidator = validator;
	}
}
