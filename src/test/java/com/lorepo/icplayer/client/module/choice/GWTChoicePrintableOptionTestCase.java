package com.lorepo.icplayer.client.module.choice;

import com.google.gwt.dom.client.Element;
import com.lorepo.icplayer.client.GWTPowerMockitoTest;
import com.lorepo.icplayer.client.printable.Printable.PrintableStateMode;
import org.junit.Test;
import org.mockito.Mockito;

import static org.junit.Assert.*;

public class GWTChoicePrintableOptionTestCase extends GWTPowerMockitoTest {
	ChoiceOption correctOption = null;
	ChoiceOption wrongOption = null;

	@Test
	public void getID() {
		ChoicePrintableOption printableOption = getCorrectPrintableOptionWhenIsUp();

		String expected = "1";
		String result = printableOption.getID();
		assertEquals(expected, result);
	}

	@Test
	public void toPrintableDOMElementWhenEmptyModeAndCorrectOptionAndUp() {
		ChoicePrintableOption printableOption = getCorrectPrintableOptionWhenIsUp();
		PrintableStateMode mode = PrintableStateMode.EMPTY;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-up";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Correct Option";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	@Test
	public void toPrintableDOMElementWhenEmptyModeAndCorrectOptionAndDown() {
		ChoicePrintableOption printableOption = getCorrectPrintableOptionWhenIsDown();
		PrintableStateMode mode = PrintableStateMode.EMPTY;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-up";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Correct Option";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	@Test
	public void toPrintableDOMElementWhenEmptyModeAndWrongOptionAndUp() {
		ChoicePrintableOption printableOption = getWrongPrintableOptionWhenIsUp();
		PrintableStateMode mode = PrintableStateMode.EMPTY;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-up";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Wrong Option";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	@Test
	public void toPrintableDOMElementWhenEmptyModeAndWrongOptionAndDown() {
		ChoicePrintableOption printableOption = getWrongPrintableOptionWhenIsDown();
		PrintableStateMode mode = PrintableStateMode.EMPTY;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-up";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Wrong Option";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	@Test
	public void toPrintableDOMElementWhenShowAnswersModeAndCorrectOptionAndUp() {
		ChoicePrintableOption printableOption = getCorrectPrintableOptionWhenIsUp();
		PrintableStateMode mode = PrintableStateMode.SHOW_ANSWERS;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-correct-answer";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Correct Option (1)";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	@Test
	public void toPrintableDOMElementWhenShowAnswersModeAndCorrectOptionAndDown() {
		ChoicePrintableOption printableOption = getCorrectPrintableOptionWhenIsDown();
		PrintableStateMode mode = PrintableStateMode.SHOW_ANSWERS;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-correct-answer";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Correct Option (1)";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	@Test
	public void toPrintableDOMElementWhenShowAnswersModeAndWrongOptionAndUp() {
		ChoicePrintableOption printableOption = getWrongPrintableOptionWhenIsUp();
		PrintableStateMode mode = PrintableStateMode.SHOW_ANSWERS;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-up";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Wrong Option";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	@Test
	public void toPrintableDOMElementWhenShowAnswersModeAndWrongOptionAndDown() {
		ChoicePrintableOption printableOption = getWrongPrintableOptionWhenIsDown();
		PrintableStateMode mode = PrintableStateMode.SHOW_ANSWERS;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-up";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Wrong Option";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	@Test
	public void toPrintableDOMElementWhenShowUserAnswersModeAndCorrectOptionAndUp() {
		ChoicePrintableOption printableOption = getCorrectPrintableOptionWhenIsUp();
		PrintableStateMode mode = PrintableStateMode.SHOW_USER_ANSWERS;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-up";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Correct Option";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	@Test
	public void toPrintableDOMElementWhenShowUserAnswersModeAndCorrectOptionAndDown() {
		ChoicePrintableOption printableOption = getCorrectPrintableOptionWhenIsDown();
		PrintableStateMode mode = PrintableStateMode.SHOW_USER_ANSWERS;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-down";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Correct Option";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	@Test
	public void toPrintableDOMElementWhenShowUserAnswersModeAndWrongOptionAndUp() {
		ChoicePrintableOption printableOption = getWrongPrintableOptionWhenIsUp();
		PrintableStateMode mode = PrintableStateMode.SHOW_USER_ANSWERS;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-up";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Wrong Option";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	@Test
	public void toPrintableDOMElementWhenShowUserAnswersModeAndWrongOptionAndDown() {
		ChoicePrintableOption printableOption = getWrongPrintableOptionWhenIsDown();
		PrintableStateMode mode = PrintableStateMode.SHOW_USER_ANSWERS;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-down";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Wrong Option";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	@Test
	public void toPrintableDOMElementWhenCheckAnswersModeAndCorrectOptionAndUp() {
		ChoicePrintableOption printableOption = getCorrectPrintableOptionWhenIsUp();
		PrintableStateMode mode = PrintableStateMode.CHECK_ANSWERS;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-up";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Correct Option";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	@Test
	public void toPrintableDOMElementWhenCheckAnswersModeAndCorrectOptionAndDown() {
		ChoicePrintableOption printableOption = getCorrectPrintableOptionWhenIsDown();
		PrintableStateMode mode = PrintableStateMode.CHECK_ANSWERS;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-down-correct";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Correct Option";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	@Test
	public void toPrintableDOMElementWhenCheckAnswersModeAndWrongOptionAndUp() {
		ChoicePrintableOption printableOption = getWrongPrintableOptionWhenIsUp();
		PrintableStateMode mode = PrintableStateMode.CHECK_ANSWERS;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-up";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Wrong Option";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	@Test
	public void toPrintableDOMElementWhenCheckAnswersModeAndWrongOptionAndDown() {
		ChoicePrintableOption printableOption = getWrongPrintableOptionWhenIsDown();
		PrintableStateMode mode = PrintableStateMode.CHECK_ANSWERS;
		Element element = printableOption.toPrintableDOMElement(mode);

		String expectedClassName = "ic_poption-down-wrong";
		assertTrue(isElementHaveClass(element, expectedClassName));

		String expectedText = "Wrong Option";
		assertTrue(isElementHaveInnerHTML(element, expectedText));

		int expectedChildrenAmount = 1;
		assertTrue(isElementHaveChildAmount(element, expectedChildrenAmount));
	}

	private ChoicePrintableOption getCorrectPrintableOptionWhenIsUp() {
		setUpChoiceOptionWithCorrectAnswer();
		ChoicePrintableOption printableOption
				= new ChoicePrintableOption(this.correctOption);
		printableOption.setIsDown(false);
		return printableOption;
	}

	private ChoicePrintableOption getCorrectPrintableOptionWhenIsDown() {
		setUpChoiceOptionWithCorrectAnswer();
		ChoicePrintableOption printableOption
				= new ChoicePrintableOption(this.correctOption);
		printableOption.setIsDown(true);
		return printableOption;
	}

	private ChoicePrintableOption getWrongPrintableOptionWhenIsUp() {
		setUpChoiceOptionWithWrongAnswer();
		ChoicePrintableOption printableOption
				= new ChoicePrintableOption(this.wrongOption);
		printableOption.setIsDown(false);
		return printableOption;
	}

	private ChoicePrintableOption getWrongPrintableOptionWhenIsDown() {
		setUpChoiceOptionWithWrongAnswer();
		ChoicePrintableOption printableOption
				= new ChoicePrintableOption(this.wrongOption);
		printableOption.setIsDown(true);
		return printableOption;
	}

	private void setUpChoiceOptionWithCorrectAnswer() {
		correctOption = Mockito.mock(ChoiceOption.class);
		Mockito.when(this.correctOption.getID()).thenReturn("1");
		Mockito.when(this.correctOption.getText()).thenReturn("Correct Option");
		Mockito.when(this.correctOption.getValue()).thenReturn(1);
		Mockito.when(this.correctOption.isCorrect()).thenReturn(true);
	}

	private void setUpChoiceOptionWithWrongAnswer() {
		wrongOption = Mockito.mock(ChoiceOption.class);
		Mockito.when(this.wrongOption.getID()).thenReturn("2");
		Mockito.when(this.wrongOption.getText()).thenReturn("Wrong Option");
		Mockito.when(this.wrongOption.getValue()).thenReturn(0);
		Mockito.when(this.wrongOption.isCorrect()).thenReturn(false);
	}

	private boolean isElementHaveClass(Element element, String expectedClassName) {
		String elementClassName = element.getClassName();
		return expectedClassName.equals(elementClassName);
	}

	private boolean isElementHaveInnerHTML(Element element, String expectedInnerHTML) {
		String elementInnerHTML = element.getInnerHTML();
		return expectedInnerHTML.equals(elementInnerHTML);
	}

	private boolean isElementHaveChildAmount(Element element, int expectedChildrenAmount) {
		int elementChildrenAmount = element.getChildCount();
		return expectedChildrenAmount == elementChildrenAmount;
	}
}
