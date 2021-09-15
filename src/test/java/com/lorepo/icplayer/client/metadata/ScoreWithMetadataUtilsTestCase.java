package com.lorepo.icplayer.client.metadata;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class ScoreWithMetadataUtilsTestCase extends GwtTest {

    @Test
    public void givenIndexBelow24WhenCallingGetLetterWithIndexThenReturnCorrectLetter() {
        String alphabet = "ABCDEFGHIJKLMNOPRSTUWXYZ";
        for (int i = 0; i < 24; i++) {
            String letter = alphabet.substring(i, i + 1);
            assertEquals(letter, ScoreWithMetadataUtils.getLetterWithIndex(i));
        }
    }

    @Test
    public void givenIndexAbove24WhenCallingGetLetterWithIndexThenReturnCorrectTwoLetters() {
        assertEquals("AB",ScoreWithMetadataUtils.getLetterWithIndex(25));
        assertEquals("AG",ScoreWithMetadataUtils.getLetterWithIndex(30));
        assertEquals("BG",ScoreWithMetadataUtils.getLetterWithIndex(54));
    }

    @Test
    public void givenCorrectMetadataWhenCallingValidateMetadataThenReturnTrue() {
        Metadata metadata = new Metadata();
        metadata.put("enumerate_start", "3.1");
        metadata.put("export_to_diagnostic_excel", "true");

        boolean result = ScoreWithMetadataUtils.validateMetadata(metadata);

        assertTrue(result);
    }

    @Test
    public void givenMetadataWithoutExportToDiagnosticExcelWhenCallingValidateMetadataThenReturnFalse() {
        Metadata metadata = new Metadata();
        metadata.put("enumerate_start", "3.1");

        boolean result = ScoreWithMetadataUtils.validateMetadata(metadata);

        assertFalse(result);
    }

    @Test
    public void givenMetadataWithExportToDiagnosticExcelSetToFalseWhenCallingValidateMetadataThenReturnFalse() {
        Metadata metadata = new Metadata();
        metadata.put("enumerate_start", "3.1");
        metadata.put("export_to_diagnostic_excel", "false");

        boolean result = ScoreWithMetadataUtils.validateMetadata(metadata);

        assertFalse(result);
    }

    @Test
    public void givenMetadataWithoutEnumerateStartWhenCallingValidateMetadataThenReturnFalse() {
        Metadata metadata = new Metadata();
        metadata.put("export_to_diagnostic_excel", "true");

        boolean result = ScoreWithMetadataUtils.validateMetadata(metadata);

        assertFalse(result);
    }

    @Test
    public void givenMetadataWithEmptyEnumerateStartWhenCallingValidateMetadataThenReturnFalse() {
        Metadata metadata = new Metadata();
        metadata.put("enumerate_start", "");
        metadata.put("export_to_diagnostic_excel", "true");

        boolean result = ScoreWithMetadataUtils.validateMetadata(metadata);

        assertFalse(result);
    }

    @Test
    public void givenMetadataWithEnumerateStartWhenCallingGetEnumerateStartThenReturnCorrectValue() {
        String expected = "3.A";
        Metadata metadata = new Metadata();
        metadata.put("enumerate_start", expected);

        String result = ScoreWithMetadataUtils.getEnumerateStart(metadata);

        assertEquals(expected, result);
    }

    @Test
    public void givenMetadataWithoutNumerationTypeWhenCallingEnumerateAlphabeticallyThenReturnFalse() {
        Metadata metadata = new Metadata();

        boolean result = ScoreWithMetadataUtils.enumerateAlphabetically(metadata);

        assertFalse(result);
    }

    @Test
    public void givenMetadataWithNumeralNumerationTypeWhenCallingEnumerateAlphabeticallyThenReturnFalse() {
        Metadata metadata = new Metadata();
        metadata.put("numeration_type", "numeral");

        boolean result = ScoreWithMetadataUtils.enumerateAlphabetically(metadata);

        assertFalse(result);
    }

    @Test
    public void givenMetadataWithAlphabeticNumerationTypeWhenCallingEnumerateAlphabeticallyThenReturnTrue() {
        Metadata metadata = new Metadata();
        metadata.put("numeration_type", "alphabetic");

        boolean result = ScoreWithMetadataUtils.enumerateAlphabetically(metadata);

        assertTrue(result);
    }

    @Test
    public void givenSimpleNumberTemplateWhenCallingGetQuestionNumberThenReturnCorrectValue() {

        String result1 = ScoreWithMetadataUtils.getQuestionNumber("3", 0, false);
        String result2 = ScoreWithMetadataUtils.getQuestionNumber("3", 1, false);
        String result3 = ScoreWithMetadataUtils.getQuestionNumber("3", 0, true);
        String result4 = ScoreWithMetadataUtils.getQuestionNumber("3", 1, true);

        assertEquals("3.1", result1);
        assertEquals("3.2", result2);
        assertEquals("3.A", result3);
        assertEquals("3.B", result4);
    }

    @Test
    public void givenNumberWithDotTemplateWhenCallingGetQuestionNumberThenReturnCorrectValue() {

        String result1 = ScoreWithMetadataUtils.getQuestionNumber("3.", 0, false);
        String result2 = ScoreWithMetadataUtils.getQuestionNumber("3.", 1, false);
        String result3 = ScoreWithMetadataUtils.getQuestionNumber("3.", 0, true);
        String result4 = ScoreWithMetadataUtils.getQuestionNumber("3.", 1, true);

        assertEquals("3.1", result1);
        assertEquals("3.2", result2);
        assertEquals("3.A", result3);
        assertEquals("3.B", result4);
    }

    @Test
    public void givenFirstQuestionNumberWhenCallingGetQuestionNumberThenReturnCorrectValue() {

        String result1 = ScoreWithMetadataUtils.getQuestionNumber("3.4", 0, false);
        String result2 = ScoreWithMetadataUtils.getQuestionNumber("3.4", 1, false);
        String result3 = ScoreWithMetadataUtils.getQuestionNumber("3.4", 0, true);
        String result4 = ScoreWithMetadataUtils.getQuestionNumber("3.4", 1, true);

        assertEquals("3.4", result1);
        assertEquals("3.5", result2);
        assertEquals("3.D", result3);
        assertEquals("3.E", result4);
    }
}
