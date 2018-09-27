package com.lorepo.icplayer.client.page.mockup;

import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.model.page.group.GroupPresenter;
import com.lorepo.icplayer.client.model.page.group.GroupView;
import com.lorepo.icplayer.client.module.IModuleFactory;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.choice.ChoiceModel;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter;
import com.lorepo.icplayer.client.module.choice.mockup.ChoiceViewMockup;
import com.lorepo.icplayer.client.module.sourcelist.SourceListModule;
import com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter;

public class ModuleFactoryMockup implements IModuleFactory {

	private IPlayerServices services;
	
	
	public ModuleFactoryMockup(IPlayerServices services){
		this.services = services;
	}
	
	
	@Override
	public IModuleModel createModel(String xmlNodeName) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public IModuleView createView(IModuleModel module) {

		if(module instanceof ChoiceModel){
			return new ChoiceViewMockup((ChoiceModel) module);
		}
		
		return null;
	}

	@Override
	public IPresenter createPresenter(IModuleModel model) {

		if(model instanceof ChoiceModel){
			return new ChoicePresenter((ChoiceModel) model, services);
		}
		else if(model instanceof SourceListModule){
			return new SourceListPresenter((SourceListModule) model, services, true);
		}
		
		return null;
	}


	@Override
	public GroupView createView(Group group) {
		return new GroupView(group, true); 
	}


	@Override
	public GroupPresenter createPresenter(Group group) {
		return new GroupPresenter(group, services); 
	}
}
