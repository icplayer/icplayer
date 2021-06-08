package com.lorepo.icplayer.client.module.ordering;

import com.lorepo.icplayer.client.printable.Printable;

import java.util.Map;

public interface IPrintableOrderingModule {
    int getItemCount();
    boolean isPrintable();
    Printable.PrintableMode getPrintable();
    Map<String, String> getPrintableState();
    boolean isSplitInPrintBlocked();
    OrderingItem getItem(int j);
    Boolean isVertical();
    String getId();
}
