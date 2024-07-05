package com.lorepo.icplayer.client.xml.page.parsers;

import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;

import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.layout.Size;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.Page.LayoutType;
import com.lorepo.icplayer.client.model.page.Page.PageScoreWeight;
import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.module.ModuleFactory;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.ui.Ruler;
import com.lorepo.icplayer.client.xml.page.IPageBuilder;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;

public abstract class PageParserBase implements IPageParser{

	protected String version;
	protected IPageBuilder page;
	protected String contentDefaultLayoutID = null;
	protected String defaultLayoutID = null;
	
	public PageParserBase() {}
	
	public void setPage(Page page) {
		this.page = page;
	}

	@Override
	public String getVersion() {
		return this.version;
	}
	
	@Override
	public void setDefaultLayoutID(String layoutID) {
		contentDefaultLayoutID = layoutID;
	}
	
	public Object parse(Element xml) {
		this.page.clearModules();
		this.page = this.loadPageAttributes(this.page, xml);
		this.page = this.loadPageStyle(this.page, xml);
		this.page = this.loadPageLayout(page, xml);
		this.page = this.loadHeaderAndFooter(this.page, xml);

		int pageVersion = XMLUtils.getAttributeAsInt(xml, "version", 2);
		NodeList children = xml.getChildNodes();
		for(int i = 0; i < children.getLength(); i++) {
			if (children.item(i) instanceof Element) {
				Element child = (Element) children.item(i);
				String name = child.getNodeName();
				if(name.compareTo("modules") == 0) {
					this.page = this.loadModules(this.page, child, pageVersion);
				} else if(name.compareTo("groups") == 0) {
					this.page = this.loadGroupModules(this.page, child);
				} else if (name.compareTo("page-weight") == 0) {
					this.page = this.loadWeight(this.page, child);
				} else if (name.compareTo("layouts") == 0) {
					this.page = this.loadLayouts(this.page, child);
				} else if (name.compareTo("styles") == 0) {
					this.page = this.loadStyles(this.page, child);
				}
				
				this.page = this.loadRulers(this.page, xml);
			}
		}
		
		this.page.markAsLoaded();
		return this.page;
	}
	
	protected IPageBuilder loadStyles(IPageBuilder page, Element xml) {
		throw new UnsupportedOperationException("Not available at this version of page" + this.version);
	}

	protected IPageBuilder loadLayouts(IPageBuilder page, Element child) {
		return page;
	}

	private IPageBuilder loadRulers(IPageBuilder page, Element xml) {
		NodeList verticalRulers = xml.getElementsByTagName("vertical");
		NodeList horizontalRulers = xml.getElementsByTagName("horizontal");
		List<Ruler> verticals = new ArrayList<Ruler>();
		List<Ruler> horizontals = new ArrayList<Ruler>();

		if (verticalRulers.getLength() == 0
			&& horizontalRulers.getLength() == 0) {
			return page;
		}

		page.clearRulers();
		this.createRulers(verticalRulers, verticals, "vertical");
		this.createRulers(horizontalRulers, horizontals, "horizontal");

		page.setRulers(verticals, horizontals);
		return page;
	}

	private void createRulers(NodeList rulersNodes, List<Ruler> rulers, String type) {
		for (int i = 0; i < rulersNodes.getLength(); i++) {
			Element rulerNode = (Element) rulersNodes.item(i);
			Ruler ruler = new Ruler();

			List<String> rulerProperties = Arrays.asList(rulerNode.getFirstChild().getNodeValue().split(" ", -1));
			ruler.setType(type);
			ruler.setPosition((int) Double.parseDouble(rulerProperties.get(0)));

			if (rulerProperties.size() > 1) {
				ruler.setLayoutID(rulerProperties.get(1));
			}

			rulers.add(ruler);
		}
	}

	private IPageBuilder loadGroupModules(IPageBuilder page, Element xml) {
		NodeList groupNodes = xml.getElementsByTagName("group");

		if (groupNodes.getLength() == 0) {
			return page;
		}

		page.clearGroupModules();
		for (int i = 0; i < groupNodes.getLength(); i++) { // for each group
															// node
			Element groupNode = (Element) groupNodes.item(i); // get it one
			Group group = new Group((Page) page);
			page.addGroupModules(group.loadGroupFromXML(groupNode));
		}
		
		return page;
	}

	protected IPageBuilder loadModules(IPageBuilder page, Element xml, int pageVersion) {
		ModuleFactory moduleFactory = new ModuleFactory(null);
		NodeList moduleNodeList = xml.getChildNodes();

		for (int i = 0; i < moduleNodeList.getLength(); i++) {
			Node node = moduleNodeList.item(i);

			if (node instanceof Element) {
				IModuleModel module = moduleFactory.createModel(node.getNodeName());

				if (module != null) {
					if (defaultLayoutID != null) {
						module.setContentDefaultLayoutID(defaultLayoutID);
					}
					module.setContentBaseURL(page.getContentBaseURL());
					module.load((Element) node, page.getBaseURL(), Integer.toString(pageVersion));
					page.addModule(module);
				}
			}
		}
		
		return page;
	}
	
	protected PageScoreWeight getWeightFromString(String weight) {
		if (weight != null) {
			for (PageScoreWeight pw : PageScoreWeight.values()) {
				if (pw.toString().equals(weight)) {
					return pw;
				}
			}
		}
		return PageScoreWeight.defaultWeight;
	}
	
	protected IPageBuilder loadWeight(IPageBuilder page, Element rootElement) {
		try {
			String value = XMLUtils.getAttributeAsString(rootElement, "value");
			int weightValue = (value == "" ? 1 : Integer.parseInt(value));
			PageScoreWeight mode = getWeightFromString(XMLUtils.getAttributeAsString(rootElement, "mode"));
			
			page.setWeightMode(mode);
			page.setWeight(weightValue);
		} catch (Exception e) {
			page.setWeightMode(PageScoreWeight.defaultWeight);
			page.setWeight(1);
		}
		
		return page;
	}

	protected IPageBuilder loadPageAttributes(IPageBuilder page, Element xml) {
		int width = XMLUtils.getAttributeAsInt(xml, "width");
		int height = XMLUtils.getAttributeAsInt(xml, "height");
				
		Size size = new Size("default", width, height);
		size.setIsDefault(true);
		page.addSize("default", size);
		page.setDefaultLayoutID("default");
		
		page.setScoring(XMLUtils.getAttributeAsString(xml, "scoring"));
		page = loadRandomizeInPrint(page, xml);
		page = loadIsSplitInPrintBlocked(page, xml);
		page = loadNotAssignable(page, xml);
		return page;
	}
	
	protected IPageBuilder loadRandomizeInPrint(IPageBuilder page, Element xml) {
		return page;
	}

	protected IPageBuilder loadIsSplitInPrintBlocked(IPageBuilder page, Element xml) {
		return page;
	}

	protected IPageBuilder loadNotAssignable(IPageBuilder page, Element xml) {
		return page;
	}
	
	protected IPageBuilder loadPageLayout(IPageBuilder page, Element xml) {
		String positioning = xml.getAttribute("layout");
		if (positioning == null || positioning.isEmpty()) {
			page.setLayout(LayoutType.percentage);
		} else if (positioning.equals(LayoutType.responsive.toString())) {
			page.setLayout(LayoutType.responsive);
		} else {
			page.setLayout(LayoutType.pixels);
		}
		
		return page;
	}
	
	protected IPageBuilder loadPageStyle(IPageBuilder page, Element xml) {
		page.setStyleCss(StringUtils.unescapeXML(xml.getAttribute("style")));
		page.setStyleClass(xml.getAttribute("class"));
		
		return page;
	}
	
	protected IPageBuilder loadHeaderAndFooter(IPageBuilder page, Element xml) {
		boolean hasHeader = XMLUtils.getAttributeAsBoolean(xml, "hasHeader", true);
		page.setHasHeader(hasHeader);
		if (hasHeader) {
			page.setHeaderId(StringUtils.unescapeXML(xml.getAttribute("header")));
		}
		
		boolean hasFooter = XMLUtils.getAttributeAsBoolean(xml, "hasFooter", true);
		page.setHasFooter(hasFooter);
		if (hasFooter) {
			page.setFooterId(StringUtils.unescapeXML(xml.getAttribute("footer")));
		}
		
		return page;
	}
}
