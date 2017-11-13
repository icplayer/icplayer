package com.lorepo.icplayer.client;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.powermock.reflect.Whitebox;

import com.google.gwt.http.client.RequestBuilder;
import com.google.gwt.http.client.RequestCallback;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icf.utils.ILoadListener;
import com.lorepo.icf.utils.XMLLoader;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.model.PageList;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.ui.PlayerView;

public class GWTPlayerControllerPageStampTestCase extends GWTPowerMockitoTest {
	PlayerController playerControllerMock = null;
	Content contentMock = null;
	PageList pageListMock = null;
	Page pageOneMock = null;
	Page pageTwoMock = null;
	PageController pageControllerMock = null;
	PlayerView playerViewMock = null;
	XMLLoader XMLLoaderMock = null;
	
	@Before
	public void setUp() throws Exception {
		this.playerControllerMock = Mockito.mock(PlayerController.class);
		this.contentMock = Mockito.mock(Content.class);
		this.pageControllerMock = Mockito.mock(PageController.class);
		this.playerViewMock = Mockito.mock(PlayerView.class);
		this.XMLLoaderMock = Mockito.mock(XMLLoader.class);
		this.pageOneMock = Mockito.mock(Page.class);
		this.pageTwoMock = Mockito.mock(Page.class);
		
		Whitebox.setInternalState(this.playerControllerMock, "contentModel", this.contentMock);
		Whitebox.setInternalState(this.playerControllerMock, "playerView", this.playerViewMock);
		
		Mockito.doNothing().when(this.XMLLoaderMock).load(Mockito.anyString(), Mockito.any(ILoadListener.class));
		Mockito.when(this.contentMock.getBaseUrl()).thenReturn("base");
		Mockito.when(this.pageOneMock.getId()).thenReturn("1");
		Mockito.when(this.pageOneMock.getHref()).thenReturn("1");
		Mockito.when(this.pageTwoMock.getId()).thenReturn("2");	
	}
	
	@Test
	public void whenSwitchingPageNewPageStampShouldBeGenerated() throws Exception {
		PowerMockito.whenNew(XMLLoader.class).withAnyArguments().thenReturn(this.XMLLoaderMock);
		Whitebox.invokeMethod(this.playerControllerMock, "switchToPage", this.pageOneMock, this.pageControllerMock);
		
		PowerMockito.verifyPrivate(this.playerControllerMock, Mockito.times(1)).invoke("generatePageStamp", "1");
	}
	
	
}
