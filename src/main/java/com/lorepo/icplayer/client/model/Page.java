package com.lorepo.icplayer.client.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArrayString;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
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
import com.lorepo.icplayer.client.model.layout.Size;
import com.lorepo.icplayer.client.module.ModuleFactory;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.checkbutton.CheckButtonModule;
import com.lorepo.icplayer.client.ui.Ruler;
import com.lorepo.icplayer.client.utils.ModuleFactoryUtils;
import com.lorepo.icplayer.client.xml.page.IPageBuilder;

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

	private String id;
	private String name;
	private final String href;
	private LayoutType layout = LayoutType.pixels;
	private ScoringType scoringType = ScoringType.percentage;
	private String cssClass = "";
	private String inlineStyles = "";
	private final ModuleList modules = new ModuleList();
	/** base url to this document with ending '/' */
	private String baseURL = "";
	private IStyleListener styleListener;
	private boolean loaded = false;
	
	private HashMap<String, Size> pageSizes = new HashMap<String, Size>();
	
	private int width;
	private int height;
	private boolean reportable = true;
	private String previewURL = "";
	// Properties
	IProperty propertyName;
	private int index;
	private List<Group> groupedModules = new ArrayList<Group>();
	@SuppressWarnings("serial")
	private final HashMap<String, List<Ruler>> rulers = new HashMap<String, List<Ruler>>() {
		{
			put("verticals", new ArrayList<Ruler>());
			put("horizontals", new ArrayList<Ruler>());
		}
	};
	private PageScoreWeight pageScoreWeightMode = PageScoreWeight.defaultWeight;
	private int modulesMaxScore = 0;
	private int pageWeight = 1;
	private int pageCustomWeight = 1;

	public Page(String name, String url) {
		super("Page");
		this.id = UUID.uuid(6);
		this.name = name;
		this.href = url;
		addPropertyName();
		addPropertyWidth();
		addPropertyHeight();
		addPropertyReportable();
		addPropertyPreview();
		addPropertyScoreType();
		addPropertyWeightScoreMode();
		addPropertyWeightScoreValue();
	}

	@Override
	public void setPlayerServices(IPlayerServices ps) {
		this.playerServices = ps;
	}

	@Override
	public String getBaseURL() {
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
		return "ID: " + name + ", href: " + href + " modules#: "
				+ modules.size();
	}

	public void setName(String name) {
		this.name = name;
		sendPropertyChangedEvent(propertyName);
	}

	/**
	 * Ustawienie sposobu layoutowania strony
	 * 
	 * @param pos
	 */
	public void setLayout(LayoutType newLayout) {
		layout = newLayout;
	}

	/**
	 * Serialize page to XML format
	 * 
	 * @param includeAll
	 *            - If true save name and isReportable property
	 */
	@Override
	public String toXML() {
		String xml = "<?xml version='1.0' encoding='UTF-8' ?>";

		xml += "<page layout='" + layout.toString() + "'";
		xml += " name='" + StringUtils.escapeXML(name) + "'";
		xml += " isReportable='" + reportable + "'";
		xml += " scoring='" + scoringType + "'";
		xml += " width='" + width + "'";
		xml += " height='" + height + "'";
		xml += " version='2'";

		if (!cssClass.isEmpty()) {
			String encodedClass = StringUtils.escapeXML(cssClass);
			xml += " class='" + encodedClass + "'";
		}
		if (!inlineStyles.isEmpty()) {
			String encodedStyle = StringUtils.escapeXML(inlineStyles);
			xml += " style='" + encodedStyle + "'";
		}
		xml += ">";

		// modules
		xml += "<modules>";
		for (IModuleModel module : modules) {
			xml += module.toXML();
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
				.replace("[value]", pageWeight + "").replace("[mode]",
						getPageScoreWeight().toString());

		return XMLUtils.removeIllegalCharacters(xml + "</page>");
	}

	public void reload(Element rootElement) {
		load(rootElement, baseURL);
		String rawName = XMLUtils.getAttributeAsString(rootElement, "name");
		name = StringUtils.unescapeXML(rawName);
		reportable = XMLUtils
				.getAttributeAsBoolean(rootElement, "isReportable");
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

	@Override
	public void load(Element rootElement, String url) {
		modules.clear();
		baseURL = url.substring(0, url.lastIndexOf("/") + 1);

		loadPageAttributes(rootElement);
		loadModules(rootElement);
		loadGroupedModules(rootElement);
		loadRulers(rootElement);
		loadWeight(rootElement);
		loaded = true;
	}

	private void loadPageAttributes(Element rootElement) {
		width = XMLUtils.getAttributeAsInt(rootElement, "width");
		height = XMLUtils.getAttributeAsInt(rootElement, "height");
		String style = StringUtils.unescapeXML(rootElement
				.getAttribute("style"));
		String css = URLUtils.resolveCSSURL(baseURL, style);
		setInlineStyle(css);
		setStyleClass(rootElement.getAttribute("class"));

		String positioning = rootElement.getAttribute("layout");
		if (positioning == null || positioning.isEmpty()) {
			setLayout(LayoutType.percentage);
		} else if (positioning.equals(LayoutType.responsive.toString())) {
			setLayout(LayoutType.responsive);
		} else {
			setLayout(LayoutType.pixels);
		}

		String scoring = XMLUtils.getAttributeAsString(rootElement, "scoring");
		setScoreFromString(scoring);
	}

	private void loadModules(Element rootElement) {

		ModuleFactory moduleFactory = new ModuleFactory(null);
		Element modulesNode = (Element) rootElement.getElementsByTagName(
				"modules").item(0);
		NodeList moduleNodeList = modulesNode.getChildNodes();

		for (int i = 0; i < moduleNodeList.getLength(); i++) {
			Node node = moduleNodeList.item(i);

			if (node instanceof Element) {
				IModuleModel module = moduleFactory.createModel(node
						.getNodeName());

				if (module != null) {
					module.load((Element) node, getBaseURL());

					if (ModuleFactoryUtils.isCheckAnswersButton(module)) {
						module = new CheckButtonModule();
						module.load((Element) node, getBaseURL());
					}
					;

					this.modules.add(module);
				}
			}
		}
	}

	private void loadGroupedModules(Element rootElement) {
		NodeList groupNodes = rootElement.getElementsByTagName("group");

		if (groupNodes.getLength() == 0) {
			return;
		}

		this.groupedModules.clear();

		for (int i = 0; i < groupNodes.getLength(); i++) { // for each group
															// node
			Element groupNode = (Element) groupNodes.item(i); // get it one
			Group group = new Group(this);
			this.groupedModules.add(group.loadGroupFromXML(groupNode));
		}
	}

	private void loadRulers(Element rootElement) {
		NodeList verticalRulers = rootElement.getElementsByTagName("vertical");
		NodeList horizontalRulers = rootElement
				.getElementsByTagName("horizontal");
		List<Ruler> verticals = new ArrayList<Ruler>();
		List<Ruler> horizontals = new ArrayList<Ruler>();

		if (verticalRulers.getLength() == 0
				&& horizontalRulers.getLength() == 0) {
			return;
		}

		this.rulers.clear();

		for (int i = 0; i < verticalRulers.getLength(); i++) {
			Element rulerNode = (Element) verticalRulers.item(i);
			Ruler ruler = new Ruler();

			ruler.setType("vertical");
			ruler.setPosition((int) Double.parseDouble(rulerNode
					.getFirstChild().getNodeValue()));

			verticals.add(ruler);
		}

		for (int i = 0; i < horizontalRulers.getLength(); i++) {
			Element rulerNode = (Element) horizontalRulers.item(i);
			Ruler ruler = new Ruler();

			ruler.setType("horizontal");
			ruler.setPosition((int) Double.parseDouble(rulerNode
					.getFirstChild().getNodeValue()));

			horizontals.add(ruler);
		}

		setRulers(verticals, horizontals);
	}

	// TODO
	private void loadWeight(Element rootElement) {
		try {
			final Node weightElement = rootElement.getElementsByTagName(
					"page-weight").item(0);
			final String value = XMLUtils.getAttributeAsString(
					(Element) weightElement, "value");
			final String mode = XMLUtils.getAttributeAsString(
					(Element) weightElement, "mode");

			this.pageScoreWeightMode = setWeightFromString(mode);
			this.pageWeight = (value == "" ? 1 : Integer.parseInt(value));
		} catch (Exception e) {
			this.pageScoreWeightMode = PageScoreWeight.defaultWeight;
			this.pageWeight = 1;
		}
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
					width = Integer.parseInt(newValue);
				} catch (NumberFormatException e) {
					width = 0;
				}
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
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
					height = Integer.parseInt(newValue);
				} catch (NumberFormatException e) {
					height = 0;
				}
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return height > 0 ? Integer.toString(height) : "";
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

	@Override
	public void addStyleListener(IStyleListener listener) {
		styleListener = listener;
	}

	@Override
	public String getInlineStyle() {
		return inlineStyles;
	}

	@Override
	public String getStyleClass() {
		return cssClass;
	}

	@Override
	public void setInlineStyle(String inlineStyle) {

		if (inlineStyle != null) {
			this.inlineStyles = inlineStyle;
			if (styleListener != null) {
				styleListener.onStyleChanged();
			}
		}
	}

	@Override
	public void setStyleClass(String styleClass) {

		if (styleClass != null) {
			this.cssClass = styleClass;

			if (styleListener != null) {
				styleListener.onStyleChanged();
			}
		}
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
		return width;
	}

	public int getHeight() {
		return height;
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

		for (int i = 1; i < 100; i++) {

			name = baseName + i;
			if (modules.getModuleById(name) == null) {
				return name;
			}
		}

		return baseName + "_new";
	}

	public void outstreachHeight(int position, int amount) {

		int visibleHeight = getHeight() - amount;
		for (IModuleModel module : getModules()) {
			if (module.getTop() > position && module.getTop() < visibleHeight) {
				module.disableChangeEvent(true);
				module.setTop(module.getTop() + amount);
				module.disableChangeEvent(false);
			}
		}
	}

	@Override
	public String getPreview() {
		return previewURL;
	}

	public void setPreview(String preview) {
		this.previewURL = preview;
	}

	@Override
	public String getId() {
		return id;
	}

	public void setId(String pageId) {
		this.id = pageId;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public void setHeight(int height) {
		this.height = height;
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

	// TODO
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

	protected boolean isNewValueMaxScoreValid(String newValue,
			IProperty property) {
		try {
			pageWeight = Integer.parseInt(newValue);
			sendPropertyChangedEvent(property);
			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}

	// TODO
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
		if (scoreName != null) {
			for (ScoringType st : ScoringType.values()) {
				if (st.toString().equals(scoreName)) {
					this.scoringType = st;
				}
			}
		}
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

		for (IModuleModel module : modules) {
			ids.add(module.getId());
		}

		for (String string : ids) {
			jsArray.push(string);
		}

		return jsArray;
	}

	/**
	 * Get JavaScript interface to the page
	 * 
	 * @param x
	 * @return
	 */
	private native static JavaScriptObject javaScriptInterface(Page x) /*-{

		var page = function() {
		}
		page.type = "page";
		page.getId = function() {
			return x.@com.lorepo.icplayer.client.model.Page::getId()();
		}
		page.getName = function() {
			return x.@com.lorepo.icplayer.client.model.Page::getName()();
		}
		page.getBaseURL = function() {
			return x.@com.lorepo.icplayer.client.model.Page::getBaseURL()();
		}
		page.isReportable = function() {
			return x.@com.lorepo.icplayer.client.model.Page::isReportable()();
		}

		page.isVisited = function() {
			return x.@com.lorepo.icplayer.client.model.Page::isVisited()();
		}

		page.getModulesAsJS = function() {
			return x.@com.lorepo.icplayer.client.model.Page::getModulesListAsJS()();
		}

		page.getModules = function() {
			return x.@com.lorepo.icplayer.client.model.Page::getModulesList()();
		}

		page.getPageWeight = function() {
			return x.@com.lorepo.icplayer.client.model.Page::getPageWeight()();
		}

		return page;
	}-*/;

	public boolean isVisited() {

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
			return true;
		}

		pageId = playerServices.getModel().getPage(index).getId();
		return playerServices.getScoreService().getPageScoreById(pageId)
				.hasScore();
	}

	public void setGroupedModules(List<Group> groupedModules) {
		this.groupedModules = groupedModules;
	}

	public List<Group> getGroupedModules() {
		return groupedModules;
	}

	public void setRulers(List<Ruler> verticals, List<Ruler> horizontals) {
		rulers.put("verticals", verticals);
		rulers.put("horizontals", horizontals);
	}
	
	public List<Ruler> getRulersByType(String type) {
		return rulers.get(type);
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
	public void setWidth(Integer width) {
		this.width = width;
	}

	@Override
	public void setHeight(Integer height) {
		this.height = height;
	}

	@Override
	public void setStyleCss(String style) {
		String css = URLUtils.resolveCSSURL(baseURL, style);
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
		this.groupedModules.add(group);
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
	public void addSize(String sizeName, Size size) {
		this.pageSizes.put(sizeName, size);
	}
}
