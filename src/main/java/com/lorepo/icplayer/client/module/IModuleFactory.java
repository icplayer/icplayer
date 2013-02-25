package com.lorepo.icplayer.client.module;

import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;

public interface IModuleFactory {

	public IModuleModel createModel(String xmlNodeName);
	public IModuleView createView(IModuleModel module);
	public IPresenter createPresenter(IModuleModel model);
}
