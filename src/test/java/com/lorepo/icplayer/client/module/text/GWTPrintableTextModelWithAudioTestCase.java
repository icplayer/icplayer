package com.lorepo.icplayer.client.module.text;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.GWTPowerMockitoTest;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;
import org.junit.Before;
import org.junit.Test;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.reflect.Whitebox;

import java.io.InputStream;

import static org.junit.Assert.*;


@PrepareForTest({TextView.class})
public class GWTPrintableTextModelWithAudioTestCase extends GWTPowerMockitoTest {

	private final String PAGE_VERSION = "2";

	private TextModel model = null;
	private TextPrintable printable = null;

	private String getPrintableHTML() {
		return printable.getPrintableHTML("myText", false);
	}

	@Before
	public void initData() throws Exception {
		// PowerMockito - allows the use of constructor
		model = PowerMockito.spy(new TextModel());
		InputStream inputStream = getClass().getResourceAsStream("testdata/module7.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		model.load(element, "", PAGE_VERSION);

		printable = new TextPrintable(model);

		PowerMockito.when(model.getPrintable()).thenReturn(PrintableMode.YES);
	}

	@Test
	public void getPrintableHTMLWhenAudioInText() {
		model.setPrintableState("");

		String result = removeIDs(getPrintableHTML());

		String expected = removeIDs("<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>Without gaps.</p> <p>A dropdown gap: <span class=\"printable_dropdown\">option 1 / option 2 / option 3</span>.</p> <p>An editable or a draggable gap: &nbsp;<span id=\"yKyibg-1\" class=\"printable_gap\">&nbsp;</span>.</p> <p>A gap with 2 correct options: &nbsp;<span id=\"yKyibg-2\" class=\"printable_gap\">&nbsp;</span>.</p> <p>This is a filled gap: &nbsp;<span id=\"yKyibg-3\" class=\"printable_gap\">initial text</span></p> <p></p> <p> </p> <p>Text and audio: . AAAA</p> </div>");
		assertEquals(expected, result);
	}

	private String removeIDs(String raw) {
		return raw.replaceAll("id=\".*?\"","id");
	}
}
