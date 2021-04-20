package com.lorepo.icplayer.client.module.skiplink.interfaces;

import com.lorepo.icplayer.client.module.api.IModuleModel;

import java.util.List;

public interface ISkipLinkModule extends IModuleModel {
    String getName();
    List<? extends ISkipLinkItem> getItems();
}
