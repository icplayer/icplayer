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
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.INameValidator;
import com.lorepo.icplayer.client.xml.module.ModuleXMLParsersFactory;
import com.lorepo.icplayer.client.xml.module.parsers.IModuleModelBuilder;

public abstract class BasicModuleModel extends StyledModule implements IModuleModel, IModuleModelBuilder {
	private String moduleTypeName;
	private String moduleName;
	private String id;
	protected String baseURL;
	private INameValidator nameValidator;
	private String buttonType;
	private boolean isTabindexEnabled = false;
	private String contentDefaultLayoutID = null;

	protected BasicModuleModel(String typeName, String name) {
		super(name);
		this.moduleTypeName = typeName;
		this.moduleName = name;
		id = UUID.uuid(6);
		addPropertyId();
		registerPositionProperties();
		addPropertyIsVisible();
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
	public void release() {
	}

	@Override
	public void setInlineStyle(String style) {
		String css = URLUtils.resolveCSSURL(this.baseURL, style);
		super.setInlineStyle(css);
	}
	
	@Override
	public void setContentDefaultLayoutID(String layoutID) {
		this.contentDefaultLayoutID = layoutID;
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
		
		if (this.haveStyles()) {
			moduleXML.appendChild(this.stylesToXML());
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

	public String getBaseURL() {
		return baseURL;
	}

	public void setBaseUrl(String baseUrl) {
		this.baseURL = baseUrl;
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
}
