package com.lorepo.icplayer.client.module.skiplink;

import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkItem;
import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkModule;
import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkViewListener;
import com.lorepo.icplayer.client.module.skiplink.keyboardManager.SkipLinkKeyboardItem;
import com.lorepo.icplayer.client.module.skiplink.keyboardManager.SkipLinkKeyboardManager;
import com.lorepo.icplayer.client.page.ITextToSpeechController;
import com.lorepo.icplayer.client.page.PageController;

import java.util.ArrayList;
import java.util.List;

public class SkipLinkView extends FlowPanel implements IWCAG, IWCAGModuleView, IModuleView {
    private final ISkipLinkModule module;
    private final String skipLinkItemClass = "skiplink-item";
    private final String skipLinkWrapperClass = "skiplink-wrapper";
    private final SkipLinkKeyboardManager keyboardManager;
    private ISkipLinkViewListener listener;
    private ITextToSpeechController speechController;
    private boolean isWCAGOn = false;

    public SkipLinkView(ISkipLinkModule module, boolean isPreview) {
        this.getElement().setId(module.getId());
        this.setStyleClassName(module.getStyleClass());
        this.module = module;
        // module only visible in preview
        this.setVisible(isPreview);

        List<SkipLinkKeyboardItem> keyboardItemList = new ArrayList<SkipLinkKeyboardItem>();

        for (ISkipLinkItem item : module.getItems()) {
            // creates simple div with class
            Widget elementDisplay = createSkipLinkItemView(item.getModuleText(), isPreview);

            add(elementDisplay);

            keyboardItemList.add(new SkipLinkKeyboardItem(elementDisplay, item.getModuleText(), item.getModuleId(), item.getModuleTextLang()));
        }

        keyboardManager = new SkipLinkKeyboardManager(keyboardItemList);
    }

    private void setStyleClassName(String className) {
        if (!className.isEmpty()) {
            this.getElement().addClassName(className);
        } else {
            this.getElement().addClassName(skipLinkWrapperClass);
        }
    }

    @Override
    public void enter(KeyDownEvent event, boolean isExiting) {
        if (isExiting) {
            exitNavigation();
        } else {
            activateKeyboard();
        }
    }

    public void addListener(ISkipLinkViewListener addedListener) {
        this.listener = addedListener;
    }

    /**
     * When user has activated the module.
     * This is convoluted, as KeybaordNavigationController isn't written nicely:
     *  First it calls selectAsActive("ic_active_module")
     *  Then it calls "enter" function
     * And after every key press it will call "restoreClasses" method.
     * This makes it a little hard to dynamically show module content when navigation is passing over the module
     * @param className class name to add
     */
    public void activateNavigation(String className) {
        if (!getElement().getClassName().contains(className)) {
            getElement().addClassName(className);
            keyboardManager.hideFirstItem();
            speakCurrentVisibleItem();
        }
    }

    /**
     * When user has deactivated the module
     * @param className class name to remove
     */
    public void deactivateNavigation(String className) {
        getElement().removeClassName(className);
    }

    /**
     * When user has tabbed into the module
     * @param className class name to add
     */
    public void showNavigation(String className) {
        if (!getElement().getClassName().contains(className)) {
            getElement().addClassName(className);
            keyboardManager.showFirstItem();
            setVisible(true);
        }
    }

    /**
     * When user has exited from the module
     * @param className class name to remove
     */
    public void hideNavigation(String className) {
        getElement().removeClassName(className);
        keyboardManager.setInactive();
        setVisible(false);
    }

    public void exitNavigation() {
        keyboardManager.setInactive();
        setVisible(false);
    }

    @Override
    public void shiftTab(KeyDownEvent event) {
        keyboardManager.decrease();
        speakCurrentVisibleItem();
    }

    @Override
    public void tab(KeyDownEvent event) {
        keyboardManager.increase();
        speakCurrentVisibleItem();
    }

    @Override
    public void space(KeyDownEvent event) {
        if (keyboardManager.isActive()) {
            event.preventDefault();
            moveNavigationToSelectedModule();
        }
    }

    @Override
    public void escape(KeyDownEvent event) {
        keyboardManager.setInactive();
        this.setVisible(false);
    }

    @Override
    public void setPageController(PageController pc) {
        this.setWCAGStatus(true);
        this.speechController = pc;
    }

    /**
     * This function is here purely for testing purposes - setPageController requires concrete implementation,
     * because its declaration is bad, fixing it would require many changes in current modules.
     * @param controller controller to set as speechController
     */
    public void setSpeechController(ITextToSpeechController controller) {
        this.speechController = controller;
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
    public void customKeyCode(KeyDownEvent event) {

    }

    private Widget createSkipLinkItemView(String itemText, boolean isPreview) {
        Widget elementDisplay = new HTML(itemText);
        elementDisplay.addStyleName(skipLinkItemClass);
        elementDisplay.setVisible(isPreview);

        return elementDisplay;
    }

    private void activateKeyboard() {
        if (!keyboardManager.isActive()) {
            this.setVisible(true);
            keyboardManager.setActive();
        }

        speakCurrentVisibleItem();
    }

    private void moveNavigationToSelectedModule() {
        if (listener != null) {
            String selectedModuleId = keyboardManager.getSelectedModuleId();
            listener.moduleIdSelected(selectedModuleId);
        }
    }

    private void speakCurrentVisibleItem() {
        if (this.keyboardManager.isActive() && this.isWCAGOn && this.speechController != null) {
            this.keyboardManager.speakCurrentItem(this.speechController);
        }
    }

}
