package com.lorepo.icplayer.client.xml;

public interface IProducingLoadingListener {

	void onFinishedLoading(Object producedItem);

	void onError(String string);

}
