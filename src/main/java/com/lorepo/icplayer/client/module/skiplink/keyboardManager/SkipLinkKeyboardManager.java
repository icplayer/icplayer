package com.lorepo.icplayer.client.module.skiplink.keyboardManager;

import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkKeyboardItem;
import com.lorepo.icplayer.client.page.ITextToSpeechController;

import java.util.Collections;
import java.util.List;


/**
 * Class encapsulating functionality of moving through skip link items
 */
public class SkipLinkKeyboardManager {
    private int currentSelected = 0;
    private boolean isActive = false;
    private final List<? extends ISkipLinkKeyboardItem> items;

    public SkipLinkKeyboardManager(List<? extends ISkipLinkKeyboardItem> items) {
        this.items = items;
    }

    /**
     * @return isActive - whether the user has entered the module navigation
     */
    public boolean isActive() {
        return isActive;
    }

    /**
     * After calling this function, user can work with the module (ex. changing selection)
     */
    public void setActive() {
        setCurrentItemVisible();
        this.isActive = true;
    }

    /**
     * Hides current item, and resets the state
     */
    public void setInactive() {
        setCurrentItemInvisible();
        currentSelected = 0;
        isActive = false;
    }

    public void showFirstItem() {
        if (hasItems()) {
            items.get(0).setVisible();
        }
    }

    public void hideFirstItem() {
        if (hasItems()) {
            items.get(0).setInvisible();
        }
    }

    /**
     * Hides current item and shows next item
     */
    public void increase() {
        if (isActive() && this.currentSelected + 1 < items.size()) {
            setCurrentItemInvisible();
            currentSelected++;
            setCurrentItemVisible();
        }
    }

    /**
     * Hides current item and shows previous item
     */
    public void decrease() {
        if (isActive() && currentSelected > 0) {
            setCurrentItemInvisible();
            currentSelected--;
            setCurrentItemVisible();
        }
    }

    /**
     * @return module id - to which module navigation should be moved
     */
    public String getSelectedModuleId() {
        if (hasItems()) {
            return items.get(currentSelected).getModuleId();
        }
        return "";
    }

    /**
     * Speaks the text of current selected item
     * @param controller controller through which speech should commence
     */
    public void speakCurrentItem(ITextToSpeechController controller) {
        if (hasItems()) {
            ISkipLinkKeyboardItem currentlySelectedItem = items.get(currentSelected);

            String textToRead = currentlySelectedItem.getTextToRead();
            String langTag = currentlySelectedItem.getTextLang();
            TextToSpeechVoice currentItem = TextToSpeechVoice.create(textToRead, langTag);

            controller.speak(
                    Collections.singletonList(currentItem)
            );
        }
    }

    private void setCurrentItemInvisible() {
        if (hasItems()) {
            items.get(currentSelected).setInvisible();
        }
    }

    private void setCurrentItemVisible() {
        if (hasItems()) {
            items.get(currentSelected).setVisible();
        }

    }

    private boolean hasItems() {
        return this.items.size() > 0;
    }
}
