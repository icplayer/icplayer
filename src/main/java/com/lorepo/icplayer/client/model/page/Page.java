package com.lorepo.icplayer.client.model.page;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArrayString;
import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.BasicPropertyProvider;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IEnumSetProperty;
import com.lorepo.icf.properties.IImageProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icf.utils.UUID;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.framework.module.IStyleListener;
import com.lorepo.icplayer.client.framework.module.IStyledModule;
import com.lorepo.icplayer.client.model.ModuleList;
import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.model.layout.Size;
import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.model.page.properties.PageHeightModifications;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.INameValidator;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.semi.responsive.SemiResponsiveStyles;
import com.lorepo.icplayer.client.ui.Ruler;
import com.lorepo.icplayer.client.xml.page.IPageBuilder;
import com.lorepo.icplayer.client.xml.page.PageFactory;

public class Page extends BasicPropertyProvider implements IStyledModule, IPage, IPageBuilder {

	private IPlayerServices playerServices;

	public enum LayoutType {
		percentage, pixels, responsive
	}

	public enum ScoringType {
		percentage, zeroOne, minusErrors
	}

	public enum PageScoreWeight {
		defaultWeight, // 1
		maxPageScore, // sum of modules scoring
		custom
	}

	public static final String version = "8";
	
	private String id;
	private String name;
	private final String href;
	private LayoutType layout = LayoutType.pixels;
	private ScoringType scoringType = ScoringType.percentage;
	private SemiResponsiveStyles semiResponsiveStyles = new SemiResponsiveStyles();
	
	private final ModuleList modules = new ModuleList();
	/** base url to this document with ending '/' */
	private String baseURL = "";
	private String contentBaseURL;
	private IStyleListener styleListener;
	private boolean loaded = false;

	private HashMap<String, Size> pageSizes;

	private boolean reportable = true;
	private String previewURL = "";
	private String previewLargeURL = "";
	// Properties
	IProperty propertyName;
	private int index;
	private List<Group> groupedModules = new ArrayList<Group>();
	
	private boolean hasHeader = true;
	private boolean hasFooter = true;
	private String headerId = "";
	private String footerId = "";
	
	@SuppressWarnings("serial")
	private final HashMap<String, List<Ruler>> rulers = new HashMap<String, List<Ruler>>(){{
		put("verticals", new ArrayList<Ruler>());
		put("horizontals", new ArrayList<Ruler>());
	}};

	private PageScoreWeight pageScoreWeightMode = PageScoreWeight.defaultWeight;
	private int modulesMaxScore = 0;
	private int pageWeight = 1;
	private int pageCustomWeight = 1;
	private String semiResponsiveLayoutID = "default";
	public PageHeightModifications heightModifications = new PageHeightModifications();
	
	private boolean randomizeInPrint = false;
	private boolean isSplitInPrintBlocked = false;
	private boolean notAssignable = false;

	private String defaultLayoutID;

	public Page(String name, String url) {
		super("Page");
		this.id = UUID.uuid(16);
		this.name = name;
		this.href = url;
		this.pageSizes = new HashMap<String, Size>();
		this.pageSizes.put(this.semiResponsiveLayoutID, new Size(this.semiResponsiveLayoutID, 0, 0));
		addPropertyName();
		addPropertyWidth();
		addPropertyHeight();
		addPropertyReportable();
		addPropertyNotAssignable();
		addPropertyPreview();
		addPropertyPreviewLarge();
		addPropertyScoreType();
		addPropertyWeightScoreMode();
		addPropertyWeightScoreValue();
		addPropertyRandomizeInPrint();
		addPropertyIsSplitInPrintBlocked();
		addGroupIdValidatorToModules();
	}

	/**
	 * Get JavaScript interface to the page
	 * @param x
	 * @return
	 */
	private native static JavaScriptObject javaScriptInterface(Page x) /*-{

		var page = function(){}
		page.type = "page";
		page.getId = function() {
			return x.@com.lorepo.icplayer.client.model.page.Page::getId()();
		}

		page.getName = function() {
			return x.@com.lorepo.icplayer.client.model.page.Page::getName()();
		}

		page.getBaseURL = function() {
			return x.@com.lorepo.icplayer.client.model.page.Page::getBaseURL()();
		}

		page.isReportable = function() {
			return x.@com.lorepo.icplayer.client.model.page.Page::isReportable()();
		}
		
		page.getRandomizeInPrint = function() {
			return x.@com.lorepo.icplayer.client.model.page.Page::getRandomizeInPrint()();
		}

		page.isSplitInPrintBlocked = function() {
			return x.@com.lorepo.icplayer.client.model.page.Page::isSplitInPrintBlocked()();
		}

		page.isNotAssignable = function() {
			return x.@com.lorepo.icplayer.client.model.page.Page::isNotAssignable()();
		}

        page.getPreview = function(){
			return x.@com.lorepo.icplayer.client.model.page.Page::getPreview()();
		}

		page.isVisited = function(checkReportable) {
			if (!checkReportable) {
				checkReportable = false;
			}
			return x.@com.lorepo.icplayer.client.model.page.Page::isVisited(Z)(checkReportable);
		}

		page.getModulesAsJS = function() {
			return x.@com.lorepo.icplayer.client.model.page.Page::getModulesListAsJS()();
		}

		page.setAsReportable = function () {
			x.@com.lorepo.icplayer.client.model.page.Page::setAsReportable()();
		}

		page.setAsNonReportable = function () {
			x.@com.lorepo.icplayer.client.model.page.Page::setAsNonReportable()();
		}

		page.getModules = function() {
			return x.@com.lorepo.icplayer.client.model.page.Page::getModulesList()();
		}

		page.getPageWeight = function() {
			return x.@com.lorepo.icplayer.client.model.page.Page::getPageWeight()();
		}

		page.getModulesMaxScore = function() {
			return x.@com.lorepo.icplayer.client.model.page.Page::getModulesMaxScore()();
		}

		return page;
	}-*/;

	@Override
	public void setPlayerServices(IPlayerServices ps) {
		this.playerServices = ps;
	}

	@Override
	public String getBaseURL(){
		return baseURL;
	}

	/**
	 * @return Pobranie linku względnego do strony.
	 */
	@Override
	public String getHref() {
		return href;
	}

	@Override
	public String getURL() {
		return URLUtils.resolveURL(baseURL, href);
	}

	public LayoutType getLayout() {
		return layout;
	}

	public ScoringType getScoringType() {
		return scoringType;
	}

	public PageScoreWeight getPageScoreWeight() {
		return pageScoreWeightMode;
	}

	@Override
	public String getName() {
		return name;
	}

	public boolean isLoaded() {
		return this.loaded;
	}

	public void release() {
		for (IModuleModel module : modules) {
			module.release();
		}
		this.loaded = false;
	}

	@Override
	public String toString() {
		return "ID: " + name + ", href: " + href + " modules#: " + modules.size();
	}

	public void setName(String name) {
		this.name = name;
		sendPropertyChangedEvent(propertyName);
	}


	public void setBaseURL(String fetchUrl) {
		this.baseURL = fetchUrl.substring(0, fetchUrl.lastIndexOf("/") + 1);
	}

	@Override
	public void setContentBaseURL(String baseURL) {
		this.contentBaseURL = baseURL;
	}

	@Override
	public String getContentBaseURL() {
		return this.contentBaseURL;
	}

	public void setSemiResponsiveLayoutID(String newLayoutID) {
		this.semiResponsiveLayoutID = newLayoutID;
	}

	public void setLayout(LayoutType newLayout) {
		layout = newLayout;
	}

	@Override
	public String toXML() {
		String xml = "<?xml version='1.0' encoding='UTF-8' ?>";

		xml += "<page layout='" + layout.toString() + "'";
		xml += " name='" + StringUtils.escapeXML(name) + "'";
		xml += " isReportable='" + reportable + "'";
		xml += " notAssignable='" + notAssignable + "'";
		xml += " scoring='" + scoringType + "'";
		xml += " version='" + Page.version + "'";
		xml += " randomizeInPrint='" + randomizeInPrint + "'";
		xml += " isSplitInPrintBlocked='" + isSplitInPrintBlocked + "'";

		xml += " header='" + StringUtils.escapeXML(this.headerId) + "'";
		xml += " hasHeader='" + this.hasHeader + "'";
		xml += " footer='" + StringUtils.escapeXML(this.footerId) + "'";
		xml += " hasFooter='" + this.hasFooter + "'";
		xml += ">";
		
		if (this.semiResponsiveStyles.haveStyles()) {
			Element stylesXML = this.semiResponsiveStyles.toXML();
			xml += stylesXML.toString();
		}
		Element layouts = XMLUtils.createElement("layouts");
		for (String key : this.pageSizes.keySet()) {
			Element layout = XMLUtils.createElement("layout");
			layout.setAttribute("id", key);

			Size size = this.pageSizes.get(key);
			XMLUtils.setIntegerAttribute(layout, "width", size.getWidth());
			XMLUtils.setIntegerAttribute(layout, "height", size.getHeight());
			if (size.isDefault()) {
				XMLUtils.setBooleanAttribute(layout, "isDefault", true);
			}
			layouts.appendChild(layout);
		}

		xml += layouts.toString();

		// modules
		xml += "<modules>";
		for (IModuleModel module : modules) {
			String moduleXML = module.toXML();
			xml += moduleXML;
		}
		xml += "</modules>";

		// groups
		xml += "<groups>";
		if (groupedModules != null) {
			for (Group group : groupedModules) {
				xml += group.toXML();
			}
		}
		xml += "</groups>";

		// editorRulers
		xml += "<editorRulers>";
		if (rulers != null) {
			List<Ruler> verticalRulers = rulers.get("verticals");
			List<Ruler> horizontalRulers = rulers.get("horizontals");

			if (verticalRulers != null) {
				for (Ruler ruler : verticalRulers) {
					xml += ruler.toXML();
				}
			}

			if (horizontalRulers != null) {
				for (Ruler ruler : horizontalRulers) {
					xml += ruler.toXML();
				}
			}
		}
		xml += "</editorRulers>";

		// page weight
		xml += "<page-weight value='[value]' mode='[mode]'></page-weight>"
				.replace("[value]", pageWeight + "")
				.replace("[mode]", getPageScoreWeight().toString());

		return StringUtils.removeIllegalCharacters(xml + "</page>");
	}

	public void reload(Element rootElement) {
		PageFactory factory = new PageFactory(this);
		factory.produce(rootElement.toString(), this.baseURL);
	}

	@Override
	public void setPageWeight(int w) {
		this.pageWeight = w;
	}

	@Override
	public int getPageWeight() {
		return this.pageWeight;
	}

	@Override
	public void setPageCustomWeight(int w) {
		this.pageCustomWeight = w;
	}

	@Override
	public int getPageCustomWeight() {
		return this.pageCustomWeight;
	}

	@Override
	public void setModulesMaxScore(int s) {
		this.modulesMaxScore = s;
	}

	@Override
	public int getModulesMaxScore() {
		return this.modulesMaxScore;
	}

	private void addPropertyName() {

		propertyName = new IProperty() {

			@Override
			public void setValue(String newValue) {
				name = newValue;
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return name;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("name");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("name");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(propertyName);
	}

	private void addPropertyWidth() {

		IProperty property = new IProperty() {

			@Override
			public void setValue(String newValue) {
				try {
					int width = Integer.parseInt(newValue);
					setWidth(width);
				} catch (NumberFormatException e) {
					setWidth(0);
				}
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				int width = getWidth();
				return width > 0 ? Integer.toString(width) : "";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("width");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("width");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	private void addPropertyHeight() {

		IProperty property = new IProperty() {

			@Override
			public void setValue(String newValue) {
				try {
					int height = Integer.parseInt(newValue);
					setHeight(height);
				} catch (NumberFormatException e) {
					setHeight(0);
				}
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				int height = getHeight();
				if (height > 0) {
					return Integer.toString(height);
				} else {
					return "";
				}
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("height");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("height");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	private void addPropertyReportable() {

		IBooleanProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != reportable) {
					reportable = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return reportable ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("is_reportable");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("is_reportable");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}
	
	private void addPropertyRandomizeInPrint() {

		IBooleanProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != randomizeInPrint) {
					randomizeInPrint = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return randomizeInPrint ? "True" : "False";
			}

			@Override
			public String getName() {
				return "Randomize in print";
			}

			@Override
			public String getDisplayName() {
				return "Randomize in print";
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	private void addPropertyIsSplitInPrintBlocked() {

		IBooleanProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != isSplitInPrintBlocked) {
					isSplitInPrintBlocked = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isSplitInPrintBlocked ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("printable_block_split_label");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("printable_block_split_label");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}


	private void addPropertyNotAssignable() {

		IBooleanProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != notAssignable) {
					notAssignable = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return notAssignable ? "True" : "False";
			}

			@Override
			public String getName() {
			    return DictionaryWrapper.get("not_assignable");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("not_assignable");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	private void addPropertyPreview() {

		propertyName = new IImageProperty() {

			@Override
			public void setValue(String newValue) {
				previewURL = newValue;
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return previewURL;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("Preview");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Preview");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(propertyName);
	}

	private void addPropertyPreviewLarge() {

		propertyName = new IImageProperty() {

			@Override
			public void setValue(String newValue) {
				previewLargeURL = newValue;
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return previewLargeURL;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("PreviewLarge");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("PreviewLarge");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(propertyName);
	}

	@Override
	public void addStyleListener(IStyleListener listener) {
		styleListener = listener;
	}

	private void addGroupIdValidatorToModules() {
		this.modules.addGroupIdValidator(new INameValidator() {
			public boolean canChangeName(String newName) {
				return (getGroupById(newName) == null);
			}
		});
	}
	
	public SemiResponsiveStyles getSemiResponsiveStyles() {
		return this.semiResponsiveStyles;
	}

	@Override
	public String getInlineStyle() {
		return this.semiResponsiveStyles.getInlineStyle(this.semiResponsiveLayoutID, this.defaultLayoutID);
	}

	@Override
	public String getStyleClass() {
		return this.semiResponsiveStyles.getStyleClass(this.semiResponsiveLayoutID, this.defaultLayoutID);
	}

	@Override
	public void setInlineStyle(String inlineStyle) {

		if (inlineStyle != null) {
			this.semiResponsiveStyles.setInlineStyle(this.semiResponsiveLayoutID, inlineStyle);
			if (styleListener != null) {
				styleListener.onStyleChanged();
			}
		}
	}

	@Override
	public void setStyleClass(String styleClass) {
		if (styleClass != null) {
			this.semiResponsiveStyles.setStyleClass(this.semiResponsiveLayoutID, styleClass);
			if (styleListener != null) {
				styleListener.onStyleChanged();
			}
		}
	}
	

	@Override
	public void syncSemiResponsiveStyles(Set<PageLayout> actualSemiResponsiveLayouts) {
		this.semiResponsiveStyles.syncStyles(actualSemiResponsiveLayouts, this.defaultLayoutID);
	}

	@Override
	public void setInlineStyles(HashMap<String, String> inlineStyles) {
		this.semiResponsiveStyles.setInlineStyles(inlineStyles);
	}

	@Override
	public void setStylesClasses(HashMap<String, String> stylesClasses) {
		this.semiResponsiveStyles.setStylesClasses(stylesClasses);
	}

	@Override
	public String getClassNamePrefix() {
		return "page";
	}

	public ModuleList getModules() {
		return modules;
	}

	@Override
	public List<String> getModulesList() {
		List<String> ids = new ArrayList<String>();
		for (IModuleModel module : modules) {
			ids.add(module.getId());
		}

		return ids;
	}

	public int getWidth() {
		Size size = this.pageSizes.get(this.semiResponsiveLayoutID);
		return size.getWidth();
	}

	public int getHeight() {
		Size size = this.pageSizes.get(this.semiResponsiveLayoutID);
		return size.getHeight();
	}

	@Override
	public void setWidth(int width) {
		Size size = this.pageSizes.get(this.semiResponsiveLayoutID);
		size.setWidth(width);
		this.setCurrentSize(size);
	}

	@Override
	public void setHeight(int height) {
		Size size = this.pageSizes.get(this.semiResponsiveLayoutID);
		size.setHeight(height);
		this.setCurrentSize(size);
	}

	private void setCurrentSize(Size size) {		
		this.pageSizes.put(this.semiResponsiveLayoutID, size);
	}

	private Size getCurrentPageSize() {
		return this.pageSizes.get(this.semiResponsiveLayoutID);
	}


	public void setReportable(boolean reportable) {
		this.reportable = reportable;
	}

	@Override
	public boolean isReportable() {
		return reportable;
	}

	public String createUniquemoduleId(String baseName) {
		String name;

		for(int i = 1; i < 100; i++) {
			name = baseName + i;
            if (isIDUnique(name)) {
				return name;
			}
		}

		return baseName + "_new";
	}

	private boolean isIDUnique(String id) {
		return (
			modules.getModuleById(id) == null 
			&& getGroupById(id) == null
		);
	}

	public void outstreachHeight(int position, int amount) {

		int visibleHeight = getHeight() - amount;
		for(IModuleModel module : getModules()) {
			if(module.getTop() > position && module.getTop() < visibleHeight) {
				module.disableChangeEvent(true);
				module.setTop(module.getTop() + amount);
				module.disableChangeEvent(false);
			}
		}
	}

	@Override
	public String getPreview() {
		return URLUtils.resolveURL(baseURL, previewURL);
	}

	public void setPreview(String preview) {
		this.previewURL = preview;
	}

	@Override
	public String getPreviewLarge() {
		return URLUtils.resolveURL(baseURL, previewLargeURL);
	}

	public void setPreviewLarge(String preview) {
		this.previewLargeURL = preview;
	}

	@Override
	public String getId() {
		return id;
	}

	@Override
	public void setAsReportable() {
		this.playerServices.getReportableService().addValue(this.getId(), true);
		this.reportable = true;
	}

	@Override
	public void setAsNonReportable() {
		this.playerServices.getReportableService().addValue(this.getId(), false);
		this.reportable = false;
	}

	public void setId(String pageId) {
		this.id = pageId;
	}

	private void addPropertyScoreType() {

		IProperty property = new IEnumSetProperty() {

			@Override
			public void setValue(String newValue) {
				setScoreFromString(newValue);
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return scoringType.toString();
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("score_type");
			}

			@Override
			public int getAllowedValueCount() {
				return ScoringType.values().length;
			}

			@Override
			public String getAllowedValue(int index) {
				return ScoringType.values()[index].toString();
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("score_type");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	public void setPageMaxScore(int maxScore) {
		pageWeight = maxScore;
	}

	private void addPropertyWeightScoreMode() {
		IProperty property = new IEnumSetProperty() {

			@Override
			public void setValue(String newValue) {
				setWeightFromString(newValue);
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return pageScoreWeightMode.toString();
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("weight_mode");
			}

			@Override
			public int getAllowedValueCount() {
				return PageScoreWeight.values().length;
			}

			@Override
			public String getAllowedValue(int index) {
				return PageScoreWeight.values()[index].toString();
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("weight_mode");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	protected boolean isNewValueMaxScoreValid(String newValue, IProperty property) {
		try {
			pageWeight = Integer.parseInt(newValue);
			sendPropertyChangedEvent(property);
			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}

	private void addPropertyWeightScoreValue() {
		IProperty property = new IProperty() {

			@Override
			public void setValue(String newValue) {
				isNewValueMaxScoreValid(newValue, this);
			}

			@Override
			public String getValue() {
				return pageWeight > 0 ? Integer.toString(pageWeight) : "";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("weight_value");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("weight_value");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	private void setScoreFromString(String scoreName) {
		if (scoreName == null || scoreName.trim().compareTo("") == 0) {
			return;
		}
		
		this.scoringType = ScoringType.valueOf(scoreName);
	}

	private PageScoreWeight setWeightFromString(String weight) {
		if (weight != null) {
			for (PageScoreWeight pw : PageScoreWeight.values()) {
				if (pw.toString().equals(weight)) {
					pageScoreWeightMode = pw;
					return pw;
				}
			}
		}
		return PageScoreWeight.defaultWeight;
	}

	@Override
	public JavaScriptObject toJavaScript() {
		return javaScriptInterface(this);
	}

	private JsArrayString getModulesListAsJS() {
		List<String> ids = new ArrayList<String>();
	    JsArrayString jsArray = (JsArrayString) JsArrayString.createArray();

		for(IModuleModel module : modules) {
			ids.add(module.getId());
		}
		
	    for (String string : ids) {
	        jsArray.push(string);
	    }
	    
	    return jsArray;
	}

	public boolean isVisited() {
		return isVisited(false);
	}
	
	/*
	 * If checkNonReportable is set to false, isVisted always returns false for non-reportable page
	 * If checkNonReportable is set to true, non-reportable pages will be treated the same way as any other. 
	 * */
	public boolean isVisited(boolean checkNonReportable) {
		if (checkNonReportable) {
			return playerServices.isPageVisited(this);
		}
		String pageId;
		int index = 0;
		int pageCount = playerServices.getModel().getPageCount();

		for (int i = 0; i < pageCount; i++) {
			if (playerServices.getModel().getPage(i).getId() == id) {
				index = i;
				break;
			}
		}

		if (playerServices.getCurrentPageIndex() == index) {
			return playerServices.isPageVisited(this);
		}

		pageId = playerServices.getModel().getPage(index).getId();
		return playerServices.getScoreService().getPageScoreById(pageId).hasScore();
	}

	public void setGroupedModules(List<Group> groupedModules) {
		this.groupedModules = groupedModules;
	}

	public List<Group> getGroupedModules() {
		return groupedModules;
	}

	public int getPageIndex() {
		return playerServices.getCurrentPageIndex();
	}

	public void setRulers(List<Ruler> verticals, List<Ruler> horizontals) {
		if (!rulers.isEmpty()) {
			List<Ruler> currentVerticalRulers = this.getVerticalRulersFromOtherLayouts();
			List<Ruler> currentHorizontalRulers = this.getHorizontalRulersFromOtherLayouts();

			currentHorizontalRulers.addAll(horizontals);
			currentVerticalRulers.addAll(verticals);
			
			rulers.put("verticals", currentVerticalRulers);
			rulers.put("horizontals", currentHorizontalRulers);
		} else {
			rulers.put("verticals", verticals);
			rulers.put("horizontals", horizontals);
		}
	}

	private List<Ruler> getHorizontalRulersFromOtherLayouts() {
		String layoutID = this.getSemiResponsiveLayoutID();
		List<Ruler> horizontalRulers = new ArrayList<Ruler>();

		for(Ruler ruler : rulers.get("horizontals")) {
			if (ruler.getLayoutID() != layoutID) {
				horizontalRulers.add(ruler);
			}
		}

		return horizontalRulers;
	}

	private List<Ruler> getVerticalRulersFromOtherLayouts() {
		String layoutID = this.getSemiResponsiveLayoutID();
		List<Ruler> verticalRulers = new ArrayList<Ruler>();

		for(Ruler ruler : rulers.get("verticals")) {
			if (ruler.getLayoutID() != layoutID) {
				verticalRulers.add(ruler);
			}
		}

		return verticalRulers;
	}

	public HashMap<String, List<Ruler>> getRulers() {
		return rulers;
	}

	public void removeModule(IModuleModel module) {
		for (Group g : groupedModules) {
			if (g.contains(module)) {
				g.remove(module);
			}
		}

		modules.remove(module);
	}

	@Override
	public void setStyleCss(String style) {
		String css = URLUtils.resolveCSSURL(baseURL, style, contentBaseURL);
		setInlineStyle(css);
	}

	@Override
	public void setScoring(String scoring) {
		this.setScoreFromString(scoring);
	}

	@Override
	public void addModule(IModuleModel module) {
		this.modules.add(module);
	}

	@Override
	public void addGroupModules(Group group) {
		boolean groupAlreadyInList = false;
		for(Group g : groupedModules) {
			if(g.getId().equals(group.getId())) {
				groupAlreadyInList = true;
				break;
			}
		}
		if(groupAlreadyInList ==false) {
			groupedModules.add(group);
		}
	}

	@Override
	public void setWeight(Integer weight) {
		this.pageWeight = weight;
	}

	@Override
	public void setWeightMode(PageScoreWeight pageScoreWeightMode) {
		this.pageScoreWeightMode = pageScoreWeightMode;
	}

	@Override
	public void markAsLoaded() {
		this.loaded = true;
	}

	@Override
	public void clearGroupModules() {
		this.groupedModules.clear();
	}

	@Override
	public void clearModules() {
		this.modules.clear();
	}

	@Override
	public void clearRulers() {
		this.rulers.clear();
	}

	@Override
	public void addSize(String layoutID, Size size) {
		this.pageSizes.put(layoutID, size);
	}
	
	@Override 
	public void setDefaultLayoutID(String defaultLayoutID) {
		this.defaultLayoutID = defaultLayoutID;
	}

	public String getSemiResponsiveLayoutID() {
		return this.semiResponsiveLayoutID;
	}

	@Override
	@Deprecated
	public void load(Element rootElement, String url) {}

	public void syncPageSizes(Set<PageLayout> actualSemiResponsiveLayouts) {
		String defaultLayoutID = this.findDefaultInActualLayouts(actualSemiResponsiveLayouts);
		Set<String> actualIDs = getActualIDs(actualSemiResponsiveLayouts);
		Size defaultSizeBeforeSync = this.getDefaultSize();

		this.ensureDefaultLayout(defaultLayoutID, defaultSizeBeforeSync);
		this.removeUnsyncLayouts(actualIDs);
		this.ensureNonSyncedLayouts(defaultLayoutID, actualIDs);
		this.setDefaultLayoutID(defaultLayoutID);
	}

	private void ensureNonSyncedLayouts(String defaultLayoutID,
			Set<String> actualIDs) {
		for (String layoutID : actualIDs) {
			if(!this.pageSizes.containsKey(layoutID)) {
				this.pageSizes.put(layoutID, Size.copy(layoutID, this.pageSizes.get(defaultLayoutID)));
			}
		}
	}

	private String findDefaultInActualLayouts(Set<PageLayout> actualSemiResponsiveLayouts) {
		String defaultLayoutID = null;
		for (PageLayout pageLayout : actualSemiResponsiveLayouts) {
			if (pageLayout.isDefault()) {
				defaultLayoutID = pageLayout.getID();
				break;
			}
		}
		return defaultLayoutID;
	}

	private void removeUnsyncLayouts(Set<String> actualIDs) {
		Set<String> keySet = new HashSet<String>(this.pageSizes.keySet());
		
		for (String key : keySet) {
			if (!actualIDs.contains(key)) {
				this.pageSizes.remove(key);
			}
		}
	}

	private void ensureDefaultLayout(String defaultLayoutID, Size defaultSizeBeforeSync) {
		if (!this.pageSizes.containsKey(defaultLayoutID)) {
			Size copyOfDefault = Size.copy(defaultLayoutID, defaultSizeBeforeSync);
			this.pageSizes.put(defaultLayoutID, copyOfDefault);
		}
	}

	private Set<String> getActualIDs(Set<PageLayout> actualSemiResponsiveLayouts) {
		Set<String> actualIDs = new HashSet<String>();
		for (PageLayout pageLayout : actualSemiResponsiveLayouts) {
			actualIDs.add(pageLayout.getID());
		}
		return actualIDs;
	}

	private Size getDefaultSize() {
		Size defaultSizeBeforeSync = null;
		for (Size size : this.pageSizes.values()) {
			if (size.isDefault()) {
				defaultSizeBeforeSync = size;
				break;
			}
		}
		return defaultSizeBeforeSync;
	}

	public void copyConfiguration(String lastSeenLayout) {
		if (this.pageSizes.containsKey(lastSeenLayout)) {
			Size lastSeenSize = this.pageSizes.get(lastSeenLayout);
			this.pageSizes.put(this.semiResponsiveLayoutID, new Size(this.semiResponsiveLayoutID, lastSeenSize.getWidth(), lastSeenSize.getHeight()));
		}
	}
	
	@Override
	public void setFooterId(String name) {
		this.footerId = name;
		this.hasFooter = true;
	}
	
	@Override
	public void setHeaderId(String name) {
		this.headerId = name;
		this.hasHeader = true;
	}
	
	public String getFooterId() {
		return this.footerId;
	}
	
	public String getHeaderId() {
		return this.headerId;
	}
	
	public boolean hasHeader() {
		return this.hasHeader;
	}
	
	public boolean hasFooter() {
		return this.hasFooter;
	}
	
	@Override
	public void setHasHeader(boolean value) {
		this.hasHeader = value;
	}
	
	@Override
	public void setHasFooter(boolean value) {
		this.hasFooter = value;
	}
	
	public HashMap<String, Size> getSizes() {
		return this.pageSizes;
	}

	public void translateSemiResponsiveIDs(HashMap<String, String> translationMap) {
		for(String key : translationMap.keySet()) {
			if (this.pageSizes.containsKey(key)) {
				String translatedID = translationMap.get(key);
				Size pageSize = this.pageSizes.get(key);
				Size copiedSize = Size.copy(translatedID, pageSize);
				this.pageSizes.put(translatedID, copiedSize);
				this.pageSizes.remove(key);
			}
		}
	}

	public Group getGroupById(String id) {
		for(Group g : groupedModules) {
			if(g.getId().equals(id)) {
				return g;
			}
		}
		return null;
	}
	
	public void setRandomizeInPrint(boolean value) {
		this.randomizeInPrint = value;
	}
	
	public boolean getRandomizeInPrint() {
		return this.randomizeInPrint;
	}

	public boolean isSplitInPrintBlocked() {
		return this.isSplitInPrintBlocked;
	}

	public void setSplitInPrintBlocked(boolean value) {
		this.isSplitInPrintBlocked = value;
	}

	public void setNotAssignable(boolean value) {
		this.notAssignable = value;
	}

	public boolean isNotAssignable() {
		return this.notAssignable;
	}
}
