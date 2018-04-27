package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.*;

import org.junit.Test;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class WCAGUtilsTestCase extends GwtTest {
	@Test
	public void properHTMLTest() {
		String html = "<div> test-string <b>test-string2</b> <br/> </div>";
		String expected = "test-string test-string2";
		
		String result = WCAGUtils.getCleanText(html);
		assertEquals(expected, result);
	}

	@Test
	public void testWithLessThanSign() {
		String html = "<div> test-string < test-string2 </div>";
		String expected = "test-string < test-string2";
		
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
		String expected = "\\gap{test}";
		
		String result = WCAGUtils.getCleanText(html);
		assertEquals(expected, result);
	}
	
	@Test
	public void testGetImageAltTexts() {
		String html = "<div> <img alt=\"test\"></img> </div>";
		String expected = "<div> <img alt=\"test\"></img><span> test </span> </div>";
		
		String result = WCAGUtils.getImageAltTexts(html);
		System.out.println(result);
		assertEquals(expected, result);
	}
}
