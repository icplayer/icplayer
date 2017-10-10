package com.lorepo.icplayer.client.ui;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import com.google.gwt.user.client.ui.Widget;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.IPlayerController;


@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTPlayerViewRemovingHeadersTestCase extends GwtTest {
	PlayerView playerViewMock = null;
	IPlayerController playerControllerMock = null;
	
	@Before
	public void setUp() {
		this.playerViewMock = Mockito.mock(PlayerView.class);
		this.playerControllerMock = Mockito.mock(IPlayerController.class);
		
		Mockito.doCallRealMethod().when(this.playerViewMock).getHeaderView();
		Mockito.doCallRealMethod().when(this.playerViewMock).removeHeaderView();
		Mockito.doCallRealMethod().when(this.playerViewMock).createHeader();
	}
	
	@Test
	public void removingHeaderViewShouldSetHeaderToNull(){
		this.playerViewMock.createHeader();
		
		assertNotNull(this.playerViewMock.getHeaderView());
		
		this.playerViewMock.removeHeaderView();
		
		assertNull(this.playerViewMock.getHeaderView());
	}
	
	@Test
	public void removingHeaderWhenNullShouldDoNothing() {
		this.playerViewMock.removeHeaderView();
		
		Mockito.verify(this.playerViewMock, Mockito.never()).remove(Mockito.any(Widget.class));
	}
}
