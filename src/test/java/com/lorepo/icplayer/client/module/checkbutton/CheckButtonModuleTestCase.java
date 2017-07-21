package com.lorepo.icplayer.client.module.checkbutton;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;

@RunWith(PowerMockRunner.class)
@PrepareForTest(DictionaryWrapper.class)
public class CheckButtonModuleTestCase {

	private static final String PAGE_VERSION = "2";

	@Test
	public void moduleTypeName() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("check_answers_button")).thenReturn("Check Button");

		CheckButtonModule module = new CheckButtonModule();
		assertEquals("Check Button", module.getModuleTypeName());
	}

	@Test
	public void backwardCompatibilityForCheckAnswers() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/checkAnswersButton.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		CheckButtonModule module = new CheckButtonModule();
		module.load(element, "", PAGE_VERSION);
		
		assertEquals("Some title", module.getCheckTitle());
		assertEquals("Some title", module.getUnCheckTitle());
	}	
}
