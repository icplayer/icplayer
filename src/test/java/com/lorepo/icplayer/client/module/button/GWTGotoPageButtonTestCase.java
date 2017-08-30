package com.lorepo.icplayer.client.module.button;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.reflect.Whitebox;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTGotoPageButtonTestCase extends GwtTest {
	private GotoPageButton gotoPageButtonMock = null;
	private IPlayerServices playerServicesMock = null;
	private IContent iContentMock = null;
	private IPlayerCommands iPlayerCommandsMock = null;
	
	@Before
	public void setUp() {
		this.gotoPageButtonMock = Mockito.mock(GotoPageButton.class);
		this.playerServicesMock = Mockito.mock(IPlayerServices.class);
		this.iContentMock = Mockito.mock(IContent.class);
		this.iPlayerCommandsMock = Mockito.mock(IPlayerCommands.class);
		
		Mockito.when(this.playerServicesMock.getModel())
				.thenReturn(this.iContentMock);
		
		Mockito.when(this.iContentMock.getPageCount())
				.thenReturn(5);
		
		Mockito.when(this.playerServicesMock.getCurrentPageIndex())
				.thenReturn(2);
		
		Mockito.when(this.playerServicesMock.getCommands())
				.thenReturn(this.iPlayerCommandsMock);
		
		Whitebox.setInternalState(this.gotoPageButtonMock, "playerServices", this.playerServicesMock);
		Whitebox.setInternalState(this.gotoPageButtonMock, "pageName", "Some page");
		
		Mockito.doReturn(true)
				.when(this.gotoPageButtonMock)
				.isCommonPageNameCorrect("Some page");
		
		Mockito.doReturn(true)
				.when(this.gotoPageButtonMock)
				.isPageNameCorrect("Some page");
	}
	
	@Test
	public void executeCallsGoToCommonPage() {
		Whitebox.setInternalState(this.gotoPageButtonMock, "pageName", "CM_Some page");
		Mockito.doCallRealMethod()
				.when(this.gotoPageButtonMock)
				.execute();
		
		this.gotoPageButtonMock.execute();
		
		Mockito.verify(this.gotoPageButtonMock, Mockito.times(1)).gotoCommonPage();
	}

	
	@Test
	public void executeCallGoToPage() {
		Mockito.doCallRealMethod()
				.when(this.gotoPageButtonMock)
				.execute();
		
		this.gotoPageButtonMock.execute();
		
		Mockito.verify(this.gotoPageButtonMock, Mockito.times(1)).gotoPage();		
	}
	
	@Test
	public void gotoPageSetPageByName() {
		Mockito.doCallRealMethod()
				.when(this.gotoPageButtonMock)
				.gotoPage();
		
		this.gotoPageButtonMock.gotoPage();
		
		Mockito.verify(this.iPlayerCommandsMock, Mockito.times(1)).gotoPage("Some page");
	}
	
	@Test 
	public void gotoPageShouldSetPageByIndex() {
		Whitebox.setInternalState(this.gotoPageButtonMock, "pageName", "");
		Whitebox.setInternalState(this.gotoPageButtonMock, "pageIndex", "5");
		Mockito.doCallRealMethod()
				.when(this.gotoPageButtonMock)
				.gotoPage();		
		
		this.gotoPageButtonMock.gotoPage();

		Mockito.verify(this.iPlayerCommandsMock, Mockito.times(1)).gotoPageIndex(4);
	}
	
	@Test
	public void gotoCommonPageShouldSetPoperlyCommonPage() {
		Whitebox.setInternalState(this.gotoPageButtonMock, "pageName", "CM_Some page");
		Mockito.doCallRealMethod()
				.when(this.gotoPageButtonMock)
				.gotoCommonPage();
		
		this.gotoPageButtonMock.gotoCommonPage();
		
		Mockito.verify(this.iPlayerCommandsMock, Mockito.times(1)).gotoCommonPage("Some page");
	}
}
