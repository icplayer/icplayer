package com.lorepo.icplayer.client.content.service;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.content.services.PlayerCommands;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.page.PageView;
import com.lorepo.icplayer.client.ui.PlayerView;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTPlayerCommandsTestCase extends GwtTest {
	private PlayerCommands playerCommands = null;
	private PageController pageControllerMock = null;
	private IPlayerController playerControllerMock = null;
	private PlayerView playerViewMock = null;
	private PageView pageViewMock = null;
	
	@Before
	public void setUp() {
		this.playerControllerMock = Mockito.mock(IPlayerController.class);
		this.pageControllerMock = Mockito.mock(PageController.class);
		this.playerViewMock = Mockito.mock(PlayerView.class);
		this.pageViewMock = Mockito.mock(PageView.class);
		
		Mockito.when(this.playerControllerMock.getView())
			.thenReturn(this.playerViewMock);
			
		this.playerCommands = new PlayerCommands(this.pageControllerMock, this.playerControllerMock);
	}
	
	@Test
	public void ifLessonDontHaveHeaderThenChangeHeaderVisibilityIsNotCalled () {
		Mockito.when(this.playerViewMock.getHeaderView())
			.thenReturn(null);
		
		this.playerCommands.changeHeaderVisibility(true);
		
		Mockito.verify(this.pageViewMock, Mockito.times(0)).setVisible(true);
	}
	
	@Test
	public void ifLessonHaveHeaderThenChangeHeaderVisibilityIsCalled () {
		Mockito.when(this.playerViewMock.getHeaderView())
			.thenReturn(this.pageViewMock);
		
		this.playerCommands.changeHeaderVisibility(true);
		
		Mockito.verify(this.pageViewMock, Mockito.times(1)).setVisible(true);
	}
	
	@Test
	public void ifLessonDontHaveFooterThenChangeFooterVisibilityIsNotCalled () {
		Mockito.when(this.playerViewMock.getFooterView())
			.thenReturn(null);	
	
		this.playerCommands.changeFooterVisibility(true);
		
		Mockito.verify(this.pageViewMock, Mockito.times(0)).setVisible(true);
	}
	
	@Test
	public void ifLessonHaveFooterThenChangeFooterVisibilityIsCalled () {
		Mockito.when(this.playerViewMock.getFooterView())
			.thenReturn(this.pageViewMock);
		
		this.playerCommands.changeFooterVisibility(true);
		
		Mockito.verify(this.pageViewMock, Mockito.times(1)).setVisible(true);		
	}
}
