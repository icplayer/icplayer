package com.lorepo.icplayer.client.model.page;

public class PopupPage extends Page {

    private int originalHeight;
    private int originalWidth;

    public PopupPage(Page page) {
        super(page.getName(), page.getURL());
    }

    public int getOriginalHeight() {
        return originalHeight;
    }

    public void setOriginalHeight(int originalHeight) {
        this.originalHeight = originalHeight;
    }

    public int getOriginalWidth() {
        return originalWidth;
    }

    public void setOriginalWidth(int originalWidth) {
        this.originalWidth = originalWidth;
    }
}
