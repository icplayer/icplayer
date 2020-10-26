package com.lorepo.icplayer.client.printable;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.client.SafeHtmlTemplates.Template;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.user.client.Random;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.ModuleList;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;

public class PrintableContentParser {
	
	public static String SPLITTABLE_CLASS_NAME = "splittable";
	int dpi = 96;
	SafeHtml headerHTML = null;
	SafeHtml footerHTML = null;
	int headerHeight = 0;
	int footerHeight = 0;
	int contentHeight = 0;
	Boolean enableTwoColumnPrint = false;
	
	private static class SplitResult extends JavaScriptObject {
		
		protected SplitResult() {};
		
		public final native String getHeadHtml() /*-{return this.head;}-*/;
		
		public final native String getTailHtml() /*-{return this.tail;}-*/;
	}
	
	public interface PrintableHtmlTemplates extends SafeHtmlTemplates {
		@Template("<tr class=\"printable_header single_column_print\" style=\"height:{0}px;width:100%;\"><td>{1}</td></tr>")
	    SafeHtml pageHeader(int height, SafeHtml content);
		
		@Template("<tr><td class='printable_content {0}' style='"
				+ "vertical-align: top;"
				+ " columns: {1};"
				+ "-webkit-columns:{1};"
				+ "-moz-columns: {1};"
				+ " column-gap: 40px;"
				+ "'>{2}</td></tr>")
	    SafeHtml pageContent(String classes, int columns, SafeHtml content);
		
		@Template("<tr><td class='printable_content {0}'><div style='"
				+ "vertical-align: top;"
				+ "height: {1}px;"
				+ "width: 100%;"
				+ " columns: {2};"
				+ "-webkit-columns:{2};"
				+ "-moz-columns: {2};"
				+ " column-gap: 40px;"
				+ "'>{3}</div></td></tr>")
	    SafeHtml pageContentFullHeight(String classes, int height, int columns, SafeHtml content);
		
		@Template("<tr class=\"printable_footer single_column_print\" style=\"height:{0}px;width:100%;\"><td>{1}</td></tr>")
	    SafeHtml pageFooter(int height, SafeHtml content);
	}
	private static final PrintableHtmlTemplates TEMPLATE = GWT.create(PrintableHtmlTemplates.class);
	
	public void setDPI(int dpi) {
		this.dpi = dpi;
	}
	
	public void setTwoColumnPrintEnabled(boolean enabled) {
		enableTwoColumnPrint = enabled;
	}
	
	public boolean getTwoColumnPrintEnabled() {
		return enableTwoColumnPrint;
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
	
	private IPrintableModuleModel generatePrintableGroup(final Group group, PrintableController controller, boolean randomizeModules, boolean showAnswers) {
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
		String splittable_class = "";
		if (!group.isSplitInPrintBlocked()) {
			splittable_class = PrintableContentParser.SPLITTABLE_CLASS_NAME;
		}
		parsed += "<div class=\"printable_modules_group " + groupClass + " " + splittable_class + "\">";
		for (IPrintableModuleModel printable: groupPrintables) {
			printable.setPrintableController(controller);
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
			public JavaScriptObject getPrintableContext() {
				return null;
			}
			
			@Override
			public void setPrintableController(PrintableController controller) {
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
		PrintableController pagePrintableController = new PrintableController(page);
		
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
					pagePrintables.add(generatePrintableGroup(modelGroup, pagePrintableController, randomizeModules, showAnswers));
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
			printable.setPrintableController(pagePrintableController);
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

		int columns = 1;
		String column_class = "single_column_print";
		if (enableTwoColumnPrint) {
			columns = 2;
			column_class = "double_column_print";
		}
		SafeHtml safeContent = SafeHtmlUtils.fromTrustedString(content);

		if (fullHeight) {
			result += TEMPLATE.pageContentFullHeight(column_class, contentHeight, columns, safeContent).asString();
		} else {
			result += TEMPLATE.pageContent(column_class, columns, safeContent).asString();
		}
		
		if (footerHeight > 0) {
			result += TEMPLATE.pageFooter(footerHeight, footerHTML).asString();
		}
		result += "</table>";
		return result;
	}
	
	private native SplitResult splitPageModules(PrintableContentParser x, String html, int pageWidth, int pageHeight) /*-{
		var pages = "";
		var $wrapper = $wnd.$("<div></div>");
		$wrapper.html(html);
		
		var SPLITTABLE_CLASS_NAME = @com.lorepo.icplayer.client.printable.PrintableContentParser::SPLITTABLE_CLASS_NAME;
		var enableTwoColumnPrint  = x.@com.lorepo.icplayer.client.printable.PrintableContentParser::getTwoColumnPrintEnabled()();
		var maxEmptyHeight = pageHeight * 0.2;
		if (enableTwoColumnPrint) maxEmptyHeight = maxEmptyHeight / 2;
		var minSplitHeight = 100;
		
		var printablePageHTML = "";
		var prevHeight = 0;
		$wrapper.children().each(function(){
			var moduleHTML = this.outerHTML;
			
			var newPrintablePageHTML = printablePageHTML + moduleHTML;
			var newPrintablePageWithHeaderAndFooter = x.@com.lorepo.icplayer.client.printable.PrintableContentParser::applyHeaderAndFooter(Ljava/lang/String;Z)(newPrintablePageHTML, false);
			var newHeight = x.@com.lorepo.icplayer.client.printable.PrintableContentParser::getHTMLHeight(Ljava/lang/String;I)(newPrintablePageWithHeaderAndFooter, pageWidth);
			if (newHeight > pageHeight) {
				if (prevHeight < pageHeight - maxEmptyHeight && this.classList.contains(SPLITTABLE_CLASS_NAME)) {
					var maxHeadHeight = pageHeight - prevHeight - 50;
					if (enableTwoColumnPrint) maxHeadHeight = maxHeadHeight * 2;
					console.log("HEAD HEIGHt");
					console.log(enableTwoColumnPrint.toString());
					console.log(maxHeadHeight);
					console.log(pageHeight);
					console.log(prevHeight);
					var splitResult = x.@com.lorepo.icplayer.client.printable.PrintableContentParser::splitModule(Ljava/lang/String;IIIZ)(moduleHTML, maxHeadHeight, minSplitHeight, pageWidth, enableTwoColumnPrint);
					printablePageHTML += splitResult.head;
					moduleHTML = splitResult.tail;
				}
				pages += x.@com.lorepo.icplayer.client.printable.PrintableContentParser::wrapPrintablePage(Ljava/lang/String;II)(printablePageHTML, pageWidth, pageHeight);
				printablePageHTML = moduleHTML;
			} else {
				printablePageHTML += moduleHTML;
			}
			prevHeight = newHeight;
		});
		return {head: pages, tail: printablePageHTML};
	}-*/;
	
	private String wrapOpeningPlayerPage(String content) {
		return "<div class=\"printable_opening_player_page single_column_print\">" + content + "</div>";
	}
	
	public String generatePrintableHTMLForPages(List<Page> pages, boolean randomizePages, boolean randomizeModules, boolean showAnswers) {
		String result = "<div class='printable_lesson'>";
		
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
				SplitResult splitPageOutput = splitPageModules(this, newPrintablePageHTML, pageWidth, pageMaxHeight);
				result += splitPageOutput.getHeadHtml();
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
		return addClassToPrintableModule(printableHTML, className, false);
	}
	
	public static String addClassToPrintableModule(String printableHTML, String className, boolean isSplittable) {
		Element element = (new HTML(printableHTML)).getElement().getFirstChildElement();
		element.addClassName("printable_module");
		if (className.length() > 0) {
			element.addClassName("printable_module-" + className);
		}
		if (isSplittable) {
			element.addClassName(SPLITTABLE_CLASS_NAME);
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
	
	private native SplitResult splitModule (String html, int maxHeight, int minSplitHeight, int pageWidth, boolean enableTwoColumnPrint) /*-{
		console.log("ATTEMPT TO SPLIT");
		console.log(maxHeight);
		console.log(html);
		
		var $_ = $wnd.$;
		var $wrapper = $_("<div></div>");
		$wrapper.css("position", "absolute");
		$wrapper.css("width", pageWidth + "px");
		$wrapper.css("visibility", "hidden");
		$wrapper.css("margin", "0px");
		$wrapper.css("padding", "0px");
		if (enableTwoColumnPrint) {
			$wrapper.css("columns", "2");
			$wrapper.css("-webkit-columns", "2");
			$wrapper.css("-moz-columns", "2");
		}
		$wrapper.html(html);
		$_("body").append($wrapper);
		var wrapperRect = $wrapper[0].getBoundingClientRect();
		var lastNode = null;
		var lastNodeRect = null;
		var descendants = $wrapper.find("*:not(ol *, tr *, th)");
		descendants.each(function(){
			var currentValue = this;
			var rect = currentValue.getBoundingClientRect();	
			var offsetY = rect.bottom - wrapperRect.y;
			if (offsetY > maxHeight) return {head: "", tail: html};
			if (offsetY < minSplitHeight || offsetY > wrapperRect.height - minSplitHeight) return;
			if (lastNode == null) {
				lastNode = currentValue;
				lastNodeRect = rect;
			} else {
				if (
				(rect.bottom > lastNodeRect.bottom) 
				|| (
				rect.bottom == lastNodeRect.bottom && 
				rect.right > lastNodeRect.right )) {
					lastNode = currentValue;
					lastNodeRect = rect;
				} 
			}
		});
		
		if (lastNode == null) return {head: "", tail: html};
		
		var headRange = $doc.createRange();
		headRange.setStartBefore($wrapper.children().first()[0]);
		headRange.setEndAfter(lastNode);
		var headWrapper = $doc.createElement("div");
		headWrapper.appendChild(headRange.cloneContents());
		headWrapper.childNodes.forEach(function(element, index, array){element.style.minHeight = "";});
		var headHTML = headWrapper.innerHTML;
		
		var tailRange = $doc.createRange();
		tailRange.setStartAfter(lastNode);
		tailRange.setEndAfter($wrapper.children().last()[0]);	
		var tailWrapper = $doc.createElement("div");
		tailWrapper.appendChild(tailRange.cloneContents());
		tailWrapper.childNodes.forEach(function(element, index, array){element.style.minHeight = "";});
		var tailHTML = tailWrapper.innerHTML;
		
		$wrapper.detach();
		return {head: headHTML, tail: tailHTML};
	}-*/;
}
