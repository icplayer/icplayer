package com.lorepo.icplayer.client.module.sourcelist;

import com.lorepo.icf.utils.TextToSpeechVoice;

import java.util.List;

public class ItemWrapper {
    private String unparsedText;
    private String visibleText;
    private List<TextToSpeechVoice> readableText;

    public ItemWrapper(String unparsedText, String visibleText, List<TextToSpeechVoice> readableText) {
        this.unparsedText = unparsedText;
        this.visibleText = visibleText;
        this.readableText = readableText;
    }

    public String getUnparsedText() {
        return unparsedText;
    }

    public String getVisibleText() {
        return visibleText;
    }

    public List<TextToSpeechVoice> getReadableText() {
        return readableText;
    }
}
