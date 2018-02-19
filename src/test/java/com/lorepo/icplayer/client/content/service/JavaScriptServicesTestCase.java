package com.lorepo.icplayer.client.content.service;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mockito;

import com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices;
import com.lorepo.icplayer.client.content.services.dto.ScaleInformation;

public class JavaScriptServicesTestCase {
	
	private JavaScriptPlayerServices mockedJSPlayerServices;
	
	@Rule
	public final ExpectedException exception = ExpectedException.none();
	
	@Before
	public void setUp () {
		mockedJSPlayerServices = Mockito.mock(JavaScriptPlayerServices.class);
		Mockito.when(mockedJSPlayerServices.getScaleInformation()).thenCallRealMethod();
		Mockito.doCallRealMethod().when(mockedJSPlayerServices).setScaleInformation(Mockito.any(String.class),Mockito.any(String.class),Mockito.any(String.class),Mockito.any(String.class));
	};
	
	@Test
	public void setCorrectScaleInformation() {
		mockedJSPlayerServices.setScaleInformation("0.5", "0.5", "scale(0.5)", "top left");
		ScaleInformation scaleInfo = mockedJSPlayerServices.getScaleInformation();
		assertTrue(scaleInfo.scaleX==0.5);
		assertTrue(scaleInfo.scaleY==0.5);
		assertTrue(scaleInfo.transform.equals("scale(0.5)"));
		assertTrue(scaleInfo.transformOrigin.equals("top left"));
		
	};
	
	@Test
	public void setIncorrectTransformScaleInformation() {
		exception.expect(NullPointerException.class);
		mockedJSPlayerServices.setScaleInformation("0.5", "0.5", null, null);
	};
	
	@Test
	public void setIncorrectScaleXYScaleInformation() {
		exception.expect(NumberFormatException.class);
		mockedJSPlayerServices.setScaleInformation("abc", "hello", "scale(0.5)", "top left");
	};

}
