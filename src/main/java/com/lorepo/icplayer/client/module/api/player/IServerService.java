package com.lorepo.icplayer.client.module.api.player;


/**
 * Interface do komunikacji z serwerem
 * @author Krzysztof Langner
 *
 */
public interface IServerService {

	public String getServerApiUrl();
	public void sendAnalytics(int pageIndex);
}
