package com.lorepo.icplayer.client.module.checkbutton;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;

import org.apache.tools.ant.filters.StringInputStream;
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


	@Test
	public void moduleTypeName() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("check_answers_button")).thenReturn("Check Button");

		CheckButtonModule module = new CheckButtonModule();
		assertEquals("Check Button", module.getModuleTypeName());
	}

	
	@Test
	public void saveLoad() throws SAXException, IOException {

		InputStream inputStream = getClass().getResourceAsStream("testdata/check1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		CheckButtonModule module = new CheckButtonModule();
		module.load(element, "");
		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new CheckButtonModule();
		module.load(element, "");
		
		assertEquals("check", module.getCheckTitle());
		assertEquals("unCheck", module.getUnCheckTitle());
	}
}
