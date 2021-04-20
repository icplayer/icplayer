package com.lorepo.icplayer.client.module.skiplink;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.BasicPropertyProvider;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.google.gwt.xml.client.Node;
import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkItem;
import com.lorepo.icplayer.client.module.skiplink.properties.SkipLinkItemStringProperty;

import java.util.HashMap;
import java.util.Map;


public class SkipLinkItem extends BasicPropertyProvider implements ISkipLinkItem {
    private String moduleId;
    private String moduleText;
    private String moduleTextLang ;
    
    SkipLinkItem() {
        this("", "", "");
    }

    public SkipLinkItem(String moduleId, String moduleText, String moduleTextLang) {
        super(DictionaryWrapper.get("skiplink_item"));

        this.moduleId = moduleId;
        this.moduleText = moduleText;
        this.moduleTextLang = moduleTextLang;

        addPropertyValue();
        addPropertyModuleText();
        addPropertyModuleTextLang();
    }

    static SkipLinkItem fromXML(Element element) {
        XMLUtils.getText(element);
        String moduleId = StringUtils.unescapeXML(XMLUtils.getFirstElementContentWithTagName(element, "moduleId", ""));
        String moduleText = StringUtils.unescapeXML(XMLUtils.getFirstElementContentWithTagName(element, "moduleText", ""));
        String moduleTextLang = StringUtils.unescapeXML(XMLUtils.getFirstElementContentWithTagName(element, "moduleTextLang", ""));

        return new SkipLinkItem(moduleId, moduleText, moduleTextLang);
    }

    public String getModuleId() {
        return moduleId;
    }

    public String getModuleText() {
        return moduleText.equals("") ? moduleId : moduleText;
    }

    public String getModuleTextLang() {
        return moduleTextLang;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }

    public void setModuleTextLang(String newValue) {
        this.moduleTextLang = newValue;
    }

    public void setModuleText(String newValue) {
        this.moduleText = newValue;
    }

    public Node toXML() {
        Element item = XMLUtils.createElement("item");

        addTextProperties(item);

        return item;
    }

    private void addTextProperties(Element item) {
        Map<String, String> propertiesWithValues = new HashMap<String, String>() {{
            put("moduleId", moduleId);
            put("moduleText", moduleText);
            put("moduleTextLang", moduleTextLang);
        }};

        for (Map.Entry<String, String> property : propertiesWithValues.entrySet()) {
            item.appendChild(
                createTextNode(property.getKey(), property.getValue())
            );
        }

    }

    private Node createTextNode(String tagName, String value) {
        Node tag = XMLUtils.createElement(tagName);
        String escapedValue = StringUtils.escapeXML(value);
        tag.appendChild(
            XMLUtils.createTextNode(escapedValue)
        );
        return tag;
    }

    private void addPropertyValue() {
        IProperty property = new SkipLinkItemStringProperty("skiplink_property_item_value") {
            @Override
            public void setValue(String newValue) {
                setModuleId(newValue);
            }

            @Override
            public String getValue() {
                return getModuleId();
            }
        };

        addProperty(property);
    }

    private void addPropertyModuleText() {
        IProperty property = new SkipLinkItemStringProperty("skiplink_property_item_module_text") {
            @Override
            public void setValue(String newValue) {
                setModuleText(newValue);
            }

            @Override
            public String getValue() {
                return moduleText;
            }
        };

        addProperty(property);
    }

    private void addPropertyModuleTextLang() {
        IProperty property = new SkipLinkItemStringProperty("skiplink_property_item_module_text_lang") {
            @Override
            public void setValue(String newValue) {
                setModuleTextLang(newValue);
            }

            @Override
            public String getValue() {
                return moduleTextLang;
            }
        };

        addProperty(property);
    }


}
