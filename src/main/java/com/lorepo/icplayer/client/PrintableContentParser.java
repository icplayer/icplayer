package com.lorepo.icplayer.client;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.Random;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.ModuleList;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.module.IPrintableModuleModel;
import com.lorepo.icplayer.client.module.Printable.PrintableMode;
import com.lorepo.icplayer.client.module.api.IModuleModel;

public class PrintableContentParser {
	
	int dpi = 96;
	String headerHTML = "";
	String footerHTML = "";
	int headerHeight = 0;
	int footerHeight = 0;
	Boolean enableTwoColumnPrint = false;
	
	public void setDPI(int dpi) {
		this.dpi = dpi;
	}
	
	public void setTwoColumnPrintEnabled(boolean enabled) {
		enableTwoColumnPrint = enabled;
	}

	public void setHeader(Page header) {
		headerHTML = parsePage(header, false, false);
		int width = getA4WidthInPixels(10);
		headerHeight = getHTMLHeight(headerHTML, width);
	}
	
	public void setFooter(Page footer) {
		footerHTML = parsePage(footer, false, false);
		int width = getA4WidthInPixels(10);
		footerHeight = getHTMLHeight(footerHTML, width);
	}
	
	private void randomizePrintables(List<IPrintableModuleModel> printables) {
		int startIndex = 0;
		for (int i = 0; i < printables.size(); i++) {
			IPrintableModuleModel printable = printables.get(i);
			if (printable.isSection() && i > startIndex) {
				randomizePrintableSection(printables, startIndex, i-1);
				startIndex = i;
			}
		}
		randomizePrintableSection(printables, startIndex, printables.size()-1);
	}
	
	private void randomizePrintableSection(List<IPrintableModuleModel> printables, int startIndex, int endIndex) {
		if (startIndex >= endIndex) return;
		List<IPrintableModuleModel> randomizable = new ArrayList<IPrintableModuleModel>();
		for (int i = startIndex; i <= endIndex; i++) {
			IPrintableModuleModel printable = printables.get(i);
			if (printable.getPrintableMode() == PrintableMode.YES_RANDOM) {
				randomizable.add(printable);
			}
		}
		
		for(int index = 0; index < randomizable.size(); index += 1) {  
		    Collections.swap(randomizable, index, index + Random.nextInt(randomizable.size() - index));  
		}
		
		int randomizableIndex = 0;
		for (int i = startIndex; i <= endIndex; i++) {
			IPrintableModuleModel printable = printables.get(i);
			if (printable.getPrintableMode() == PrintableMode.YES_RANDOM) {
				printables.set(i, randomizable.get(randomizableIndex));
				randomizableIndex++;
			}
		}
	}
	
	private IPrintableModuleModel generatePrintableGroup(final Group group, boolean randomizeModules, boolean showAnswers) {
		List<IPrintableModuleModel> groupPrintables = new ArrayList<IPrintableModuleModel>();
		for (int i = 0; i < group.size(); i++) {
			IModuleModel model = group.get(i);
			if (model instanceof IPrintableModuleModel) {
				IPrintableModuleModel printable = (IPrintableModuleModel) model;
				if (printable.getPrintableMode() != PrintableMode.NO) {
					groupPrintables.add(printable);
				}
			}
		}
		if (randomizeModules) {
			randomizePrintables(groupPrintables);
		}
		
		String parsed = "";
		String groupClass = "";
		if (group.getStyleClass().length() > 0) {
			groupClass += "printable_" + group.getStyleClass();
		}
		parsed += "<div class=\"printable_modules_group " + groupClass + "\">";
		for (IPrintableModuleModel printable: groupPrintables) {
			parsed += printable.getPrintableHTML(showAnswers);
		}
		parsed += "</div>";

		final String finalParsed = parsed;
		
		return new IPrintableModuleModel(){

			@Override
			public String getPrintableHTML(boolean showAnswers) {
				return finalParsed;
			}

			@Override
			public PrintableMode getPrintableMode() {
				return group.getPrintable();
			}

			@Override
			public boolean isSection() {
				return false;
			}
			
		};
	}
	
	private String parsePage(Page page, boolean randomizeModules, boolean showAnswers ) {
		List<Group> parsedGroups = new ArrayList<Group>();
		List<IPrintableModuleModel> pagePrintables = new ArrayList<IPrintableModuleModel>();
		ModuleList modules = page.getModules();
		for (int i = 0; i < modules.size(); i++) {
			IModuleModel model = modules.get(i);
			if (model.hasGroup()) {
				Group modelGroup = null;
				for (Group group: page.getGroupedModules()) {
					if (group.contains(model)) {
						modelGroup = group;
					}
				}
				if (modelGroup != null && !parsedGroups.contains(modelGroup)) {
					parsedGroups.add(modelGroup);
					pagePrintables.add(generatePrintableGroup(modelGroup, randomizeModules, showAnswers));
				}
			}else if (model instanceof IPrintableModuleModel) {
				IPrintableModuleModel printable = (IPrintableModuleModel) model;
				if (printable.getPrintableMode() != PrintableMode.NO) {
					pagePrintables.add(printable);
				}
			}
		}
		if (randomizeModules) {
			randomizePrintables(pagePrintables);
		}
		String result = "";
		for (IPrintableModuleModel printable: pagePrintables) {
			result += printable.getPrintableHTML(showAnswers);
		}
		return result;
	}
	
	private String wrapPrintablePage(String content, int pageWidth, int pageHeight) {
		String pageDivCss = "width:" 
				+ Integer.toString(pageWidth) 
				+ "px; height:" 
				+ Integer.toString(pageHeight) 
				+ "px;";
		
		content = applyHeaderAndFooter(content, true);
		
		String result = "<div class=\"printable_page\" style=\"" + pageDivCss + "\">";
		result += content;
		result += "</div>";
		return result;
	}
	
	private String applyHeaderAndFooter(String content, boolean fullHeight) {
		String result = fullHeight ? "<table style='width:100%; height:100%'>" : "<table>";
		if (headerHeight > 0) {
			String headerStyle = "height: " + Integer.toString(headerHeight) + "px;";
			result += "<tr class='printable_header' style='" + headerStyle + "'><td>" + headerHTML + "</td></tr>";
		}
		if (enableTwoColumnPrint) {
			result += "<tr><td class='printable_content' style='vertical-align: top; columns: 2; column-gap: 40px;'>" + content + "</td></tr>";
		} else {
			result += "<tr><td class='printable_content' style='vertical-align: top;'>" + content + "</td></tr>";
		}
		if (footerHeight > 0) {
			String footerStyle = "height: " + Integer.toString(footerHeight) + "px;";
			result += "<tr class='printable_footer' style='" + footerStyle + "'><td>" + footerHTML + "</td></tr>";
		}
		result += "</table>";
		return result;
	}
	
	private native JavaScriptObject splitPageModules(PrintableContentParser x, String html, int pageWidth, int pageHeight) /*-{
		var pages = "";
		var $wrapper = $wnd.$("<div></div>");
		$wrapper.html(html);
		
		var printablePageHTML = "";
		$wrapper.children().each(function(){
			var moduleHTML = this.outerHTML;
			var newPrintablePageHTML = printablePageHTML + moduleHTML;
			var newPrintablePageWithHeaderAndFooter = x.@com.lorepo.icplayer.client.PrintableContentParser::applyHeaderAndFooter(Ljava/lang/String;Z)(newPrintablePageHTML, false);
			var newHeight = x.@com.lorepo.icplayer.client.PrintableContentParser::getHTMLHeight(Ljava/lang/String;I)(newPrintablePageWithHeaderAndFooter, pageWidth);
			if (newHeight > pageHeight) {
				pages += x.@com.lorepo.icplayer.client.PrintableContentParser::wrapPrintablePage(Ljava/lang/String;II)(printablePageHTML, pageWidth, pageHeight);
				printablePageHTML = moduleHTML;
			} else {
				printablePageHTML += moduleHTML;
			}
		});
		return {pages: pages, tail: printablePageHTML};
	}-*/;
	
	public String generatePrintableHTMLForPages(List<Page> pages, boolean randomizePages, boolean randomizeModules, boolean showAnswers) {
		String result = "<div>";
		
		if (randomizePages && pages.size() > 1) {
			Page firstPage = pages.get(0);
			pages.remove(0);
			for(int index = 0; index < pages.size(); index += 1) {  
			}
			pages.add(0, firstPage);
		}
		

		int pageMaxHeight = getA4HeightInPixels(10);
		int pageWidth = getA4WidthInPixels(10);
		String printablePageHTML = "";
		
		for (Page page: pages) {
			String pageHTML = parsePage(page, randomizeModules, showAnswers);
			String newPrintablePageHTML = printablePageHTML + pageHTML;
			if (getHTMLHeight(applyHeaderAndFooter(newPrintablePageHTML, false), pageWidth) > pageMaxHeight) {
				if (printablePageHTML.length() > 0) {
					result += wrapPrintablePage(printablePageHTML, pageWidth, pageMaxHeight);
					printablePageHTML = pageHTML;
				} else {
					JavaScriptObject splitPageOutput = splitPageModules(this, pageHTML, pageWidth, pageMaxHeight);
					result += JavaScriptUtils.getArrayItemByKey(splitPageOutput, "pages");
					printablePageHTML = JavaScriptUtils.getArrayItemByKey(splitPageOutput, "tail");
				}
			} else {
				printablePageHTML = newPrintablePageHTML;
			}
		}
		if (printablePageHTML.length() > 0) {
			result += wrapPrintablePage(printablePageHTML, pageWidth, pageMaxHeight);
		}
		
		result += "</div>";
		return result;
	};
	
	public String generatePrintableHTML(Content contentModel, boolean randomizePages, boolean randomizeModules, boolean showAnswers) {
		List<Page> pages = contentModel.getPages().getAllPages();
		Page header = contentModel.getDefaultHeader();
		if (header != null) {
			setHeader(header);
		}
		Page footer = contentModel.getDefaultFooter();
		if (footer != null) {
			setFooter(footer);
		}
		setTwoColumnPrintEnabled(Boolean.valueOf(contentModel.getMetadataValue("enableTwoColumnPrint")));
		String result = generatePrintableHTMLForPages(pages, randomizePages, randomizeModules, showAnswers);
		return result;
	}
	
	public String generatePrintableHTMLForPage(Page page, boolean randomizeModules, boolean showAnswers) {
		List<Page> pages = new ArrayList<Page>();
		pages.add(page);
		return generatePrintableHTMLForPages(pages, false, randomizeModules, showAnswers);
	}
	
	public static String addClassToPrintableModule(String printableHTML, String className) {
		Element element = (new HTML(printableHTML)).getElement().getFirstChildElement();
		element.addClassName("printable_module");
		if (className.length() > 0) {
			element.addClassName("printable_module-" + className);
		}
		return element.getString();
	}
	
	public int getA4WidthInPixels(int margin) {
		double A4WidthInMM = 210 - margin*2;
		double MMInInch = 25.4;
		double d_dpi = dpi;
		return (int)((A4WidthInMM / MMInInch) * d_dpi);
	};
	
	public int getA4HeightInPixels(int margin) {
		double A4HeightInMM = 297 - margin*2;
		double MMInInch = 25.4;
		double d_dpi = dpi;
		return (int)((A4HeightInMM / MMInInch) * d_dpi);
	};
	
	public native int getHTMLHeight (String html, int pageWidth) /*-{
		var $_ = $wnd.$;
		var $wrapper = $_("<div></div>");
		$wrapper.css("position", "absolute");
		$wrapper.css("width", pageWidth + "px");
		$wrapper.css("visibility", "hidden");
		$wrapper.css("margin", "0px");
		$wrapper.css("padding", "0px");
		$wrapper.html(html);
		$_("body").append($wrapper);
		var height = $wrapper[0].getBoundingClientRect().height;
		$wrapper.detach();
		return height;
	}-*/;
}
