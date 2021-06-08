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
		Node tableBody = element.getChild(0);
		Node tableTR = tableBody.getChild(0);
		Element elementTextNode = (Element) tableTR.getChild(1);

		String expectedText = item.getText();
		String returnedText = elementTextNode.getInnerHTML();
		assertEquals(expectedText, returnedText);
	}

	private Element createPrintableDOMElement() {
		OrderingItem item = new OrderingItem(1, "element 1", "string", 1);
		return item.toPrintableDOMElement(this.indexBox);
	}
}
