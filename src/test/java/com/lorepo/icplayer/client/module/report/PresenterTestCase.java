package com.lorepo.icplayer.client.module.report;

import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.io.InputStream;

import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.module.report.mockup.ReportDisplayMockup;

public class PresenterTestCase {

	@Test
	public void checkRowCount() throws SAXException, IOException {
		
		Content model = initContentFromFile("testdata/content.xml");
		PlayerServicesMockup services = new PlayerServicesMockup();
		ReportDisplayMockup display = new ReportDisplayMockup();
		services.setModel(model);
		ReportModule module = new ReportModule();
		ReportPresenter presenter = new ReportPresenter(module, services);
		presenter.addView(display);
		
		assertEquals(3, display.getRowCount());
	}

	private Content initContentFromFile(String path) throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream(path);
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		Content model = new Content();
		model.load(element, "");

		return model;
	}

	
}
