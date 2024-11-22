package com.lorepo.icplayer.client.printable;

import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;

public class PrintableOrderParser extends JavaScriptObject {
    protected PrintableOrderParser(){}

    public static HashMap<String, List<String>> toHashMap(JavaScriptObject order) {
        PrintableOrderParser parser = createParser(order);

        return parser.toHashMap();
    }

    private native static PrintableOrderParser createParser(JavaScriptObject order) /*-{
		return order;
	}-*/;

    public final HashMap<String, List<String>> toHashMap() {
        List<String> addonsOrder;
        HashMap<String, List<String>> order = new HashMap<String, List<String>>();
        String[] pagesID = getPagesID();

        for (int i = 0; i < pagesID.length; i++) {
            String pageID = pagesID[i];
            addonsOrder = new ArrayList<String>(
                Arrays.asList(getOrderedAddonsID(pageID))
            );

            order.put(pageID, addonsOrder);
        }

        return order;
    }

    public final native String[] getPagesID() /*-{
        return Object.keys(this);
	}-*/;

    public final native String[] getOrderedAddonsID(String pageID) /*-{
        return this[pageID];
	}-*/;
}