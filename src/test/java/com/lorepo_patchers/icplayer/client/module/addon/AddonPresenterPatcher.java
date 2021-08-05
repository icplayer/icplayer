package com.lorepo_patchers.icplayer.client.module.addon;

import com.google.gwt.core.client.JavaScriptObject;
import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.module.addon.AddonPresenter;


@PatchClass(AddonPresenter.class)
public class AddonPresenterPatcher {

    @PatchMethod
    public static String getOpenEndedContent(AddonPresenter self, JavaScriptObject presenter) {
        return "Open Ended Content For Addon";
    }
}
