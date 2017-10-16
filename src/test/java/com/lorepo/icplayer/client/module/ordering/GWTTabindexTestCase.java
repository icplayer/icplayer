package com.lorepo.icplayer.client.module.ordering;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.reflect.Whitebox;

import com.google.gwt.user.client.ui.CellPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTTabindexTestCase extends GwtTest {
	OrderingView orderingView = null;
	OrderingModule model = null;
	CellPanel innerCellPanel = null;
	ItemWidget itemWidget1 = null, itemWidget2 = null, itemWidget3 = null;
	
	@Before
	public void setUp() throws Exception {
		this.model = Mockito.mock(OrderingModule.class);
		this.orderingView = Mockito.mock(OrderingView.class);
		
		innerCellPanel = new VerticalPanel();
		Whitebox.setInternalState(this.orderingView, "innerCellPanel", this.innerCellPanel);
		
		Mockito.when(this.model.isTabindexEnabled()).thenReturn(true);
		
		itemWidget1 = new ItemWidget(new OrderingItem(0, "string", "string"), this.model);
		itemWidget2 = new ItemWidget(new OrderingItem(1, "string", "string"), this.model);
		itemWidget3 = new ItemWidget(new OrderingItem(2, "string", "string"), this.model);
		
		Whitebox.invokeMethod(this.model, "addItem", itemWidget1);
		Whitebox.invokeMethod(this.model, "addItem", itemWidget2);
		Whitebox.invokeMethod(this.model, "addItem", itemWidget3);
	}
	
	@Test
	public void ifTabindexIsEnabledShouldAddAttribute() {
		
	}
}
