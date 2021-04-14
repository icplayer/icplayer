package com.lorepo.icplayer.client.module.skiplink;

public class SkipLinkKeyboardManager {
    private int currentSelected = 0;
    private boolean isActive = false;
    private int max = 0;

    SkipLinkKeyboardManager(int max) {
        this.max = max;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public void increase() {
        if (this.currentSelected + 1 == max) {
            this.currentSelected = 0;
        } else {
            this.currentSelected++;
        }
    }

    public void decrease() {
        if (currentSelected == 0) {
            currentSelected = max;
        } else {
            this.currentSelected--;
        }
    }

    public int getCurrentSelected() {
        return this.currentSelected;
    }

    public void reset() {
        currentSelected = 0;
        isActive = false;
    }
}
