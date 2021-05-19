package com.lorepo.icplayer.client.module.skiplink.properties;

import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;

public abstract class SkipLinkItemStringProperty implements IProperty {
    private final String name;

    public SkipLinkItemStringProperty(String nameDictionaryEntry) {
        this.name = DictionaryWrapper.get(nameDictionaryEntry);
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public String getDisplayName() {
        return this.name;
    }

    @Override
    public boolean isDefault() {
        return false;
    }
}
