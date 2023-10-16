package com.lorepo.icplayer.client.module.sourcelist;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.google.gwt.user.client.Random;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.PrintableController;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;

public class SourceListPrintable {
	
	private SourceListModule model = null;
	private PrintableController controller = null;
	
	public SourceListPrintable(SourceListModule model, PrintableController controller) {
		this.model = model;
		this.controller = controller;
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
		orderedIndexes = new ArrayList<Integer>();
		for (int i = 0; i < model.getItemCount(); i++) {
			orderedIndexes.add(i);
		}
		if (this.model.isRandomOrder()) {
			randomizeOrder(orderedIndexes);
		}
		return orderedIndexes;
	}
	
	private void randomizeOrder(List<Integer> itemsIndexes) {
		for (int index = 0; index < itemsIndexes.size(); index += 1) {
			int secondElementIndex = index + nextInt(itemsIndexes.size() - index);
			Collections.swap(itemsIndexes, index, secondElementIndex);
		}
	}
	
	private int nextInt(int upperBound) {
		if (controller != null) {
			return controller.nextInt(upperBound);
		}
		return Random.nextInt(upperBound);
	}
}
