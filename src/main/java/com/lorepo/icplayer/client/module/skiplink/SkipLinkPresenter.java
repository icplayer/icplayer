package com.lorepo.icplayer.client.module.skiplink;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkModule;
import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkPresenter;
import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkViewListener;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;

import java.util.HashMap;
import java.util.List;

public class SkipLinkPresenter implements ISkipLinkPresenter, IPresenter, ICommandReceiver, IWCAGPresenter {
    private final ISkipLinkModule module;
    private final IPlayerServices services;
    private SkipLinkView view;

    public SkipLinkPresenter(ISkipLinkModule module, IPlayerServices services) {
        this.module = module;
        this.services = services;
    }

    @Override
    public void addView(IModuleView view) {
        if (view instanceof SkipLinkView) {
            this.view = (SkipLinkView) view;

            this.addViewEventsListener();
        }
    }

    @Override
    public IModuleModel getModel() {
        return this.module;
    }

    @Override
    public JavaScriptObject getAsJavaScript() {
        // if ever implementing this, create new class which extends JavaScriptObject (GWT overlay type)
        return JavaScriptObject.createObject();
    }

    @Override
    public boolean isDisabled() {
        return false;
    }

    @Override
    public String getName() {
        return module.getId();
    }

    @Override
    public String executeCommand(String commandName, List<IType> params) {
        return null;
    }

    @Override
    public IWCAG getWCAGController() {
        return this.view;
    }

    @Override
    public void selectAsActive(String className) {
        if (className.equals(KeyboardNavigationController.ACTIVE_CLASS)) {
            view.activateNavigation(className);
        } else if (className.equals(KeyboardNavigationController.SELECTED_CLASS)) {
            view.showNavigation(className);
        }
    }

    @Override
    public void deselectAsActive(String className) {
        if (className.equals(KeyboardNavigationController.ACTIVE_CLASS)) {
            view.deactivateNavigation(className);
        } else if (className.equals(KeyboardNavigationController.SELECTED_CLASS)) {
            view.hideNavigation(className);
        }
    }

    @Override
    public boolean isSelectable(boolean isTextToSpeechOn) {
        return isTextToSpeechOn || haveStandaloneKeyboardNavigationSupport();
    }
    
    @Override
    public boolean haveStandaloneKeyboardNavigationSupport() {
        return !module.shouldOmitInKeyboardNavigation();
    }

    @Override
    public void setShowErrorsMode() {

    }

    @Override
    public void setWorkMode() {

    }

    @Override
    public void reset(boolean onlyWrongAnswers) {

    }

    @Override
    public void onEventReceived(String eventName, HashMap<String, String> data) {

    }

    @Override
    public void setDisabled(boolean value) {

    }

    private void addViewEventsListener() {
        this.view.addListener(new ISkipLinkViewListener() {
            @Override
            public void moduleIdSelected(String selectedModuleId) {
                selectModuleInKeyboardNavigation(selectedModuleId);
            }
        });
    }

    private void selectModuleInKeyboardNavigation(String moduleId) {
        services.getCommands().switchKeyboardNavigationToModule(moduleId);
    }
}
