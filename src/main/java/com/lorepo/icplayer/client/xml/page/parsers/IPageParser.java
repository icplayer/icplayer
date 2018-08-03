package com.lorepo.icplayer.client.xml.page.parsers;

import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.xml.IParser;

public interface IPageParser extends IParser {
	public void setPage(Page page);
	public void setDefaultLayoutID(String layoutID);
}
