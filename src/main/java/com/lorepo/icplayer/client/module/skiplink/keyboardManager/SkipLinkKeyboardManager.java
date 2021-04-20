package com.lorepo.icplayer.client.module.skiplink.keyboardManager;

import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkKeyboardItem;
import com.lorepo.icplayer.client.page.ITextToSpeechController;

import java.util.Collections;
import java.util.List;


public class SkipLinkKeyboardManager {
    private int currentSelected = 0;
    private boolean isActive = false;
    private final List<? extends ISkipLinkKeyboardItem> items;

    public SkipLinkKeyboardManager(List<? extends ISkipLinkKeyboardItem> items) {
        this.items = items;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive() {
        setCurrentItemVisible();
        this.isActive = true;
    }

    public void setInactive() {
        setCurrentItemInvisible();
        currentSelected = 0;
        isActive = false;
    }

    public void increase() {
        if (isActive() && this.currentSelected + 1 < items.size()) {
            setCurrentItemInvisible();
            currentSelected++;
            setCurrentItemVisible();
        }
    }

    public void decrease() {
        if (isActive() && currentSelected > 0) {
            setCurrentItemInvisible();
            currentSelected--;
            setCurrentItemVisible();
        }
    }

    public String getSelectedModuleId() {
        return items.get(currentSelected).getModuleId();
    }

    public void speakCurrentItem(ITextToSpeechController controller) {
        ISkipLinkKeyboardItem currentlySelectedItem = items.get(currentSelected);

        String textToRead = currentlySelectedItem.getTextToRead();
        String langTag = currentlySelectedItem.getTextLang();
        TextToSpeechVoice currentItem = TextToSpeechVoice.create(textToRead, langTag);

        controller.speak(
            Collections.singletonList(currentItem)
        );
    }

    private void setCurrentItemInvisible() {
        items.get(currentSelected).setInvisible();
    }

    private void setCurrentItemVisible() {
        items.get(currentSelected).setVisible();

    }
}
