package com.lorepo.icplayer.client.module.text;

import org.junit.Before;
import org.junit.Test;

import static junit.framework.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;

public class GapInfoTestCase {
    private GapInfo gapInfo;

    @Before
    public void setUp() {
        this.gapInfo = new GapInfo("someId", 0, false, false, 1, false);
    }

    @Test
    public void givenTextWithoutEscapedAltTextWhenAddingAnswerThenAnswerIsSameAsGivenText() {
        String input = "lorem ipsum";
        gapInfo.addAnswer(input);

        assertTrue(gapInfo.getAnswers().hasNext());
        String answer = gapInfo.getAnswers().next();
        assertEquals(input, answer);
    }

    @Test
    public void givenTextWithEscapedAltTextWhenAddingAnswerThenAnswerIsUnEscapedText() {
        String input = "\\altEscaped" + "Visible Text" + "&altTextSeperator&" + "Readable Text" + "&altTextEnd&";
        String expected = "\\alt{Visible Text|Readable Text}";
        gapInfo.addAnswer(input);

        assertTrue(gapInfo.getAnswers().hasNext());
        String answer = gapInfo.getAnswers().next();
        assertEquals(expected, answer);
    }

    @Test
    public void givenIgnorePlaceholderFalseAndGapNotAccessedWhenIsValueCheckableThenTrue() {
        boolean ignorePlaceholder = false;
        boolean hasGapBeenAccessed = false;

        boolean isValueCheckable = this.gapInfo.isValueCheckable(ignorePlaceholder, hasGapBeenAccessed);

        assertTrue(isValueCheckable);
    }

    @Test
    public void givenIgnorePlaceholderFalseAndGapAccessedWhenIsValueCheckableThenTrue() {
        boolean ignorePlaceholder = false;
        boolean hasGapBeenAccessed = true;

        boolean isValueCheckable = this.gapInfo.isValueCheckable(ignorePlaceholder, hasGapBeenAccessed);

        assertTrue(isValueCheckable);
    }

    @Test
    public void givenIgnorePlaceholderTrueAndGapAccessedWhenIsValueCheckableThenTrue() {
        boolean ignorePlaceholder = true;
        boolean hasGapBeenAccessed = true;

        boolean isValueCheckable = this.gapInfo.isValueCheckable(ignorePlaceholder, hasGapBeenAccessed);

        assertTrue(isValueCheckable);
    }

    @Test
    public void givenIgnorePlaceholderTrueAndGapNotAccessedWhenIsValueCheckableThenFalse() {
        boolean ignorePlaceholder = true;
        boolean hasGapBeenAccessed = false;

        boolean isValueCheckable = this.gapInfo.isValueCheckable(ignorePlaceholder, hasGapBeenAccessed);

        assertFalse(isValueCheckable);
    }
}
