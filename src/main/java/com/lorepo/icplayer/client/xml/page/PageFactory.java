package com.lorepo.icplayer.client.xml.page;

import java.util.Iterator;

import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.xml.IParser;
import com.lorepo.icplayer.client.xml.IProducingLoadingListener;
import com.lorepo.icplayer.client.xml.XMLVersionAwareFactory;
import com.lorepo.icplayer.client.xml.page.parsers.IPageParser;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v0;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v1;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v2;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v3;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v4;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v5;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v6;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v7;

public class PageFactory extends XMLVersionAwareFactory {
	
	Page producedPage = null;
	static String defaultLayoutID = null;

	public PageFactory(Page page) {
		this.producedPage = page;
		
		this.addParser(new PageParser_v0());
		this.addParser(new PageParser_v1());
		this.addParser(new PageParser_v2());
		this.addParser(new PageParser_v3());
		this.addParser(new PageParser_v4());
		this.addParser(new PageParser_v5());
		this.addParser(new PageParser_v6());
		this.addParser(new PageParser_v7());
		
		if (defaultLayoutID != null) {
			setDefaultLayoutID(defaultLayoutID);
		}
	}
	
	public void addParser(IPageParser parser) {
		parser.setPage(this.producedPage);
		
		this.parsersMap.put(parser.getVersion(), parser);
	}
	
	public void setDefaultLayoutID (String layoutID) {
		defaultLayoutID = layoutID;
		Iterator<String> iter = this.parsersMap.keySet().iterator();
		while (iter.hasNext()) {
			IParser parser = this.parsersMap.get(iter.next());
			if (parser instanceof IPageParser) {
				((IPageParser) parser).setDefaultLayoutID(layoutID);
			}
		}
	}
	
	@Override
	public void load(String fetchUrl, IProducingLoadingListener listener) {
		this.producedPage.setBaseURL(fetchUrl);
		super.load(fetchUrl, listener);
	}
}
