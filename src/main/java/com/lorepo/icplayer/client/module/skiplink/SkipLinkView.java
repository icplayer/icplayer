package com.lorepo.icplayer.client.module.skiplink;

import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.page.ITextToSpeechController;
import com.lorepo.icplayer.client.page.PageController;

import java.util.Collections;

public class SkipLinkView extends FlowPanel implements IWCAG, IWCAGModuleView, IModuleView {
    private final ISkipLinkModule module;
    private final String skipLinkItemClass = "skiplink-item";
    private final SkipLinkKeyboardManager keyboardManager;
    private ISkipLinkViewListener listener;
    private ITextToSpeechController speechController;
    private boolean isWCAGOn = false;

    public SkipLinkView(ISkipLinkModule module, boolean isPreview) {
        this.getElement().setId(module.getId());
        this.module = module;

        for (ISkipLinkItem item : module.getItems()) {
            Widget elementDisplay = new HTML(item.getModuleText());

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
            exitNavigation();
        } else {
            if (keyboardManager.isActive()) {
                String selectedModuleId = module.getItems().get(keyboardManager.getCurrentSelected()).getModuleId();
                listener.moduleIdSelected(selectedModuleId);
            } else {
                this.setVisible(true);
                keyboardManager.setActive(true);
                setCurrentItemVisible();
                speakCurrentVisibleItem();
            }

        }
    }

    public void addListener(ISkipLinkViewListener addedListener) {
        this.listener = addedListener;
    }

    public void enterNavigation(String className) {
        getElement().addClassName(className);
        setVisible(true);
        setCurrentItemVisible();
        speakCurrentVisibleItem();
    }

    public void exitNavigation(String className) {
        exitNavigation();
        getElement().removeClassName(className);
    }

    public void exitNavigation() {
        setCurrentItemInvisible();
        setVisible(false);
        keyboardManager.reset();
    }

    @Override
    public void space(KeyDownEvent event) {

    }

    @Override
    public void tab(KeyDownEvent event) {
        setCurrentItemInvisible();
        keyboardManager.increase();
        setCurrentItemVisible();
        speakCurrentVisibleItem();
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
        setCurrentItemInvisible();
        keyboardManager.decrease();
        setCurrentItemVisible();
        speakCurrentVisibleItem();
    }

    @Override
    public void setPageController(PageController pc) {
        this.setWCAGStatus(true);
        this.speechController = pc;
    }

    @Override
    public void setWCAGStatus(boolean isWCAGOn) {
        this.isWCAGOn = isWCAGOn;
    }

    @Override
    public String getLang() {
        return null;
    }

    @Override
    public String getName() {
        return module.getName();
    }

    private void setCurrentItemInvisible() {
        int currentIndex = keyboardManager.getCurrentSelected();
        getChildren().get(currentIndex).setVisible(false);
    }

    private void setCurrentItemVisible() {
        int currentIndex = keyboardManager.getCurrentSelected();
        getChildren().get(currentIndex).setVisible(true);
    }

    private void speakCurrentVisibleItem() {
        if (this.isWCAGOn && this.speechController != null) {
            ISkipLinkItem currentlySelectedItem = module.getItems().get(keyboardManager.getCurrentSelected());

            String text = currentlySelectedItem.getModuleText();
            String langTag = currentlySelectedItem.getModuleTextLang();
            TextToSpeechVoice currentItem = TextToSpeechVoice.create(text, langTag);

            speechController.speak(
                Collections.singletonList(currentItem)
            );
        }

    }

}
