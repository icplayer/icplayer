package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.*;

import java.util.Arrays;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.google.gwt.dom.client.AnchorElement;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.OptionElement;
import com.google.gwt.dom.client.SelectElement;
import com.google.gwt.dom.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTTextShowAnswersTestCase extends GwtTest {	
	InlineChoiceWidget gapWidget1 = null;
	SelectElement gap1Select = null;
	
	InlineChoiceWidget gapWidget2 = null;
	SelectElement gap2Select = null;
	
	InlineChoiceWidget gapWidget3 = null;
	SelectElement gap3Select = null;
	
	InlineChoiceWidget gapWidget4 = null;
	SelectElement gap4Select = null;

	GapWidget gapWidget5 = null;
	Element gap5Element = null;

	GapWidget gapWidget6 = null;
	Element gap6Element = null;
	
	@Before
	public void setUp() {
		TextModel model = new TextModel();
		TextView textView1 = new TextView(model, false);
		TextView textView2 = new TextView(model, false);
		TextView textView3 = new TextView(model, false);
		TextView textView4 = new TextView(model, false);
		TextView textView5 = new TextView(model, false);
		TextView textView6 = new TextView(model, false);
		
		List<String> optionsForGap1 = Arrays.asList("---", "correct", "wrong");
		List<String> optionsForGap2 = Arrays.asList("---", "special chars ' < > & \" ", "wrong");
		List<String> optionsForGap3 = Arrays.asList("---", "special chars &apos; &lt; &gt; &amp; &quot; ", "wrong <");
		List<String> optionsForGap4 = Arrays.asList("---", "\\alt{correct|test 1}", "\\alt{wrong|test 1}");
		
		Document doc = Document.get();
		AnchorElement a1 = Document.get().createAnchorElement();
		
		doc.appendChild(a1);
		
		// create select element and append 3 options
		this.gap1Select = createSelectHTML("gap1", optionsForGap1);
		this.gap2Select = createSelectHTML("gap2", optionsForGap2);
		this.gap3Select = createSelectHTML("gap3", optionsForGap3);
		this.gap4Select = createSelectHTML("gap4", optionsForGap4);
		this.gap5Element = doc.createElement("p");
		this.gap5Element.setId("gap5");
		this.gap5Element.setAttribute("placeholder", "T");
		this.gap6Element = doc.createElement("p");
		this.gap6Element.setId("gap6");
		this.gap6Element.setAttribute("placeholder", "Car");

		a1.appendChild(gap1Select);
		a1.appendChild(gap2Select);
		a1.appendChild(gap3Select);
		a1.appendChild(gap4Select);
		a1.appendChild(gap5Element);
		a1.appendChild(gap6Element);
		
		// id must be same as in select element
		InlineChoiceInfo gapInfo1 = new InlineChoiceInfo("gap1", "correct", 0);
		InlineChoiceInfo gapInfo2 = new InlineChoiceInfo("gap2", "special chars ' < > & \" ", 0);
		InlineChoiceInfo gapInfo3 = new InlineChoiceInfo("gap3", "special chars ' < > & \" ", 0);
		InlineChoiceInfo gapInfo4 = new InlineChoiceInfo("gap4", "\\alt{correct|test 1}", 0);
		GapInfo gapInfo5 = new GapInfo("gap5", 1, false, false, 1, false);
		gapInfo5.setPlaceHolder("T");
		gapInfo5.addAnswer("Trex");
		GapInfo gapInfo6 = new GapInfo("gap6", 1, false, false, 1, false);
		gapInfo6.setPlaceHolder("Car");
		gapInfo6.addAnswer("Car");


		this.gapWidget1 = new InlineChoiceWidget(gapInfo1, null, textView1);
		this.gapWidget2 = new InlineChoiceWidget(gapInfo2, null, textView2);
		this.gapWidget3 = new InlineChoiceWidget(gapInfo3, null, textView3);
		this.gapWidget4 = new InlineChoiceWidget(gapInfo4, null, textView4);
		this.gapWidget5 = new GapWidget(gapInfo5, null);
		this.gapWidget6 = new GapWidget(gapInfo6, null);
		
		textView1.addElement(this.gapWidget1);
		textView2.addElement(this.gapWidget2);
		textView3.addElement(this.gapWidget3);
		textView4.addElement(this.gapWidget4);
		textView5.addElement(this.gapWidget5);
		textView6.addElement(this.gapWidget6);
	}
	
	public SelectElement createSelectHTML(String selectElementId, List<String> optionsTexts) {
		Document doc = Document.get();
		SelectElement select = doc.createSelectElement();
		select.setId(selectElementId);
		
		for (String value : optionsTexts) {
			OptionElement option = doc.createOptionElement();
			option.setValue(value);
			option.setInnerText(value);
			select.appendChild(option);
		}
		
		return select;
	}
	
	@Test
	public void testNoChoiceMade() {
		String className = "default";
		
		// user haven't chosen an option
		this.gapWidget1.setShowErrorsMode(true);
		this.gapWidget4.setShowErrorsMode(true);
		
		boolean isDefaultClass1 = this.gapWidget1.getElement().getClassName().contains(className);
		boolean isDefaultClass2 = this.gapWidget4.getElement().getClassName().contains(className);
		assertTrue(isDefaultClass1);
		assertTrue(isDefaultClass2);
	}
	
	@Test
	public void testCorrectChoiceMade() {
		String className = "correct";
		
		// user have chosen correct option
		this.gap1Select.setSelectedIndex(1);
		this.gap2Select.setSelectedIndex(1);
		this.gap3Select.setSelectedIndex(1);
		this.gap4Select.setSelectedIndex(1);
		
		this.gapWidget1.setShowErrorsMode(true);
		this.gapWidget2.setShowErrorsMode(true);
		this.gapWidget3.setShowErrorsMode(true);
		this.gapWidget4.setShowErrorsMode(true);
		
		boolean isCorrectClass1 = this.gapWidget1.getElement().getClassName().contains(className);
		boolean isCorrectClass2 = this.gapWidget2.getElement().getClassName().contains(className);
		boolean isCorrectClass3 = this.gapWidget3.getElement().getClassName().contains(className);
		boolean isCorrectClass4 = this.gapWidget4.getElement().getClassName().contains(className);
		
		
		assertTrue(isCorrectClass1);
		assertTrue(isCorrectClass2);
		assertTrue(isCorrectClass3);
		assertTrue(isCorrectClass4);
	}
	
	@Test
	public void testWrongChoiceMade() {
		String className = "wrong";
		
		// user have chosen wrong option
		this.gap1Select.setSelectedIndex(2);
		this.gap2Select.setSelectedIndex(2);
		this.gap3Select.setSelectedIndex(2);
		this.gap4Select.setSelectedIndex(2);
		
		this.gapWidget1.setShowErrorsMode(true);
		this.gapWidget2.setShowErrorsMode(true);
		this.gapWidget3.setShowErrorsMode(true);
		this.gapWidget4.setShowErrorsMode(true);
		
		boolean isWrongClass1 = this.gapWidget1.getElement().getClassName().contains(className);
		boolean isWrongClass2 = this.gapWidget2.getElement().getClassName().contains(className);
		boolean isWrongClass3 = this.gapWidget3.getElement().getClassName().contains(className);
		boolean isWrongClass4 = this.gapWidget4.getElement().getClassName().contains(className);
		
		assertTrue(isWrongClass1);
		assertTrue(isWrongClass2);
		assertTrue(isWrongClass3);
		assertTrue(isWrongClass4);
	}

//Testowanie zachowania gdy placeholder (T) a odpowiedz poprawna to (Trex), a value nie wprowadzone ()
	@Test
	public void testGivenSomePlaceholderWhenIgnorePlaceholderIsFalseAndGapIsNotAccessedThenWrong() {
	    String className = "wrong";

        this.gapWidget5.setIgnorePlaceholder(false);
		this.gapWidget5.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget5.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertFalse(this.gapWidget5.hasGapBeenAccessed());
	}

	@Test
	public void testGivenSomePlaceholderWhenIgnorePlaceholderIsFalseAndGapIsAccessedThenWrong() {
	    String className = "wrong";

        this.gapWidget5.setIgnorePlaceholder(false);
        this.gapWidget5.markGapAsAccessed();
		this.gapWidget5.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget5.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertTrue(this.gapWidget5.hasGapBeenAccessed());
	}

	@Test
	public void testGivenSomePlaceholderWhenIgnorePlaceholderIsTrueAndGapIsNotAccessedThenEmpty() {
	    String className = "empty";

        this.gapWidget5.setIgnorePlaceholder(true);
		this.gapWidget5.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget5.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertFalse(this.gapWidget5.hasGapBeenAccessed());
	}

	@Test
	public void testGivenSomePlaceholderWhenIgnorePlaceholderIsTrueAndGapIsAccessedThenWrong() {
	    String className = "wrong";

        this.gapWidget5.setIgnorePlaceholder(true);
        this.gapWidget5.markGapAsAccessed();
		this.gapWidget5.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget5.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertTrue(this.gapWidget5.hasGapBeenAccessed());
	}

//Testowanie zachowania gdy placeholder (Car) a odpowiedz poprawna to (Car), a value nie wprowadzone ()
	@Test
	public void testGivenCorrectPlaceholderWhenIgnorePlaceholderIsFalseAndGapIsNotAccessedThenCorrect() {
	    String className = "correct";

        this.gapWidget6.setIgnorePlaceholder(false);
		this.gapWidget6.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget6.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertFalse(this.gapWidget6.hasGapBeenAccessed());
	}

	@Test
	public void testGivenCorrectPlaceholderWhenIgnorePlaceholderIsFalseAndGapIsAccessedThenCorrect() {
	    String className = "correct";

        this.gapWidget6.setIgnorePlaceholder(false);
        this.gapWidget6.markGapAsAccessed();
		this.gapWidget6.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget6.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertTrue(this.gapWidget6.hasGapBeenAccessed());
	}

	@Test
	public void testGivenCorrectPlaceholderWhenIgnorePlaceholderIsTrueAndGapIsNotAccessedThenEmpty() {
	    String className = "empty";

        this.gapWidget6.setIgnorePlaceholder(true);
		this.gapWidget6.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget6.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertFalse(this.gapWidget6.hasGapBeenAccessed());
	}

	@Test
	public void testGivenCorrectPlaceholderWhenIgnorePlaceholderIsTrueAndGapIsAccessedThenCorrect() {
	    String className = "correct";

        this.gapWidget6.setIgnorePlaceholder(true);
        this.gapWidget6.markGapAsAccessed();
		this.gapWidget6.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget6.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertTrue(this.gapWidget6.hasGapBeenAccessed());
	}

//Testowanie zachowania gdy placeholder (T) a odpowiedz poprawna to (Trex), a wprowadzone value (Trex)
    @Test
    public void testGivenSomePlaceholderAndCorrectAnswerWhenIgnorePlaceholderIsFalseAndGapIsNotAccessedThenCorrect() {
        String className = "correct";

        this.gap5Element.setAttribute("value", "Trex");
        this.gapWidget5.setIgnorePlaceholder(false);
		this.gapWidget5.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget5.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertFalse(this.gapWidget5.hasGapBeenAccessed());
    }

    @Test
    public void testGivenSomePlaceholderAndCorrectAnswerWhenIgnorePlaceholderIsTrueAndGapIsNotAccessedThenCorrect() {
        String className = "correct";

        this.gap5Element.setAttribute("value", "Trex");
        this.gapWidget5.setIgnorePlaceholder(true);
        this.gapWidget5.markGapAsAccessed();
		this.gapWidget5.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget5.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertTrue(this.gapWidget5.hasGapBeenAccessed());
    }

    @Test
    public void testGivenSomePlaceholderAndCorrectAnswerWhenIgnorePlaceholderIsFalseAndGapIsAccessedThenCorrect() {
        String className = "correct";

        this.gap5Element.setAttribute("value", "Trex");
        this.gapWidget5.setIgnorePlaceholder(false);
        this.gapWidget5.markGapAsAccessed();
		this.gapWidget5.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget5.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertTrue(this.gapWidget5.hasGapBeenAccessed());
    }

    @Test
    public void testGivenSomePlaceholderAndCorrectAnswerWhenIgnorePlaceholderIsTrueAndGapIsAccessedThenCorrect() {
        String className = "correct";

        this.gap5Element.setAttribute("value", "Trex");
        this.gapWidget5.setIgnorePlaceholder(true);
        this.gapWidget5.markGapAsAccessed();
		this.gapWidget5.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget5.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertTrue(this.gapWidget5.hasGapBeenAccessed());
    }

//Testowanie zachowania gdy placeholder (T) a odpowiedz poprawna to (Trex), a wprowadzone value (Trekking)
    @Test
    public void testGivenSomePlaceholderAndWrongAnswerWhenIgnorePlaceholderIsFalseAndGapIsNotAccessedThenWrong() {
        String className = "wrong";

        this.gap5Element.setAttribute("value", "Trekking");
        this.gapWidget5.setIgnorePlaceholder(false);
		this.gapWidget5.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget5.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertFalse(this.gapWidget5.hasGapBeenAccessed());
    }

    @Test
    public void testGivenSomePlaceholderAndWrongAnswerWhenIgnorePlaceholderIsTrueAndGapIsNotAccessedThenWrong() {
        String className = "wrong";

        this.gap5Element.setAttribute("value", "Trekking");
        this.gapWidget5.setIgnorePlaceholder(true);
        this.gapWidget5.markGapAsAccessed();
		this.gapWidget5.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget5.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertTrue(this.gapWidget5.hasGapBeenAccessed());
    }

    @Test
    public void testGivenSomePlaceholderAndWrongAnswerWhenIgnorePlaceholderIsFalseAndGapIsAccessedThenWrong() {
        String className = "wrong";

        this.gap5Element.setAttribute("value", "Trekking");
        this.gapWidget5.setIgnorePlaceholder(false);
        this.gapWidget5.markGapAsAccessed();
		this.gapWidget5.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget5.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertTrue(this.gapWidget5.hasGapBeenAccessed());
    }

    @Test
    public void testGivenSomePlaceholderAndWrongAnswerWhenIgnorePlaceholderIsTrueAndGapIsAccessedThenWrong() {
        String className = "wrong";

        this.gap5Element.setAttribute("value", "Trekking");
        this.gapWidget5.setIgnorePlaceholder(true);
        this.gapWidget5.markGapAsAccessed();
		this.gapWidget5.setShowErrorsMode(true);
		boolean isCorrectClass = this.gapWidget5.getElement().getClassName().contains(className);

		assertTrue(isCorrectClass);
		assertTrue(this.gapWidget5.hasGapBeenAccessed());
    }
}
