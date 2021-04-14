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

import java.util.HashMap;
import java.util.List;

public class SkipLinkPresenter implements ISkipLinkPresenter, IPresenter, ICommandReceiver, IWCAGPresenter {
    private ISkipLinkModule module;
    private IPlayerServices services;
    private SkipLinkView view;

    public SkipLinkPresenter(ISkipLinkModule module, IPlayerServices services) {
        this.module = module;
        this.services = services;
    }

    @Override
    public void addView(IModuleView view) {
        if (view instanceof SkipLinkView) {
            this.view = (SkipLinkView) view;
        }
    }

    @Override
    public IModuleModel getModel() {
        return this.module;
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
    public JavaScriptObject getAsJavaScript() {
        return JSSkipLinkPresenter.create(this);
    }

    @Override
    public void setDisabled(boolean value) {

    }

    @Override
    public boolean isDisabled() {
        return false;
    }

    @Override
    public String getName() {
        return null;
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
        this.view.getElement().addClassName(className);
        this.view.setVisible(true);
    }

    @Override
    public void deselectAsActive(String className) {
        this.view.setVisible(false);
        this.view.getElement().removeClassName(className);
    }

    @Override
    public boolean isSelectable(boolean isTextToSpeechOn) {
        return true;
    }
}
