package com.lorepo.icplayer.client.module.skiplink.mocks;

import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkViewListener;

public class SkipLinkViewListenerMock implements ISkipLinkViewListener {
    public String selectedModuleId = "";

    @Override
    public void moduleIdSelected(String selectedModuleId) {
        this.selectedModuleId = selectedModuleId;
    }
}
