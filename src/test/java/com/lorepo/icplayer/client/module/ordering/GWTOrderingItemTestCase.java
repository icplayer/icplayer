package com.lorepo.icplayer.client.module.ordering;

import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.Node;
import com.google.gwt.user.client.DOM;
import com.lorepo.icplayer.client.GWTPowerMockitoTest;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;


public class GWTOrderingItemTestCase extends GWTPowerMockitoTest {
	Element indexBox = null;
	String indexBoxId = "1000";
	String audioHTML = "\\audio{/file/serve/5698751586893824}";
	String audioDivHTML = "<div>\\audio{/file/serve/5698751586893824}</div>";
	String emptyDivHTML = "<div></div>";
	String brDivHTML = "<div><br></div>";

	@Before
	public void setUp() throws Exception {
		this.indexBox = DOM.createDiv();
		this.indexBox.setId(this.indexBoxId);
	}

	@Test
	public void toPrintableDOMElementCheckClassName() {
		Element element = createPrintableDOMElement();

		String expectedClassName = "item-wrapper";
		String returnedClassName = element.getClassName();
		assertEquals(expectedClassName, returnedClassName);
	}

	@Test
	public void toPrintableDOMElementCheckStructure() {
		Element element = createPrintableDOMElement();

		Node tableBody = element.getChild(0);
		Node tableTR = tableBody.getChild(0);

		Element elementTDWithIndexBox = (Element) tableTR.getChild(0);
		int elementIndexBoxChildAmount = elementTDWithIndexBox.getChildCount();
		int expectedElementIndexBoxChildAmount = 1;
		assertEquals(expectedElementIndexBoxChildAmount, elementIndexBoxChildAmount);

		Element elementIndexBox = (Element) elementTDWithIndexBox.getChild(0);
		String returnedId = elementIndexBox.getId();
		assertEquals(this.indexBoxId, returnedId);

		Node elementTextNode = tableTR.getChild(1);
		assertNotNull(elementTextNode);
	}

	@Test
	public void toPrintableDOMElementCheckTextNode() {
		OrderingItem item = new OrderingItem(1, "element 1", "string", 1);
		Element element = item.toPrintableDOMElement(this.indexBox);

		String expectedText = item.getText();
		String returnedText = getElementTextNodeInnerHTML(element);
		assertEquals(expectedText, returnedText);
	}

	@Test
	public void toPrintableDOMElementCheckMultilineTextNode() {
		String itemHTML
			= brDivHTML + brDivHTML
			+ "element 1"
			+ brDivHTML + brDivHTML;
		OrderingItem item = new OrderingItem(1, itemHTML, "string", 1);
		Element element = item.toPrintableDOMElement(this.indexBox);

		String expectedText = itemHTML;
		String returnedText = getElementTextNodeInnerHTML(element);
		assertEquals(expectedText, returnedText);
	}

	private Element createPrintableDOMElement() {
		OrderingItem item = new OrderingItem(1, "element 1", "string", 1);
		return item.toPrintableDOMElement(this.indexBox);
	}

	@Test
	public void toPrintableDOMElementCheckStructureWithAudio() {
		Element element = createPrintableDOMElementWithAudio("element 1");

		Node tableBody = element.getChild(0);
		Node tableTR = tableBody.getChild(0);

		Element elementTDWithIndexBox = (Element) tableTR.getChild(0);
		int elementIndexBoxChildAmount = elementTDWithIndexBox.getChildCount();
		int expectedElementIndexBoxChildAmount = 1;
		assertEquals(expectedElementIndexBoxChildAmount, elementIndexBoxChildAmount);

		Element elementIndexBox = (Element) elementTDWithIndexBox.getChild(0);
		String returnedId = elementIndexBox.getId();
		assertEquals(this.indexBoxId, returnedId);

		Node elementTextNode = tableTR.getChild(1);
		assertNotNull(elementTextNode);
	}

	@Test
	public void toPrintableDOMElementCheckTextNodeWithAudio() {
		String itemHTML = audioHTML + "element 1" + audioHTML;
		Element element = createPrintableDOMElementWithAudio(itemHTML);

		String expectedText = "element 1";
		String returnedText = getElementTextNodeInnerHTML(element);
		assertEquals(expectedText, returnedText);
	}

	@Test
	public void toPrintableDOMElementCheckMultilineTextNodeWithAudio() {
		String itemHTML = audioDivHTML + "element 1" + audioDivHTML;
		Element element = createPrintableDOMElementWithAudio(itemHTML);

		String expectedText = brDivHTML + "element 1" + brDivHTML;
		String returnedText = getElementTextNodeInnerHTML(element);
		assertEquals(expectedText, returnedText);
	}

	@Test
	public void toPrintableDOMElementCheckTextNodeWithAudiosAndTexts() {
		String itemHTML
			= audioHTML + audioHTML + "element 1"
			+ audioHTML + audioHTML + "element 2"
			+ audioHTML + audioHTML;
		Element element = createPrintableDOMElementWithAudio(itemHTML);

		String expectedText = "element 1element 2";
		String returnedText = getElementTextNodeInnerHTML(element);
		assertEquals(expectedText, returnedText);
	}

	@Test
	public void toPrintableDOMElementCheckTextNodeWithMultilineAudiosAndTexts() {
		String itemHTML
			= audioDivHTML + audioDivHTML + "element 1"
			+ audioDivHTML + audioDivHTML + "element 2"
			+ audioDivHTML + audioDivHTML;
		Element element = createPrintableDOMElementWithAudio(itemHTML);

		String expectedText
			= brDivHTML + brDivHTML + "element 1"
			+ brDivHTML + brDivHTML + "element 2"
			+ brDivHTML + brDivHTML;
		String returnedText = getElementTextNodeInnerHTML(element);
		assertEquals(expectedText, returnedText);
	}

	@Test
	public void toPrintableDOMElementCheckTextNodeWithMixedAudiosAndTexts() {
		String itemHTML
			= audioHTML + audioDivHTML + "element 1"
			+ audioHTML + " element 2"
			+ audioDivHTML + audioHTML;
		Element element = createPrintableDOMElementWithAudio(itemHTML);

		String expectedText
			= brDivHTML + "element 1 element 2" + brDivHTML;
		String returnedText = getElementTextNodeInnerHTML(element);
		assertEquals(expectedText, returnedText);
	}

	private Element createPrintableDOMElementWithAudio(String itemText) {
		OrderingItem item = new OrderingItem(1, itemText, "string", 1);
		return item.toPrintableDOMElement(this.indexBox);
	}

	private String getElementTextNodeInnerHTML(Element itemElement) {
		Node tableBody = itemElement.getChild(0);
		Node tableTR = tableBody.getChild(0);
		Element elementTextNode = (Element) tableTR.getChild(1);
		return elementTextNode.getInnerHTML();
	}
}
