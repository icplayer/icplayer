package com.lorepo.icplayer.client.printable;

public interface IPrintableTextParser {
    JSPrintableTextParser getAsJS();
    String parseAltText(String textToParse);
    String parse(String textToParse);
    int findClosingBracket(String text);
}
