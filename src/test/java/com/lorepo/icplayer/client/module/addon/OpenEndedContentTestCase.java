package com.lorepo.icplayer.client.module.addon;

import com.lorepo.icplayer.client.GWTPowerMockitoTest;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import org.junit.Test;
import org.xml.sax.SAXException;

import java.io.IOException;

import static org.junit.Assert.assertEquals;

public class OpenEndedContentTestCase extends GWTPowerMockitoTest {

	@Test
	public void whenCallingGetOpenEndedContentThenReturnAddonsOpenEndedContentValue() throws SAXException, IOException {
		PlayerServicesMockup services = new PlayerServicesMockup();
		AddonModel module = new AddonModel();
		AddonPresenter addon = new AddonPresenter(module, services);

		String openEndedContent = addon.getOpenEndedContent();

		assertEquals("Open Ended Content For Addon", openEndedContent);
	}

}
