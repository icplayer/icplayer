package com.lorepo.icplayer.client.model.AltText;

import com.lorepo.icplayer.client.model.alternativeText.AlternativeTextService;
import com.lorepo.icplayer.client.model.alternativeText.IToken;
import org.junit.Test;

import java.util.List;

import static junit.framework.Assert.assertEquals;

public class AltTextParsingTestCase {

    @Test
    public void givenTextInInputWhenTokensThenReturnsParsedTokens() {
        String input = "lorem ipsum sed vinictus";
        int expectedTokenListSize = 1;

        List<IToken> result = AlternativeTextService.parseAltText(input);

        assertEquals(expectedTokenListSize, result.size());
        assertEquals(input, result.get(0).getVisibleText());
        assertEquals(input, result.get(0).getReadableText());
    }

    @Test
    public void givenTextAndAltTextInInputWhenTokensThenReturnsParsedTokens() {
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
    public void givenAltTextInInputWhenTokensThenReturnsParsedTokens() {
        String input = "\\alt{visibleText|readableText}";
        int expectedTokenListSize = 1;

        List<IToken> result = AlternativeTextService.parseAltText(input);
        System.out.println(result);
        assertEquals(expectedTokenListSize, result.size());
        assertEquals("visibleText", result.get(0).getVisibleText());
        assertEquals("readableText", result.get(0).getReadableText());
    }

    @Test
    public void givenOnlyAltTextInInputWhenGettingVisibleTextsThenReturnsOnlyFirstPartOfExpression() {
        String input = "\\alt{visibleText|readableText}";
        String expectedResult = "visibleText";

        String result = AlternativeTextService.getVisibleText(input);
        assertEquals(expectedResult, result);
    }

    @Test
    public void givenTextWithAltTextInInputWhenGettingVisibleTextsThenReturnsOnlyVisibleText() {
        String input = "some text \\alt{visibleText|readableText} and more text";
        String expectedResult = "some text visibleText and more text";

        String result = AlternativeTextService.getVisibleText(input);
        assertEquals(expectedResult, result);
    }

    @Test
    public void givenTextWithAltTextAndLangInInputWhenGettingVisibleTextsThenReturnsOnlyVisibleText() {
        String input = "some text \\alt{visibleText|readableText}[lang lang] and more text";
        String expectedResult = "some text visibleText and more text";

        String result = AlternativeTextService.getVisibleText(input);
        assertEquals(expectedResult, result);
    }

}
