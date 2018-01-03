package com.lorepo.icplayer.client.module.report;

import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import org.junit.Test;
import org.mockito.Mockito;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.content.services.PlayerServices;
import com.lorepo.icplayer.client.content.services.ScoreService;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.report.mockup.ReportDisplayMockup;
import com.lorepo.icplayer.client.xml.content.parsers.ContentParser_v0;

public class PresenterTestCase {

	@Test
	public void checkRowCount() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content.xml");

		IPlayerServices playerServicesMock = Mockito.mock(PlayerServices.class);
		Mockito.when(playerServicesMock.getModel()).thenReturn(model);
		Mockito.when(playerServicesMock.getScoreService()).thenReturn(Mockito.mock(ScoreService.class));

		ReportDisplayMockup display = new ReportDisplayMockup();
		ReportModule module = new ReportModule();
		ReportPresenter presenter = new ReportPresenter(module, playerServicesMock);
		presenter.addView(display);

		assertEquals(3, display.getRowCount());
	}

	private Content initContentFromFile(String path) throws SAXException, IOException {

		InputStream inputStream = getClass().getResourceAsStream(path);
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);

		ContentParser_v0 parser = new ContentParser_v0();
		parser.setPagesSubset(new ArrayList<Integer> ());
		
		return (Content) parser.parse(element);
	}
}
