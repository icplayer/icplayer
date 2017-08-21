package com.lorepo.icplayer.client.module.addon;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.addon.AddonPresenter.IDisplay;


/**
 * Addon.
 * 
 * @author Krzysztof Langner
 *
 */
public class AddonView extends HTML implements IDisplay {

	private AddonModel	module;
	Set<String> buttonAddons = new HashSet<String>(Arrays.asList("single_state_button", "double_state_button", "show_answers"));
	
	public AddonView(AddonModel	model) {
		
		this.module = model;
		createUI();
	}

	
	public void createUI() {
		
		setHTML("Addon Id: " + module.getAddonId());
		setStyleName("addon_" + module.getAddonId());
		StyleUtils.applyInlineStyle(this, module);
		
		if (buttonAddons.contains(module.getAddonId().toLowerCase())) {
			this.getElement().setAttribute("role", "button");
		}
		
		if( !module.isVisible() ){
			DOM.setStyleAttribute(getElement(), "visibility", "hidden");
		}
		getElement().setId(module.getId());
	}

	
	@Override
	public void setViewHTML(String html) {
		setHTML(html);
	}
}
