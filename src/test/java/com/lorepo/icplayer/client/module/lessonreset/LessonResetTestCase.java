package com.lorepo.icplayer.client.module.lessonreset;

import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.reflect.Whitebox;
import org.xml.sax.SAXException;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.io.IOException;

@RunWith(PowerMockRunner.class)
@PrepareForTest({LessonResetPresenter.class})
public class LessonResetTestCase {
	LessonResetModule module = null;
	IPlayerServices services = null;
	
	@Before
	public void setUp () {

		module = new LessonResetModule();
		Whitebox.setInternalState(module, "title", "1");
		Whitebox.setInternalState(module, "id", "2");
		services = new PlayerServicesMockup();
	}

	@Test
	public void testWhenClearVisitedPagesCommandIsCalledThenCallClearVisitedPagedMethod () throws SAXException, IOException {
		LessonResetPresenter presenter = new LessonResetPresenter(module, services);
		LessonResetPresenter presenterSpy = PowerMockito.spy(presenter);
		PowerMockito.doNothing().when(presenterSpy).executeAndClearVisitedPages();

		presenterSpy.executeCommand("executeandclearvisitedpages", null);

		verify(presenterSpy, times(1)).executeAndClearVisitedPages();
	}
}
