package com.lorepo.icplayer.client.module.ordering;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.reflect.Whitebox;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gwt.user.client.ui.CellPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.lorepo.icf.utils.RandomUtils;
import com.lorepo.icplayer.client.GWTPowerMockitoTest;


@PrepareForTest({OrderingView.class, RandomUtils.class})
public class GWTOrderingViewRandomizingTestCase extends GWTPowerMockitoTest {
	OrderingView orderingView = null;
	OrderingModule model = null;
	CellPanel innerCellPanel = null;
	ArrayList<ItemWidget> itemWidgets = null;
	ArrayList<OrderingItem> items = null;
	
	@Before
	public void setUp() throws Exception {
		this.model = Mockito.mock(OrderingModule.class);
		this.orderingView = PowerMockito.spy(Whitebox.newInstance(OrderingView.class));
		this.itemWidgets = new ArrayList<ItemWidget>();
		this.items = new ArrayList<OrderingItem>();
		innerCellPanel = new VerticalPanel();
		
		Whitebox.setInternalState(this.orderingView, "innerCellPanel", this.innerCellPanel);
		Whitebox.setInternalState(this.orderingView, "module", this.model);
		
		
		Whitebox.setInternalState(this.model, "items", this.items);
		Mockito.when(this.model.getItemsOrder()).thenCallRealMethod();
		Mockito.when(this.model.getOptionalOrder()).thenReturn("");
		
		Mockito.when(this.model.isValid()).thenReturn(true);
		
		Whitebox.setInternalState(this.orderingView, "initialOrder", "");	
	}
	
	// sets getRandomOrder to return items instead of random order
	private void generateRandomOrder(List<Integer> items) {
		Mockito.doReturn(items).when(this.orderingView).getRandomOrder(items.size());
	}
	
	// this function adds items to cell panel with indexes from 0 to items.size with positions from paramter
	private void generateItemsWithStartingPosition(List<Integer> items) throws Exception {
		this.items.clear();
		this.itemWidgets.clear();
		this.innerCellPanel.clear();
		
		for (int i = 0; i < items.size(); i++) {
			OrderingItem item = new OrderingItem(i, "string", "string", items.get(i));
			this.items.add(item);
			
			ItemWidget widget = new ItemWidget(item, this.model);
			this.itemWidgets.add(widget);
			
			Whitebox.invokeMethod(this.orderingView, "addWidget", widget);
		}
	}
	
	@Test
	public void testItemsWithSetStartingPositions() throws Exception{
		this.generateItemsWithStartingPosition(Arrays.asList(new Integer[] {1, null , 2}));
			
		this.orderingView.randomizeViewItems();
		
		ItemWidget item1 = (ItemWidget) this.orderingView.getWidget(0);
		ItemWidget item2 = (ItemWidget) this.orderingView.getWidget(1);
		ItemWidget item3 = (ItemWidget) this.orderingView.getWidget(2);
	
		assertEquals(this.itemWidgets.get(0).getIndex(), item1.getIndex());
		assertEquals(this.itemWidgets.get(1).getIndex(), item3.getIndex());
		assertEquals(this.itemWidgets.get(2).getIndex(), item2.getIndex());
	}
	
	@Test
	public void testOneItemWithStartingPosition() throws Exception{
		this.generateItemsWithStartingPosition(Arrays.asList(new Integer[] {3, null, null, null, null}));
			
		this.orderingView.randomizeViewItems();
		
		ItemWidget item = (ItemWidget) this.orderingView.getWidget(2);
		
		assertEquals(0, item.getIndex());
	}
	
	@Test
	public void testWithRandomizing() throws Exception {
		this.generateRandomOrder(Arrays.asList(new Integer[] {0, 1, 2}));
		this.generateItemsWithStartingPosition(Arrays.asList(new Integer[] {null, null, null}));
		
		this.orderingView.randomizeViewItems();
		
		
		ItemWidget item1 = (ItemWidget) this.orderingView.getWidget(0);
		ItemWidget item2 = (ItemWidget) this.orderingView.getWidget(1);
		ItemWidget item3 = (ItemWidget) this.orderingView.getWidget(2);
			
		assertEquals(this.itemWidgets.get(0).getIndex(), item1.getIndex());
		assertEquals(this.itemWidgets.get(1).getIndex(), item2.getIndex());
		assertEquals(this.itemWidgets.get(2).getIndex(), item3.getIndex());
	}
	
	static final Logger logger = 
			LoggerFactory.getLogger(GWTOrderingViewRandomizingTestCase.class);
	
	@Test
	public void testWithRandomizingAndStartingPosition() throws Exception {
		this.generateRandomOrder(Arrays.asList(new Integer[] {0, 1}));
		this.generateItemsWithStartingPosition(Arrays.asList(new Integer[] {1, null, null}));
		
		this.orderingView.randomizeViewItems();
		
		ItemWidget item1 = (ItemWidget) this.orderingView.getWidget(0);
		ItemWidget item2 = (ItemWidget) this.orderingView.getWidget(1);
		ItemWidget item3 = (ItemWidget) this.orderingView.getWidget(2);
		
		assertEquals(this.itemWidgets.get(0).getIndex(), item1.getIndex());
		assertEquals(this.itemWidgets.get(1).getIndex(), item2.getIndex());
		assertEquals(this.itemWidgets.get(2).getIndex(), item3.getIndex());
	}
	
	
}
