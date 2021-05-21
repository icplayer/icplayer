package com.lorepo.icplayer.client.module.ordering;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.gwt.dom.client.Node;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.Style;
import com.lorepo.icplayer.client.content.services.JsonServices;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.printable.Printable;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.PrintableController;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.reflect.Whitebox;

import com.lorepo.icplayer.client.GWTPowerMockitoTest;
import com.google.gwt.user.client.DOM;

public class GWTOrderingPrintableTestCase extends GWTPowerMockitoTest {
	PrintableController printableController = null;
	OrderingModule model = null;
	OrderingPrintable orderingPrintable = null;
	ArrayList<OrderingItem> items = null;
	String userStateWithCorrectAlternativeOrder = "{\"order\":\"3,2,1\", \"isSolved\": \"true\"}}";
	String userStateWithCorrectOrder = "{\"order\":\"1,2,3\", \"isSolved\": \"true\"}";
	String userStateWithWrongOrder = "{\"order\":\"1,3,2\", \"isSolved\": \"true\"}}";

	@Before
	public void setUp() {
		this.model = Mockito.mock(OrderingModule.class);
		this.items = new ArrayList<OrderingItem>();

		OrderingItem item1 = new OrderingItem(1, "element 1", "string", 1);
		item1.addAlternativeIndex(3);
		this.items.add(item1);

		OrderingItem item2 = new OrderingItem(2, "element 2", "string", 2);
		this.items.add(item2);

		OrderingItem item3 = new OrderingItem(3, "element 3", "string", 3);
		item3.addAlternativeIndex(1);
		this.items.add(item3);

		Whitebox.setInternalState(this.model, "items", this.items);

		Mockito.when(this.model.getPrintable()).thenReturn(Printable.PrintableMode.YES);
		Mockito.when(this.model.getPrintableState()).thenReturn(null);

		Mockito.when(this.model.getItemCount()).thenCallRealMethod();
		Mockito.when(this.model.getItem(0)).thenCallRealMethod();
		Mockito.when(this.model.getItem(1)).thenCallRealMethod();
		Mockito.when(this.model.getItem(2)).thenCallRealMethod();

		Mockito.when(this.model.getId()).thenReturn("1");
		Mockito.when(this.model.isVertical()).thenReturn(true);

		Mockito.when(this.model.getPrintableState()).thenCallRealMethod();
	}

	@Test
	public void getPrintableHTMLIfNoPrintableMode() {
		Mockito.when(this.model.getPrintable()).thenReturn(Printable.PrintableMode.NO);
		this.orderingPrintable = new OrderingPrintable(this.model, this.printableController);
		String html = this.orderingPrintable.getPrintableHTML("", false);
		assertNull(html);
	}

	@Test
	public void getPrintableHTMLIfPrintableMode() {
		Mockito.when(this.model.getPrintable()).thenReturn(Printable.PrintableMode.YES);
		this.orderingPrintable = new OrderingPrintable(this.model, this.printableController);
		String html1 = this.orderingPrintable.getPrintableHTML("", false);
		assertNotNull(html1);

		Mockito.when(this.model.getPrintable()).thenReturn(Printable.PrintableMode.YES_RANDOM);
		this.orderingPrintable = new OrderingPrintable(this.model, this.printableController);
		String html2 = this.orderingPrintable.getPrintableHTML("", false);
		assertNotNull(html2);
	}

	@Test
	public void getPrintableHTMLWhenIsSplitInPrintBlocked() {
		Mockito.when(this.model.isSplitInPrintBlocked()).thenReturn(true);

		this.orderingPrintable = new OrderingPrintable(this.model, this.printableController);
		String html = this.orderingPrintable.getPrintableHTML("", false);
		Element htmlNode = (Element) getPrintableHTMLNode(html);

		String expectedClassName = PrintableContentParser.SPLITTABLE_CLASS_NAME;
		assertFalse(isNodeContainClass(htmlNode, expectedClassName));
	}

	@Test
	public void getPrintableHTMLWhenIsSplitInPrintNotBlocked() {
		Mockito.when(this.model.isSplitInPrintBlocked()).thenReturn(false);

		this.orderingPrintable = new OrderingPrintable(this.model, this.printableController);
		String html = this.orderingPrintable.getPrintableHTML("", false);
		Element htmlNode = (Element) getPrintableHTMLNode(html);

		String expectedClassName = PrintableContentParser.SPLITTABLE_CLASS_NAME;
		assertTrue(isNodeContainClass(htmlNode, expectedClassName));
	}

	@Test
	public void getPrintableHTMLWithoutClassName() {
		String className = "";
		String notExpectedClassName = "printable_module-";

		this.orderingPrintable = new OrderingPrintable(this.model, this.printableController);
		String html = this.orderingPrintable.getPrintableHTML(className, false);
		Element htmlNode = (Element) getPrintableHTMLNode(html);

		assertFalse(isNodeContainClass(htmlNode, notExpectedClassName));
	}

	@Test
	public void getPrintableHTMLWithClassName() {
		String className = "ordering_test";
		String expectedClassName = "printable_module-" + className;

		this.orderingPrintable = new OrderingPrintable(this.model, this.printableController);
		String html = this.orderingPrintable.getPrintableHTML(className, false);
		Element htmlNode = (Element) getPrintableHTMLNode(html);

		assertTrue(isNodeContainClass(htmlNode, expectedClassName));
	}

	@Test
	public void getPrintableHTMLCheckClassesWhenEmptyState() {
		Node htmlNode = getHTMLNodeWhenEmptyState();

		String rootClassName = "printable_module";
		assertTrue(isNodeContainClass(htmlNode, rootClassName));

		String itemsWrapperClass = "items-wrapper";
		assertTrue(isItemsWrapperHaveClass(htmlNode, itemsWrapperClass));

		String itemWrappersClass = "item-wrapper";
		assertTrue(areItemWrappersHaveClass(htmlNode, itemWrappersClass));

		String numberBoxesClass = "number-box";
		assertTrue(areNumberBoxesHaveClass(htmlNode, numberBoxesClass));

		assertNull(getSignNode(htmlNode));
	}

	@Test
	public void getPrintableHTMLCheckIndexesWhenEmptyState() {
		Node htmlNode = getHTMLNodeWhenEmptyState();
		ArrayList<Node> numberBoxes = getNumberBoxes(htmlNode);
		for (Node numberBox: numberBoxes){
			Element numberBoxElement = (Element) numberBox;
			String text = numberBoxElement.getInnerText();
			assertEquals("", text);
		}
	}

	@Test
	public void getPrintableHTMLCheckElementsAmountWhenEmptyState() {
		Node htmlNode = getHTMLNodeWhenEmptyState();
		int validAmount = this.model.getItemCount();

		ArrayList<Node> itemWrappers = getItemWrappers(htmlNode);
		assertEquals(validAmount, itemWrappers.size());

		ArrayList<Node> displaysViews = getDisplaysViews(htmlNode);
		assertEquals(validAmount, displaysViews.size());

		ArrayList<Node> numberBoxes = getNumberBoxes(htmlNode);
		assertEquals(validAmount, numberBoxes.size());

		ArrayList<Node> textTDs = getTextTDs(htmlNode);
		assertEquals(validAmount, textTDs.size());
	}

	@Test
	public void getPrintableHTMLCheckIfVerticalNodesWhenEmptyState() {
		Mockito.when(this.model.isVertical()).thenReturn(true);
		Node htmlNode = getHTMLNodeWhenEmptyState();
		Style expectedStyle = createDisplayBlockStyle();
		assertTrue(areDisplaysViewsHaveStyle(htmlNode, expectedStyle));
	}

	@Test
	public void getPrintableHTMLCheckIfHorizontalNodesWhenEmptyState() {
		Mockito.when(this.model.isVertical()).thenReturn(false);
		Node htmlNode = getHTMLNodeWhenEmptyState();
		Style expectedStyle = createDisplayInlineBlockStyle();
		assertTrue(areDisplaysViewsHaveStyle(htmlNode, expectedStyle));
	}

	private Node getHTMLNodeWhenEmptyState() {
		this.orderingPrintable = new OrderingPrintable(this.model, this.printableController);
		String html = this.orderingPrintable.getPrintableHTML("", false);
		return getPrintableHTMLNode(html);
	}

	@Test
	public void getPrintableHTMLCheckClassesWhenShowAnswersState() {
		Node htmlNode = getHTMLNodeWhenShowAnswersState();

		String rootClassName = "printable_module";
		assertTrue(isNodeContainClass(htmlNode, rootClassName));

		String itemsWrapperClass = "items-wrapper";
		assertTrue(isItemsWrapperHaveClass(htmlNode, itemsWrapperClass));

		String itemWrappersClass = "item-wrapper";
		assertTrue(areItemWrappersHaveClass(htmlNode, itemWrappersClass));

		String numberBoxesClass = "number-box";
		assertTrue(areNumberBoxesHaveClass(htmlNode, numberBoxesClass));

		assertNull(getSignNode(htmlNode));
	}

	@Test
	public void getPrintableHTMLCheckIndexesWhenShowAnswersState() {
		Node htmlNode = getHTMLNodeWhenShowAnswersState();
		ArrayList<Node> numberBoxes = getNumberBoxes(htmlNode);
		for (int i = 0; i < numberBoxes.size(); i++){
			Node numberBox = numberBoxes.get(i);
			Element numberBoxElement = (Element) numberBox;
			String text = numberBoxElement.getInnerText();
			String expectedText = Integer.toString(this.items.get(i).getIndex());
			assertEquals(expectedText, text);
		}
	}

	@Test
	public void getPrintableHTMLCheckElementsAmountWhenShowAnswersState() {
		Node htmlNode = getHTMLNodeWhenShowAnswersState();
		int validAmount = this.model.getItemCount();

		ArrayList<Node> itemWrappers = getItemWrappers(htmlNode);
		assertEquals(validAmount, itemWrappers.size());

		ArrayList<Node> displaysViews = getDisplaysViews(htmlNode);
		assertEquals(validAmount, displaysViews.size());

		ArrayList<Node> numberBoxes = getNumberBoxes(htmlNode);
		assertEquals(validAmount, numberBoxes.size());

		ArrayList<Node> textTDs = getTextTDs(htmlNode);
		assertEquals(validAmount, textTDs.size());
	}

	@Test
	public void getPrintableHTMLCheckIfVerticalNodesWhenShowAnswersState() {
		Mockito.when(this.model.isVertical()).thenReturn(true);
		Node htmlNode = getHTMLNodeWhenShowAnswersState();
		Style expectedStyle = createDisplayBlockStyle();
		assertTrue(areDisplaysViewsHaveStyle(htmlNode, expectedStyle));
	}

	@Test
	public void getPrintableHTMLCheckIfHorizontalNodesWhenShowAnswersState() {
		Mockito.when(this.model.isVertical()).thenReturn(false);
		Node htmlNode = getHTMLNodeWhenShowAnswersState();
		Style expectedStyle = createDisplayInlineBlockStyle();
		assertTrue(areDisplaysViewsHaveStyle(htmlNode, expectedStyle));
	}

	private Node getHTMLNodeWhenShowAnswersState() {
		this.orderingPrintable = new OrderingPrintable(this.model, this.printableController);
		String html = this.orderingPrintable.getPrintableHTML("", true);
		return getPrintableHTMLNode(html);
	}

	@Test
	public void getPrintableHTMLCheckClassesWhenShowUserAnswersState() {
		Node htmlNode = getHTMLNodeWhenShowUserAnswersState();

		String rootClassName = "printable_module";
		assertTrue(isNodeContainClass(htmlNode, rootClassName));

		String itemsWrapperClass = "items-wrapper";
		assertTrue(isItemsWrapperHaveClass(htmlNode, itemsWrapperClass));

		String itemWrappersClass = "item-wrapper";
		assertTrue(areItemWrappersHaveClass(htmlNode, itemWrappersClass));

		String numberBoxesClass = "number-box";
		assertTrue(areNumberBoxesHaveClass(htmlNode, numberBoxesClass));

		assertNull(getSignNode(htmlNode));
	}

	@Test
	public void getPrintableHTMLCheckIndexesWhenShowUserAnswersState() {
		Node htmlNode = getHTMLNodeWhenShowUserAnswersState();
		Integer[] indexes = getItemsIndexesInOrderFromState(this.userStateWithWrongOrder);
		ArrayList<Node> numberBoxes = getNumberBoxes(htmlNode);
		for (int i = 0; i < numberBoxes.size(); i++){
			Node numberBox = numberBoxes.get(i);
			Element numberBoxElement = (Element) numberBox;
			String text = numberBoxElement.getInnerText();
			String expectedText = Integer.toString(indexes[i]);
			assertEquals(expectedText, text);
		}
	}

	@Test
	public void getPrintableHTMLCheckElementsAmountWhenShowUserAnswersState() {
		Node htmlNode = getHTMLNodeWhenShowUserAnswersState();
		int validAmount = this.model.getItemCount();

		ArrayList<Node> itemWrappers = getItemWrappers(htmlNode);
		assertEquals(validAmount, itemWrappers.size());

		ArrayList<Node> displaysViews = getDisplaysViews(htmlNode);
		assertEquals(validAmount, displaysViews.size());

		ArrayList<Node> numberBoxes = getNumberBoxes(htmlNode);
		assertEquals(validAmount, numberBoxes.size());

		ArrayList<Node> textTDs = getTextTDs(htmlNode);
		assertEquals(validAmount, textTDs.size());
	}

	@Test
	public void getPrintableHTMLCheckIfVerticalNodesWhenShowUserAnswersState() {
		Mockito.when(this.model.isVertical()).thenReturn(true);
		Node htmlNode = getHTMLNodeWhenShowUserAnswersState();
		Style expectedStyle = createDisplayBlockStyle();
		assertTrue(areDisplaysViewsHaveStyle(htmlNode, expectedStyle));
	}

	@Test
	public void getPrintableHTMLCheckIfHorizontalNodesWhenShowUserAnswersState() {
		Mockito.when(this.model.isVertical()).thenReturn(false);
		Node htmlNode = getHTMLNodeWhenShowUserAnswersState();
		Style expectedStyle = createDisplayInlineBlockStyle();
		assertTrue(areDisplaysViewsHaveStyle(htmlNode, expectedStyle));
	}

	private Node getHTMLNodeWhenShowUserAnswersState() {
		setPrintableState(this.userStateWithWrongOrder);
		this.orderingPrintable = new OrderingPrintable(this.model, this.printableController);
		String html = this.orderingPrintable.getPrintableHTML("", false);
		return getPrintableHTMLNode(html);
	}

	@Test
	public void getPrintableHTMLCheckClassesWhenCheckAnswersStateAndCorrectOrder() {
		Node htmlNode = getHTMLNodeWhenCheckAnswersStateWithCorrectOrder();

		String rootClassName = "printable_module";
		assertTrue(isNodeContainClass(htmlNode, rootClassName));

		String itemsWrapperClass = "items-wrapper";
		assertTrue(isItemsWrapperHaveClass(htmlNode, itemsWrapperClass));

		String itemWrappersClass = "item-wrapper";
		assertTrue(areItemWrappersHaveClass(htmlNode, itemWrappersClass));

		String numberBoxesClass = "number-box-correct";
		assertTrue(areNumberBoxesHaveClass(htmlNode, numberBoxesClass));

		String signClass = "is-all-ok-sign-wrapper";
		Node sign = getSignNode(htmlNode);
		assertTrue(isNodeHaveClass(sign, signClass));
	}

	@Test
	public void getPrintableHTMLCheckClassesWhenCheckAnswersStateAndWrongOrder() {
		Node htmlNode = getHTMLNodeWhenCheckAnswersStateWithWrongOrder();

		String rootClassName = "printable_module";
		assertTrue(isNodeContainClass(htmlNode, rootClassName));

		String itemsWrapperClass = "items-wrapper";
		assertTrue(isItemsWrapperHaveClass(htmlNode, itemsWrapperClass));

		String itemWrappersClass = "item-wrapper";
		assertTrue(areItemWrappersHaveClass(htmlNode, itemWrappersClass));

		String correctNumberBoxesClass = "number-box-correct";
		String wrongNumberBoxesClass = "number-box-wrong";
		ArrayList<Node> nodes = getNumberBoxes(htmlNode);
		assertTrue((isNodeHaveClass(nodes.get(0), correctNumberBoxesClass)));
		assertTrue((isNodeHaveClass(nodes.get(1), wrongNumberBoxesClass)));
		assertTrue((isNodeHaveClass(nodes.get(2), wrongNumberBoxesClass)));

		String signClass = "is-not-all-ok-sign-wrapper";
		Node sign = getSignNode(htmlNode);
		assertTrue(isNodeHaveClass(sign, signClass));
	}

	@Test
	public void getPrintableHTMLCheckAlternativeCorrectAnswer() {
		setPrintableState(this.userStateWithCorrectAlternativeOrder);

		this.orderingPrintable = new OrderingPrintable(this.model, this.printableController);
		String html = this.orderingPrintable.getPrintableHTML("", true);
		Node htmlNode = getPrintableHTMLNode(html);

		String numberBoxesClass = "number-box-correct";
		assertTrue(areNumberBoxesHaveClass(htmlNode, numberBoxesClass));

		String signClass = "is-all-ok-sign-wrapper";
		Node sign = getSignNode(htmlNode);
		assertTrue(isNodeHaveClass(sign, signClass));
	}

	@Test
	public void getPrintableHTMLCheckIndexesWhenCheckAnswersState() {
		Node htmlNode = getHTMLNodeWhenCheckAnswersStateWithWrongOrder();
		Integer[] indexes = getItemsIndexesInOrderFromState(this.userStateWithWrongOrder);
		ArrayList<Node> numberBoxes = getNumberBoxes(htmlNode);
		for (int i = 0; i < numberBoxes.size(); i++){
			Node numberBox = numberBoxes.get(i);
			Element numberBoxElement = (Element) numberBox;
			String text = numberBoxElement.getInnerText();
			String expectedText = Integer.toString(indexes[i]);
			assertEquals(expectedText, text);
		}
	}

	@Test
	public void getPrintableHTMLCheckElementsAmountWhenCheckAnswersState() {
		Node htmlNode = getHTMLNodeWhenCheckAnswersStateWithWrongOrder();
		int validAmount = this.model.getItemCount();

		ArrayList<Node> itemWrappers = getItemWrappers(htmlNode);
		assertEquals(validAmount, itemWrappers.size());

		ArrayList<Node> displaysViews = getDisplaysViews(htmlNode);
		assertEquals(validAmount, displaysViews.size());

		ArrayList<Node> numberBoxes = getNumberBoxes(htmlNode);
		assertEquals(validAmount, numberBoxes.size());

		ArrayList<Node> textTDs = getTextTDs(htmlNode);
		assertEquals(validAmount, textTDs.size());
	}

	@Test
	public void getPrintableHTMLCheckIfVerticalNodesWhenCheckAnswersState() {
		Mockito.when(this.model.isVertical()).thenReturn(true);
		Node htmlNode = getHTMLNodeWhenCheckAnswersStateWithWrongOrder();
		Style expectedStyle = createDisplayBlockStyle();
		assertTrue(areDisplaysViewsHaveStyle(htmlNode, expectedStyle));
	}

	@Test
	public void getPrintableHTMLCheckIfHorizontalNodesWhenCheckAnswersState() {
		Mockito.when(this.model.isVertical()).thenReturn(false);
		Node htmlNode = getHTMLNodeWhenCheckAnswersStateWithWrongOrder();
		Style expectedStyle = createDisplayInlineBlockStyle();
		assertTrue(areDisplaysViewsHaveStyle(htmlNode, expectedStyle));
	}

	private Node getHTMLNodeWhenCheckAnswersStateWithCorrectOrder() {
		setPrintableState(this.userStateWithCorrectOrder);
		this.orderingPrintable = new OrderingPrintable(this.model, this.printableController);
		String html = this.orderingPrintable.getPrintableHTML("", true);
		return getPrintableHTMLNode(html);
	}

	private Node getHTMLNodeWhenCheckAnswersStateWithWrongOrder() {
		setPrintableState(this.userStateWithWrongOrder);
		this.orderingPrintable = new OrderingPrintable(this.model, this.printableController);
		String html = this.orderingPrintable.getPrintableHTML("", true);
		return getPrintableHTMLNode(html);
	}

	private boolean isItemsWrapperHaveClass(Node html, String correctClassName) {
		Node node = getItemsWrapper(html);
		Element element = Element.as(node);
		String elementClassName = element.getClassName();
		return elementClassName.equals(correctClassName);
	}

	private boolean areDisplaysViewsHaveStyle(Node html, Style correctStyle) {
		ArrayList<Node> nodes = getDisplaysViews(html);
		for (Node node : nodes) {
			Element element = Element.as(node);
			Style elementStyle = element.getStyle();
			if (!areStylesEquals(correctStyle, elementStyle))
				return false;
		}
		return true;
	}

	private boolean areStylesEquals(Style expected, Style actual) {
		String parsedExpectedStyle = expected.toString();
		String parsedActualStyle = actual.toString();
		return parsedActualStyle.equals(parsedExpectedStyle);
	}

	private boolean areItemWrappersHaveClass(Node html, String className) {
		ArrayList<Node> nodes = getItemWrappers(html);
		return areNodesHaveClass(nodes, className);
	}

	private boolean areNumberBoxesHaveClass(Node html, String className) {
		ArrayList<Node> nodes = getNumberBoxes(html);
		return areNodesHaveClass(nodes, className);
	}

	private boolean areNodesHaveClass(ArrayList<Node> nodes, String correctClassName) {
		for (Node node : nodes) {
			if (!isNodeHaveClass(node, correctClassName))
				return false;
		}
		return true;
	}

	private boolean isNodeHaveClass(Node node, String correctClassName) {
		Element element = Element.as(node);
		String elementClassName = element.getClassName();
		return elementClassName.equals(correctClassName);
	}

	private boolean isNodeContainClass(Node node, String correctClassName) {
		Element element = Element.as(node);
		String elementClassName = element.getClassName();
		return elementClassName.contains(correctClassName);
	}

	private Node getPrintableHTMLNode(String html) {
		Element div = DOM.createDiv();
		div.setInnerHTML(html.trim());
		return div.getChild(0);
	}

	private ArrayList<Node> getNumberBoxes(Node html) {
		ArrayList<Node> itemWrappers = getItemWrappers(html);
		ArrayList<Node> numberBoxes = new ArrayList<Node>();
		for (Node itemWrapper: itemWrappers) {
			for (int i = 0; i < itemWrapper.getChildCount(); i++ ) {
				Node table = itemWrapper.getChild(i);
				Node tr = table.getChild(0);
				Node numberBoxTD = tr.getChild(0);
				numberBoxes.add(numberBoxTD.getChild(0));
			}
		}
		return numberBoxes;
	}

	private ArrayList<Node> getTextTDs(Node html) {
		ArrayList<Node> itemWrappers = getItemWrappers(html);
		ArrayList<Node> textTDs = new ArrayList<Node>();
		for (Node itemWrapper: itemWrappers) {
			for (int i = 0; i < itemWrapper.getChildCount(); i++ ) {
				Node table = itemWrapper.getChild(i);
				Node tr = table.getChild(0);
				textTDs.add(tr.getChild(1));
			}
		}
		return textTDs;
	}

	private ArrayList<Node> getItemWrappers(Node html) {
		ArrayList<Node> displaysViews = getDisplaysViews(html);
		ArrayList<Node> itemWrappers = new ArrayList<Node>();
		for (Node displayView: displaysViews) {
			for (int i = 0; i < displayView.getChildCount(); i++ ) {
				itemWrappers.add(displayView.getChild(i));
			}
		}
		return itemWrappers;
	}

	private ArrayList<Node> getDisplaysViews(Node html) {
		Node itemsWrapper = getItemsWrapper(html);
		ArrayList<Node> displaysViews = new ArrayList<Node>();
		for (int i = 0; i < itemsWrapper.getChildCount(); i++ ) {
			displaysViews.add(itemsWrapper.getChild(i));
		}
		return displaysViews;
	}

	private Node getItemsWrapper(Node html) {
		return html.getChild(0);
	}

	private Node getSignNode(Node html){
		return html.getChild(1);
	}

	private Style createDisplayBlockStyle() {
		Element tmpNode = DOM.createDiv();
		Style expectedStyle = tmpNode.getStyle();
		expectedStyle.setDisplay(Style.Display.BLOCK);
		return expectedStyle;
	}

	private Style createDisplayInlineBlockStyle() {
		Element tmpNode = DOM.createDiv();
		Style expectedStyle = tmpNode.getStyle();
		expectedStyle.setDisplay(Style.Display.INLINE_BLOCK);
		return expectedStyle;
	}

	private void setPrintableState(String state) {
		IJsonServices jsonServices = new JsonServices();
		HashMap<String, String> printableState = jsonServices.decodeHashMap(state);
		Whitebox.setInternalState(this.model, "printableState", printableState);
	}

	private Integer[] getItemsIndexesInOrderFromState(String state) {
		IJsonServices jsonServices = new JsonServices();
		HashMap<String, String> parsedState = jsonServices.decodeHashMap(state);
		String orderState = parsedState.get("order");
		String[] indexes = orderState.split(",");
		Integer[] parsedIndexes = new Integer[indexes.length];
		for(int i = 0; i < indexes.length; i++) {
			parsedIndexes[i] = Integer.parseInt(indexes[i]);
		}
		return parsedIndexes;
	}
}
