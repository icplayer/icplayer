package com.lorepo.icplayer.client.module.ordering;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.reflect.Whitebox;

import com.google.gwt.event.dom.client.KeyDownEvent;
import com.lorepo.icplayer.client.GWTPowerMockitoTest;
import com.lorepo.icplayer.client.module.api.event.ModuleActivatedEvent;

@PrepareForTest({OrderingPresenter.class})
public class GWTOrderingPresenterTestCase extends GWTPowerMockitoTest {
	OrderingPresenter orderingPresenterMock = null;
	OrderingModule module = null;
	OrderingView viewMock = null;
	
	@Before
	public void setUp() throws Exception {
		this.orderingPresenterMock = PowerMockito.spy(Whitebox.newInstance(OrderingPresenter.class));
		this.viewMock = PowerMockito.spy(Whitebox.newInstance(OrderingView.class));
		
		this.module = new OrderingModule();
		this.module.setId("ordering");
		Whitebox.setInternalState(this.orderingPresenterMock, "view", this.viewMock);
		Whitebox.setInternalState(this.orderingPresenterMock, "module", this.module);
	}
	
	@Test
	public void activateWillCallExecuteOnKeyDownIfModuleNameIsEquals() throws Exception {
		ModuleActivatedEvent event = Mockito.mock(ModuleActivatedEvent.class);
		Whitebox.setInternalState(event, "moduleName", "ordering");
		KeyDownEvent keyDownEvent = Mockito.mock(KeyDownEvent.class);
		
		PowerMockito.when(event.getKeyDownEvent()).thenReturn(keyDownEvent);
		PowerMockito.doNothing().when(this.viewMock, "executeOnKeyCode", keyDownEvent);
		
		Whitebox.invokeMethod(this.orderingPresenterMock, "activate", event);
		
		PowerMockito.verifyPrivate(this.viewMock, Mockito.times(1)).invoke("executeOnKeyCode", keyDownEvent);
	}
}
