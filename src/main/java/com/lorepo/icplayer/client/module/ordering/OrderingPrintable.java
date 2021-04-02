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
		if (model.getPrintable() == PrintableMode.NO)
			return null;

		HashMap<String, String> printableState = model.getPrintableState();
		String printableRepresentation = "";

		if (printableState != null && printableState.containsKey("order"))
			printableRepresentation = createPrintableRepresentationIfSetState(showAnswers, printableState);
		else
			printableRepresentation = createPrintableRepresentationIfNotSetState(showAnswers);
		return PrintableContentParser.addClassToPrintableModule(
				printableRepresentation, className, !model.isSplitInPrintBlocked());
	}

	private String createPrintableRepresentationIfSetState(
			boolean checkAnswers, HashMap<String, String> printableState) {
		String[] parsedItems = new String[model.getItemCount()];
		List<String> unorderedItems = new ArrayList<String>();

		String[] itemsIndexesFromState = getItemsIndexesInOrderFromState(printableState);
		boolean isCorrectOrder = true;

		for (int i = 0; i < itemsIndexesFromState.length; i++) {
			int itemIndexFromState = Integer.parseInt(itemsIndexesFromState[i]);
			int position = i+1;
			for (int j = 0; j < model.getItemCount(); j++) {
				OrderingItem item = model.getItem(j);
				if (item.getIndex() == itemIndexFromState) {
					if (!item.isCorrect(position))
						isCorrectOrder = false;
					String parsedItem = createPrintableItem(item, position, model.isVertical(), checkAnswers);
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
		return combineItemsRepresentations(parsedItems, checkAnswers, isCorrectOrder);
	}

	private String createPrintableRepresentationIfNotSetState(boolean showAnswers) {
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
		return combineItemsRepresentations(parsedItems, false, false);
	}

	/**
	 * getItemsIndexesInOrderFromState Returns items indexes in order defined in the printable state.
	 * @param  printableState printable state object in which there must be a 'order' key. Resulting value must be of
	 *                           String type. Numbers represent indexes of items. The numbers are arranged in order.
	 *                           Numbers must be separated by a comma.
	 * @return                indexes items in order from the state
	 */
	private String[] getItemsIndexesInOrderFromState(HashMap<String, String> printableState) {
		String orderState = printableState.get("order");
		return orderState.split(",");
	}

	/**
	 * createPrintableItem  Returns a printable representation of the item.
	 * @param  item         object whose representation is created
	 * @param  index        position of object. index == 0 means index will not be displayed
	 * @param  isVertical   if the object must be represented vertically
	 * @param  checkAnswers if item will be represented in the checkAnswers state
	 * @return              printable representation of the item
	 */
	private String createPrintableItem(OrderingItem item, int index, boolean isVertical, boolean checkAnswers) {
		String displayMode = isVertical? "block" : "inline-block";
		String result = "<div style=\"display:" + displayMode + "\">";
		result += "<div class=\"item-wrapper\">";
		result += "<table><tr><td>";
		result += createPrintableIndexBox(item, index, checkAnswers);
		result += "</td><td>";
		result += item.getText();
		result += "</td></tr></table></div></div>";
		return result;
	}

	/**
	 * createPrintableIndexBox Returns a printable representation of the item's box with index.
	 * @param  item         object for which the box representation is created
	 * @param  index        position of object. index == 0 means index will not be displayed
	 * @param  checkAnswers if true, add a sign representing whether the indexes match
	 * @return              printable representation of the item's box
	 */
	private String createPrintableIndexBox(OrderingItem item, int index, boolean checkAnswers) {
		String box = "";
		if (checkAnswers) {
			if (item.isCorrect(index))
				box = "<div class=\"number-box-correct\">";
			else
				box = "<div class=\"number-box-wrong\">";
		} else {
			box = "<div class=\"number-box\">";
		}
		if (index != 0) {
			box += Integer.toString(index);
		}
		box += "</div>";
		return box;
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

	private String combineItemsRepresentations(String[] printableItems, boolean checkAnswers, boolean isAllCorrect) {
		String result = "<div class=\"printable_ic_ordering\" id=\"" + model.getId() +"\">";
		result += "<div class=\"items-wrapper\">";
		for (String parsedItem: printableItems) {
			result += parsedItem;
		}
		result += "</div>";
		if (checkAnswers)
			result += createIsAllOkSignWrapper(isAllCorrect);
		result += "</div>";
		return result;
	}
	
	private String createIsAllOkSignWrapper(boolean isAllCorrect){
		if (isAllCorrect)
			return "<div class=\"is-all-ok-wrapper-correct\"/>";
		return "<div class=\"is-all-ok-wrapper-wrong\"/>";
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
