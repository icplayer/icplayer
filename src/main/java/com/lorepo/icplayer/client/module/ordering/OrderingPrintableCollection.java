package com.lorepo.icplayer.client.module.ordering;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.Random;
import com.lorepo.icplayer.client.printable.PrintableController;

public class OrderingPrintableCollection {

    private PrintableController controller = null;
    private Element[] orderedItems = null;
    private List<Element> unorderedItems = null;

    public OrderingPrintableCollection(PrintableController controller, int size){
        this.controller = controller;
        this.orderedItems = new Element[size];
        this.unorderedItems = new ArrayList<Element>();
    }

    public Element[] getOrderedItems() {
        return this.orderedItems;
    }

    public void addItemToAppropriateArray(
            OrderingItem item, Element itemRepresentation) {
        Integer startingPosition = item.getStartingPosition();
        if (startingPosition != null) {
            this.orderedItems[startingPosition - 1] = itemRepresentation;
        } else {
            this.unorderedItems.add(itemRepresentation);
        }
    }

    public void sortAndMergeItems() {
        this.sortUnorderedItems();
        this.mergeUnorderedItemsToOrderedArray();
    }

    private void sortUnorderedItems(){
        for(int index = 0; index < this.unorderedItems.size(); index += 1) {
            Collections.swap(this.unorderedItems, index, index + nextInt(this.unorderedItems.size() - index));
        }
    }

    private int nextInt(int upperBound) {
        if (controller != null)
            return controller.nextInt(upperBound);
        return Random.nextInt(upperBound);
    }

    private void mergeUnorderedItemsToOrderedArray(){
        for (int i = 0; i < this.orderedItems.length; i++) {
            if (this.orderedItems[i] == null) {
                this.orderedItems[i] = this.unorderedItems.get(0);
                this.unorderedItems.remove(0);
            }
        }
    }
}
