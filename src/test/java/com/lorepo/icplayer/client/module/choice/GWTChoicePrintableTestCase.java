package com.lorepo.icplayer.client.module.choice;

import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.Node;
import com.google.gwt.user.client.DOM;
import com.lorepo.icplayer.client.GWTPowerMockitoTest;
import com.lorepo.icplayer.client.content.services.JsonServices;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.printable.Printable;
import com.lorepo.icplayer.client.printable.PrintableController;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.reflect.Whitebox;

import java.util.ArrayList;
import java.util.HashMap;

import static org.junit.Assert.*;

public class GWTChoicePrintableTestCase extends GWTPowerMockitoTest {

	ChoiceModel model = null;
	ArrayList<ChoiceOption> options = null;
	PrintableController printableController = null;
	ChoicePrintable choicePrintable = null;
	String printableStateWithMixedOptions = "{\"options\":\"0101\"}";

	@Before
	public void setUp() {
		this.options = new ArrayList<ChoiceOption>();

		ChoiceOption item1 = new ChoiceOption("1", "option 1", 2);
		this.options.add(item1);

		ChoiceOption item2 = new ChoiceOption("2", "option 2", 1);
		this.options.add(item2);

		ChoiceOption item3 = new ChoiceOption("3", "option 3", 0);
		this.options.add(item3);

		ChoiceOption item4 = new ChoiceOption("4", "option 4", 0);
		this.options.add(item4);

		this.model = Mockito.mock(ChoiceModel.class);
		Whitebox.setInternalState(this.model, "options", this.options);
		Mockito.when(this.model.getPrintable()).thenReturn(Printable.PrintableMode.YES);
		Mockito.when(this.model.getPrintableState()).thenCallRealMethod();
		Mockito.when(this.model.getOptions()).thenCallRealMethod();
		Mockito.when(this.model.getOptionCount()).thenCallRealMethod();
		Mockito.when(this.model.isRandomOrder()).thenReturn(false);
		Mockito.when(this.model.getId()).thenReturn("Choice1");

		this.printableController = Mockito.mock(PrintableController.class);
	}

	@Test
	public void getPrintableHTMLIfNoPrintableMode() {
		Mockito.when(this.model.getPrintable()).thenReturn(Printable.PrintableMode.NO);
		this.choicePrintable = new ChoicePrintable(this.model, this.printableController);
		String html = this.choicePrintable.getPrintableHTML("", false);
		assertNull(html);
	}

	@Test
	public void getPrintableHTMLIfPrintableMode() {
		Mockito.when(this.model.getPrintable()).thenReturn(Printable.PrintableMode.YES);
		this.choicePrintable = new ChoicePrintable(this.model, this.printableController);
		String html1 = this.choicePrintable.getPrintableHTML("", false);
		assertNotNull(html1);

		Mockito.when(this.model.getPrintable()).thenReturn(Printable.PrintableMode.YES_RANDOM);
		this.choicePrintable = new ChoicePrintable(this.model, this.printableController);
		String html2 = this.choicePrintable.getPrintableHTML("", false);
		assertNotNull(html2);
	}

	@Test
	public void getPrintableHTMLWithoutClassName() {
		String className = "";
		String notExpectedClassName = "printable_module-";

		this.choicePrintable = new ChoicePrintable(this.model, this.printableController);
		String html = this.choicePrintable.getPrintableHTML(className, false);
		Element htmlNode = (Element) getPrintableHTMLNode(html);

		assertFalse(isNodeContainClass(htmlNode, notExpectedClassName));
	}

	@Test
	public void getPrintableHTMLCheckOptionsWhenRandomOrderWithoutPrintableState() {
		Mockito.when(this.model.isRandomOrder()).thenReturn(true);
		int[] newOrder = {1,2,3,0};

		int iterations = 8;
		for (int iteration = 0; iteration < iterations; iteration++) {
			Mockito.when(this.printableController.nextInt(Mockito.isA(Integer.class))).thenReturn(1,1,1,0);
			this.choicePrintable = new ChoicePrintable(this.model, this.printableController);
			String html = this.choicePrintable.getPrintableHTML("", true);
			Node htmlNode = getPrintableHTMLNode(html);

			ArrayList<Node> printableOptions = getPrintableOptions(htmlNode);
			for (int i = 0; i < printableOptions.size(); i++) {
				Element element = Element.as(printableOptions.get(i));

				ChoiceOption option = this.options.get(newOrder[i]);
				String expectedOptionClassName;
				String expectedInnerText;
				if (option.isCorrect()) {
					expectedOptionClassName = "ic_poption-correct-answer";
					expectedInnerText = option.getText() + " (" + option.getValue() + ")";
				} else {
					expectedOptionClassName = "ic_poption-up";
					expectedInnerText = option.getText();
				}

				assertTrue(isNodeHaveClass(element, expectedOptionClassName));

				assertTrue(isNodeHaveInnerText(element, expectedInnerText));

				int expectedChildrenAmount = 1;
				assertTrue(isNodeHaveChildrenAmount(element, expectedChildrenAmount));
			}
		}
	}

	@Test
	public void getPrintableHTMLCheckOptionsWhenRandomOrderWithPrintableState() {
		Mockito.when(this.model.isRandomOrder()).thenReturn(true);
		setPrintableState(this.printableStateWithMixedOptions);
		boolean[] optionsIsDownStatus = getOptionsIsDownStatusFromPrintableState();
		int[] newOrder = {1,2,3,0};

		int iterations = 8;
		for (int iteration = 0; iteration < iterations; iteration++) {
			Mockito.when(this.printableController.nextInt(Mockito.isA(Integer.class))).thenReturn(1,1,1,0);
			this.choicePrintable = new ChoicePrintable(this.model, this.printableController);
			String html = this.choicePrintable.getPrintableHTML("", false);
			Node htmlNode = getPrintableHTMLNode(html);

			ArrayList<Node> printableOptions = getPrintableOptions(htmlNode);
			for (int i = 0; i < printableOptions.size(); i++) {
				Element element = Element.as(printableOptions.get(i));

				String expectedOptionClassName;
				if (optionsIsDownStatus[newOrder[i]])
					expectedOptionClassName = "ic_poption-down";
				else
					expectedOptionClassName = "ic_poption-up";
				assertTrue(isNodeHaveClass(element, expectedOptionClassName));

				ChoiceOption option = this.options.get(newOrder[i]);
				String expectedInnerText = option.getText();
				assertTrue(isNodeHaveInnerText(element, expectedInnerText));

				int expectedChildrenAmount = 1;
				assertTrue(isNodeHaveChildrenAmount(element, expectedChildrenAmount));
			}
		}
	}

	@Test
	public void getPrintableHTMLWithClassName() {
		String className = "choice_test";
		String expectedClassName = "printable_module-" + className;

		this.choicePrintable = new ChoicePrintable(this.model, this.printableController);
		String html = this.choicePrintable.getPrintableHTML(className, false);
		Element htmlNode = (Element) getPrintableHTMLNode(html);

		assertTrue(isNodeContainClass(htmlNode, expectedClassName));
	}

    @Test
    public void getPrintableHTMLCheckOrderedListWhenEmptyStateMode() {
        Node htmlNode = getHTMLNodeWhenEmptyState();

        Element orderedList = (Element) getOrderedList(htmlNode);
        String expectedOrderedListTagName = "ol".toUpperCase();
        assertTrue(isNodeHaveTag(orderedList, expectedOrderedListTagName));

        String expectedOrderedListTypeAttribute = "A";
        assertTrue(isNodeHaveType(orderedList, expectedOrderedListTypeAttribute));

        int expectedChildrenAmount = this.model.getOptionCount();
        assertTrue(isNodeHaveChildrenAmount(orderedList, expectedChildrenAmount));
    }

    @Test
    public void getPrintableHTMLCheckOrderedListElementsWhenEmptyStateMode() {
        Node htmlNode = getHTMLNodeWhenEmptyState();

        ArrayList<Node> orderedListElements = getOrderedListElements(htmlNode);
        for (int i = 0; i < orderedListElements.size(); i++) {
            Element listElement = (Element) orderedListElements.get(i);

            String expectedListElementID = "Choice1_ic_option_" + Integer.toString(i + 1);
            assertTrue(isNodeHaveID(listElement, expectedListElementID));

            String expectedListElementTagName = "li".toUpperCase();
            assertTrue(isNodeHaveTag(listElement, expectedListElementTagName));

            int expectedChildrenAmount = 1;
            assertTrue(isNodeHaveChildrenAmount(listElement, expectedChildrenAmount));
        }
    }

    @Test
    public void getPrintableHTMLCheckOptionsWhenEmptyStateMode() {
        Node htmlNode = getHTMLNodeWhenEmptyState();

        ArrayList<Node> printableOptions = getPrintableOptions(htmlNode);
        for (int i = 0; i < printableOptions.size(); i++) {
            Element element = Element.as(printableOptions.get(i));

            String expectedOptionClassName = "ic_poption-up";
            assertTrue(isNodeHaveClass(element, expectedOptionClassName));

            String expectedInnerText = this.options.get(i).getText();
            assertTrue(isNodeHaveInnerText(element, expectedInnerText));

            int expectedChildrenAmount = 1;
            assertTrue(isNodeHaveChildrenAmount(element, expectedChildrenAmount));
        }
    }

	private Node getHTMLNodeWhenEmptyState() {
		this.choicePrintable = new ChoicePrintable(this.model, this.printableController);
		String html = this.choicePrintable.getPrintableHTML("", false);
		return getPrintableHTMLNode(html);
	}

	@Test
	public void getPrintableHTMLCheckOrderedListWhenShowAnswersStateMode() {
		Node htmlNode = getHTMLNodeWhenShowAnswersState();

		Element orderedList = (Element) getOrderedList(htmlNode);
		String expectedOrderedListTagName = "ol".toUpperCase();
		assertTrue(isNodeHaveTag(orderedList, expectedOrderedListTagName));

		String expectedOrderedListTypeAttribute = "A";
		assertTrue(isNodeHaveType(orderedList, expectedOrderedListTypeAttribute));

		int expectedChildrenAmount = this.model.getOptionCount();
		assertTrue(isNodeHaveChildrenAmount(orderedList, expectedChildrenAmount));
	}

	@Test
	public void getPrintableHTMLCheckOrderedListElementsWhenShowAnswersStateMode() {
		Node htmlNode = getHTMLNodeWhenShowAnswersState();

		ArrayList<Node> orderedListElements = getOrderedListElements(htmlNode);
		for (int i = 0; i < orderedListElements.size(); i++) {
			Element listElement = (Element) orderedListElements.get(i);

			String expectedListElementID = "Choice1_ic_option_" + Integer.toString(i + 1);
			assertTrue(isNodeHaveID(listElement, expectedListElementID));

			String expectedListElementTagName = "li".toUpperCase();
			assertTrue(isNodeHaveTag(listElement, expectedListElementTagName));

			int expectedChildrenAmount = 1;
			assertTrue(isNodeHaveChildrenAmount(listElement, expectedChildrenAmount));
		}
	}

	@Test
	public void getPrintableHTMLCheckOptionsWhenShowAnswersStateMode() {
		Node htmlNode = getHTMLNodeWhenShowAnswersState();

		ArrayList<Node> printableOptions = getPrintableOptions(htmlNode);
		for (int i = 0; i < printableOptions.size(); i++) {
			Element element = Element.as(printableOptions.get(i));

			ChoiceOption option = this.options.get(i);
			String expectedOptionClassName;
			String expectedInnerText;
			if (option.isCorrect()) {
				expectedOptionClassName = "ic_poption-correct-answer";
				expectedInnerText = option.getText() + " (" + option.getValue() + ")";
			} else {
				expectedOptionClassName = "ic_poption-up";
				expectedInnerText = option.getText();
			}

			assertTrue(isNodeHaveClass(element, expectedOptionClassName));

			assertTrue(isNodeHaveInnerText(element, expectedInnerText));

			int expectedChildrenAmount = 1;
			assertTrue(isNodeHaveChildrenAmount(element, expectedChildrenAmount));
		}
	}

	private Node getHTMLNodeWhenShowAnswersState() {
		this.choicePrintable = new ChoicePrintable(this.model, this.printableController);
		String html = this.choicePrintable.getPrintableHTML("", true);
		return getPrintableHTMLNode(html);
	}

	@Test
	public void getPrintableHTMLCheckOrderedListWhenShowUserAnswersStateMode() {
		Node htmlNode = getHTMLNodeWhenShowUserAnswersState();

		Element orderedList = (Element) getOrderedList(htmlNode);
		String expectedOrderedListTagName = "ol".toUpperCase();
		assertTrue(isNodeHaveTag(orderedList, expectedOrderedListTagName));

		String expectedOrderedListTypeAttribute = "A";
		assertTrue(isNodeHaveType(orderedList, expectedOrderedListTypeAttribute));

		int expectedChildrenAmount = this.model.getOptionCount();
		assertTrue(isNodeHaveChildrenAmount(orderedList, expectedChildrenAmount));
	}

	@Test
	public void getPrintableHTMLCheckOrderedListElementsWhenShowUserAnswersStateMode() {
		Node htmlNode = getHTMLNodeWhenShowUserAnswersState();

		ArrayList<Node> orderedListElements = getOrderedListElements(htmlNode);
		for (int i = 0; i < orderedListElements.size(); i++) {
			Element listElement = (Element) orderedListElements.get(i);

			String expectedListElementID = "Choice1_ic_option_" + Integer.toString(i + 1);
			assertTrue(isNodeHaveID(listElement, expectedListElementID));

			String expectedListElementTagName = "li".toUpperCase();
			assertTrue(isNodeHaveTag(listElement, expectedListElementTagName));

			int expectedChildrenAmount = 1;
			assertTrue(isNodeHaveChildrenAmount(listElement, expectedChildrenAmount));
		}
	}

	@Test
	public void getPrintableHTMLCheckOptionsWhenShowUserAnswersStateMode() {
		Node htmlNode = getHTMLNodeWhenShowUserAnswersState();
		boolean[] optionsIsDownStatus = getOptionsIsDownStatusFromPrintableState();

		ArrayList<Node> printableOptions = getPrintableOptions(htmlNode);
		for (int i = 0; i < printableOptions.size(); i++) {
			Element element = Element.as(printableOptions.get(i));

			String expectedOptionClassName;
			if (optionsIsDownStatus[i])
				expectedOptionClassName = "ic_poption-down";
			else
				expectedOptionClassName = "ic_poption-up";
			assertTrue(isNodeHaveClass(element, expectedOptionClassName));

			String expectedInnerText = this.options.get(i).getText();
			assertTrue(isNodeHaveInnerText(element, expectedInnerText));

			int expectedChildrenAmount = 1;
			assertTrue(isNodeHaveChildrenAmount(element, expectedChildrenAmount));
		}
	}

	private Node getHTMLNodeWhenShowUserAnswersState() {
		setPrintableState(this.printableStateWithMixedOptions);
		this.choicePrintable = new ChoicePrintable(this.model, this.printableController);
		String html = this.choicePrintable.getPrintableHTML("", false);
		return getPrintableHTMLNode(html);
	}

	@Test
	public void getPrintableHTMLCheckOrderedListWhenCheckAnswersStateMode() {
		Node htmlNode = getHTMLNodeWhenCheckAnswersState();

		Element orderedList = (Element) getOrderedList(htmlNode);
		String expectedOrderedListTagName = "ol".toUpperCase();
		assertTrue(isNodeHaveTag(orderedList, expectedOrderedListTagName));

		String expectedOrderedListTypeAttribute = "A";
		assertTrue(isNodeHaveType(orderedList, expectedOrderedListTypeAttribute));

		int expectedChildrenAmount = this.model.getOptionCount();
		assertTrue(isNodeHaveChildrenAmount(orderedList, expectedChildrenAmount));
	}

	@Test
	public void getPrintableHTMLCheckOrderedListElementsWhenCheckAnswersStateMode() {
		Node htmlNode = getHTMLNodeWhenCheckAnswersState();

		ArrayList<Node> orderedListElements = getOrderedListElements(htmlNode);
		for (int i = 0; i < orderedListElements.size(); i++) {
			Element listElement = (Element) orderedListElements.get(i);

			String expectedListElementID = "Choice1_ic_option_" + Integer.toString(i + 1);
			assertTrue(isNodeHaveID(listElement, expectedListElementID));

			String expectedListElementTagName = "li".toUpperCase();
			assertTrue(isNodeHaveTag(listElement, expectedListElementTagName));

			int expectedChildrenAmount = 1;
			assertTrue(isNodeHaveChildrenAmount(listElement, expectedChildrenAmount));
		}
	}

	@Test
	public void getPrintableHTMLCheckOptionsWhenCheckAnswersStateMode() {
		Node htmlNode = getHTMLNodeWhenCheckAnswersState();
		boolean[] optionsIsDownStatus = getOptionsIsDownStatusFromPrintableState();

		ArrayList<Node> printableOptions = getPrintableOptions(htmlNode);
		for (int i = 0; i < printableOptions.size(); i++) {
			Element element = Element.as(printableOptions.get(i));

			ChoiceOption option = this.options.get(i);
			String expectedOptionClassName;
			if (optionsIsDownStatus[i]) {
				if (option.isCorrect())
					expectedOptionClassName = "ic_poption-down-correct";
				else
					expectedOptionClassName = "ic_poption-down-wrong";
			} else
				expectedOptionClassName = "ic_poption-up";
			assertTrue(isNodeHaveClass(element, expectedOptionClassName));

			String expectedInnerText = option.getText();
			assertTrue(isNodeHaveInnerText(element, expectedInnerText));

			int expectedChildrenAmount = 1;
			assertTrue(isNodeHaveChildrenAmount(element, expectedChildrenAmount));
		}
	}

	private Node getHTMLNodeWhenCheckAnswersState() {
		setPrintableState(this.printableStateWithMixedOptions);
		this.choicePrintable = new ChoicePrintable(this.model, this.printableController);
		String html = this.choicePrintable.getPrintableHTML("", true);
		return getPrintableHTMLNode(html);
	}

	private boolean isNodeHaveChildrenAmount(Node node, int expectedAmount) {
		Element element = Element.as(node);
		int elementChildrenAmount = element.getChildCount();
		return elementChildrenAmount == expectedAmount;
	}

    private boolean isNodeHaveInnerText(Node node, String expectedInnerText) {
		Element element = Element.as(node);
		String elementInnerText = element.getInnerText();
		return elementInnerText.equals(expectedInnerText);
    }

    private boolean isNodeHaveID(Node node, String expectedID) {
		Element element = Element.as(node);
		String elementID = element.getId();
		return elementID.equals(expectedID);
    }

    private boolean isNodeHaveType(Node node, String expectedTypeName) {
		Element element = Element.as(node);
		String elementType = element.getAttribute("type");
		return elementType.equals(expectedTypeName);
    }

    private boolean isNodeHaveTag(Node node, String expectedTagName) {
		Element element = Element.as(node);
		String elementTagName = element.getTagName();
		return elementTagName.equals(expectedTagName);
    }

	private boolean isNodeHaveClass(Node node, String expectedClassName) {
		Element element = Element.as(node);
		String elementClassName = element.getClassName();
		return elementClassName.equals(expectedClassName);
	}

	private boolean isNodeContainClass(Node node, String expectedClassName) {
		Element element = Element.as(node);
		String elementClassName = element.getClassName();
		return elementClassName.contains(expectedClassName);
	}

	private Node getPrintableHTMLNode(String html) {
		Element div = DOM.createDiv();
		div.setInnerHTML(html.trim());
		return div.getChild(0);
	}

	private Node getOrderedList(Node html) {
		return html.getFirstChild();
    }

    private ArrayList<Node> getOrderedListElements(Node html) {
		Node orderedList = getOrderedList(html);
		ArrayList<Node> orderedListElements = new ArrayList<Node>();
		for (int i = 0; i < orderedList.getChildCount(); i++ ) {
			Node orderedListElement = orderedList.getChild(i);
			orderedListElements.add(orderedListElement);
		}
		return orderedListElements;
    }

    private ArrayList<Node> getPrintableOptions(Node html) {
		ArrayList<Node> orderedListElements = getOrderedListElements(html);
		ArrayList<Node> options = new ArrayList<Node>();
		for (Node orderedListElement: orderedListElements) {
			for (int i = 0; i < orderedListElement.getChildCount(); i++) {
				Node option = orderedListElement.getChild(i);
				options.add(option);
			}
		}
		return options;
    }

	private void setPrintableState(String state) {
		IJsonServices jsonServices = new JsonServices();
		HashMap<String, String> printableState = jsonServices.decodeHashMap(state);
		Whitebox.setInternalState(this.model, "printableState", printableState);
	}

	private boolean[] getOptionsIsDownStatusFromPrintableState() {
		HashMap<String, String> printableState = model.getPrintableState();
		String optionsState = printableState.get("options");
		boolean[] optionsIsDownStatus = new boolean[optionsState.length()];

		for (int i = 0; i < optionsState.length(); i++)
			optionsIsDownStatus[i] = optionsState.charAt(i) == '1';
		return optionsIsDownStatus;
	}
}
