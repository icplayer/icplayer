package com.lorepo.icplayer.client.module.button;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.reflect.Whitebox;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTPrevPageButtonTestCase extends GwtTest {
	private PrevPageButton prevPageButtonMock = null;
	private IPlayerServices playerServicesMock = null;
	private IPlayerCommands iPlayerCommandsMock = null;
	
	@Before
	public void setUp() {
		this.prevPageButtonMock = Mockito.mock(PrevPageButton.class);
		this.playerServicesMock = Mockito.mock(IPlayerServices.class);
		this.iPlayerCommandsMock = Mockito.mock(IPlayerCommands.class);
		Whitebox.setInternalState(this.prevPageButtonMock, "playerServices", this.playerServicesMock);
		
		Mockito.when(this.playerServicesMock.getCommands()).thenReturn(this.iPlayerCommandsMock);
		Mockito.when(this.playerServicesMock.getCurrentPageIndex()).thenReturn(0);
	}
	
	@Test
	public void goToLastVisitedPage() {
		Whitebox.setInternalState(this.prevPageButtonMock, "goToLastVisitedPage", true);
		
		Mockito.doCallRealMethod()
			.when(this.prevPageButtonMock)
			.execute();
		
		this.prevPageButtonMock.execute();
		
		Mockito.verify(this.iPlayerCommandsMock, Mockito.times(1)).goToLastVisitedPage();
	}
	
	@Test
	public void goToPreviousPage() {
		Whitebox.setInternalState(this.prevPageButtonMock, "goToLastVisitedPage", false);
		
		Mockito.doCallRealMethod()
			.when(this.prevPageButtonMock)
			.execute();
		
		this.prevPageButtonMock.execute();
		
		Mockito.verify(this.iPlayerCommandsMock, Mockito.times(1)).prevPage();
	}

}