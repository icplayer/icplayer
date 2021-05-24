package com.lorepo.icplayer.client.module.skiplink.keyboardManager;

import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkKeyboardItem;

public class SkipLinkKeyboardItem implements ISkipLinkKeyboardItem {
    private Widget view;
    private String textToRead;
    private String moduleId;
    private String textLang;

    public SkipLinkKeyboardItem(Widget itemView, String itemText, String itemModuleId, String itemTextLang) {
        this.view = itemView;
        this.textToRead = itemText;
        this.moduleId = itemModuleId;
        this.textLang = itemTextLang;
    }

    public String getModuleId() {
        return moduleId;
    }

    public String getTextToRead() {
        return textToRead;
    }

    public String getTextLang() {
        return textLang;
    }

    public void setVisible() {
        view.setVisible(true);
    }

    public void setInvisible() {
        view.setVisible(false);
    }
}
