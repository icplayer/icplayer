package com.lorepo.icplayer.client.model.alternativeText;

public interface IToken {
    String getReadableText();
    String getVisibleText();
    String getLanguage();
    boolean isAlt();
}
