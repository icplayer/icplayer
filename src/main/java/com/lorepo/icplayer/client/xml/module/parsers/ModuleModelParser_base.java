package com.lorepo.icplayer.client.xml.module.parsers;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.module.api.IModuleModel;

public abstract class ModuleModelParser_base implements IModuleModelParser {

	protected String version;
	protected IModuleModel module;
	
	public ModuleModelParser_base() {
		// TODO Auto-generated constructor stub
	}

	@Override
	public String getVersion() {
		return this.version;
	}

	@Override
	public Object parse(Element xml) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setModule(IModuleModel module) {
		this.module = module;
	}
}
