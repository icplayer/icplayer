package com.lorepo_patchers.icplayer.client.module;

import com.google.gwt.dom.client.Element;
import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.module.NestedAddonUtils;

@PatchClass(NestedAddonUtils.class)
public class NestedAddonUtilsPatcher {

    @PatchMethod
    public static boolean insertIntoAddonGap(String moduleID, Element view, Element page) {
        return false;
    }
}
