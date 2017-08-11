package com.lorepo.icplayer.client.module.ordering;

import static org.junit.Assert.*;

import java.lang.reflect.Field;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTOrderingViewTestCase extends GwtTest{
	OrderingView orderingView = null;
	
	@Before
	public void beforeTest() {
		this.orderingView = Mockito.mock(OrderingView.class);
	}
	
	@Test
	public void ifMathJaxIsNotRenderedShowCommandShouldSetAttribute () throws NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException {
		Mockito.doCallRealMethod()
				.when(this.orderingView)
				.show();
		this.orderingView.show();
		
		Field shouldRefreshMathField = OrderingView.class.getDeclaredField("shouldRefreshMath");
		shouldRefreshMathField.setAccessible(true);
		
		assertTrue((Boolean)shouldRefreshMathField.get(this.orderingView));
		
	}
	
	@Test
	public void ifMathJaxCallRedneredCallbackThenMathJaxInAddonShouldBeRerendered() throws NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException {
		Mockito.doCallRealMethod()
				.when(this.orderingView)
				.mathJaxIsLoadedCallback();
		Field shouldRefreshMathField = OrderingView.class.getDeclaredField("shouldRefreshMath");
		shouldRefreshMathField.setAccessible(true);
		shouldRefreshMathField.set(this.orderingView, true);
		
		this.orderingView.mathJaxIsLoadedCallback();
		
		Mockito.verify(this.orderingView, Mockito.times(1)).refreshMath();
		Field mathJaxIsLoadedField = OrderingView.class.getDeclaredField("mathJaxIsLoaded");
		mathJaxIsLoadedField.setAccessible(true);
		
		boolean mathJaxIsLoaded = (Boolean)mathJaxIsLoadedField.get(this.orderingView);
		
		assertTrue(mathJaxIsLoaded);
	}
	
	@Test
	public void ifMathJaxWasRenderedThenCallingShowShouldRerenderViewInstantly() throws NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException {
		Mockito.doCallRealMethod()
			.when(this.orderingView)
			.show();
		Field mathJaxIsLoadedField = OrderingView.class.getDeclaredField("mathJaxIsLoaded");
		mathJaxIsLoadedField.setAccessible(true);
		mathJaxIsLoadedField.set(this.orderingView, true);
		
		this.orderingView.show();
		
		Mockito.verify(this.orderingView, Mockito.times(1)).refreshMath();
	}

}
