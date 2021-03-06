package com.lorepo.icplayer.client.module.sourcelist;

import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;

public class SourceListPrintable {
	
	private SourceListModule model = null;
	
	public SourceListPrintable(SourceListModule model) {
		this.model = model;
	}
	
	public String getPrintableHTML(String className, boolean showAnswers) {
		if (model.getPrintable() == PrintableMode.NO) return null;
		
		String result = "<div class=\"printable_ic_sourceList\" id=\"" + model.getId() +"\">";
		result += "<ul>";
		int itemCount = model.getItemCount();
		for (int i = 0; i < itemCount; i++) {
			result += "<li>" + model.getItem(i) + "</li>";
		}
		result += "</ul>";
		result += "</div>";
		
		result = PrintableContentParser.addClassToPrintableModule(result, className, model.isSplitInPrintBlocked());
		
		return result;
	}
}
