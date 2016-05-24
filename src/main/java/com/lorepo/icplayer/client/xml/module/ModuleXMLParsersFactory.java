package com.lorepo.icplayer.client.xml.module;

import java.util.HashMap;

import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.xml.IParser;
import com.lorepo.icplayer.client.xml.module.parsers.IModuleModelParser;

public class ModuleXMLParsersFactory {

	private IModuleModel module;
	private HashMap<String, IParser> parsersMap = new HashMap<String, IParser>();
	
	public ModuleXMLParsersFactory(IModuleModel module) {
		this.module = module;
	}
	
	public void addParser(IModuleModelParser parser) {
		parser.setModule(this.module);
		this.parsersMap.put(parser.getVersion(), parser);
	}
}
