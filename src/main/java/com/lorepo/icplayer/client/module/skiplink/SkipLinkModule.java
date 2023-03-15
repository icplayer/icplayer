package com.lorepo.icplayer.client.module.skiplink;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IWCAGModuleModel;
import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkItem;
import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SkipLinkModule extends BasicModuleModel implements ISkipLinkModule, IWCAGModuleModel {
    private final List<SkipLinkItem> items;

    public SkipLinkModule() {
        super("SkipLink", DictionaryWrapper.get("skiplink_module"));
        this.items = new ArrayList<SkipLinkItem>();

        addPropertyItems();
    }

    @Override
    public String getName() {
        return "SkipLink";
    }

    @Override
    public List<? extends ISkipLinkItem> getItems() {
        return items;
    }

    @Override
    public String toXML() {
        Element module = XMLUtils.createElement("skipLinkModule");

        setBaseXMLAttributes(module);
        module.appendChild(getLayoutsXML());
        module.appendChild(getXMLItems());

        return module.toString();
    }

    @Override
    protected void parseModuleNode(Element element) {
        items.clear();

        NodeList itemsTags = element.getElementsByTagName("items");
        if (itemsTags.getLength() == 1) {
            Node itemTag = itemsTags.item(0);

            NodeList itemsList = itemTag.getChildNodes();
            for (int i = 0; i < itemsList.getLength(); i++) {
                if (itemsList.item(i) instanceof Element) {
                    Element item = (Element) itemsList.item(i);
                    items.add(SkipLinkItem.fromXML(item));
                }
            }
        }
    }

    private Node getXMLItems() {
        Element xmlItems = XMLUtils.createElement("items");

        for (SkipLinkItem item : items) {
            xmlItems.appendChild(item.toXML());
        }

        return xmlItems;
    }

    private void addItems(int count) {
        for (int i = 0; i < count; i++) {
            items.add(new SkipLinkItem());
        }
    }

    private void removeItem(int index) {
        items.remove(index);
    }

    private void moveItemUp(int index) {
        if (index > 0) {
            Collections.swap(items, index, index - 1);
        }
    }

    private void moveItemDown(int index) {
        if (index < items.size()) {
            Collections.swap(items, index, index + 1);
        }
    }

    private void moveItem(int prevIndex, int nextIndex) {
        SkipLinkItem linkItem = items.remove(prevIndex);
        items.add(nextIndex, linkItem);
    }

    private void addPropertyItems() {
        IListProperty property = new IListProperty() {
            @Override
            public void setValue(String newValue) {
                sendPropertyChangedEvent(this);
            }

            @Override
            public String getValue() {
                return Integer.toString(items.size());
            }

            @Override
            public String getName() {
                return DictionaryWrapper.get("skiplink_items");
            }

            @Override
            public IPropertyProvider getChild(int index) {
                return items.get(index);
            }

            @Override
            public int getChildrenCount() {
                return items.size();
            }

            @Override
            public void addChildren(int count) {
                addItems(count);
                sendPropertyChangedEvent(this);
            }

            @Override
            public String getDisplayName() {
                return DictionaryWrapper.get("choice_item");
            }

            @Override
            public void removeChildren(int index) {
                removeItem(index);
                sendPropertyChangedEvent(this);
            }

            @Override
            public void moveChildUp(int index) {
                moveItemUp(index);
                sendPropertyChangedEvent(this);
            }

            @Override
            public void moveChildDown(int index) {
                moveItemDown(index);
                sendPropertyChangedEvent(this);
            }

            @Override
            public boolean isDefault() {
                return true;
            }

            @Override
			public void moveChild(int prevIndex, int nextIndex) {
                moveItem(prevIndex, nextIndex);
				sendPropertyChangedEvent(this);
            }

        };

        addProperty(property);
    }

}
