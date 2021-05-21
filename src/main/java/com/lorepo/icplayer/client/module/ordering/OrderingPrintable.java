package com.lorepo.icplayer.client.module.ordering;

import java.util.HashMap;

import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.Style;
import com.google.gwt.user.client.DOM;
import com.lorepo.icplayer.client.model.alternativeText.AlternativeTextService;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.PrintableController;

public class OrderingPrintable {

    OrderingModule model = null;
    PrintableController controller = null;
    OrderingPrintableCollection collection = null;
    HashMap<String, String> printableState = null;

    public OrderingPrintable(
            OrderingModule model, PrintableController controller) {
        this.model = model;
        this.controller = controller;
        this.collection = new OrderingPrintableCollection(
                controller, model.getItemCount());
    }

    public String getPrintableHTML(String className, boolean showAnswers) {
        if (this.model.getPrintable() == PrintableMode.NO) {
			return null;
		}

        String representation;
        printableState = model.getPrintableState();
        boolean isPrintableState =
				printableState != null &&
				printableState.containsKey("order") &&
				printableState.containsKey("isSolved") &&
				printableState.get("isSolved").toLowerCase().equals("true");
        if (isPrintableState) {
			// states CHECK_ANSWERS (4) (showAnswers = true) or SHOW_USER_ANSWERS (3) (showAnswers = false)
			representation = createPrintableRepresentationIfPrintableState(showAnswers);
		} else {
			// states SHOW_ANSWERS (2) (showAnswers = true) or EMPTY (1) (showAnswers = false)
			representation = createPrintableRepresentationIfNotPrintableState(showAnswers);
		}
        return PrintableContentParser.addClassToPrintableModule(representation, className, !this.model.isSplitInPrintBlocked());
    }

    private String createPrintableRepresentationIfPrintableState(boolean checkAnswers) {
        Integer[] itemsIndexesFromState = getItemsIndexesInOrderFromState(this.printableState);
        boolean isAllInCorrectOrder = true;

        for (int i = 0; i < itemsIndexesFromState.length; i++) {
            int itemPosition = i + 1;
            for (int j = 0; j < model.getItemCount(); j++) {
                OrderingItem item = model.getItem(j);
                if (item.getIndex() == itemsIndexesFromState[i]) {
                    boolean isCorrectOrder = item.isCorrect(itemPosition);
                    isAllInCorrectOrder &= isCorrectOrder;

                    Element indexBox = createPrintableIndexBoxIfPrintableState(itemPosition, checkAnswers, isCorrectOrder);
                    Element printableItem = createPrintableItem(item, indexBox);
                    collection.addItemToAppropriateArray(item, printableItem);
                    break;
                }
            }
        }
        collection.sortAndMergeItems();

        Element classWrapper = createPrintableClassWrapper();
        Element items = combinePrintableItems(collection.getOrderedItems());
        classWrapper.appendChild(items);
        if (checkAnswers) {
            Element sign = createSign(isAllInCorrectOrder);
            classWrapper.appendChild(sign);
        }
        return classWrapper.getString();
    }

    private String createPrintableRepresentationIfNotPrintableState(boolean showAnswers) {
        OrderingItem item;
        for (int i = 0; i < model.getItemCount(); i++) {
            item = model.getItem(i);
            Element indexBox = createPrintableIndexBoxIfNotPrintableState(item.getIndex(), showAnswers);
            Element printableItem = createPrintableItem(item, indexBox);

            if (showAnswers) {
                printableItem.addClassName("printable-ordering-show-answers");
            }

            collection.addItemToAppropriateArray(item, printableItem);
        }
        collection.sortAndMergeItems();

        Element classWrapper = createPrintableClassWrapper();
        Element items = combinePrintableItems(collection.getOrderedItems());
        classWrapper.appendChild(items);
        return classWrapper.getString();
    }

    /**
     * getItemsIndexesInOrderFromState Returns items indexes in order defined in the printable state.
     *
     * @param printableState printable state object in which there must be a 'order' key. Resulting value must be of
     *                       String type. Numbers represent indexes of items. The numbers are arranged in order.
     *                       Numbers must be separated by a comma. Example: "3,1,2"
     * @return indexes items in order from the state
     */
    private Integer[] getItemsIndexesInOrderFromState(
            HashMap<String, String> printableState) {
        String orderState = printableState.get("order");
        String[] indexes = orderState.split(",");
        Integer[] parsedIndexes = new Integer[indexes.length];
        for (int i = 0; i < indexes.length; i++) {
            parsedIndexes[i] = Integer.parseInt(indexes[i]);
        }
        return parsedIndexes;
    }

    private Element createPrintableIndexBoxIfPrintableState(
            Integer itemPosition, boolean checkAnswers,
            boolean isCorrectOrder) {
        if (checkAnswers) {
			return createPrintableIndexBoxForCheckAnswers(
					itemPosition, isCorrectOrder);
		}
        return createPrintableIndexBoxForShowUserAnswers(itemPosition);
    }

    private Element createPrintableIndexBoxForCheckAnswers(
            Integer itemPosition, boolean isCorrectOrder) {
        if (isCorrectOrder) {
			return createPrintableIndexBoxWithCorrectSign(itemPosition);
		}
        return createPrintableIndexBoxWithWrongSign(itemPosition);
    }

    private Element createPrintableIndexBoxForShowUserAnswers(
            Integer itemPosition) {
        return createPrintableIndexBox(itemPosition);
    }

    private Element createPrintableIndexBoxIfNotPrintableState(
            Integer itemPosition, boolean showAnswers) {
        if (showAnswers) {
			return createPrintableIndexBoxForShowAnswers(itemPosition);
		}
        return createPrintableIndexBoxForEmptyState();
    }

    private Element createPrintableIndexBoxForShowAnswers(
            Integer itemPosition) {
        return createPrintableIndexBox(itemPosition);
    }

    private Element createPrintableIndexBoxForEmptyState() {
        return createPrintableEmptyIndexBox();
    }

    private Element createPrintableEmptyIndexBox() {
        Element box = DOM.createDiv();
        box.setClassName("number-box");
        return box;
    }

    private Element createPrintableIndexBox(Integer index) {
        Element box = DOM.createDiv();
        box.setClassName("number-box");
        box.setInnerHTML(index.toString());
        return box;
    }

    private Element createPrintableIndexBoxWithCorrectSign(Integer index) {
        Element box = DOM.createDiv();
        box.setClassName("number-box-correct");
        box.setInnerHTML(index.toString());
        return box;
    }

    private Element createPrintableIndexBoxWithWrongSign(Integer index) {
        Element box = DOM.createDiv();
        box.setClassName("number-box-wrong");
        box.setInnerHTML(index.toString());
        return box;
    }

    private Element createPrintableItem(OrderingItem item, Element indexBox) {
        if (this.model.isVertical()) {
			return createVerticalPrintableItem(item, indexBox);
		}
        return createHorizontalPrintableItem(item, indexBox);
    }

    private Element createVerticalPrintableItem(OrderingItem orderingItem, Element indexBox) {
        Element item = DOM.createDiv();
        Style style = item.getStyle();
        style.setDisplay(Style.Display.BLOCK);
        item.appendChild(orderingItem.toPrintableDOMElement(indexBox));
        return item;
    }

    private Element createHorizontalPrintableItem(
            OrderingItem orderingItem, Element indexBox) {
        Element item = DOM.createDiv();
        Style style = item.getStyle();
        style.setDisplay(Style.Display.INLINE_BLOCK);
        item.appendChild(orderingItem.toPrintableDOMElement(indexBox));
        return item;
    }

    private Element combinePrintableItems(Element[] items) {
        Element div = DOM.createDiv();
        div.setClassName("items-wrapper");
        for (Element printableItem : items) {
            div.appendChild(printableItem);
        }
        return div;
    }

    private Element createSign(boolean isAllCorrect) {
        if (isAllCorrect) {
			return createIsAllOkSign();
		}
        return createIsNotAllOkSign();
    }

    private Element createIsAllOkSign() {
        Element sign = DOM.createDiv();
        sign.setClassName("is-all-ok-sign-wrapper");
        return sign;
    }

    private Element createIsNotAllOkSign() {
        Element sign = DOM.createDiv();
        sign.setClassName("is-not-all-ok-sign-wrapper");
        return sign;
    }

    private Element createPrintableClassWrapper() {
        Element wrapper = DOM.createDiv();
        wrapper.setClassName("printable_ic_ordering");
        wrapper.setId(this.model.getId());
        return wrapper;
    }

	/**
	 * getParsedItemText Parses text, so special syntax is properly displayed
	 * @param itemText text to parse
	 * @return parsed text
	 */
	private String getParsedItemText(String itemText) {
		return AlternativeTextService.getVisibleText(itemText);
	}

}
