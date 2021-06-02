package com.lorepo.icplayer.client.printable;

import com.google.gwt.core.client.JavaScriptObject;

public class JSPrintableTextParser extends JavaScriptObject {
    protected JSPrintableTextParser() {
    }

    public native static JSPrintableTextParser create(IPrintableTextParser parser) /*-{
        var obj = function() {};

        obj.parseAltTexts = $entry(function(textToParse) {
            return parser.@com.lorepo.icplayer.client.printable.IPrintableTextParser::parseAltText(Ljava/lang/String;)(textToParse);
        });

        obj.parse = $entry(function(textToParse) {
            return parser.@com.lorepo.icplayer.client.printable.IPrintableTextParser::parse(Ljava/lang/String;)(textToParse);
        });


        obj.findClosingBracket = $entry(function(textToParse) {
            return parser.@com.lorepo.icplayer.client.printable.IPrintableTextParser::findClosingBracket(Ljava/lang/String;)(textToParse);
        });

        return obj;
    }-*/;
}
