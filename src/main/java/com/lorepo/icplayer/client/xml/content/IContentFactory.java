package com.lorepo.icplayer.client.xml.content;
import java.util.ArrayList;

import com.lorepo.icplayer.client.model.Content;

public interface IContentFactory {	
	public void load(String fetchUrl, ArrayList<Integer> pagesSubset, final IContentLoadingListener listener);
	public String dumps(Content content);
}
