package com.lorepo.icplayer.client.model.AltText;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.model.alternativeText.AlternativeTextService;
import org.junit.Test;


import static junit.framework.Assert.assertEquals;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTAltTextEscapingTestCase extends GwtTest {
    @Test
    public void givenTextWithoutAltTextWhenEscapingBasicAltTextThenReturnsSameText() {
        String input = "lorem ipsum sed vinictus";

        String output = AlternativeTextService.escapeAltText(input);
        assertEquals(input, output);
    }

    @Test
    public void givenTextWithoutAltTextWhenEscapingVisibleAltTextThenReturnsSameText() {
        String input = "lorem ipsum sed vinictus";

        String output = AlternativeTextService.escapeAltTextWithAllVisibleText(input);
        assertEquals(input, output);
    }

    @Test
    public void givenTextAndAltTextInInputWhenEscapingBasicAltTextThenReturnsEscapedText() {
        String input = "additionalText \\alt{visibleText|readableText} additionalText";
        String expected = "additionalText \\altEscapedvisibleText&altTextSeperator&readableText&altTextEnd& additionalText";

        String output = AlternativeTextService.escapeAltText(input);

        assertEquals(expected, output);
    }

    @Test
    public void givenTextAndAltTextInInputWhenEscapingVisibleAltTextThenReturnsEscapedText() {
        String input = "additionalText \\alt{visibleText|readableText} additionalText";
        String expected = "additionalText \\altEscapedvisibleText&altTextSeperator&readableText&altTextEnd& additionalText";

        String output = AlternativeTextService.escapeAltTextWithAllVisibleText(input);

        assertEquals(expected, output);
    }

    @Test
    public void givenTextAndAltTextWithSomeMathFormulaInInputWhenEscapingBasicAltTextThenReturnsSameText() {
        String mathFormula = "\\(\\fraction{1}{2}\\)";
        String input = "additionalText \\alt{" + mathFormula + "|readableText} additionalText";

        String output = AlternativeTextService.escapeAltText(input);

        assertEquals(input, output);
    }

    @Test
    public void givenTextAndAltTextWithSomeMathFormulaInInputWhenEscapingVisibleAltTextThenReturnsEscapedText() {
        String mathFormula = "\\(\\fraction{1}{2}\\)";
        String input = "additionalText \\alt{" + mathFormula + "|readableText} additionalText";
        String expected = "additionalText \\altEscaped" + mathFormula + "&altTextSeperator&readableText&altTextEnd& additionalText";

        String output = AlternativeTextService.escapeAltTextWithAllVisibleText(input);

        assertEquals(expected, output);
    }

    /*
    * UnEscape tests
    * */

    @Test
    public void givenTextWithoutAltTextWhenUnEscapingAltTextThenReturnsSameText() {
        String input = "lorem ipsum sed vinictus";

        String output = AlternativeTextService.unescapeAltText(input);
        assertEquals(input, output);
    }

    @Test
    public void givenTextWithoutAltTextWhenUnEscapingAllVisibleAltTextThenReturnsSameText() {
        String input = "lorem ipsum sed vinictus";

        String output = AlternativeTextService.unescapeAltText(input, true);
        assertEquals(input, output);
    }

    @Test
    public void givenTextAndAltTextInInputWhenUnEscapingAltTexThenReturnsEscapedText() {
        String input = "additionalText \\altEscapedvisibleText&altTextSeperator&readableText&altTextEnd& additionalText";
        String expected = "additionalText \\alt{visibleText|readableText} additionalText";

        String output = AlternativeTextService.unescapeAltText(input);

        assertEquals(expected, output);
    }

    @Test
    public void givenTextAndAltTextInInputWhenUnEscapingAllVisibleAltTextThenReturnsEscapedText() {
        String input = "additionalText \\altEscapedvisibleText&altTextSeperator&readableText&altTextEnd& additionalText";
        String expected = "additionalText \\alt{visibleText|readableText} additionalText";

        String output = AlternativeTextService.unescapeAltText(input, true);

        assertEquals(expected, output);
    }

    @Test
    public void givenTextAndAltTextWithSomeMathFormulaInInputWhenUnEscapingAltTextThenReturnsSameText() {
        String mathFormula = "\\(\\fraction{1}{2}\\)";
        String input = "additionalText \\altEscaped" + mathFormula + "&altTextSeperator&readableText&altTextEnd& additionalText";

        String output = AlternativeTextService.unescapeAltText(input);

        assertEquals(input, output);
    }

    @Test
    public void givenTextAndAltTextWithSomeMathFormulaInInputWhenUnEscapingAllVisibleAltTextThenReturnsUnEscapedText() {
        String mathFormula = "\\(\\fraction{1}{2}\\)";
        String input = "additionalText \\altEscaped" + mathFormula + "&altTextSeperator&readableText&altTextEnd& additionalText";
        String expected = "additionalText \\alt{" + mathFormula + "|readableText} additionalText";

        String output = AlternativeTextService.unescapeAltText(input, true);

        assertEquals(expected, output);
    }

}
