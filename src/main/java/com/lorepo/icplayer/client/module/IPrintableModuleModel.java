package com.lorepo.icplayer.client.module;

import com.lorepo.icplayer.client.module.Printable.PrintableMode;

public interface IPrintableModuleModel {

	String getPrintableHTML(boolean showAnswers);
	
	PrintableMode getPrintableMode();
	
	boolean isSection();
}
