package com.lorepo.icplayer.client.xml.page;

import com.lorepo.icplayer.client.xml.XMLVersionAwareFactory;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v0;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v1;

public class PageFactory extends XMLVersionAwareFactory{

	public PageFactory() {
		this.addParser(new PageParser_v0());
		this.addParser(new PageParser_v1());
	}

}
