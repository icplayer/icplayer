package com.lorepo.icplayer.client.model.alternativeText;

public class AltToken implements IToken {
    private String readableText;
    private String visibleText;
    private String language;

    public AltToken(String readableText, String visibleText) {
        this.readableText = readableText;
        this.visibleText = visibleText;
        this.language = null;
    }

    public AltToken(String readableText, String visibleText, String language) {
        this.readableText = readableText;
        this.visibleText = visibleText;
        this.language = language;
    }

    @Override
    public String getVisibleText() {
        return visibleText;
    }

    @Override
    public String getReadableText() {
        return readableText;
    }

    @Override
    public String getLanguage() {
        return language;
    }

    @Override
    public boolean isAlt() {
        return true;
    }
}
