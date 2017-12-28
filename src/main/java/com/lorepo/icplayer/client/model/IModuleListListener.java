package com.lorepo.icplayer.client.model;

import com.lorepo.icplayer.client.module.api.IModuleModel;

/**
 * Interface implemented by view to listen to changes in page model
 * 
 * @author Krzysztof Langner
 *
 */
public interface IModuleListListener {
	void onModuleChanged(IModuleModel module);
	void onModuleAdded(IModuleModel module);
	void onModuleRemoved(IModuleModel module);
}
