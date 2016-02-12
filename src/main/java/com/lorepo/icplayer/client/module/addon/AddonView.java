package com.lorepo.icplayer.client.module.addon;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icplayer.client.framework.module.StyleUtils;


/**
 * Addon.
 * 
 * @author Krzysztof Langner
 *
 */
public class AddonView extends HTML implements AddonPresenter.IDisplay{

	private AddonModel	module;
	
	
	public AddonView(AddonModel	model) {
		
		this.module = model;
		createUI();
	}

	
	public void createUI() {
		
		setHTML("Addon Id: " + module.getAddonId());
		setStyleName("addon_" + module.getAddonId());
		StyleUtils.applyInlineStyle(this, module);
		
		if( !module.isVisible() ){
			DOM.setStyleAttribute(getElement(), "visibility", "hidden");
		}
		getElement().setId(module.getId());
	}

	
	@Override
	public void setViewHTML(String html) {
		setHTML(html);
	}


	@Override
	public void onEnterKey() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void onEscapeKey() {
		// TODO Auto-generated method stub
		
	}
}
