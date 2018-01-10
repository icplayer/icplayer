package com.lorepo.icplayer.client;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.page.PageList;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTPlayerControllerTestCase extends GwtTest {
	PlayerController playerControllerMock = null;
	Content contentMock = null;
	PageList pageListMock = null;
	
	@Before
	public void setUp() {
		this.playerControllerMock = Mockito.mock(PlayerController.class);
		this.contentMock = Mockito.mock(Content.class);
		this.pageListMock = Mockito.mock(PageList.class);
		
		
		Mockito.when(this.playerControllerMock.getModel())
			.thenReturn(this.contentMock);
		
		Mockito.when(this.contentMock.getCommonPages())
			.thenReturn(this.pageListMock);
		
		
	}
	
	@Test
	public void changePageToCommonsPageWillBeCalledIfPageWithThatIdExist() {
		Mockito.doCallRealMethod()
			.when(this.playerControllerMock)
			.switchToCommonPageById("someID");
		
		Mockito.when(this.pageListMock.findPageIndexById("someID"))
			.thenReturn(2);
		
		this.playerControllerMock.switchToCommonPageById("someID");
		
		Mockito.verify(this.playerControllerMock, Mockito.times(1)).switchToCommonPage(2);
	}
	
	@Test
	public void changePageToCommonsPageWontBeCalledIfPageWithThatIdDontExist() {
		Mockito.doCallRealMethod()
			.when(this.playerControllerMock)
			.switchToCommonPageById("someID");
		
		Mockito.when(this.pageListMock.findPageIndexById("someID"))
			.thenReturn(-1);
		
		this.playerControllerMock.switchToCommonPageById("someID");
		
		Mockito.verify(this.playerControllerMock, Mockito.times(0)).switchToCommonPage(Mockito.anyInt());
	}
}
