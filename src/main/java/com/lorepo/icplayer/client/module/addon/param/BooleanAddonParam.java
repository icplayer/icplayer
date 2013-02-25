package com.lorepo.icplayer.client.module.addon.param;

import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icplayer.client.module.addon.AddonModel;

public class BooleanAddonParam extends StringAddonParam{


	public BooleanAddonParam(AddonModel parent, String type) {
		super(parent, type);
	}


	@Override
	public IProperty getAsProperty() {

		IProperty property = new IBooleanProperty() {
			
			public void setValue(String newValue) {
				value = newValue;
				sendPropertyChangedEvent(this);
			}
			
			public String getValue() {
				return value;
			}
			
			public String getName() {
				return name;
			}
		};
		
		return property;
	}


	@Override
	public IAddonParam makeCopy() {
		IAddonParam param = new BooleanAddonParam(getAddonModel(), type);
		param.setName(name);
		return param;
	}
}
