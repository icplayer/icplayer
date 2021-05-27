package com.lorepo.icplayer.client.module.ordering;

import java.util.Map;

import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.Style;
import com.google.gwt.user.client.DOM;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.PrintableController;

public class OrderingPrintable {

    IPrintableOrderingModule model;
    PrintableController controller;
    OrderingPrintableCollection collection ;
    Map<String, String> printableState = null;

    private enum IndexBoxClass {
        DEFAULT("number-box"),
        CORRECT("number-box-correct"),
        WRONG("number-box-wrong");

        private final String className;

        IndexBoxClass(String className) {
            this.className = className;
        }

        public String className() {
            return this.className;
        }
    }

    public OrderingPrintable(IPrintableOrderingModule model, PrintableController controller) {
        this.model = model;
        this.controller = controller;
        this.collection = new OrderingPrintableCollection(controller, model.getItemCount());
    }

    public String getPrintableHTML(String className, boolean showAnswers) {
        if (!this.model.isPrintable()) {
            return null;
        }

        printableState = model.getPrintableState();
        boolean stateSet = printableState != null;

        boolean isPrintableState = stateSet && printableState.containsKey("order");
        boolean userHasInteracted = stateSet && printableState.containsKey("isSolved") && printableState.get("isSolved").toLowerCase().equals("true");

        Element representation;

        if (isPrintableState && userHasInteracted) {
            // states CHECK_ANSWERS (4) (showAnswers = true) or SHOW_USER_ANSWERS (3) (showAnswers = false)
            representation = createItemsWithUserAnswers(showAnswers);
        } else if (isPrintableState) {
            // states CHECK_ANSWERS (4) or SHOW_USER_ANSWERS (3) when user hasn't answered - show empty boxes
            representation = createItems(false);
        } else {
            // states SHOW_ANSWERS (2) (showAnswers = true) or EMPTY (1) (showAnswers = false)
            representation = createItems(showAnswers);

            if (showAnswers) {
                representation.addClassName("printable-ordering-show-answers");
            }
        }

        return PrintableContentParser.addClassToPrintableModule(representation.getString(), className, !this.model.isSplitInPrintBlocked());
    }

    private Element createItemsWithUserAnswers(boolean showCorrectness) {
        Integer[] itemsIndexesFromState = getItemsIndexesInOrderFromState(this.printableState);
        boolean isAllInCorrectOrder = true;

        for (int i = 0; i < itemsIndexesFromState.length; i++) {
            int itemPosition = i + 1;
            for (int j = 0; j < model.getItemCount(); j++) {
                OrderingItem item = model.getItem(j);
                if (item.getIndex() == itemsIndexesFromState[i]) {
                    boolean isCorrectOrder = item.isCorrect(itemPosition);
                    isAllInCorrectOrder &= isCorrectOrder;

                    String indexBoxClassName = IndexBoxClass.DEFAULT.className();
                    if (showCorrectness) {
                        indexBoxClassName = isCorrectOrder ? IndexBoxClass.CORRECT.className() : IndexBoxClass.WRONG.className();
                    }

                    Element indexBox = createPrintableIndexBox(itemPosition, indexBoxClassName);
                    Element printableItem = createPrintableItem(item, indexBox);
                    collection.addItemToItems(item, printableItem);
                    break;
                }
            }
        }
        collection.sortAndMergeItems();

        Element classWrapper = createPrintableClassWrapper();
        Element items = combinePrintableItems(collection.getOrderedItems());
        classWrapper.appendChild(items);

        if (showCorrectness) {
            Element sign = createSign(isAllInCorrectOrder);
            classWrapper.appendChild(sign);
        }

        return classWrapper;
    }

    private Element createItems(boolean showAnswers) {
        OrderingItem item;

        for (int i = 0; i < model.getItemCount(); i++) {
            item = model.getItem(i);

            Element indexBox = showAnswers ?
                    createPrintableIndexBox(item.getIndex(), IndexBoxClass.DEFAULT.className()) :
                    createPrintableEmptyIndexBox();

            Element printableItem = createPrintableItem(item, indexBox);

            collection.addItemToItems(item, printableItem);
        }
        collection.sortAndMergeItems();

        Element classWrapper = createPrintableClassWrapper();
        Element items = combinePrintableItems(collection.getOrderedItems());
        classWrapper.appendChild(items);
        return classWrapper;
    }

    /**
     * getItemsIndexesInOrderFromState Returns items indexes in order defined in the printable state.
     *
     * @param printableState printable state object in which there must be a 'order' key. Resulting value must be of
     *                       String type. Numbers represent indexes of items. The numbers are arranged in order.
     *                       Numbers must be separated by a comma. Example: "3,1,2"
     * @return indexes items in order from the state
     */
    private Integer[] getItemsIndexesInOrderFromState(Map<String, String> printableState) {
        String orderState = printableState.get("order");
        String[] indexes = orderState.split(",");
        Integer[] parsedIndexes = new Integer[indexes.length];
        for (int i = 0; i < indexes.length; i++) {
            parsedIndexes[i] = Integer.parseInt(indexes[i]);
        }
        return parsedIndexes;
    }

    private Element createIndexBox(String innerHTML) {
        Element box = DOM.createDiv();
        box.setInnerHTML(innerHTML);
        return box;
    }

    private Element createPrintableEmptyIndexBox() {
        Element box = DOM.createDiv();
        box.setClassName("number-box");
        return box;
    }

    private Element createPrintableIndexBox(Integer index, String className) {
        Element box = createIndexBox(index.toString());
        box.setClassName(className);
        return box;
    }

    private Element createPrintableItem(OrderingItem item, Element indexBox) {
        Element printableItem = DOM.createDiv();

        Style style = printableItem.getStyle();
        Style.Display displayType = this.model.isVertical() ? Style.Display.BLOCK : Style.Display.INLINE_BLOCK;
        style.setDisplay(displayType);

        Element childHTML = item.toPrintableDOMElement(indexBox);
        printableItem.appendChild(childHTML);

        return printableItem;
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
        Element sign = DOM.createDiv();

        String className = isAllCorrect ? "is-all-ok-sign-wrapper" : "is-not-all-ok-sign-wrapper";
        sign.setClassName(className);

        return sign;
    }

    private Element createPrintableClassWrapper() {
        Element wrapper = DOM.createDiv();
        wrapper.setClassName("printable_ic_ordering");
        wrapper.setId(this.model.getId());
        return wrapper;
    }

}
