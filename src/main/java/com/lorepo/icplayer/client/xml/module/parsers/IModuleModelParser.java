package com.lorepo.icplayer.client.xml.module.parsers;

import com.lorepo.icplayer.client.xml.IParser;

public interface IModuleModelParser extends IParser {
	public void setModule(IModuleModelBuilder module);
	public void setDefaultLayoutID(String layoutID);
}
