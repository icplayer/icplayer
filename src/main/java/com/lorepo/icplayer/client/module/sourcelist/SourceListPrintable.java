package com.lorepo.icplayer.client.module.sourcelist;

import java.util.ArrayList;
import java.util.List;

import com.lorepo.icf.utils.RandomUtils;
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
		List<Integer> orderedIndexes = this.getOrderedIndexes();
		for (Integer index : orderedIndexes) {
			result += "<li>" + model.getItem(index) + "</li>";
		}
		result += "</ul>";
		result += "</div>";
		
		result = PrintableContentParser.addClassToPrintableModule(result, className, model.isSplitInPrintBlocked());
		
		return result;
	}
	
	private List<Integer> getOrderedIndexes() {
		List<Integer> orderedIndexes;
		if (this.model.isRandomOrder()) {
			orderedIndexes = RandomUtils.singlePermutation(model.getItemCount());
		} else {
			orderedIndexes = new ArrayList<Integer>();
			for (int i = 0; i < model.getItemCount(); i++) {
				orderedIndexes.add(i);
			}
		}
		return orderedIndexes;
	}
}
