package com.lorepo.icplayer.client.page.mockup;

import com.lorepo.icplayer.client.module.ModuleFactory;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.button.ButtonModule;
import com.lorepo.icplayer.client.module.button.ButtonView;
import com.lorepo.icplayer.client.module.choice.ChoiceModel;
import com.lorepo.icplayer.client.module.choice.mockup.ChoiceViewMockupExtendFromOriginal;

public class ModuleFactoryMockupExtendFromOrigin extends ModuleFactory{

	private IPlayerServices services; 
	
	public ModuleFactoryMockupExtendFromOrigin(IPlayerServices services) {
		super(services);
		this.services = services;
	}

	@Override
	public IModuleView createView(IModuleModel module) {

		if(module instanceof ChoiceModel){
			return new ChoiceViewMockupExtendFromOriginal((ChoiceModel) module, false);
		}
		else if(module instanceof ButtonModule){
			return new ButtonView((ButtonModule) module, services);
		}
		return null;
	}
}
