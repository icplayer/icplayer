package com.lorepo.icplayer.client.module.addon.param;

import com.lorepo.icf.properties.IAudioProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icplayer.client.module.addon.AddonModel;

public class AudioAddonParam extends StringAddonParam{


	public AudioAddonParam(AddonModel parent, String type) {
		super(parent, type);
	}


	@Override
	public IProperty getAsProperty() {

		IProperty property = new IAudioProperty() {
			
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
			
			public String getDisplayName() {
				return displayName;
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
		
		IAddonParam param = new AudioAddonParam(getAddonModel(), type);
		param.setName(name);
		param.setDisplayName(displayName);
		param.setDefault(isDefault);
		return param;
	}
}
