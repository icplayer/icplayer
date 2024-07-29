package com.lorepo.icplayer.client.page;

import org.junit.Test;
import static org.junit.Assert.assertEquals;

import com.lorepo.icplayer.client.content.services.TimeService;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTTimeTestCase extends GwtTest {
	
	@SuppressWarnings("static-access")
	@Test
	public void loadFromStringTestWhenNull() {
		TimeService timeService = new TimeService();
		
		timeService.loadFromString(null);
		
		long totalTime = (long) timeService.getTotalTime();
		long expectedTime = 0;
		assertEquals(totalTime, expectedTime);
	}
	
	@SuppressWarnings("static-access")
	@Test
	public void loadFromStringTestWhenNotNull() {
		TimeService timeService = new TimeService();
		String timeState = "{\"pages_times\":\"{\\\"g9BxLlm3XGtsXj6Q\\\":\\\"35158\\\", \\\"yZdEJw2UCwFXX6xZ\\\":\\\"3087737\\\"}\"}";
		
		timeService.loadFromString(timeState);
		
		long totalTime = (long) timeService.getTotalTime();
		long expectedTime = 35158 + 3087737;
		assertEquals(totalTime, expectedTime);
	}
	
	@SuppressWarnings("static-access")
	@Test
	public void loadFromStringTestWhenNotNullAndOneTimeIsNegative() {
		TimeService timeService = new TimeService();
		String timeState = "{\"pages_times\":\"{\\\"g9BxLlm3XGtsXj6Q\\\":\\\"35158\\\", \\\"yZdEJw2UCwFXX6xZ\\\":\\\"-3087737\\\"}\"}";
		
		timeService.loadFromString(timeState);
		
		long totalTime = (long) timeService.getTotalTime();
		long expectedTime = 35158;
		assertEquals(totalTime, expectedTime);
	}
}
