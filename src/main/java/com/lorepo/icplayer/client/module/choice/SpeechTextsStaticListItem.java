package com.lorepo.icplayer.client.module.choice;

import com.lorepo.icf.properties.BasicPropertyProvider;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;

public class SpeechTextsStaticListItem extends BasicPropertyProvider {
	private String text;
	private String dictionaryLabel;
	
	public SpeechTextsStaticListItem(String name) {
		super(name);
		addPropertyText();
		dictionaryLabel = "choice_item_" + name;
		// TODO Auto-generated constructor stub
	}
	
	public String getText() {
		return StringUtils.escapeXML(this.text);
	}
	
	public void setText(String text) {
		this.text = StringUtils.unescapeXML(text);
	}
	
	private void addPropertyText() {

		IProperty property = new IProperty() {

			@Override
			public void setValue(String newValue) {
				text = newValue;
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return text;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get(dictionaryLabel);
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(dictionaryLabel);
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

}
