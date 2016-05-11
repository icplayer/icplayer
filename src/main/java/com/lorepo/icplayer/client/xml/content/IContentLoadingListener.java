package com.lorepo.icplayer.client.xml.content;

import com.lorepo.icplayer.client.model.Content;

public interface IContentLoadingListener {
	void onFinishedLoading(Content content);
	
	void onError(String error);
}
