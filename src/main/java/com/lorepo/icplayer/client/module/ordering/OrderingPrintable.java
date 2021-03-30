package com.lorepo.icplayer.client.module.ordering;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.user.client.Random;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;
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
		if (model.getPrintable() == PrintableMode.NO) return null;

		HashMap<String, String> printableState = model.getPrintableState();

		String[] itemsRepresentations;
		if (printableState != null && printableState.containsKey("order")) {
			itemsRepresentations = createItemsRepresentationsIfSetState(showAnswers, printableState);
		} else {
			itemsRepresentations = createItemsRepresentationsIfNotSetState(showAnswers);
		}

		String result = "<div class=\"printable_ic_ordering\" id=\"" + model.getId() +"\">";

		for (String parsedItem: itemsRepresentations) {
			result += parsedItem;
		}

		result += "</div>";
		result = PrintableContentParser.addClassToPrintableModule(result, className, !model.isSplitInPrintBlocked());

		return result;
	}

	private String[] createItemsRepresentationsIfSetState(boolean showAnswers, HashMap<String, String> printableState) {
		String[] parsedItems = new String[model.getItemCount()];
		List<String> unorderedItems = new ArrayList<String>();

		String orderState = printableState.get("order");
		String[] indexes = orderState.split(",");

		for (int i = 0; i < indexes.length; i++) {
			int index = Integer.parseInt(indexes[i]);
			for (int j = 0; j < model.getItemCount(); j++) {
				OrderingItem item = model.getItem(j);
				if (item.getIndex() == index) {
					String parsedItem = createPrintableItem(item, i+1, model.isVertical(), showAnswers);
					Integer startingPosition = item.getStartingPosition();
					if (startingPosition != null) {
						parsedItems[startingPosition - 1] = parsedItem;
					} else {
						unorderedItems.add(parsedItem);
					}
					break;
				}
			}
		}
		sortItemsRepresentations(parsedItems, unorderedItems);
		return parsedItems;
	}

	private String[] createItemsRepresentationsIfNotSetState(boolean showAnswers) {
		String[] parsedItems = new String[model.getItemCount()];
		List<String> unorderedItems = new ArrayList<String>();

		for (int i = 0; i < model.getItemCount(); i++) {
			OrderingItem item = model.getItem(i);

			String parsedItem = "";
			if (showAnswers)
				parsedItem = createPrintableItem(item, item.getIndex(), model.isVertical(), false);
			else
				parsedItem = createPrintableItem(item, 0, model.isVertical(), false);
			Integer startingPosition = item.getStartingPosition();
			if (startingPosition != null) {
				parsedItems[startingPosition - 1] = parsedItem;
			} else {
				unorderedItems.add(parsedItem);
			}
		}
		sortItemsRepresentations(parsedItems, unorderedItems);
		return parsedItems;
	}


	private void sortItemsRepresentations(String[] parsedItems, List<String> unorderedItems){
		for(int index = 0; index < unorderedItems.size(); index += 1) {
			Collections.swap(unorderedItems, index, index + nextInt(unorderedItems.size() - index));
		}

		for (int i = 0; i < parsedItems.length; i++) {
			if (parsedItems[i] == null) {
				parsedItems[i] = unorderedItems.get(0);
				unorderedItems.remove(0);
			}
		}
	}

	/**
	 * createPrintableItem  Returns a printable representation of the item.
	 * @param  item         object whose representation is created
	 * @param  index        position of object. index == 0 means no index will be displayed
	 * @param  isVertical   if the object must be represented vertically
	 * @param  checkAnswers if item will be represented in the checkAnswers state
	 * @return              printable representation of the object
	 */
	private String createPrintableItem(OrderingItem item, int index, boolean isVertical, boolean checkAnswers) {
		String displayMode = isVertical? "block" : "inline-block";
		String result = "<div style=\"display:" + displayMode + "\">";
		result += "<div class=\"item-wrapper\">";
		result += "<table><tr><td>";
		if (checkAnswers) {
			if (item.getIndex() == index)
				result += "<div class=\"number-correct-box\">";
			else
				result += "<div class=\"number-wrong-box\">";
		} else {
			result += "<div class=\"number-box\">";
		}
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
