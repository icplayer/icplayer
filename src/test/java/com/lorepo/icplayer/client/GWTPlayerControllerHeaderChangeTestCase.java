package com.lorepo.icplayer.client;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.reflect.Whitebox;

import com.google.gwt.junit.client.GWTTestCase;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.PageList;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.page.PageView;
import com.lorepo.icplayer.client.ui.PlayerView;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTPlayerControllerHeaderChangeTestCase extends GwtTest {
	PlayerController playerControllerMock = null;
	PageController headerControllerMock = null;
	KeyboardNavigationController keyboardMock = null;
	Content contentMock = null;
	PlayerView playerViewMock = null;
	Page pageMock = null;
	
	@Before
	public void setUp() {
		this.playerControllerMock = Mockito.mock(PlayerController.class);
		this.headerControllerMock = Mockito.mock(PageController.class);
		this.contentMock = Mockito.mock(Content.class);
		this.pageMock = Mockito.mock(Page.class);
		this.playerViewMock = Mockito.mock(PlayerView.class);
		this.keyboardMock = Mockito.mock(KeyboardNavigationController.class);
		
		Whitebox.setInternalState(this.playerControllerMock, "playerView", this.playerViewMock);
		Whitebox.setInternalState(this.playerControllerMock, "headerController", this.headerControllerMock);
		
		Mockito.when(this.playerControllerMock.getModel()).thenReturn(this.contentMock);
		Mockito.when(this.playerViewMock.getHeaderView()).thenReturn(null);
	}
	
	@Test
	public void whenPageHasNoHeaderItShouldRemoveHeaderFromView() {
		Mockito.when(this.pageMock.hasHeader()).thenReturn(false);
		
		try {
			Whitebox.invokeMethod(this.playerControllerMock, PlayerController.class, "setHeader", this.pageMock);
			
			Mockito.verify(this.playerViewMock, Mockito.times(1)).removeHeaderView();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@Test
	public void whenPageHasDefaultHeaderItShouldSetDefaultHeader() {
		Mockito.when(this.pageMock.hasHeader()).thenReturn(true);
		Page page = new Page("header 1", "");
		Mockito.when(this.contentMock.getHeader(Mockito.any(Page.class))).thenReturn(page);
		
		try {
			Whitebox.invokeMethod(this.playerControllerMock, PlayerController.class, "setHeader", this.pageMock);
			
			Mockito.verify(this.headerControllerMock, Mockito.times(1)).setPage(page);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@Test
	public void ifHeaderExistsItShouldBeSet() {
		Mockito.when(this.pageMock.hasHeader()).thenReturn(true);
		Mockito.when(this.contentMock.getHeader(Mockito.any(Page.class))).thenReturn(this.pageMock);
		
		try {
			Whitebox.invokeMethod(this.playerControllerMock, PlayerController.class, "setHeader", this.pageMock);
			
			Mockito.verify(this.playerViewMock, Mockito.times(1)).createHeader();
			Mockito.verify(this.headerControllerMock, Mockito.times(1)).setView(Mockito.any(PageView.class));
			Mockito.verify(this.headerControllerMock, Mockito.times(1)).setPage(this.pageMock);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

		
}
