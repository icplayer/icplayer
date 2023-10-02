package com.lorepo.icplayer.client.printable;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;

public interface IPrintableModuleModel {

	String getPrintableHTML(boolean showAnswers);
	PrintableMode getPrintableMode();
	JavaScriptObject getPrintableContext();
	void setPrintableController(PrintableController controller);
	boolean isSection();
	String getId();
	void setPrintableState(String state);
	boolean isPrintableAsync();
	void setPrintableAsyncCallback(String id, PrintableContentParser.ParsedListener listener);
}
