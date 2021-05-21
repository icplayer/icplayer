package com.lorepo.icplayer.client.printable;

import com.google.gwt.core.client.JavaScriptObject;

public class JSPrintableTextParser extends JavaScriptObject {
    protected JSPrintableTextParser() {
    }

    public native static JSPrintableTextParser create(IPrintableTextParser parser) /*-{
        var obj = function() {};

        obj.parseAltText = $entry(function(textToParse) {
            return parser.@com.lorepo.icplayer.client.printable.IPrintableTextParser::parseAltText(Ljava/lang/String;)(textToParse);
        });

        obj.parse = $entry(function(textToParse) {
            return parser.@com.lorepo.icplayer.client.printable.IPrintableTextParser::parse(Ljava/lang/String;)(textToParse);
        });

        return obj;
    }-*/;
}
