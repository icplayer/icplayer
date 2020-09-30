package com.lorepo.icplayer.client;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.user.client.Random;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.ModuleList;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.module.IPrintableModuleModel;
import com.lorepo.icplayer.client.module.Printable.PrintableMode;
import com.lorepo.icplayer.client.module.api.IModuleModel;

public class PrintableContentParser {
	
	int dpi = 96;
	SafeHtml headerHTML = null;
	SafeHtml footerHTML = null;
	int headerHeight = 0;
	int footerHeight = 0;
	int contentHeight = 0;
	Boolean enableTwoColumnPrint = false;
	
	private static class SplitPageResult extends JavaScriptObject {
		
		protected SplitPageResult() {};
		
		public final native String getPagesHtml() /*-{return this.pages;}-*/;
		
		public final native String getTailHtml() /*-{return this.tail;}-*/;
	}
	
	public interface PrintableHtmlTemplates extends SafeHtmlTemplates {
		@Template("<tr class=\"printable_header\" style=\"height:{0}px;width:100%;\"><td>{1}</td></tr>")
	    SafeHtml pageHeader(int height, SafeHtml content);
		
		@Template("<tr><td class='printable_content' style='"
				+ "vertical-align: top;"
				+ " columns: {0};"
				+ "-webkit-columns:{0};"
				+ "-moz-columns: {0};"
				+ " column-gap: 40px;"
				+ "'>{1}</td></tr>")
	    SafeHtml pageContent(int columns, SafeHtml content);
		
		@Template("<tr><td class='printable_content'><div style='"
				+ "vertical-align: top;"
				+ "height: {0}px;"
				+ "width: 100%;"
				+ " columns: {1};"
				+ "-webkit-columns:{1};"
				+ "-moz-columns: {1};"
				+ " column-gap: 40px;"
				+ " column-fill: auto;"
				+ "-webkit-column-fill: auto;"
				+ "-moz-column-fill: auto;"
				+ "'>{2}</div></td></tr>")
	    SafeHtml pageContentFullHeight(int height, int columns, SafeHtml content);
		
		@Template("<tr class=\"printable_footer\" style=\"height:{0}px;width:100%;\"><td>{1}</td></tr>")
	    SafeHtml pageFooter(int height, SafeHtml content);
	}
	private static final PrintableHtmlTemplates TEMPLATE = GWT.create(PrintableHtmlTemplates.class);
	
	public void setDPI(int dpi) {
		this.dpi = dpi;
	}
	
	public void setTwoColumnPrintEnabled(boolean enabled) {
		enableTwoColumnPrint = enabled;
	}

	public void setHeader(Page header) {
		String headerRaw = parsePage(header, false, false);
		int width = getA4WidthInPixels(10);
		headerHeight = getHTMLHeight(headerRaw, width);
		headerHTML = SafeHtmlUtils.fromTrustedString(headerRaw);
	}
	
	public void setFooter(Page footer) {
		String footerRaw = parsePage(footer, false, false);
		int width = getA4WidthInPixels(10);
		footerHeight = getHTMLHeight(footerRaw, width);
		footerHTML = SafeHtmlUtils.fromTrustedString(footerRaw);
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
			result += TEMPLATE.pageHeader(headerHeight, headerHTML).asString();
		}

		int columns = enableTwoColumnPrint ? 2 : 1;
		SafeHtml safeContent = SafeHtmlUtils.fromTrustedString(content);

		if (fullHeight) {
			result += TEMPLATE.pageContentFullHeight(contentHeight, columns, safeContent).asString();
		} else {
			result += TEMPLATE.pageContent(columns, safeContent).asString();
		}
		
		if (footerHeight > 0) {
			result += TEMPLATE.pageFooter(footerHeight, footerHTML).asString();
		}
		result += "</table>";
		return result;
	}
	
	private native SplitPageResult splitPageModules(PrintableContentParser x, String html, int pageWidth, int pageHeight) /*-{
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
	
	private String wrapOpeningPlayerPage(String content) {
		return "<div class=\"printable_opening_player_page\">" + content + "</div>";
	}
	
	public String generatePrintableHTMLForPages(List<Page> pages, boolean randomizePages, boolean randomizeModules, boolean showAnswers) {
		String result = "<div>";
		
		if (randomizePages && pages.size() > 1) {
			Page firstPage = pages.get(0);
			pages.remove(0);
			for(int index = 0; index < pages.size(); index += 1) {  
				Collections.swap(pages, index, index + Random.nextInt(pages.size() - index));  
			}
			pages.add(0, firstPage);
		}
		

		int pageMaxHeight = getA4HeightInPixels(10);
		contentHeight = pageMaxHeight - footerHeight - headerHeight;
		int pageWidth = getA4WidthInPixels(10);
		String printablePageHTML = "";
		boolean twoColumnPrintOriginalValue = enableTwoColumnPrint;
		
		boolean firstPage = true;
		for (Page page: pages) {
			String pageHTML = parsePage(page, randomizeModules, showAnswers);
			String newPrintablePageHTML = printablePageHTML + pageHTML;
			if (firstPage && enableTwoColumnPrint) { // First mauthor page is always in single column
				enableTwoColumnPrint = false;
			}
			if (getHTMLHeight(applyHeaderAndFooter(newPrintablePageHTML, false), pageWidth) > pageMaxHeight) {
				SplitPageResult splitPageOutput = splitPageModules(this, newPrintablePageHTML, pageWidth, pageMaxHeight);
				result += splitPageOutput.getPagesHtml();
				if (firstPage) {
					printablePageHTML = wrapOpeningPlayerPage(splitPageOutput.getTailHtml());
				} else {
					printablePageHTML = splitPageOutput.getTailHtml();
				}
			} else {
				if (firstPage) {
					newPrintablePageHTML = wrapOpeningPlayerPage(newPrintablePageHTML);
				}
				printablePageHTML = newPrintablePageHTML;
			}
			if (firstPage){
				enableTwoColumnPrint = twoColumnPrintOriginalValue;
				firstPage = false;
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
