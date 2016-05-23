package com.lorepo.icplayer.client.xml.page.parsers;

import java.util.ArrayList;
import java.util.List;

import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.Group;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.model.Page.LayoutType;
import com.lorepo.icplayer.client.model.Page.PageScoreWeight;
import com.lorepo.icplayer.client.module.ModuleFactory;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.checkbutton.CheckButtonModule;
import com.lorepo.icplayer.client.ui.Ruler;
import com.lorepo.icplayer.client.utils.ModuleFactoryUtils;
import com.lorepo.icplayer.client.xml.page.IPageBuilder;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;

public abstract class PageParserBase implements IPageParser{

	protected String version;
	protected IPageBuilder page;
	
	public PageParserBase() {
		// TODO Auto-generated constructor stub
	}
	
	public void setPage(Page page) {
		this.page = page;
	}

	@Override
	public String getVersion() {
		return this.version;
	}
	

	public Object parse(Element xml) {
		this.page.clearModules();
		this.loadPageAttributes(this.page, xml);
		
		NodeList children = xml.getChildNodes();
		for(int i = 0; i < children.getLength(); i++) {
			if (children.item(i) instanceof Element) {
				Element child = (Element) children.item(i);
				String name = child.getNodeName();
				
				if(name.compareTo("modules") == 0) {
					this.page = loadModules(this.page, child);
				} else if(name.compareTo("group") == 0) {
					this.page = loadGroupModules(this.page, child);
				} else if (name.compareTo("page-weight") == 0) {
					this.page = loadWeight(this.page, child);
				}
				
				this.page = this.loadRulers(this.page, xml);
			}
		}
		
		this.page.markAsLoaded();
		return this.page;
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
		for (int i = 0; i < verticalRulers.getLength(); i++) {
			Element rulerNode = (Element) verticalRulers.item(i);
			Ruler ruler = new Ruler();

			ruler.setType("vertical");
			ruler.setPosition((int) Double.parseDouble(rulerNode.getFirstChild().getNodeValue()));

			verticals.add(ruler);
		}

		for (int i = 0; i < horizontalRulers.getLength(); i++) {
			Element rulerNode = (Element) horizontalRulers.item(i);
			Ruler ruler = new Ruler();

			ruler.setType("horizontal");
			ruler.setPosition((int) Double.parseDouble(rulerNode.getFirstChild().getNodeValue()));

			horizontals.add(ruler);
		}

		page.setRulers(verticals, horizontals);
		return page;
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

	protected IPageBuilder loadModules(IPageBuilder page2, Element xml) {
		ModuleFactory moduleFactory = new ModuleFactory(null);
		NodeList moduleNodeList = xml.getChildNodes();

		for (int i = 0; i < moduleNodeList.getLength(); i++) {
			Node node = moduleNodeList.item(i);

			if (node instanceof Element) {
				IModuleModel module = moduleFactory.createModel(node.getNodeName());

				if (module != null) {
					module.load((Element) node, page.getBaseURL());

					if (ModuleFactoryUtils.isCheckAnswersButton(module)) {
						module = new CheckButtonModule();
						module.load((Element) node, page.getBaseURL());
					}

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
		page.setWidth(XMLUtils.getAttributeAsInt(xml, "width"));
		page.setHeight(XMLUtils.getAttributeAsInt(xml, "height"));
		
		page.setStyleCss(StringUtils.unescapeXML(xml.getAttribute("style")));
		page.setStyleClass(xml.getAttribute("class"));

		String positioning = xml.getAttribute("layout");
		if (positioning == null || positioning.isEmpty()) {
			page.setLayout(LayoutType.percentage);
		} else if (positioning.equals(LayoutType.responsive.toString())) {
			page.setLayout(LayoutType.responsive);
		} else {
			page.setLayout(LayoutType.pixels);
		}

		page.setScoring(XMLUtils.getAttributeAsString(xml, "scoring"));
		
		return page;
	}
}
