package com.lorepo.icplayer.client.module.button;

import org.junit.Before;

import static org.junit.Assert.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.powermock.reflect.Whitebox;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;

import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.module.button.ButtonModule.ButtonType;
import com.lorepo.icplayer.client.module.choice.SpeechTextsStaticListItem;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTButtonModuleTestCase extends GwtTest{
	ButtonModule module = null;
	
	@Before
	public void setUp () {
		module = new ButtonModule();
		ArrayList<SpeechTextsStaticListItem> resetSpeechTexts = new ArrayList<SpeechTextsStaticListItem>();
		SpeechTextsStaticListItem mockSpeechText = mock(SpeechTextsStaticListItem.class);
		SpeechTextsStaticListItem anotherMockSpeechText = mock(SpeechTextsStaticListItem.class);
		when(mockSpeechText.getText()).thenReturn("<>11");
		when(anotherMockSpeechText.getText()).thenReturn("<>12");
		resetSpeechTexts.add(mockSpeechText);
		resetSpeechTexts.add(anotherMockSpeechText);
		
		Whitebox.setInternalState(module, "id", "<>1");
		Whitebox.setInternalState(module, "text", "<>2");
		Whitebox.setInternalState(module, "onClick", "<>3");
		Whitebox.setInternalState(module, "additionalClasses", "<>4");
		Whitebox.setInternalState(module, "popupLeftPosition", "<>5");
		Whitebox.setInternalState(module, "popupTopPosition", "<>6");
		Whitebox.setInternalState(module, "pageIndex", "<>7");
		Whitebox.setInternalState(module, "confirmReset", true);
		Whitebox.setInternalState(module, "confirmInfo", "<>8");
		Whitebox.setInternalState(module, "confirmYesInfo", "<>9");
		Whitebox.setInternalState(module, "confirmNoInfo", "<>10");
		Whitebox.setInternalState(module, "shouldOmitInKeyboardNavigation", true);
		Whitebox.setInternalState(module, "shouldOmitInTTS", true);
		Whitebox.setInternalState(module, "ttsTitle", "<>11");
		Whitebox.setInternalState(module, "resetSpeechTextItems", resetSpeechTexts);
		Whitebox.setInternalState(module, "goToLastVisitedPage", true);
	}
	
	@Test
	public void toXML() {
		ButtonModule module = new ButtonModule();
		module.setLeft(1);
		module.setTop(2);
		module.setWidth(3);
		module.setHeight(4);
		module.setType("nextPage");
		
		String xml = module.toXML();
		
		String expected = "<buttonModule id=\"" + module.getId() + "\"";
		assertTrue(xml.startsWith(expected));
	}
	
	
	@Test
	public void testToXMLEscapingXMLPopup () {	
		String expected = "<buttonModule id=\"&lt;&gt;1\" isTabindexEnabled=\"false\" shouldOmitInKeyboardNavigation=\"true\" shouldOmitInTTS=\"true\" ttsTitle=\"&lt;&gt;11\"><layouts isVisible=\"true\"><layout isLocked=\"false\" isModuleVisibleInEditor=\"true\" id=\"default\"><relative type=\"LTWH\"><left relative=\"\" property=\"left\"/><top relative=\"\" property=\"top\"/><right relative=\"\" property=\"right\"/><bottom relative=\"\" property=\"bottom\"/></relative><absolute left=\"0\" right=\"0\" top=\"0\" bottom=\"0\" width=\"0\" height=\"0\"/></layout></layouts><button onclick=\"&lt;&gt;3\" type=\"popup\" text=\"&lt;&gt;2\" additionalClasses=\"&lt;&gt;4\" popupLeftPosition=\"&lt;&gt;5\" popupTopPosition=\"&lt;&gt;6\"/></buttonModule>";
		Whitebox.setInternalState(module, "type", ButtonType.popup);
		
		assertEquals(expected, module.toXML());
	}
	
	@Test
	public void testToXMLEscapingXMLGoToPage () {
		String expected = "<buttonModule id=\"&lt;&gt;1\" isTabindexEnabled=\"false\" shouldOmitInKeyboardNavigation=\"true\" shouldOmitInTTS=\"true\" ttsTitle=\"&lt;&gt;11\"><layouts isVisible=\"true\"><layout isLocked=\"false\" isModuleVisibleInEditor=\"true\" id=\"default\"><relative type=\"LTWH\"><left relative=\"\" property=\"left\"/><top relative=\"\" property=\"top\"/><right relative=\"\" property=\"right\"/><bottom relative=\"\" property=\"bottom\"/></relative><absolute left=\"0\" right=\"0\" top=\"0\" bottom=\"0\" width=\"0\" height=\"0\"/></layout></layouts><button onclick=\"&lt;&gt;3\" type=\"gotoPage\" text=\"&lt;&gt;2\" pageIndex=\"&lt;&gt;7\"/></buttonModule>";
		Whitebox.setInternalState(module, "type", ButtonType.gotoPage);
		
		assertEquals(expected, module.toXML());
	}
	
	@Test
	public void testToXMLEscapingXMLReset () {
		String expected = "<buttonModule id=\"&lt;&gt;1\" isTabindexEnabled=\"false\" shouldOmitInKeyboardNavigation=\"true\" shouldOmitInTTS=\"true\" ttsTitle=\"&lt;&gt;11\"><layouts isVisible=\"true\"><layout isLocked=\"false\" isModuleVisibleInEditor=\"true\" id=\"default\"><relative type=\"LTWH\"><left relative=\"\" property=\"left\"/><top relative=\"\" property=\"top\"/><right relative=\"\" property=\"right\"/><bottom relative=\"\" property=\"bottom\"/></relative><absolute left=\"0\" right=\"0\" top=\"0\" bottom=\"0\" width=\"0\" height=\"0\"/></layout></layouts><button onclick=\"&lt;&gt;3\" type=\"reset\" text=\"&lt;&gt;2\" resetOnlyWrong=\"false\" confirmReset=\"true\" confirmInfo=\"&lt;&gt;8\" confirmYesInfo=\"&lt;&gt;9\" confirmNoInfo=\"&lt;&gt;10\" resetReset=\"&lt;&gt;11\" resetSkipReset=\"&lt;&gt;12\"/></buttonModule>";
		Whitebox.setInternalState(module, "type", ButtonType.reset);

		assertEquals(expected, module.toXML());
	}
	
	@Test
	public void testToXMLEscapingXMLPrevPage () {
		String expected = "<buttonModule id=\"&lt;&gt;1\" isTabindexEnabled=\"false\" shouldOmitInKeyboardNavigation=\"true\" shouldOmitInTTS=\"true\" ttsTitle=\"&lt;&gt;11\"><layouts isVisible=\"true\"><layout isLocked=\"false\" isModuleVisibleInEditor=\"true\" id=\"default\"><relative type=\"LTWH\"><left relative=\"\" property=\"left\"/><top relative=\"\" property=\"top\"/><right relative=\"\" property=\"right\"/><bottom relative=\"\" property=\"bottom\"/></relative><absolute left=\"0\" right=\"0\" top=\"0\" bottom=\"0\" width=\"0\" height=\"0\"/></layout></layouts><button onclick=\"&lt;&gt;3\" type=\"prevPage\" text=\"&lt;&gt;2\" goToLastVisitedPage=\"true\"/></buttonModule>";
		Whitebox.setInternalState(module, "type", ButtonType.prevPage);
		
		assertEquals(expected, module.toXML());
	}
	
	@Test
	public void loadButtonPopup () throws Exception {
		String data = "<buttonModule id=\"&lt;&gt;1\" isTabindexEnabled=\"false\" shouldOmitInKeyboardNavigation=\"true\" shouldOmitInTTS=\"true\" ttsTitle=\"&lt;&gt;11\"><layouts><layout isLocked=\"false\" isModuleVisibleInEditor=\"true\" id=\"default\" isVisible=\"true\"><relative type=\"LTWH\"><left relative=\"\" property=\"left\"/><top relative=\"\" property=\"top\"/><right relative=\"\" property=\"right\"/><bottom relative=\"\" property=\"bottom\"/></relative><absolute left=\"0\" right=\"0\" top=\"0\" bottom=\"0\" width=\"0\" height=\"0\"/></layout></layouts><button onclick=\"&lt;&gt;3\" type=\"popup\" text=\"&lt;&gt;2\" additionalClasses=\"&lt;&gt;4\" popupLeftPosition=\"&lt;&gt;5\" popupTopPosition=\"&lt;&gt;6\"/></buttonModule>";
	
		InputStream inputStream = new ByteArrayInputStream(data.getBytes());
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		Whitebox.invokeMethod(module, "parseModuleNode", element);
		
		String onClick = Whitebox.getInternalState(module, "onClick");
		String text = Whitebox.getInternalState(module, "text");
		ButtonType type = Whitebox.getInternalState(module, "type");
		
		String additionalClasses = Whitebox.getInternalState(module, "additionalClasses");
		String popupLeftPosition = Whitebox.getInternalState(module, "popupLeftPosition");
		String popupTopPosition = Whitebox.getInternalState(module, "popupTopPosition");
		
		assertEquals("<>3", onClick);
		assertEquals("<>2", text);
		assertEquals(ButtonType.popup, type);
		
		assertEquals("<>4", additionalClasses);
		assertEquals("<>5", popupLeftPosition);
		assertEquals("<>6", popupTopPosition);
	}
	
	@Test
	public void loadButtonGoToPage () throws Exception {
		String data = "<buttonModule id=\"&lt;&gt;1\" isTabindexEnabled=\"false\" shouldOmitInKeyboardNavigation=\"true\" shouldOmitInTTS=\"true\" ttsTitle=\"&lt;&gt;11\"><layouts><layout isLocked=\"false\" isModuleVisibleInEditor=\"true\" id=\"default\" isVisible=\"true\"><relative type=\"LTWH\"><left relative=\"\" property=\"left\"/><top relative=\"\" property=\"top\"/><right relative=\"\" property=\"right\"/><bottom relative=\"\" property=\"bottom\"/></relative><absolute left=\"0\" right=\"0\" top=\"0\" bottom=\"0\" width=\"0\" height=\"0\"/></layout></layouts><button onclick=\"&lt;&gt;3\" type=\"gotoPage\" text=\"&lt;&gt;2\" pageIndex=\"&lt;&gt;7\"/></buttonModule>";
	
		InputStream inputStream = new ByteArrayInputStream(data.getBytes());
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		Whitebox.invokeMethod(module, "parseModuleNode", element);
		
		String onClick = Whitebox.getInternalState(module, "onClick");
		String text = Whitebox.getInternalState(module, "text");
		ButtonType type = Whitebox.getInternalState(module, "type");
		
		String pageIndex = Whitebox.getInternalState(module, "pageIndex");
		
		assertEquals("<>3", onClick);
		assertEquals("<>2", text);
		assertEquals(ButtonType.gotoPage, type);
		
		assertEquals("<>7", pageIndex);

	}
	
	
	@Test
	public void loadButtonReset () throws Exception {
		String data = "<buttonModule id=\"&lt;&gt;1\" isTabindexEnabled=\"false\" shouldOmitInKeyboardNavigation=\"true\" shouldOmitInTTS=\"true\" ttsTitle=\"&lt;&gt;11\"><layouts><layout isLocked=\"false\" isModuleVisibleInEditor=\"true\" id=\"default\" isVisible=\"true\"><relative type=\"LTWH\"><left relative=\"\" property=\"left\"/><top relative=\"\" property=\"top\"/><right relative=\"\" property=\"right\"/><bottom relative=\"\" property=\"bottom\"/></relative><absolute left=\"0\" right=\"0\" top=\"0\" bottom=\"0\" width=\"0\" height=\"0\"/></layout></layouts><button onclick=\"&lt;&gt;3\" type=\"reset\" text=\"&lt;&gt;2\" confirmReset=\"true\" confirmInfo=\"&lt;&gt;8\" confirmYesInfo=\"&lt;&gt;9\" confirmNoInfo=\"&lt;&gt;10\"/></buttonModule>";
	
		InputStream inputStream = new ByteArrayInputStream(data.getBytes());
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		Whitebox.invokeMethod(module, "parseModuleNode", element);
		
		String onClick = Whitebox.getInternalState(module, "onClick");
		String text = Whitebox.getInternalState(module, "text");
		ButtonType type = Whitebox.getInternalState(module, "type");
		
		Boolean confirmReset = Whitebox.getInternalState(module, "confirmReset");
		String confirmInfo = Whitebox.getInternalState(module, "confirmInfo");
		String confirmYesInfo = Whitebox.getInternalState(module, "confirmYesInfo");
		String confirmNoInfo = Whitebox.getInternalState(module, "confirmNoInfo");
		
		assertEquals("<>3", onClick);
		assertEquals("<>2", text);
		assertEquals(ButtonType.reset, type);
		
		assertEquals(true, confirmReset);
		assertEquals("<>8", confirmInfo);
		assertEquals("<>9", confirmYesInfo);
		assertEquals("<>10", confirmNoInfo);
	}
	
	@Test
	public void loadButtonPrevPage () throws Exception {
		String data = "<buttonModule id=\"&lt;&gt;1\" isTabindexEnabled=\"false\" shouldOmitInKeyboardNavigation=\"true\" shouldOmitInTTS=\"true\" ttsTitle=\"&lt;&gt;11\"><layouts><layout isLocked=\"false\" isModuleVisibleInEditor=\"true\" id=\"default\" isVisible=\"true\"><relative type=\"LTWH\"><left relative=\"\" property=\"left\"/><top relative=\"\" property=\"top\"/><right relative=\"\" property=\"right\"/><bottom relative=\"\" property=\"bottom\"/></relative><absolute left=\"0\" right=\"0\" top=\"0\" bottom=\"0\" width=\"0\" height=\"0\"/></layout></layouts><button onclick=\"&lt;&gt;3\" type=\"prevPage\" text=\"&lt;&gt;2\" goToLastVisitedPage=\"true\"/></buttonModule>";
	
		InputStream inputStream = new ByteArrayInputStream(data.getBytes());
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		Whitebox.invokeMethod(module, "parseModuleNode", element);
		
		String onClick = Whitebox.getInternalState(module, "onClick");
		String text = Whitebox.getInternalState(module, "text");
		ButtonType type = Whitebox.getInternalState(module, "type");
		
		Boolean goToLastVisitedPage = Whitebox.getInternalState(module, "goToLastVisitedPage");

		
		assertEquals("<>3", onClick);
		assertEquals("<>2", text);
		assertEquals(ButtonType.prevPage, type);
		
		assertEquals(true, goToLastVisitedPage);

	}
}
