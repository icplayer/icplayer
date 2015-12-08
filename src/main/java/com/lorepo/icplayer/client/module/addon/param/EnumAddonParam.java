package com.lorepo.icplayer.client.module.addon.param;

import java.util.ArrayList;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IEnumSetProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icplayer.client.module.addon.AddonModel;

public class EnumAddonParam extends StringAddonParam{

	private ArrayList<String>	allowedValues = new ArrayList<String>();
	
	
	public EnumAddonParam(AddonModel parent, String type) {
		super(parent, type);
		loadAllovedValues();
	}


	@Override
	public void load(Element element, String baseUrl) {
		
		super.load(element,baseUrl);
		loadAllovedValues();
	}

	
	private void loadAllovedValues() {
		
		int startIndex = type.indexOf('{');
		int endIndex = type.indexOf('}');
		
		allowedValues.clear();
		if(startIndex > -1 && endIndex > 0){
			String valuesString = type.substring(startIndex+1, endIndex);
			String[] values = valuesString.split(",");
			for(int i = 0; i < values.length; i++){
				allowedValues.add(values[i].trim());
			}
		}
	}


	@Override
	public IProperty getAsProperty() {

		IProperty property = new IEnumSetProperty() {
			
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
			public int getAllowedValueCount() {
				return allowedValues.size();
			}

			@Override
			public String getAllowedValue(int index) {
				return allowedValues.get(index);
			}

			@Override
			public boolean isDefault() {
				return isDefault;
			}
		};
		
		return property;
	}
	


	@Override
	public IAddonParam makeCopy() {
		IAddonParam param = new EnumAddonParam(getAddonModel(), type);
		param.setName(name);
		param.setDisplayName(displayName);
		return param;
	}
}
