package com.lorepo.icplayer.client.xml.page;

import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.xml.IProducingLoadingListener;
import com.lorepo.icplayer.client.xml.XMLVersionAwareFactory;
import com.lorepo.icplayer.client.xml.page.parsers.IPageParser;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v0;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v1;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v2;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v3;

public class PageFactory extends XMLVersionAwareFactory {
	
	Page producedPage = null;

	public PageFactory(Page page) {
		this.producedPage = page;
		
		this.addParser(new PageParser_v0());
		this.addParser(new PageParser_v1());
		this.addParser(new PageParser_v2());
		this.addParser(new PageParser_v3());
	}
	
	public void addParser(IPageParser parser) {
		parser.setPage(this.producedPage);
		
		this.parsersMap.put(parser.getVersion(), parser);
	}
	
	@Override
	public void load(String fetchUrl, IProducingLoadingListener listener) {
		this.producedPage.setBaseURL(fetchUrl);
		super.load(fetchUrl, listener);
	}
}
