package com.lorepo.icplayer.client.module.skiplink;

import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.page.PageController;

public class SkipLinkView extends FlowPanel implements IWCAG, IWCAGModuleView, IModuleView {
    private ISkipLinkModule module;
    private String skipLinkItemClass = "skiplink-item";
    private SkipLinkKeyboardManager keyboardManager;

    public SkipLinkView(ISkipLinkModule module, boolean isPreview) {
        this.getElement().setId(module.getId());
        this.module = module;

        for (ISkipLinkItem item : module.getItems()) {
            Widget elementDisplay = new HTML(item.getModuleId());

            elementDisplay.addStyleName(skipLinkItemClass);
            elementDisplay.setVisible(isPreview);

            this.add(elementDisplay);
        }

         keyboardManager = new SkipLinkKeyboardManager(module.getItems().size());
        // module only visible in preview
        this.setVisible(isPreview);
    }

    @Override
    public void enter(KeyDownEvent event, boolean isExiting) {
        if (isExiting) {
            keyboardManager.reset();
            this.setVisible(false);
        } else {
            if (keyboardManager.isActive()) {
                JavaScriptUtils.log(module.getItems().get(keyboardManager.getCurrentSelected()).getModuleId());
            } else {
                this.setVisible(true);
                keyboardManager.setActive(true);
                this.getChildren().get(keyboardManager.getCurrentSelected()).setVisible(true);
            }

        }
    }

    @Override
    public void space(KeyDownEvent event) {

    }

    @Override
    public void tab(KeyDownEvent event) {
        setCurrentVisible(false);
        keyboardManager.increase();
        setCurrentVisible(true);
    }

    @Override
    public void left(KeyDownEvent event) {

    }

    @Override
    public void right(KeyDownEvent event) {

    }

    @Override
    public void down(KeyDownEvent event) {

    }

    @Override
    public void up(KeyDownEvent event) {

    }

    @Override
    public void escape(KeyDownEvent event) {
        keyboardManager.reset();
        this.setVisible(false);
    }

    @Override
    public void customKeyCode(KeyDownEvent event) {

    }

    @Override
    public void shiftTab(KeyDownEvent event) {
        setCurrentVisible(false);
        keyboardManager.decrease();
        setCurrentVisible(true);
    }

    @Override
    public void setPageController(PageController pc) {

    }

    @Override
    public void setWCAGStatus(boolean isWCAGOn) {

    }

    @Override
    public String getLang() {
        return null;
    }

    @Override
    public String getName() {
        return module.getName();
    }

    private void setCurrentVisible(boolean visible) {
        int currentIndex = keyboardManager.getCurrentSelected();
        getChildren().get(currentIndex).setVisible(visible);
    }

}
