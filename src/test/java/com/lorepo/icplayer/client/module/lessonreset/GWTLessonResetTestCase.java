package com.lorepo.icplayer.client.module.lessonreset;

import org.junit.Before;
import org.junit.Test;
import org.powermock.reflect.Whitebox;
import org.xml.sax.SAXException;

import java.io.IOException;

import org.custommonkey.xmlunit.Diff;
import org.custommonkey.xmlunit.XMLAssert;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTLessonResetTestCase extends GwtTest {
	LessonResetModule module = null;
	
	@Before
	public void setUp () {
		module = new LessonResetModule();
	}
	
	@Test
	public void testToXML () throws SAXException, IOException {
		String expected = "<lessonResetModule id=\"some &lt;&gt; id\" isTabindexEnabled=\"false\" shouldOmitInKeyboardNavigation=\"true\" shouldOmitInTTS=\"true\" ttsTitle=\"some &lt;script&gt;ttsTitle&lt;/script&gt;\"><layouts isVisible=\"true\"><layout isLocked=\"false\" isModuleVisibleInEditor=\"true\" id=\"default\"><relative type=\"LTWH\"><left relative=\"\" property=\"left\"/><top relative=\"\" property=\"top\"/><right relative=\"\" property=\"right\"/><bottom relative=\"\" property=\"bottom\"/></relative><absolute left=\"0\" right=\"0\" top=\"0\" bottom=\"0\" width=\"0\" height=\"0\"/></layout></layouts><lessonReset title=\"some&lt;&gt; stitle\" resetMistakes=\"false\" resetChecks=\"false\" resetVisitedPages=\"false\" lesson_was_reset=\"\"/></lessonResetModule>";
		Whitebox.setInternalState(module, "title", "some<> stitle");
		Whitebox.setInternalState(module, "id", "some <> id");
		Whitebox.setInternalState(module, "ttsTitle", "some <script>ttsTitle</script>");
		Whitebox.setInternalState(module, "shouldOmitInKeyboardNavigation", true);
		Whitebox.setInternalState(module, "shouldOmitInTTS", true);
		
		String xml = module.toXML();
		
		Diff diff = new Diff(expected, xml);
		
		XMLAssert.assertXMLEqual(diff, true);
	}
}
