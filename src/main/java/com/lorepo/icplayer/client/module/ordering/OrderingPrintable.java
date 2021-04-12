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
		String representation;

		if (printableState != null && printableState.containsKey("order"))
			representation = createPrintableRepresentationIfPrintableState(showAnswers, printableState);
		else
			representation = createPrintableRepresentationIfNotPrintableState(showAnswers);
		return PrintableContentParser.addClassToPrintableModule(
				representation, className, !model.isSplitInPrintBlocked());
	}

	private String createPrintableRepresentationIfPrintableState(
			boolean checkAnswers, HashMap<String, String> printableState) {
		String[] parsedItems = new String[model.getItemCount()];
		List<String> unorderedItems = new ArrayList<String>();

		Integer[] itemsIndexesFromState = getItemsIndexesInOrderFromState(printableState);
		boolean isAllInCorrectOrder = true;

		for (int i = 0; i < itemsIndexesFromState.length; i++) {
			int itemPosition = i+1;
			for (int j = 0; j < model.getItemCount(); j++) {
				OrderingItem item = model.getItem(j);
				if (item.getIndex() == itemsIndexesFromState[i]) {
					boolean isCorrectOrder = item.isCorrect(itemPosition);
					isAllInCorrectOrder &= isCorrectOrder;

					String indexBox = createPrintableIndexBoxIfPrintableState(itemPosition, checkAnswers, isCorrectOrder);
					String printableItem = createPrintableItem(item, indexBox);
					addPrintableItemToAppropriateArray(item, printableItem, parsedItems, unorderedItems);
					break;
				}
			}
		}
		sortUnorderedPrintableItems(unorderedItems);
		mergeUnorderedPrintableItemsToOrderedArray(parsedItems, unorderedItems);
		String itemsHTML = combinePrintableItems(parsedItems);
		if (checkAnswers)
			itemsHTML += generateSignWrapper(isAllInCorrectOrder);
		return wrapHTMLInPrintableClass(itemsHTML);
	}

	private String createPrintableRepresentationIfNotPrintableState(boolean showAnswers) {
		String[] orderedItems = new String[model.getItemCount()];
		List<String> unorderedItems = new ArrayList<String>();

		OrderingItem item;
		for (int i = 0; i < model.getItemCount(); i++) {
			item = model.getItem(i);
			String indexBox = createPrintableIndexBoxIfNotPrintableState(item.getIndex(), showAnswers);
			String printableItem = createPrintableItem(item, indexBox);
			addPrintableItemToAppropriateArray(item, printableItem, orderedItems, unorderedItems);
		}
		sortUnorderedPrintableItems(unorderedItems);
		mergeUnorderedPrintableItemsToOrderedArray(orderedItems, unorderedItems);
		String itemsHTML = combinePrintableItems(orderedItems);
		return wrapHTMLInPrintableClass(itemsHTML);
	}

	/**
	 * getItemsIndexesInOrderFromState Returns items indexes in order defined in the printable state.
	 * @param  printableState printable state object in which there must be a 'order' key. Resulting value must be of
	 *                           String type. Numbers represent indexes of items. The numbers are arranged in order.
	 *                           Numbers must be separated by a comma. Example: "3,1,2"
	 * @return                indexes items in order from the state
	 */
	private Integer[] getItemsIndexesInOrderFromState(HashMap<String, String> printableState) {
		String orderState = printableState.get("order");
		String[] indexes = orderState.split(",");
		Integer[] parsedIndexes = new Integer[indexes.length];
		for(int i = 0; i < indexes.length; i++) {
			parsedIndexes[i] = Integer.parseInt(indexes[i]);
		}
		return parsedIndexes;
	}

	private String createPrintableIndexBoxIfPrintableState(
			Integer itemPosition, boolean checkAnswers, boolean isCorrectOrder){
		if (checkAnswers) {
			if (isCorrectOrder)
				return createPrintableIndexBoxWithCorrectSignHTML(itemPosition);
			else {
				return createPrintableIndexBoxWithWrongSignHTML(itemPosition);
			}
		}
		return createPrintableIndexBoxHTML(itemPosition);
	}

	private String createPrintableIndexBoxIfNotPrintableState(
			Integer itemPosition, boolean showAnswers){
		if (showAnswers)
			return createPrintableIndexBoxHTML(itemPosition);
		return createPrintableEmptyIndexBoxHTML();
	}

	private String createPrintableEmptyIndexBoxHTML() {
		return "<div class=\"number-box\"/>";
	}

	private String createPrintableIndexBoxHTML(Integer index) {
		return "<div class=\"number-box\">" + index + "</div>";
	}

	private String createPrintableIndexBoxWithCorrectSignHTML(Integer index) {
		return "<div class=\"number-box-correct\">" + index + "</div>";
	}

	private String createPrintableIndexBoxWithWrongSignHTML(Integer index) {
		return "<div class=\"number-box-wrong\">" + index + "</div>";
	}

	private String createPrintableItem(OrderingItem item, String indexBox) {
		if (model.isVertical())
			return createVerticalPrintableItemHTML(item, indexBox);
		return createHorizontalPrintableItemHTML(item, indexBox);
	}

	private String createVerticalPrintableItemHTML(OrderingItem item, String indexBox) {
		String html = "<div style=\"display: block\">";
		html += createPrintableItemHTML(item, indexBox);
		html += "</div>";
		return html;
	}

	private String createHorizontalPrintableItemHTML(OrderingItem item, String indexBox) {
		String html = "<div style=\"display: inline-block\">";
		html += createPrintableItemHTML(item, indexBox);
		html += "</div>";
		return html;
	}

	private String createPrintableItemHTML(OrderingItem item, String indexBoxHTML){
		String html = "<div class=\"item-wrapper\">";
		html += "<table><tr><td>";
		html += indexBoxHTML;
		html += "</td><td>";
		html += item.getText();
		html += "</td></tr></table></div>";
		return html;
	}

	private void addPrintableItemToAppropriateArray(
			OrderingItem item, String itemRepresentation, String[] orderedArray,
			List<String> unorderedArray) {
		Integer startingPosition = item.getStartingPosition();
		if (startingPosition != null) {
			orderedArray[startingPosition - 1] = itemRepresentation;
		} else {
			unorderedArray.add(itemRepresentation);
		}
	}

	private void sortUnorderedPrintableItems(List<String> items){
		for(int index = 0; index < items.size(); index += 1) {
			Collections.swap(items, index, index + nextInt(items.size() - index));
		}
	}

	private void mergeUnorderedPrintableItemsToOrderedArray(
			String[] orderedItems, List<String> unorderedItems){
		for (int i = 0; i < orderedItems.length; i++) {
			if (orderedItems[i] == null) {
				orderedItems[i] = unorderedItems.get(0);
				unorderedItems.remove(0);
			}
		}
	}

	private String combinePrintableItems(String[] items) {
		String html = "<div class=\"items-wrapper\">";
		for (String printableItem: items) {
			html += printableItem;
		}
		html += "</div>";
		return html;
	}

	private String generateSignWrapper(boolean isAllCorrect) {
		if (isAllCorrect)
			return generateIsAllOkSign();
		return generateIsNotAllOkSign();
	}

	private String wrapHTMLInPrintableClass(String html) {
		return "<div class=\"printable_ic_ordering\" id=\"" + model.getId() +"\">" + html + "</div>";
	}

	private String generateIsAllOkSign() {
		return "<div class=\"is-all-ok-sign-wrapper\"/>";
	}

	private String generateIsNotAllOkSign() {
		return "<div class=\"is-not-all-ok-sign-wrapper\"/>";
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
