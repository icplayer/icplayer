package com.lorepo.icplayer.client.module.ordering;

import static org.junit.Assert.*;

import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.DOM;
import com.lorepo.icplayer.client.GWTPowerMockitoTest;
import com.lorepo.icplayer.client.printable.PrintableController;

import org.junit.Before;
import org.junit.Test;

import org.mockito.Mockito;


public class GWTOrderingPrintableCollectionTestCase extends GWTPowerMockitoTest {
	PrintableController printableController = null;
	OrderingModule model = null;

	Integer itemsAmount = 3;
	OrderingItem[] items = new OrderingItem[itemsAmount];
	OrderingItem item1 = null;
	OrderingItem item2 = null;
	OrderingItem item3 = null;

	Element[] itemsReps = new Element[itemsAmount];
	Element item1Rep = null;
	Element item2Rep = null;
	Element item3Rep = null;


	@Before
	public void setUp() throws Exception {
		this.model = Mockito.mock(OrderingModule.class);
		this.printableController = Mockito.mock(PrintableController.class);
		Mockito.doReturn(itemsAmount).when(this.model).getItemCount();

		item1Rep = DOM.createDiv();
		item1Rep.setId("1");
		itemsReps[0] = item1Rep;

		item2Rep = DOM.createDiv();
		item2Rep.setId("2");
		itemsReps[1] = item2Rep;

		item3Rep = DOM.createDiv();
		item3Rep.setId("3");
		itemsReps[2] = item3Rep;
	}

	@Test
	public void addItemToAppropriateArrayWhenAllItemsHaveStartingPosition() {
		item1 = new OrderingItem(1, "element 1", "string", 1, "contentBaseURL");
		item2 = new OrderingItem(2, "element 2", "string", 2, "contentBaseURL");
		item3 = new OrderingItem(3, "element 3", "string", 3, "contentBaseURL");
		addItems();

		int tries = 8;
		for (int tryID = 0; tryID < tries; tryID++) {
			OrderingPrintableCollection collection = new OrderingPrintableCollection(
					this.printableController, this.model.getItemCount());
			executeAddItemToAppropriateArrayForAllItems(collection);
			Element[] items = collection.getOrderedItems();
			for (int i = 0; i < items.length; i++) {
				Element item = items[i];
				assertEquals(item.getId(), itemsReps[i].getId());
			}
		}
	}

	@Test
	public void addItemToAppropriateArrayWhenAllItemsDoNotHaveStartingPosition() {
		item1 = new OrderingItem(1, "element 1", "string", null);
		item2 = new OrderingItem(2, "element 2", "string", null);
		item3 = new OrderingItem(3, "element 3", "string", 2);
		addItems();

		int tries = 8;
		for (int tryID = 0; tryID < tries; tryID++) {
			OrderingPrintableCollection collection = new OrderingPrintableCollection(
					this.printableController, this.model.getItemCount());
			executeAddItemToAppropriateArrayForAllItems(collection);
			Element[] items = collection.getOrderedItems();
			assertNull(items[0]);
			assertEquals(items[1], this.item3Rep);
			assertNull(items[2]);
		}
	}

	@Test
	public void sortAndMergeItemsWithController() {
		item1 = new OrderingItem(1, "element 1", "string", null);
		item2 = new OrderingItem(2, "element 2", "string", null);
		item3 = new OrderingItem(3, "element 3", "string", 2);
		addItems();

		int tries = 8;
		for (int tryID = 0; tryID < tries; tryID++) {
			OrderingPrintableCollection collection = new OrderingPrintableCollection(
					this.printableController, this.model.getItemCount());
			executeAddItemToAppropriateArrayForAllItems(collection);

			Mockito.when(this.printableController.nextInt(Mockito.isA(int.class))).thenReturn(3, 1);
			collection.sortAndMergeItems();

			Element[] items = collection.getOrderedItems();
			assertEquals(items[0], this.item1Rep);
			assertEquals(items[1], this.item3Rep);
			assertEquals(items[2], this.item2Rep);
		}
	}

	private void addItems(){
		items[0] = item1;
		items[1] = item2;
		items[2] = item3;
	}

	private void executeAddItemToAppropriateArrayForAllItems(
			OrderingPrintableCollection collection) {
		for (int i = 0; i < itemsAmount; i++) {
			collection.addItemToItems(items[i], itemsReps[i]);
		}
	}
}
