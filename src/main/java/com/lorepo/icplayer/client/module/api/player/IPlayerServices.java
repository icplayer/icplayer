package com.lorepo.icplayer.client.module.api.player;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icplayer.client.module.api.IPresenter;


/**
 * Interface implementowany przez przez Player i podawany do modułów.
 * Zawiera dostęp do serwisów udostępnianych przez player modułom na stronie
 * 
 * @author Krzysztof Langner
 *
 */
public interface IPlayerServices {

	public IContent getModel();
	
	public EventBus	getEventBus();
	
	public int getCurrentPageIndex();

	public IPlayerCommands	getCommands();

	public IScoreService	getScoreService();

	public IServerService	getServerService();
	
	public JavaScriptObject getAsJSObject();
	
	public IPresenter getModule(String moduleName);
}
