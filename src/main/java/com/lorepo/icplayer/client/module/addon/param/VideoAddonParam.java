package com.lorepo.icplayer.client.module.addon.param;

import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IVideoProperty;
import com.lorepo.icplayer.client.module.addon.AddonModel;

public class VideoAddonParam extends StringAddonParam{
	public VideoAddonParam(AddonModel parent, String type) {
		super(parent, type);
	}

	@Override
	public IProperty getAsProperty() {
		IProperty property = new IVideoProperty() {
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
		
		IAddonParam param = new VideoAddonParam(getAddonModel(), type);
		param.setName(name);
		param.setDisplayName(displayName);
		return param;
	}
}
