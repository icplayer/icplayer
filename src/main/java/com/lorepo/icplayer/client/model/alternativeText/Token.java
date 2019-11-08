package com.lorepo.icplayer.client.model.alternativeText;

public class Token implements IToken {
    private String text;

    public Token(String text) {
        this.text = text;
    }

    @Override
    public String getReadableText() {
        return text;
    }

    @Override
    public String getVisibleText() {
        return text;
    }

    @Override
    public String getLanguage() {
        return null;
    }

    @Override
    public boolean isAlt() {
        return false;
    }
}
