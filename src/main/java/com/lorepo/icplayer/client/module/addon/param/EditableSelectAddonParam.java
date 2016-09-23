package com.lorepo.icplayer.client.module.addon.param;

import java.util.ArrayList;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IEditableSelectProperty;
import com.lorepo.icf.properties.IEnumSetProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.module.addon.AddonModel;

public class EditableSelectAddonParam extends StringAddonParam{

	private AddonParamFactory factory;
	private ArrayList<IAddonParam> options = new ArrayList<IAddonParam>();
	private ArrayList<String> types = new ArrayList<String>();
	
	public EditableSelectAddonParam(AddonModel parent, String type, AddonParamFactory factory) {
		super(parent, type);
		this.factory = factory;
	}
	
	@Override
	public String toXML(){
		
		String xml;
		
		xml = "<property";
		xml += " name='" + StringUtils.escapeXML(name) + "'";
		xml += " displayName='" + StringUtils.escapeXML(displayName) + "'";
		xml += " type='" + StringUtils.escapeXML(type) + "'";
		xml += " value='" + StringUtils.escapeXML(value) + "'";
		xml += ">";
		
		xml += itemsToXML();
		
		xml += "</property>";
		JavaScriptUtils.log("Load");
		JavaScriptUtils.log(xml);
		return xml;
	}
	
	private String itemsToXML() {
		String xml = "";
		for(IAddonParam addonParam : options){
			
			xml += addonParam.toXML();
		}
		
		return xml;
	}	
	
	@Override
	public void load(Element rootElement, String baseUrl) {
		JavaScriptUtils.log("Load");
		JavaScriptUtils.log(rootElement.toString());
		super.load(rootElement,baseUrl);
		name = XMLUtils.getAttributeAsString(rootElement, "name");
		displayName = XMLUtils.getAttributeAsString(rootElement, "displayName");
		type = XMLUtils.getAttributeAsString(rootElement, "type");
		JavaScriptUtils.log("Value: " + value);
		loadItems(rootElement);
		
	}

	private void loadItems(Element rootElement) {
		JavaScriptUtils.log(rootElement.toString());
		AddonParamFactory paramFactory = new AddonParamFactory();
		NodeList optionNodes = rootElement.getElementsByTagName("property");
		for(int i = 0; i < optionNodes.getLength(); i++){

			Element element = (Element)optionNodes.item(i);
			String type = XMLUtils.getAttributeAsString(element, "type");
			IAddonParam addonParam = paramFactory.createAddonParam(null, type);
			addonParam.load(element, "");
			this.options.add(addonParam);
			this.types.add(type);
		}
	}
	
	public void addOptions (IAddonParam param, String type) {
		this.options.add(param);	
		this.types.add(type);
	}
	
	public void setOptions (ArrayList<IAddonParam> options) {
		this.options = new ArrayList<IAddonParam>();
		for (IAddonParam element: options) {
			this.options.add(element.makeCopy());
		}
	}

	@Override
	public IProperty getAsProperty() {

		IProperty property = new IEditableSelectProperty() {
			
			@Override
			public void setValue(String newValue) {
				value = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return value;
			}

			@Override
			public String getName() {
				return name;
			}

			@Override
			public String getDisplayName() {
				return displayName;
			}
			
			@Override
			public boolean isDefault() {
				return isDefault;
			}

			@Override
			public int getChildrenCount() {
				return options.size();
			}

			@Override
			public IProperty getChild(int index) {
				return options.get(index).getAsProperty();
			}

			@Override
			public String getAddonType(int index) {
		
				return null;
			}
		};
		
		return property;
	}
	


	@Override
	public IAddonParam makeCopy() {
		EditableSelectAddonParam param = new EditableSelectAddonParam(getAddonModel(), type, this.factory);
		param.setName(name);
		param.setDisplayName(displayName);
		param.setOptions(this.options);
		return param;
	}
}
