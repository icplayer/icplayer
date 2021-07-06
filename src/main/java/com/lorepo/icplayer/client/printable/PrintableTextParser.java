package com.lorepo.icplayer.client.printable;

import com.lorepo.icplayer.client.module.text.TextParser;

public class PrintableTextParser implements IPrintableTextParser {

    @Override
    public JSPrintableTextParser getAsJS() {
        return JSPrintableTextParser.create(this);
    }

    @Override
    public String parseAltText(String textToParse) {
        TextParser parser = new TextParser();
        return parser.parseAltText(textToParse);
    }

    @Override
    public String parse(String textToParse) {
        TextParser parser = new TextParser();
        parser.skipGaps();
        return parser.parse(textToParse).parsedText;
    }

    @Override
    public int findClosingBracket(String text) {
        return TextParser.findClosingBracket(text);
    }
}
