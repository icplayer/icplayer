package com.lorepo.icplayer.client.content.service;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mockito;

import com.lorepo.icplayer.client.content.services.PlayerServices;
import com.lorepo.icplayer.client.content.services.dto.ScaleInformation;

public class PlayerServicesTestCase {
	
	private PlayerServices mockedPlayerServices;
	
	@Rule
	public final ExpectedException exception = ExpectedException.none();
	
	@Before
	public void setUp () {
		mockedPlayerServices = Mockito.mock(PlayerServices.class);
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

}
