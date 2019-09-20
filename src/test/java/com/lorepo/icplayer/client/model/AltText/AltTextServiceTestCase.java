package com.lorepo.icplayer.client.model.AltText;

import com.lorepo.icplayer.client.model.alternativeText.AlternativeTextService;
import com.lorepo.icplayer.client.model.alternativeText.IToken;
import org.junit.Test;

import java.util.List;

import static junit.framework.Assert.assertEquals;

public class AltTextServiceTestCase {

    @Test
    public void given_text_in_input_when_tokens_then_returns_parsed_tokens() {
        String input = "lorem ipsum sed vinictus";
        int expectedTokenListSize = 1;

        List<IToken> result = AlternativeTextService.parseAltText(input);

        assertEquals(expectedTokenListSize, result.size());
        assertEquals(input, result.get(0).getVisibleText());
        assertEquals(input, result.get(0).getReadableText());
    }

    @Test
    public void given_text_and_alt_text_in_input_when_tokens_then_returns_parsed_tokens() {
        String input = "additionalText \\alt{visibleText|readableText} additionalText";
        int expectedTokenListSize = 3;

        List<IToken> result = AlternativeTextService.parseAltText(input);
        assertEquals(expectedTokenListSize, result.size());
        assertEquals("additionalText ", result.get(0).getVisibleText());
        assertEquals("visibleText", result.get(1).getVisibleText());
        assertEquals(" additionalText", result.get(2).getVisibleText());

        assertEquals("additionalText ", result.get(0).getReadableText());
        assertEquals("readableText", result.get(1).getReadableText());
        assertEquals(" additionalText", result.get(2).getReadableText());
    }

    @Test
    public void given_alt_text_in_input_when_tokens_then_returns_parsed_tokens() {
        String input = "\\alt{visibleText|readableText}";
        int expectedTokenListSize = 1;

        List<IToken> result = AlternativeTextService.parseAltText(input);
        System.out.println(result);
        assertEquals(expectedTokenListSize, result.size());
        assertEquals("visibleText", result.get(0).getVisibleText());
        assertEquals("readableText", result.get(0).getReadableText());
    }

    @Test
    public void given_only_alt_text_in_input_when_getting_visible_texts_then_returns_only_first_part_of_expression() {
        String input = "\\alt{visibleText|readableText}";
        String expectedResult = "visibleText";

        String result = AlternativeTextService.getVisibleText(input);
        assertEquals(expectedResult, result);
    }

    @Test
    public void given_text_with_alt_text_in_input_when_getting_visible_texts_then_returns_only_visible_text() {
        String input = "some text \\alt{visibleText|readableText} and more text";
        String expectedResult = "some text visibleText and more text";

        String result = AlternativeTextService.getVisibleText(input);
        assertEquals(expectedResult, result);
    }

    @Test
    public void given_text_with_alt_text_and_lang_in_input_when_getting_visible_texts_then_returns_only_visible_text() {
        String input = "some text \\alt{visibleText|readableText}[lang lang] and more text";
        String expectedResult = "some text visibleText and more text";

        String result = AlternativeTextService.getVisibleText(input);
        assertEquals(expectedResult, result);
    }

}
