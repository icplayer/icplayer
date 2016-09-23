package com.lorepo.icplayer.client.module.addon.param;

import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.addon.AddonModel;

public class AddonParamFactory {

	public IAddonParam createAddonParam(AddonModel parent, String type){
		
		String lowerCaseType = type.trim().toLowerCase();

		if (lowerCaseType.compareTo("audio") == 0) {
			return new AudioAddonParam(parent, type);
		} if (lowerCaseType.compareTo("video") == 0) {
			return new VideoAddonParam(parent, type);
		} else if(lowerCaseType.compareTo("boolean") == 0) {
			return new BooleanAddonParam(parent, type);
		} else if(lowerCaseType.compareTo("event") == 0) {
			return new EventAddonParam(parent, type);
		} else if(lowerCaseType.compareTo("file") == 0) {
			return new FileAddonParam(parent, type);
		} else if(lowerCaseType.compareTo("html") == 0) {
			return new HTMLAddonParam(parent, type);
		} else if(lowerCaseType.compareTo("image") == 0) {
			return new ImageAddonParam(parent, type);
		} else if(lowerCaseType.compareTo("list") == 0) {
			return new ListAddonParam(parent, type, this);
		} else if(lowerCaseType.compareTo("text") == 0) {
			return new TextAddonParam(parent, type);
		} else if(lowerCaseType.compareTo("staticlist") == 0) {
			return new StaticListAddonParam(parent, type, this);
		} else if(lowerCaseType.compareTo("narration") == 0) {
			return new TextAddonParam(parent, type);
		} else if(lowerCaseType.compareTo("staticrow") == 0){
			return new StaticRowAddonParam(parent, type);
		} else if(lowerCaseType.startsWith("{")) {
			return new EnumAddonParam(parent, type);
		} else if(lowerCaseType.startsWith("editableselect")) {
			return new EditableSelectAddonParam(parent, type, this);
		}
		
		return new StringAddonParam(parent, type);
	}
}
