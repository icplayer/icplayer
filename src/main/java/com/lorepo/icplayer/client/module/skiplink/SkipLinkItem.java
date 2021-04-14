package com.lorepo.icplayer.client.module.skiplink;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.BasicPropertyProvider;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.google.gwt.xml.client.Node;


public class SkipLinkItem extends BasicPropertyProvider implements ISkipLinkItem {
    private String moduleId;
    
    SkipLinkItem() {
        super(DictionaryWrapper.get("skiplink_item"));

        addPropertyValue();
    }

    static SkipLinkItem fromXML(Element element) {
        String moduleId = XMLUtils.getText(element);

        SkipLinkItem item = new SkipLinkItem();
        item.setModuleId(moduleId);

        return item;
    }

    public String getModuleId() {
        return moduleId;
    }
    
    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }

    public Node toXML() {
        Element item = XMLUtils.createElement("item");
        Node moduleIdValue = XMLUtils.createTextNode(moduleId);
        item.appendChild(moduleIdValue);
        return item;
    }

    private void addPropertyValue() {
        IProperty property = new IProperty() {

            @Override
            public void setValue(String newValue) {
                setModuleId(newValue);
            }

            @Override
            public String getValue() {
                return getModuleId();
            }

            @Override
            public String getName() {
                return DictionaryWrapper.get("skiplink_item_value");
            }

            @Override
            public String getDisplayName() {
                return DictionaryWrapper.get("skiplink_item_value");
            }

            @Override
            public boolean isDefault() {
                return false;
            }
        };

        addProperty(property);
    }
}
