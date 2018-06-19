package com.lorepo.icplayer.client.module.checkcounter;

import com.lorepo.icf.properties.IProperty;
import com.google.gwt.xml.client.Element;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IWCAGModuleModel;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;


public class CheckCounterModule extends BasicModuleModel implements IWCAGModuleModel {

	private String langAttribute = "";
	
	/**
	 * constructor
	 * @param services
	 */
	public CheckCounterModule() {
		super("Check Counter", DictionaryWrapper.get("check_counter_module"));
		addPropertyLangAttribute();
	}

	
	@Override
	public String toXML() {
		Element checkCounterModule = XMLUtils.createElement("checkCounterModule");
		
		this.setBaseXMLAttributes(checkCounterModule);
		checkCounterModule.appendChild(this.getLayoutsXML());
		checkCounterModule.setAttribute("langAttribute", this.langAttribute);
		
		return checkCounterModule.toString();
	}
	
	private void addPropertyLangAttribute() {
		IProperty property = new IProperty() {

			@Override
			public void setValue(String newValue) {
				langAttribute = newValue;
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return langAttribute;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("choice_lang_attribute");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("choice_lang_attribute");
			}
		};

		addProperty(property);
	}
	
	public String getLangAttribute() {
		return langAttribute;
	}

	@Override
	protected void parseModuleNode(Element element) {}
}
