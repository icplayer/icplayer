package com.lorepo.icplayer.client.module.ordering;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.google.gwt.user.client.Random;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.PrintableController;

public class OrderingPrintable {

	OrderingModule model = null;
	PrintableController controller = null;
	
	public OrderingPrintable(OrderingModule model, PrintableController controller) {
		this.model = model;
		this.controller = controller;
	}
	
	public String getPrintableHTML(String className, boolean showAnswers) {
		String result = "<div class=\"printable_ic_ordering\" id=\"" + model.getId() +"\">";
		
		String[] parsedItems = new String[model.getItemCount()];
		List<String> unorderedItems = new ArrayList<String>();
		
		for (int i = 0; i < model.getItemCount(); i++) {
			OrderingItem item = model.getItem(i);
			String parsedItem = "";
			if (showAnswers) {
				parsedItem = createItem(item, model.isVertical(), i+1);
			} else {
				parsedItem = createItem(item, model.isVertical(), 0);
			}
			Integer startingPosition = item.getStartingPosition();
			if (startingPosition != null) {
				parsedItems[startingPosition - 1] = parsedItem;
			} else {
				unorderedItems.add(parsedItem);
			}
		}
		
		for(int index = 0; index < unorderedItems.size(); index += 1) {  
			Collections.swap(unorderedItems, index, index + nextInt(unorderedItems.size() - index));  
		}
		
		for (int i = 0; i < parsedItems.length; i++) {
			if (parsedItems[i] == null) {
				parsedItems[i] = unorderedItems.get(0);
				unorderedItems.remove(0);
			}
		}
		
		for (int i = 0; i < parsedItems.length; i++) {
			result += parsedItems[i];
		}
		
		result += "</div>";
		result = PrintableContentParser.addClassToPrintableModule(result, className);
		return result;
	}
	
	private String createItem(OrderingItem item, boolean isVertical, int index) {
		// index == 0 means no index will be displayed
		String result = "";
		String displayMode = isVertical? "block" : "inline-block";
		result += "<div style=\"display:" + displayMode + "\">";
		result += "<div class=\"item-wrapper\">";
		result += "<table><tr><td>";
		result += "<div class=\"number-box\">";
		if (index != 0) {
		    result += Integer.toString(index);
		}
		result += "</div>";
		result += "</td><td>";
		result += item.getText();
		result += "</td></tr></table></div></div>";
		return result;
	}
	
	private int nextInt(int upperBound) {
		int result = 0;
		if (controller != null) {
			result = controller.nextInt(upperBound);
		} else {
			result = Random.nextInt(upperBound);
		}
		return result;
	}
	
}
