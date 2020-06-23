package com.lorepo.icplayer.client.model.alternativeText;

import com.google.gwt.regexp.shared.MatchResult;
import com.google.gwt.regexp.shared.RegExp;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.module.text.TextParser;
import com.lorepo.icplayer.client.utils.DomElementManipulator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AlternativeTextService {

    public static String getVisibleText(String source) {
        List<IToken> tokens = parseAltText(source);
        return getVisibleText(tokens);
    }

    public static String getVisibleText(List<IToken> tokens) {
        StringBuilder builder = new StringBuilder();

        for (IToken token : tokens) {
            builder.append(token.getVisibleText());
        }

        return builder.toString();
    }

    public static List<TextToSpeechVoice> getReadableText(String source) {
        List<IToken> tokens = parseAltText(source);
        return getReadableText(tokens);
    }

    public static List<TextToSpeechVoice> getReadableText(List<IToken> tokens) {
        return getReadableText(tokens, null);
    }

    public static List<TextToSpeechVoice> getReadableText(List<IToken> tokens, String defaultLangAttribute) {
        List<TextToSpeechVoice> textToSpeechVoices = new ArrayList<TextToSpeechVoice>();

        for (IToken token : tokens) {
            TextToSpeechVoice ttsv;

            if (token.getLanguage() != null) {
                ttsv = TextToSpeechVoice.create(token.getReadableText(), token.getLanguage());
            } else {
                ttsv = TextToSpeechVoice.create(token.getReadableText(), defaultLangAttribute);
            }

            textToSpeechVoices.add(ttsv);
        }

        return textToSpeechVoices;
    }

    public static String getAltTextAsHtml(String source) {
        source = escapeAltTextInTag(source);
        List<IToken> tokens = parseAltText(source);
        StringBuilder builder = new StringBuilder();

        for (IToken token : tokens) {

            if (token.isAlt()) {
                String code = StringUtils.unescapeXML(
                        getAltTextElement(
                                token.getVisibleText(),
                                token.getReadableText(),
                                token.getLanguage()
                        ).getHTMLCode()
                );
                builder.append(
                    code
                );
            } else {
                // it doesn't matter which text we will get as they are the same, if it is not alt token
                builder.append(token.getReadableText());
            }
        }

        String output = builder.toString();
        return unescapeAltTextInTag(output);
    }

    // this function won't allow some math formulas in visible (and readable) text, since it disallows pipe and brackets after "alt{"
    public static String escapeAltText(String srcText){
        String parsedText = srcText.replaceAll("\\\\alt\\{([^\\|\\{\\}]*?)\\|([^\\|\\{\\}]*?)\\}", "\\\\altEscaped$1&altTextSeperator&$2&altTextEnd&");
        return parsedText;
    }

    // this function shouldn't have same constraints as escapeAltText function
    public static String escapeAltTextWithAllVisibleText(String srcText) {
        List<IToken> tokens = parseAltText(srcText);
        StringBuilder builder = new StringBuilder();

        for (IToken token : tokens) {
            if (token.isAlt()) {
                String visible = token.getVisibleText();
                String readable = token.getReadableText();
                String escapedText = AlternativeTextTemplates.TEMPLATES.altTextEscaped(visible, readable).asString();

                builder.append(escapedText);

                if (token.getLanguage() != null) {
                    builder.append(AlternativeTextTemplates.TEMPLATES.langTag(token.getLanguage()).asString());
                }
            } else {
                builder.append(token.getVisibleText());
            }
        }

        return builder.toString();
    }

    public static String unescapeAltText(String srcText) {
        return unescapeAltText(srcText, false);
    }

    // if matchAllVisibleText is true, it will match all characters in given string, between altEscaped and &altTextSeparator$
    // otherwise it won't match pipe and bracket signs where visible text should be
    public static String unescapeAltText(String srcText, boolean matchAllVisibleText) {
        String visibleTextRegexp = matchAllVisibleText ? "(.*)" : "([^\\|\\{\\}]*?)";
        String regexp = "\\\\altEscaped" + visibleTextRegexp + "&altTextSeperator&([^\\|\\{\\}]*?)&altTextEnd&";

        return srcText.replaceAll(regexp, "\\\\alt\\{$1\\|$2\\}");
    }

    public static List<IToken> parseAltText(String srcText) {
        srcText = escapeAltTextInTag(srcText);
        final String pattern = "\\\\alt\\{";
        String input = srcText;
        int index = -1;
        RegExp regExp = RegExp.compile(pattern);
        MatchResult matchResult;

        List<IToken> altTokens = new ArrayList<IToken>();

        while ((matchResult = regExp.exec(input)) != null) {
            if (matchResult.getGroupCount() <= 0) { // check if alt text is available
                break;
            }

            String group = matchResult.getGroup(0);

            String textToBeginingOfAltText = input.substring(0, matchResult.getIndex());
            if (textToBeginingOfAltText.length() > 0) {
                altTokens.add(new Token(textToBeginingOfAltText)); // remove text from character 0 to position of \alt and add it as normal text
            }
            input = input.substring(matchResult.getIndex() + group.length()); // remove .*\alt{.* from input
            index = TextParser.findClosingBracket(input);

            String expression = input.substring(0, index); // inside of brackets {visibleText|readableText}
            input = input.substring(index + 1); // remove closing bracket
            Map<String, String> gapOptions = getGapOptions(input); // finds [lang langTag]
            input = removeGapOptions(input); // removes langtag from input
            int separatorIndex = expression.indexOf("|");
            if (separatorIndex > 0) {
                String visibleText = expression.substring(0, separatorIndex);
                String readableText = expression.substring(separatorIndex + 1);
                if (gapOptions != null && gapOptions.containsKey("lang")) {
                    altTokens.add(new AltToken(readableText, visibleText, gapOptions.get("lang")));
                } else {
                    altTokens.add(new AltToken(readableText, visibleText));
                }
            } else {
                altTokens.add(new Token("#ERR"));
            }
        }

        // alt text was only at the beginning and there is more text which needs to be added to the token list
        if (input.length() > 0) {
            altTokens.add(new Token(input));
        }

        return altTokens;
    }

    private static Map<String,String> getGapOptions(String expression) {
        final String pattern = 	"^\\[[a-zA-Z0-9_\\- ]*?\\]";
        Map<String,String> result = new HashMap<String,String>();
        RegExp regExp = RegExp.compile(pattern);
        MatchResult matchResult;

        while ((matchResult = regExp.exec(expression)) != null) {
            if (matchResult.getGroupCount() <= 0) {
                break;
            }

            String group = matchResult.getGroup(0);
            expression = expression.replaceFirst(pattern, "");
            group = group.replaceAll("[\\[\\]]", "");
            String[] values = group.split(" ");
            if(values.length==2) {
                result.put(values[0], values[1]);
            }
        }
        return result;
    };

    private static String removeGapOptions(String expression) {
        final String pattern = 	"^\\[[a-zA-Z0-9_\\- ]*?\\]";
        RegExp regExp = RegExp.compile(pattern);
        MatchResult matchResult;

        while ((matchResult = regExp.exec(expression)) != null) {
            if (matchResult.getGroupCount() <= 0) {
                break;
            }

            String group = matchResult.getGroup(0);
            group = group.replaceAll("[\\[\\]]", "");
            String[] values = group.split(" ");
            if(values.length!=2) {
                break;
            }
            expression = expression.replaceFirst(pattern, "");
        }
        return expression;
    };

    private static DomElementManipulator getAltTextElement(String visibleText, String altText, String langTag) {
        DomElementManipulator wrapper = new DomElementManipulator("span");
        wrapper.setHTMLAttribute("aria-label", altText);
        if (langTag != null && langTag.length() > 0) {
            wrapper.setHTMLAttribute("lang", langTag);
        }
        DomElementManipulator visibleTextElement = new DomElementManipulator("span");
        visibleTextElement.setHTMLAttribute("aria-hidden", "true");
        visibleTextElement.setInnerHTMLText(visibleText);

        wrapper.appendElement(visibleTextElement);
        return wrapper;

    }

    private static String escapeAltTextInTag(String srcText){
        String parsedText = srcText;
        String oldParsedText = "";
        String pattern = "<([^>]*?)\\\\alt\\{([^<]*?)>";
        while(!oldParsedText.equals(parsedText)){ //it is possible that there will be multiple alt texts inside one tag, all must be escaped
            oldParsedText = parsedText;
            parsedText =  parsedText.replaceAll(pattern, "<$1\\\\altEscaped\\{$2>");
        }
        return parsedText;
    }

    private static String unescapeAltTextInTag(String srcText){
        String pattern = "<([^>]*?)\\\\altEscaped\\{([^<]*?)>";
        String parsedText = srcText;
        String oldParsedText = "";
        while(!oldParsedText.equals(parsedText)){ //it is possible that there will be multiple alt texts inside one tag, all must be unescaped
            oldParsedText = parsedText;
            parsedText =  parsedText.replaceAll(pattern, "<$1\\\\alt\\{$2>");
        }
        return parsedText;
    }
}
