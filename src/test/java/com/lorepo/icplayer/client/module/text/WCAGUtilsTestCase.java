package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.*;

import org.junit.Test;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class WCAGUtilsTestCase extends GwtTest {
	@Test
	public void properHTMLTest() {
		String html = "<div> test-string <b>test-string2</b> </div>";
		String expected = "test-string test-string2 .";
		
		String result = WCAGUtils.getCleanText(html);
		assertEquals(expected, result);
	}

	@Test
	public void testWithLessThanSign() {
		String html = "<div> test-string < test-string2 </div>";
		String expected = "test-string < test-string2 .";
		
		String result = WCAGUtils.getCleanText(html);
		assertEquals(expected, result);
	}
	
	@Test
	public void testWithNormalString() {
		String html = "test-string";
		String expected = "test-string";
		
		String result = WCAGUtils.getCleanText(html);
		assertEquals(expected, result);
	}
	
	@Test
	public void testWithGap() {
		String html = "<div> \\gap{test} </div>";
		String expected = "\\gap{test} .";
		
		String result = WCAGUtils.getCleanText(html);
		assertEquals(expected, result);
	}
	
	@Test
	public void testGetImageAltTexts() {
		String html = "<div> <img src=\"aaa\"/><img src=\"bbb\" alt=\"test\"/> </div>";
		String expected = "<div> <img src=\"aaa\"/> test  </div>";
		
		String result = WCAGUtils.getImageAltTexts(html);
		assertEquals(expected, result);
	}
	
	@Test
	public void testGetImageAltTextsWithBreaks() {
		String html = "<div> <img src=\"aaa\"/><img src=\"bbb\" alt=\"test\"/> </div>";
		String expected = "<div> <img src=\"aaa\"/>&&break&& test &&break&& </div>";
		
		String result = WCAGUtils.getImageAltTextsWithBreaks(html);
		assertEquals(expected, result);
	}

	@Test
	public void testAddSpacesToListElements() {
		String html = "<div> <ul> <li>element</li> <li>!@#|\\$%/^&*()_+<></li> </ul> </div>";
		String expected = "<div> <ul> <li>element, </li> <li>!@#|\\$%/^&*()_+<>, </li> </ul> </div>";

		String result = WCAGUtils.addSpacesToListTags(html);
		assertEquals(expected, result);
	}

	@Test
	public void testParseSingleLineBreak() {
		String html = "<font size=\"6\"> test-string <b>test-string2</b> <br></font>";
		String expected = "test-string test-string2 .";

		String result = WCAGUtils.getCleanText(html);
		
		assertEquals(expected, result);
	}

	@Test
	public void testParseDivAfterBrWillNotAddRedundantDot() {
		String html = "<div> test-string <b>test-string2</b> <br></div>";
		String expected = "test-string test-string2 .";

		String result = WCAGUtils.getCleanText(html);

		assertEquals(expected, result);
	}

	@Test
	public void testParseLineBreakWithAttribute() {
		String html = "<div> test-string <b>test-string2</b> <br id=\"someID\"></div>";
		String expected = "test-string test-string2 .";

		String result = WCAGUtils.getCleanText(html);

		assertEquals(expected, result);
	}

	@Test
	public void testParseDivBeforeBrWillAddDot() {
		String html = "<div> test-string <b>test-string2</b> </div><br>";
		String expected = "test-string test-string2 . .";

		String result = WCAGUtils.getCleanText(html);

		assertEquals(expected, result);
	}

	@Test
	public void testParseMultiLineBreak() {
		String html = "<div> test-string <b>test-string2</b> <br></div><br>";
		String expected = "test-string test-string2 . .";

		String result = WCAGUtils.getCleanText(html);

		assertEquals(expected, result);
	}
}
