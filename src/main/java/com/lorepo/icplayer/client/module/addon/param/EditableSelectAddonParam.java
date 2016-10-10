package com.lorepo.icplayer.client.module.addon.param;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

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

	private int added = 0;
	private int added2 = 0;
	private AddonParamFactory factory;
	private ArrayList<IAddonParam> options = new ArrayList<IAddonParam>();
	private Map<String,String> defaultProperties = new HashMap<String, String>();
	
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
		return xml;
	}
	
	private String itemsToXML() {
		String xml = "";
		for(IAddonParam addonParam : options){
			
			xml += addonParam.toXML();
		}
		xml += "<values>";
		for(IAddonParam addonParam : options){
			
			xml += "<value name = \""+ addonParam.getName() +"\">";
			xml += defaultProperties.get(addonParam.getName());
			xml += "</value>";
		}	
		xml += "</values>";
		return xml;
	}	
	
	@Override
	public void load(Element rootElement, String baseUrl) {
		super.load(rootElement,baseUrl);
		
		name = XMLUtils.getAttributeAsString(rootElement, "name");
		displayName = XMLUtils.getAttributeAsString(rootElement, "displayName");
		type = XMLUtils.getAttributeAsString(rootElement, "type");
		loadItems(rootElement);
		loadValues(rootElement);
		
	}

	private void loadItems(Element rootElement) {
		AddonParamFactory paramFactory = new AddonParamFactory();
		NodeList optionNodes = rootElement.getElementsByTagName("property");
		for(int i = 0; i < optionNodes.getLength(); i++){
			Element element = (Element)optionNodes.item(i);
			String type = XMLUtils.getAttributeAsString(element, "type");
			IAddonParam addonParam = paramFactory.createAddonParam(null, type);
			addonParam.load(element, "");
			this.options.add(addonParam);
		}
	}
	
	private void loadValues(Element rootElement) {
		NodeList values = rootElement.getElementsByTagName("values");
		NodeList valuesList = ((Element)values.item(0)).getElementsByTagName("value");
		for (int j = 0; j < valuesList.getLength(); j++) {
			this.defaultProperties.put(XMLUtils.getAttributeAsString((Element)valuesList.item(j), "name"), XMLUtils.getText((Element)valuesList.item(j)));
		}		
	}
	
	public void addOptions (IAddonParam param, String type) {
		this.options.add(param);	
	}
	
	public void setOptions (ArrayList<IAddonParam> options) {
		this.options = new ArrayList<IAddonParam>();
		for (IAddonParam element: options) {
			IAddonParam copy = element.makeCopy();
			copy.getAsProperty().setValue(defaultProperties.get(element.getAsProperty().getName()));
			this.options.add(copy);
		}
	}
	
	public void setDefaultProperties (Map<String,String> defaultProperties) { 
		this.defaultProperties = new HashMap<String, String>(defaultProperties);
	
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
				/*for (int i = 0; i < options.size(); i++) {
					if (options.get(i).getDisplayName() == value) {
						return options.get(i).getName();
					}
				}
				return options.get(0).getName();*/
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
			public int getSelectedIndex() {
				for (int i = 0; i < options.size(); i++) {
					if (options.get(i).getDisplayName() == value) {
						return i;
					}
				}
				return 0;
			}
			
			@Override
			public void setDefaultProperties(String propertyName, String value) {
				defaultProperties.put(propertyName, value);
				added++;
			}

			@Override
			public int getDefaultPropertiesSize() {
				return added2;
			}

		};
		
		return property;
	}
	


	@Override
	public IAddonParam makeCopy() {
		EditableSelectAddonParam param = new EditableSelectAddonParam(getAddonModel(), type, this.factory);
		param.setName(name);
		param.setDisplayName(displayName);
		param.setDefaultProperties(this.defaultProperties);	//Must be before setOptions!
		param.setOptions(this.options);
		return param;
	}
}
