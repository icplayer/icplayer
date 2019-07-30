package com.lorepo.icplayer.client.content.service;

import static org.junit.Assert.*;

import java.util.HashSet;
import java.util.Set;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mockito;
import org.mockito.internal.util.reflection.Whitebox;

import com.lorepo.icplayer.client.PlayerApp;
import com.lorepo.icplayer.client.PlayerController;
import com.lorepo.icplayer.client.content.services.PlayerServices;
import com.lorepo.icplayer.client.content.services.dto.ScaleInformation;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.model.page.Page;

public class PlayerServicesTestCase {
	
	private PlayerServices mockedPlayerServices;
	private PlayerApp mockedApplication;
	
	@Rule
	public final ExpectedException exception = ExpectedException.none();
	
	@Before
	public void setUp () {
		this.mockedApplication = Mockito.mock(PlayerApp.class);
		mockedPlayerServices = Mockito.mock(PlayerServices.class);
		Whitebox.setInternalState(mockedPlayerServices, "application", this.mockedApplication);
		
		Mockito.when(mockedPlayerServices.getScaleInformation()).thenCallRealMethod();
		Mockito.doNothing().when(mockedPlayerServices).fixDroppable();
		Mockito.doCallRealMethod().when(mockedPlayerServices).setScaleInformation(Mockito.any(String.class),Mockito.any(String.class),Mockito.any(String.class),Mockito.any(String.class));
		
	};
	
	@Test
	public void setCorrectScaleInformation() {
		mockedPlayerServices.setScaleInformation("0.5", "0.5", "scale(0.5)", "top left");
		ScaleInformation scaleInfo = mockedPlayerServices.getScaleInformation();
		assertTrue(scaleInfo.scaleX==0.5);
		assertTrue(scaleInfo.scaleY==0.5);
		assertTrue(scaleInfo.transform.equals("scale(0.5)"));
		assertTrue(scaleInfo.transformOrigin.equals("top left"));
		
	};
	
	@Test
	public void setIncorrectTransformScaleInformation() {
		exception.expect(NullPointerException.class);
		mockedPlayerServices.setScaleInformation("0.5", "0.5", null, null);
	};
	
	@Test
	public void setIncorrectScaleXYScaleInformation() {
		exception.expect(NumberFormatException.class);
		mockedPlayerServices.setScaleInformation("abc", "hello", "scale(0.5)", "top left");
	};
	
	@Test
	public void changeSemiResponsiveLayoutCallsApplicationChangeLayout() {
		Mockito.doReturn(false).when(this.mockedApplication).changeLayout(Mockito.any(String.class));
		Mockito.doCallRealMethod().when(mockedPlayerServices).changeSemiResponsiveLayout("testID");
		
		mockedPlayerServices.changeSemiResponsiveLayout("testID");
		
		Mockito.verify(this.mockedApplication, Mockito.times(1)).changeLayout("testID");
	}
	
	@Test
	public void whenChangeLayoutCannotBeDoneItReturnsFalse() {
		Mockito.doCallRealMethod().when(mockedPlayerServices).changeSemiResponsiveLayout(Mockito.any(String.class));
		Mockito.doReturn(false).when(this.mockedApplication).changeLayout(Mockito.any(String.class));
		
		boolean result = mockedPlayerServices.changeSemiResponsiveLayout("testID");
		
		assertFalse(result);
	}
	
	@Test
	public void whenChangeLayoutCanBeDoneItReturnsTrue() {
		Mockito.when(mockedPlayerServices.changeSemiResponsiveLayout("testID")).thenCallRealMethod();
		Mockito.doReturn(true).when(this.mockedApplication).changeLayout(Mockito.any(String.class));
		
		boolean result = mockedPlayerServices.changeSemiResponsiveLayout("testID");
		
		assertTrue(result);
	}
	
	@Test
	public void changingLayoutHaveToTryByNameIfUserPassedLayoutNameInsteadID() {
		String layoutName = "testLayoutName";
		
		Mockito.doReturn(false).when(this.mockedApplication).changeLayout(Mockito.any(String.class));
		Mockito.doReturn(true).when(this.mockedApplication).changeLayoutByName(Mockito.any(String.class));
		Mockito.doCallRealMethod().when(this.mockedPlayerServices).changeSemiResponsiveLayout(Mockito.any(String.class));
		
		mockedPlayerServices.changeSemiResponsiveLayout(layoutName);
		
		Mockito.verify(this.mockedApplication, Mockito.times(1)).changeLayout(layoutName);
		Mockito.verify(this.mockedApplication, Mockito.times(1)).changeLayoutByName(layoutName);
	}
	
	@Test
	public void testLayoutChangeEnabledLayoutUpdate() {
		PlayerApp applicationMock = Mockito.mock(PlayerApp.class);
		Mockito.doCallRealMethod().when(mockedPlayerServices).setAbleChangeLayout(Mockito.anyBoolean());
		Mockito.doCallRealMethod().when(mockedPlayerServices).setApplication(Mockito.any(PlayerApp.class));
		mockedPlayerServices.setApplication(applicationMock);
		mockedPlayerServices.setAbleChangeLayout(false);
		mockedPlayerServices.setAbleChangeLayout(false);
		mockedPlayerServices.setAbleChangeLayout(true);
		mockedPlayerServices.setAbleChangeLayout(true);
		mockedPlayerServices.setAbleChangeLayout(false);
		Mockito.verify(applicationMock, Mockito.times(1)).updateLayout();
	};
	
	@Test
	public void testGivenVisitedPagesSetWhenTestingIfPagesWereVisitedThenReturnTrueOnlyForVisitedPages() {
		PlayerController controllerMock = Mockito.mock(PlayerController.class);
		Whitebox.setInternalState(mockedPlayerServices, "playerController", controllerMock);
		
		Set<IPage> visitedPages = new HashSet<IPage>();
		Page page1 = new Page("page1","");
		Page page2 = new Page("page2","");
		Page page3 = new Page("page3","");
		visitedPages.add(page1);
		visitedPages.add(page2);
		
		Mockito.doReturn(visitedPages).when(controllerMock).getVisitedPages();
		Mockito.doCallRealMethod().when(mockedPlayerServices).isPageVisited(Mockito.any(IPage.class));
		
		assertTrue(mockedPlayerServices.isPageVisited(page1));
		assertTrue(mockedPlayerServices.isPageVisited(page2));
		assertFalse(mockedPlayerServices.isPageVisited(page3));
	}
}
