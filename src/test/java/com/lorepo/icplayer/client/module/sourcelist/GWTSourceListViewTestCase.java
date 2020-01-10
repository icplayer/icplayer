package com.lorepo.icplayer.client.module.sourcelist;

import static org.junit.Assert.assertEquals;

import java.util.Arrays;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Matchers;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;

import com.google.gwt.user.client.ui.HTML;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTSourceListViewTestCase extends GwtTest {
	private SourceListModule module;
	private SourceListView view;
	
	private List<String> itemsLabels;
	private List<String> itemsID;
	
	private boolean isPreview = true;
	
	@Before
	public void setUp() throws Exception {
		this.module = new SourceListModule();
		this.view = PowerMockito.spy(new SourceListView(this.module, this.isPreview));
		
		PowerMockito.doNothing().when(this.view).connectLabelEventHandlers(Matchers.any(HTML.class), Matchers.anyString());
		
		this.createItems();
	}
	
	private void createItems() {
		String[] ids = new String[] {"item1ID", "item2ID", "item3ID", "item4ID"};
		String[] values = new String[] {"item1", "item2", "item3", "item3"};
		
		this.itemsID = Arrays.asList(ids);
		this.itemsLabels = Arrays.asList(values);
		

		for (int i = 0; i < this.itemsID.size(); i++) {
			this.view.addItem(this.itemsID.get(i), this.itemsLabels.get(i), this.isPreview);
		}
	}
	
	@Test
	public void givenFourItemsInSourceListWhenRemovingLabelThenThreeItemsRemains() {
		assertEquals(this.itemsID.size(), this.view.getCurrentLabels().size());
		
		String idOfLabelToRemove = this.itemsID.get(1);

		this.view.setDragMode();		
		this.view.removeItem(idOfLabelToRemove);
		this.view.unsetDragMode();
		
		int childElementsCount = this.view.getElement().getChildCount();
		
		assertEquals(this.itemsID.size() - 1, childElementsCount);
	}
	
	@Test
	public void givenFourLabelsAndTwoItemsWithSameLabelInSourceListWhenRemovingLabelThenThreeItemsRemains() {
		assertEquals(this.itemsID.size(), this.view.getCurrentLabels().size());
		
		String idOfLabelToRemove = this.itemsID.get(3);

		this.view.setDragMode();		
		this.view.removeItem(idOfLabelToRemove);
		this.view.unsetDragMode();

		int childElementsCount = this.view.getElement().getChildCount();
		
		assertEquals(this.itemsID.size() - 1, childElementsCount);
	}

}
