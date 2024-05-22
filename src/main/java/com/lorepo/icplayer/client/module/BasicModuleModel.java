package com.lorepo.icplayer.client.module;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icf.utils.UUID;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.EnableTabindex;
import com.lorepo.icplayer.client.metadata.IMetadata;
import com.lorepo.icplayer.client.metadata.Metadata;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.INameValidator;
import com.lorepo.icplayer.client.xml.module.ModuleXMLParsersFactory;
import com.lorepo.icplayer.client.xml.module.parsers.IModuleModelBuilder;

public abstract class BasicModuleModel extends StyledModule implements IModuleModel, IModuleModelBuilder {
	private String moduleTypeName;
	private String moduleName;
	private String id;
	protected String baseURL;
	protected String contentBaseURL;
	private INameValidator nameValidator;
	private String buttonType;
	private boolean isTabindexEnabled = false;
	private boolean shouldOmitInTTS = false;
	private boolean shouldOmitInKeyboardNavigation = false;
	private String ttsTitle = "";
	private String contentDefaultLayoutID = null;
	public IMetadata metadata = new Metadata();

	protected BasicModuleModel(String typeName, String name) {
		super(name);
		this.moduleTypeName = typeName;
		this.moduleName = name;
		id = UUID.uuid(6);
		addPropertyId();
		registerPositionProperties();
		addPropertyIsVisible();
		this.addPropertyOmitInKeyboardNavigation();
		this.addPropertyOmitInTTS();
		this.addPropertyTTSTitle();
		this.addPropertyIsTabindexEnabled();
	}

	@Override
	public String getModuleName() {
		return moduleName;
	}

	@Override
	public String getModuleTypeName() {
		return moduleTypeName;
	}

	@Override
	public String getClassNamePrefix() {
		return getModuleTypeName();
	};

	@Override
	public String getId() {
		return id;
	}

	@Override
	public void setId(String newId) {
		id = newId;
	}

	@Override
	public void release() {}

	@Override
	public void setInlineStyle(String style) {
		String css = URLUtils.resolveCSSURL(this.baseURL, style, this.contentBaseURL);
		super.setInlineStyle(css);
	}
	
	@Override
	public void setContentDefaultLayoutID(String layoutID) {
		this.contentDefaultLayoutID = layoutID;
	}
	
	@Override
	public void setMetadata(IMetadata metadata) {
		this.metadata = metadata;
	}

	/**
	 * Load attributes common to all modules: - position - style
	 */
	@Override
	public void load(Element element, String baseUrl, String version) {
		this.baseURL = baseUrl;
		ModuleXMLParsersFactory factory = new ModuleXMLParsersFactory(this);
		if (this.contentDefaultLayoutID != null) {
			factory.setDefaultLayoutID(contentDefaultLayoutID);
		}
		factory.produce(element, version);
		this.parseModuleNode(element);
	}

	protected abstract void parseModuleNode(Element element);

	public void setButtonType(String type) {
		this.buttonType = type;
	}

	public String getButtonType() {
		return buttonType;
	}

	protected Element setBaseXMLAttributes(Element moduleXML) {
		String escapedId = StringUtils.escapeXML(this.getId());
		moduleXML.setAttribute("id", escapedId);
		XMLUtils.setBooleanAttribute(moduleXML, "isTabindexEnabled", this.isTabindexEnabled);
		XMLUtils.setBooleanAttribute(moduleXML, "shouldOmitInKeyboardNavigation", this.shouldOmitInKeyboardNavigation);
		XMLUtils.setBooleanAttribute(moduleXML, "shouldOmitInTTS", this.shouldOmitInTTS);
		String escapedTTSTitle = StringUtils.escapeXML(this.getTTSTitle());
		moduleXML.setAttribute("ttsTitle", escapedTTSTitle);
		
		if (this.haveStyles()) {
			moduleXML.appendChild(this.stylesToXML());
		}
		
		if (this.metadata.hasEntries()) {
			moduleXML.appendChild(this.metadata.toXML());
		}

		return moduleXML;
	}

	private void addPropertyId() {

		IProperty property = new IProperty() {

			@Override
			public void setValue(String newValue) {
				if (nameValidator != null
						&& nameValidator.canChangeName(newValue)) {
					id = newValue;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return id;
			}

			@Override
			public String getName() {
				return "ID";
			}

			public String getDisplayName() {
				return "ID";
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	private void addPropertyIsVisible() {
		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != isVisible()) {
					setIsVisible(value);
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isVisible() ? "True" : "False";
			}

			@Override
			public String getName() {
				return "Is Visible";
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("is_visible");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}

    private void addPropertyIsTabindexEnabled() {
		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != isTabindexEnabled) {
					isTabindexEnabled = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isTabindexEnabled ? "True" : "False";
			}

			@Override
			public String getName() {
				return "Is Tabindex Enabled";
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("is_tabindex_enabled");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}

	private void addPropertyOmitInKeyboardNavigation() {
		IProperty property = new IBooleanProperty() {
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != shouldOmitInKeyboardNavigation) {
					shouldOmitInKeyboardNavigation = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return shouldOmitInKeyboardNavigation ? "True" : "False";
			}

			@Override
			public String getName() {
				return "Omit in keyboard navigation";
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("should_omit_in_keyboard_navigation");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	private void addPropertyOmitInTTS() {
		IProperty property = new IBooleanProperty() {
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != shouldOmitInTTS) {
					shouldOmitInTTS = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return shouldOmitInTTS ? "True" : "False";
			}

			@Override
			public String getName() {
				return "Omit in TTS";
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("should_omit_in_TTS");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	private void addPropertyTTSTitle() {
		IProperty property = new IProperty() {
			@Override
			public void setValue(String newValue) {
				if (newValue != ttsTitle) {
					ttsTitle = newValue;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return ttsTitle;
			}

			@Override
			public String getName() {
				return "TTS Title";
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("tts_title");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	@Override
	public boolean shouldOmitInKeyboardNavigation() {
		return this.shouldOmitInKeyboardNavigation;
	}

	@Override
	public void setOmitInKeyboardNavigation(boolean value) {
		this.shouldOmitInKeyboardNavigation = value;
	}

	@Override
	public boolean shouldOmitInTTS() {
		return this.shouldOmitInTTS;
	}

	@Override
	public void setOmitInTTS(boolean value) {
		this.shouldOmitInTTS = value;
	}

	public String getBaseURL() {
		return this.baseURL;
	}

    @Override
	public void setBaseUrl(String baseUrl) {
		this.baseURL = baseUrl;
    }

	@Override
	public void setContentBaseURL(String baseURL) {
		this.contentBaseURL = baseURL;
	}

	public String getContentBaseURL() {
		return this.contentBaseURL;
	}

	@Override
	public void addNameValidator(INameValidator validator) {
		this.nameValidator = validator;
	}

	@Override
	public void setID(String id) {
		this.id = id;
	}

	@Override
	public boolean isTabindexEnabled() {
		boolean isTabEnabledPreferences = EnableTabindex.getInstance().isTabindexEnabled && isTabindexEnabled ? true : false;

		return isTabEnabledPreferences;
	}

	@Override
	public void setIsTabindexEnabled(boolean value) {
		this.isTabindexEnabled = value;
	}
	
	@Override
	public IMetadata getMetadata() {
		return this.metadata;
	}

	@Override
	public String getTTSTitle() {
		return this.ttsTitle;
	}

	@Override
	public void setTTSTitle(String title) {
		this.ttsTitle = title;
	}
}
