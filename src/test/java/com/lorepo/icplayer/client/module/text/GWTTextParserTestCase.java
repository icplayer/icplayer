package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.Iterator;

import org.junit.Test;

import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.NodeList;
import com.google.gwt.user.client.ui.HTML;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.module.text.GapInfo;
import com.lorepo.icplayer.client.module.text.LinkInfo;
import com.lorepo.icplayer.client.module.text.TextParser;
import com.lorepo.icplayer.client.module.text.TextParser.ParserResult;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTTextParserTestCase extends GwtTest{

	@Test
	public void gapMath5() {
		
		TextParser parser = new TextParser();
		String srcText ="\\gap{\\(f(x)=\\frac{x}{|x|}\\)}";
		
		parser.setId("xcf");
		parser.setUseDraggableGaps(true);
		ParserResult parsed = parser.parse(srcText);
		
		assertEquals(1, parsed.gapInfos.size());

		GapInfo gi = parsed.gapInfos.get(0);
		assertTrue(gi.isCorrect("\\(f(x)=\\frac{x}{|x|}\\)"));
	}
	

	@Test
	public void testLinks() {
		
		TextParser parser = new TextParser();
		String srcText ="This is [[page1|Link do strony 1]] and [[page2|Link do strony 2]]";
		String expectedText ="This is <a id='xcf-1' class='ic_definitionLink' href='javascript:void(0);'>Link do strony 1</a> and <a id='xcf-2' class='ic_definitionLink' href='javascript:void(0);'>Link do strony 2</a>";
		
		parser.setId("xcf");
		ParserResult parsedText = parser.parse(srcText);
		Iterator<LinkInfo> it = parsedText.linkInfos.iterator();
		expectedText = expectedText.replace("'xcf-1'", "'" + it.next().getId() + "'");
		expectedText = expectedText.replace("'xcf-2'", "'" + it.next().getId() + "'");
		
		assertEquals(expectedText, parsedText.parsedText);
	}

	@Test
	public void formattedLink() {
		
		TextParser parser = new TextParser();
		String srcText ="This is [[<span id='result_box' class='short_text' lang='en'><span class='hps'>Page1</span><span class='hps'></span></span>|Link do strony 1]]";
		
		parser.setId("xcf");
		ParserResult parsedText = parser.parse(srcText);

		Iterator<LinkInfo> it = parsedText.linkInfos.iterator();
		assertTrue(it.hasNext());
		LinkInfo info = it.next();
		assertEquals("Page1", info.getHref());
	}

	@Test
	public void testExternalLinks() {
		
		TextParser parser = new TextParser();
		String srcText ="This is [[page1|pageLink1]] and <a href='http://www.google.com'>externalLink1</a>. This is  [[page2|pageLink2]] and <a href='http://www.gwtproject.org/'>externalLink2</a>";
		String expectedText ="This is <a id='xcf-1' class='ic_definitionLink' href='javascript:void(0);'>pageLink1</a> and <a id='xcf-3' target='_blank' href='http://www.google.com'>externalLink1</a>. This is <a id='xcf-2' class='ic_definitionLink' href='javascript:void(0);'>pageLink2</a> and <a id='xcf-4' target='_blank' href='http://www.gwtproject.org/'>externalLink2</a>";
		
		parser.setId("xcf");
		ParserResult parsedText = parser.parse(srcText);
		Iterator<LinkInfo> it = parsedText.linkInfos.iterator();
		expectedText = expectedText.replace("'xcf-3'", "'" + it.next().getId() + "'");
		expectedText = expectedText.replace("'xcf-4'", "'" + it.next().getId() + "'");
		expectedText = expectedText.replace("'xcf-1'", "'" + it.next().getId() + "'");
		expectedText = expectedText.replace("'xcf-2'", "'" + it.next().getId() + "'");

		assertEquals(expectedText, parsedText.parsedText);
	}
	
	@Test
	public void testExternalLinksWithSpecialCharacters() {
		
		TextParser parser = new TextParser();
		String srcText ="This is <a href='https://www.google.pl/search?q=lorem+ipsum&oq=lorem+ipsum&aqs=chrome..69i57j0l5.2695j0j7&sourceid=chrome&espv=210&es_sm=93&ie=UTF-8'>externalLink1</a>.";
		String expectedText ="This is <a id='xcf-1' target='_blank' href='https://www.google.pl/search?q=lorem+ipsum&oq=lorem+ipsum&aqs=chrome..69i57j0l5.2695j0j7&sourceid=chrome&espv=210&es_sm=93&ie=UTF-8'>externalLink1</a>.";
		
		parser.setId("xcf");
		ParserResult parsedText = parser.parse(srcText);
		Iterator<LinkInfo> it = parsedText.linkInfos.iterator();
		expectedText = expectedText.replace("'xcf-1'", "'" + it.next().getId() + "'");

		assertEquals(expectedText, parsedText.parsedText);
	}
	
	@Test
	public void testGap1() {
		
		TextParser parser = new TextParser();
		String srcText ="\\gap{answer1|answer2|answer3} \\gap{answer1|answer2|answer3}";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		
		assertEquals(2, parsed.gapInfos.size());

	}

	@Test
	public void testGap3() {
		
		TextParser parser = new TextParser();
		String srcText ="\\gap{1:answer1|}";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		
		assertEquals(1, parsed.gapInfos.size());

		GapInfo gi = parsed.gapInfos.get(0);
		assertTrue(gi.isCorrect("1:answer1"));
	}
	
	
	@Test
	public void testDefinition1() {
		
		TextParser parser = new TextParser();
		String srcText ="\\def{słówko1} \\def{słówko2}";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		
		assertEquals(2, parsed.linkInfos.size());

	}

	@Test
	public void testDefinition2() {
		
		TextParser parser = new TextParser();
		String srcText ="\\def{słówko1} \\def{słówko2}";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		
		int index = parsed.parsedText.indexOf("słówko1");
		assertTrue(index > 0);
	}

	@Test
	public void testDefinition3() {
		
		TextParser parser = new TextParser();
		String srcText ="\\def{abc|słówko1} \\def{słówko2}";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);

		int index = parsed.parsedText.indexOf(">słówko1</a>");
		assertTrue(index > 0);
	}
	
	@Test
	public void testAltText() {
		
		TextParser parser = new TextParser();
		String srcText ="\\alt{słówko1|słówko2}";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		HTML html = new HTML(parsed.parsedText);
		Element htmlWidget = html.getElement();
		assertEquals(1, htmlWidget.getChildCount());
		
		Element wrapper = (Element) htmlWidget.getChild(0);
		assertEquals(1, wrapper.getChildCount());
		assertEquals("słówko2", wrapper.getAttribute("aria-label"));
		
		Element visibleChild = (Element) wrapper.getChild(0);
		assertEquals("true",visibleChild.getAttribute("aria-hidden"));
		assertEquals("słówko1",visibleChild.getInnerText());
	}


	/**
	 * Wrong syntax should be correctly parsed.
	 */
	@Test
	public void wrongSyntax() {
		
		TextParser parser = new TextParser();
		String srcText ="{{1 {{1:7200}}";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		
		assertEquals("#ERROR#", parsed.parsedText);
	}

	@Test
	public void skipGapInMath() {
		
		TextParser parser = new TextParser();
		parser.setUseDraggableGaps(true);
		String srcText ="\\(\\sqrt {{x^{10}}{y^8}} = \\sqrt {{x^{10}}}\\)";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);

		assertEquals("\\(\\sqrt {{x^{10}}{y^8}} = \\sqrt {{x^{10}}}\\)", parsed.parsedText);
	}

	@Test
	public void skipGapInMath2() {
		
		TextParser parser = new TextParser();
		parser.setUseDraggableGaps(true);
		String srcText ="This is \\(\\cfrac{{1}}{10^4}\\) not a gap";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);

		assertEquals("This is \\(\\cfrac{{1}}{10^4}\\) not a gap", parsed.parsedText);
	}

	@Test
	public void skipGaps() {
		TextParser parser = new TextParser();
		parser.skipGaps();
		String srcText ="This is {{2:ala}} and \\def{słówko1}";
		ParserResult parsed = parser.parse(srcText);
		
		assertEquals(1, parsed.linkInfos.size());
		assertTrue(parsed.parsedText.indexOf("{{2:ala}}") > 0);
	}
	
	public void parserIsInEditorModeAndAddAdditionalInformationsToElements() {
		TextParser parser = new TextParser();
		String srcText ="[[page1|Link do strony 1]] \\gap{answer1|answer2|answer3} \\gap{answer1|answer2|answer3} \\filledGap{initial text|answer} \\def{słowko1}";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText, true);
		
		assertTrue(parsed.parsedText.indexOf("data-gap-value=\"\\gap{answer1|answer2|answer3}\"") > -1);
		assertTrue(parsed.parsedText.indexOf("data-gap-value=\"\\filledGap{initial text|answer}\"") > -1);
		assertTrue(parsed.parsedText.indexOf("data-gap-value='\\def{słowko1}'") > -1);
	}
	
	@Test
	public void parserIsNotInEditorModeWillNotAddAdditionalInformation () {
		TextParser parser = new TextParser();
		String srcText ="[[page1|Link do strony 1]] \\gap{answer1|answer2|answer3} \\gap{answer1|answer2|answer3} \\filledGap{initial text|answer} \\def{słowko1}";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText, false);
		
		assertTrue(parsed.parsedText.indexOf("data-gap-value=\"\\gap{answer1|answer2|answer3}\"") == -1);
		assertTrue(parsed.parsedText.indexOf("data-gap-value=\"\\filledGap{initial text|answer}\"") == -1);
		assertTrue(parsed.parsedText.indexOf("data-gap-value='\\def{słowko1}'") == -1);		
	}
	
	@Test
	public void altTextParsing () {
		TextParser parser = new TextParser();
		String srcText ="\\alt{visible|readable}\\alt{visible2|readable2{langTag}-}<span value='\\alt{visible3|readable3}'>\\alt{visible4|readable4{langtag2}-}</span>";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		Element el = (new HTML(parsed.parsedText)).getElement();
		
		assertTrue(el.getChildCount()==3);
		
		Element child = (Element)el.getChild(0);
		assertTrue(checkCorrectAltTextElement(child,"visible","readable",""));
		
		child = (Element)el.getChild(1);
		assertTrue(checkCorrectAltTextElement(child,"visible2","readable2","langTag"));
		
		child = (Element)el.getChild(2);
		assertTrue(child.getChildCount()==1);
		assertTrue(child.getAttribute("value").equals("\\alt{visible3|readable3}"));
		
		child = (Element)child.getChild(0);
		assertTrue(checkCorrectAltTextElement(child,"visible4","readable4","langtag2"));
		
	}
	
	@Test
	public void altTextInsideDropdown () {
		TextParser parser = new TextParser();
		String srcText ="{{1:1|\\alt{hello|world{langTag}-}|3}}";
		
		parser.setId("xcf");
		parser.setKeepOriginalOrder(true);
		
		ParserResult parsed = parser.parse(srcText);
		System.out.println(parsed.parsedText);
		Element el = (new HTML(parsed.parsedText)).getElement();
		NodeList<Element> options = el.getElementsByTagName("option");
		
		assertTrue(options.getLength()==4);
		
		Element child = options.getItem(2);
		assertTrue(child.getChildCount()==1);
		assertTrue(child.getAttribute("value").equals("\\alt{hello|world{langTag}-}"));
		assertTrue(child.getAttribute("aria-label").equals("world"));
		
		child = (Element) child.getChild(0);
		assertTrue(checkCorrectAltTextElement(child,"hello","world","langTag"));
		
	}
	
	private boolean checkCorrectAltTextElement(Element root, String visible, String readable, String langTag) {
		if (root.getChildCount() != 1) {
			return false;
		}
		if(!root.getAttribute("aria-label").equals(readable)){
			return false;
		}
		if(langTag.length() > 0 && !root.getAttribute("langtag").equals(langTag)){
			return false;
		}

		Element child = (Element)root.getChild(0);
		if(!child.getAttribute("aria-hidden").equals("true")){
			return false;
		}
		if(!child.getInnerText().equals(visible)){
			return false;
		}
		return true;
	}
}
