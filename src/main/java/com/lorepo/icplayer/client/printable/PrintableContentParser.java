package com.lorepo.icplayer.client.printable;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.dom.client.Element;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.user.client.Random;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.ModuleList;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.PageList;
import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.player.IChapter;
import com.lorepo.icplayer.client.module.api.player.IContentNode;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.text.TextPrintable;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;
import com.lorepo.icplayer.client.printable.PrintableContentParser.ParsedListener;
import com.lorepo.icplayer.client.printable.PrintableContentParser.PrintableHtmlTemplates;


public class PrintableContentParser {

	public interface ParsedListener {
		void onParsed(String result);
	}
	
	public static String SPLITTABLE_CLASS_NAME = "splittable";
	int dpi = 96;
	SafeHtml headerHTML = null;
	SafeHtml footerHTML = null;
	int headerHeight = 0;
	int footerHeight = 0;
	int contentHeight = 0;
	Boolean enableTwoColumnPrint = false;
	SeededRandom random = new SeededRandom();
	private HashMap<String, String> loadedState = null;
	private String rawScore = "";
	private boolean preview = false;
	boolean showAnswers = false;
	boolean randomizePages = false;
	boolean randomizeModules = false;
	ParsedListener listener = null;

	JavaScriptObject parsedModuleCallback = null;
	int asyncModuleCounter = 0;
	int asyncModuleIDCounter = 0;
	HashMap<String, String> asyncModuleResults = new HashMap<String, String>();
	ArrayList<HashMap<String, String>> contentInformation = new ArrayList<HashMap<String, String>>();
	HashMap<String, List<String>> printableOrder = new HashMap<String, List<String>>();

	private static class SplitResult extends JavaScriptObject {
		
		protected SplitResult() {};
		
		public final native String getHeadHtml() /*-{return this.head;}-*/;
		
		public final native String getTailHtml() /*-{return this.tail;}-*/;
	}

	private class SplitPageResult {
		public String htmlToAdd;
		public String printablePageHTML;
		public String nonSplittablePageHTML;

		public SplitPageResult(String htmlToAdd, String printablePageHTML, String nonSplittablePageHTML) {
			this.htmlToAdd = htmlToAdd;
			this.printablePageHTML = printablePageHTML;
			this.nonSplittablePageHTML = nonSplittablePageHTML;
		}
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
	
	public PrintableContentParser() {
		setRandomSeed(Random.nextInt());
	}
	
	public void setDPI(int dpi) {
		this.dpi = dpi;
	}
	
	public void setRandomSeed(int seed) {
		this.random.setSeed(seed);
	}

	public void setState(HashMap<String, String> data) {
		if (data != null && data.containsKey("state") && data.containsKey("score")) {
			this.loadedState = JSONUtils.decodeHashMap(data.get("state"));
			this.rawScore = data.get("score");
		}
	}

	public void setRandomizePages(boolean randomizePages) {
		this.randomizePages = randomizePages;
	}

	public void setRandomizeModules(boolean randomizeModules) {
		this.randomizeModules = randomizeModules;
	}

	public void setShowAnswers(boolean showAnswers) {
		this.showAnswers = showAnswers;
	}

	public void setListener(ParsedListener listener) {
		this.listener = listener;
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
		    Collections.swap(randomizable, index, index + random.nextInt(randomizable.size() - index));  
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

	private String getPrintableModuleHTML(IPrintableModuleModel printable, boolean showAnswers, PrintableController controller) {
		String result = "";
		printable.setPrintableController(controller);
		String moduleState = getModuleState(printable.getId(), controller.getPageId());
		printable.setPrintableState(moduleState);
		if (printable.isPrintableAsync()) {
			asyncModuleCounter += 1;
			final PrintableContentParser self = this;
			final String parsedID = "async-parsed-module-" + Integer.toString(this.asyncModuleIDCounter);
			this.asyncModuleIDCounter += 1;
			printable.setPrintableAsyncCallback(parsedID, new ParsedListener() {
				@Override
				public void onParsed(String result) {
					asyncModuleResults.put(parsedID, result);
					int counter = getAsyncModuleCounter();
					setAsyncModuleCounter(counter-1);
					callParsedModuleCallback(self);
				}
			});
		}
		if (moduleState.length() == 0 && this.loadedState != null) {
			// If the lesson has state but the module does not, display empty module
			result = printable.getPrintableHTML(false);
		} else {
			result = printable.getPrintableHTML(showAnswers);
		}
		return result;
	}

	private native void callParsedModuleCallback(PrintableContentParser x)/*-{
		var callback = x.@com.lorepo.icplayer.client.printable.PrintableContentParser::getParsedModuleCallback()();
		if (callback) callback();
	}-*/;

	private JavaScriptObject getParsedModuleCallback() {
		return this.parsedModuleCallback;
	}

	private void setParsedModuleCallback(JavaScriptObject callback) {
		this.parsedModuleCallback = callback;
	}

	public int getAsyncModuleCounter() {
		return asyncModuleCounter;
	}

	public void setAsyncModuleCounter(int value) {
		asyncModuleCounter = value;
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
			parsed += getPrintableModuleHTML(printable, showAnswers, controller);
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
			public String getId() {
				return null;
			}

			@Override
			public boolean isSection() {
				return false;
			}

			@Override
			public void setPrintableState(String state) { }

			@Override
			public boolean isPrintableAsync() {
				return false;
			}

			@Override
			public void setPrintableAsyncCallback(String id, ParsedListener listener) {

			}

		};
	}
	
	private String parsePage(Page page, boolean randomizeModules, boolean showAnswers) {
		List<Group> parsedGroups = new ArrayList<Group>();
		List<IPrintableModuleModel> pagePrintables = new ArrayList<IPrintableModuleModel>();
		PrintableController pagePrintableController = new PrintableController(page);
		boolean isPrintableOrderSet = this.printableOrder.size() > 0;

		pagePrintableController.setSeededRandom(random);
		pagePrintableController.setPreview(this.preview);
		String printableLessonTemplate = createTemplateOfPrintableLesson();
		pagePrintableController.setLessonTemplate(printableLessonTemplate);
		if (this.rawScore != null && this.rawScore.length() > 0) {
			pagePrintableController.setScore(this.rawScore);
		}
		if (!this.contentInformation.isEmpty()) {
			pagePrintableController.setContentInformation(this.contentInformation);
		}

		ModuleList modules = page.getModules();
		int modulesNumber = getModulesNumber(modules, page.getId());
		for (int i = 0; i < modulesNumber; i++) {
			IModuleModel model = getModuleModel(page, page.getId(), i);
			if (model == null) { continue; }
			Group modelGroup = null;
			if (model.hasGroup()) {
				for (Group group: page.getGroupedModules()) {
					if (group.contains(model)) {
						modelGroup = group;
					}
				}
				if (modelGroup != null && !parsedGroups.contains(modelGroup)) {
					parsedGroups.add(modelGroup);
					pagePrintables.add(generatePrintableGroup(modelGroup, pagePrintableController, randomizeModules, showAnswers));
				}
			}
			if (modelGroup == null && model instanceof IPrintableModuleModel) {
				IPrintableModuleModel printable = (IPrintableModuleModel) model;
				if (printable.getPrintableMode() != PrintableMode.NO) {
					pagePrintables.add(printable);
				}
			}
		}
		if (!isPrintableOrderSet && randomizeModules) {
			randomizePrintables(pagePrintables);
		}
		String result = "";
		for (IPrintableModuleModel printable: pagePrintables) {
			result += getPrintableModuleHTML(printable, showAnswers, pagePrintableController);
		}
		return result;
	}

	private int getModulesNumber(ModuleList modules, String pageID){
		boolean hasKey = this.printableOrder.containsKey(pageID);
		if (hasKey && this.printableOrder.size() > 0) {
			List<String>addonsID = this.printableOrder.get(pageID);
			return addonsID.size();
		}
		return modules.size();
	}

	private IModuleModel getModuleModel(Page page, String pageID, int i) {
		ModuleList modules = page.getModules();
		boolean isPrintableOrderSet = this.printableOrder.size() > 0;
		boolean hasKey = this.printableOrder.containsKey(pageID);

		if (isPrintableOrderSet && hasKey) {
			List<String>addonsID = this.printableOrder.get(pageID);
			String moduleID = addonsID.get(i);
			return page.getModules().getModuleById(moduleID);
		}
		
		return modules.get(i);
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
		var minSplitHeight = 100;
		
		var printablePageHTML = "";
		var prevHeight = 0;
		$wrapper.children().each(function(){
			var moduleHTML = this.outerHTML;
			
			var newPrintablePageHTML = printablePageHTML + moduleHTML;
			var newPrintablePageWithHeaderAndFooter = x.@com.lorepo.icplayer.client.printable.PrintableContentParser::applyHeaderAndFooter(Ljava/lang/String;Z)(newPrintablePageHTML, false);
			var newHeight = @com.lorepo.icplayer.client.printable.PrintableContentParser::getHTMLHeight(Ljava/lang/String;I)(newPrintablePageWithHeaderAndFooter, pageWidth);
			if (newHeight > pageHeight) {
				if (prevHeight < pageHeight && this.classList.contains(SPLITTABLE_CLASS_NAME)) {
					var maxHeadHeight = pageHeight - prevHeight - 50;
					if (enableTwoColumnPrint) maxHeadHeight = maxHeadHeight * 2;
					var splitResult = @com.lorepo.icplayer.client.printable.PrintableContentParser::splitModule(Ljava/lang/String;IIIZ)(moduleHTML, maxHeadHeight, minSplitHeight, pageWidth, enableTwoColumnPrint);
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
	
	public void generatePrintableHTMLForPages(List<Page> sourcePages) {
		List<String> pageHTMLs = generatePageHTMLs(sourcePages);
		String result = "";
		for(String pageHTML: pageHTMLs) {
			result += pageHTML;
		}
		preloadPageHTMLs(this, result);
	};

	private void continueGeneratePrintableHTML(JavaScriptObject element) {
		updateAsyncModules(element);
		int maxHeight = getA4HeightInPixels(12);
		int maxWidth =	getA4WidthInPixels(12);
		updateImageSizes(element, maxHeight, maxWidth);
		List<String> pageHTMLs = getModuleHTMLsFromWrapper(element);
		String result = paginatePageHTMLs(pageHTMLs);
		removeJSElement(element);
		listener.onParsed(result);
	}

	private void updateAsyncModules(JavaScriptObject element) {
		for (String key: this.asyncModuleResults.keySet()){
			updateAsyncModule(key, asyncModuleResults.get(key), element);
		}
		asyncModuleIDCounter = 0;
		asyncModuleCounter = 0;
		asyncModuleResults.clear();
	}

	private native void updateAsyncModule(String id, String html, JavaScriptObject element)/*-{
		var $replacement = $wnd.$(html);
		$wnd.$('#'+id).replaceWith($replacement);
	}-*/;

	private List<String> generatePageHTMLs(List<Page> sourcePages) {
		List<Page> pages = new ArrayList<Page>();
		if (randomizePages && sourcePages.size() > 1) {
			List<Page> randomizablePages = new ArrayList<Page>();
			List<Page> nonRandomizablePages = new ArrayList<Page>();
			for (Page page: sourcePages) {
				if (page.getRandomizeInPrint()) {
					randomizablePages.add(page);
				} else {
					nonRandomizablePages.add(page);
				}
			}

			for(int index = 0; index < randomizablePages.size(); index += 1) {
				Collections.swap(randomizablePages, index, index + random.nextInt(randomizablePages.size() - index));
			}
			for (Page page: nonRandomizablePages) pages.add(page);
			for (Page page: randomizablePages) pages.add(page);
		} else {
			pages = sourcePages;
		}
		List<String> parsedPages = new ArrayList<String>();

		for (Page page: pages) {
			String result = "<div class='page";
			result += page.isSplitInPrintBlocked() ? "'>" : " splittable'>";
			result += parsePage(page, randomizeModules, showAnswers);
			result += "</div>";
			parsedPages.add(result);
		}

		return parsedPages;
	}

	private boolean isStartOfPage(String html) {
		return html.contains("class=\"page");
	}

	private boolean isStartOfUnsplittablePage(String html) {
		return !html.contains("class=\"page splittable");
	}

	private boolean isHTMLBiggerThanA4(String html) {
		int a4Height = getA4HeightInPixels(10);
		int a4Width = getA4WidthInPixels(10);
		return getHTMLHeight(applyHeaderAndFooter(html, false), a4Width) > a4Height;
	};

	private SplitPageResult splitAccumulatedHTMLmarkRestNonSplittable(String printablePageHTML, String nonSplittablePageHTML) {
		int pageMaxHeight = getA4HeightInPixels(10);
		int pageWidth = getA4WidthInPixels(10);
		String htmlToAdd = "";

		if (printablePageHTML.length() > 0) {
			htmlToAdd += wrapPrintablePage(printablePageHTML, pageWidth, pageMaxHeight);
			printablePageHTML = "";
			if (isHTMLBiggerThanA4(nonSplittablePageHTML)) {
				SplitResult splitPageOutput = splitPageModules(this, nonSplittablePageHTML, pageWidth, pageMaxHeight);
				htmlToAdd += splitPageOutput.getHeadHtml();
				nonSplittablePageHTML = splitPageOutput.getTailHtml();
			}
		} else {
			SplitResult splitPageOutput = splitPageModules(this, nonSplittablePageHTML, pageWidth, pageMaxHeight);
			htmlToAdd += splitPageOutput.getHeadHtml();
			nonSplittablePageHTML = splitPageOutput.getTailHtml();
		}

		return new SplitPageResult(htmlToAdd, printablePageHTML, nonSplittablePageHTML);
	}

	private SplitPageResult splitAccumulatedHTMLmarkRestSplittable(String printablePageHTML, String nonSplittablePageHTML) {
		int pageMaxHeight = getA4HeightInPixels(10);
		int pageWidth = getA4WidthInPixels(10);
		String htmlToAdd = "";
		
		if (printablePageHTML.length() > 0) {
			htmlToAdd += wrapPrintablePage(printablePageHTML, pageWidth, pageMaxHeight);
			printablePageHTML = "";
			if (isHTMLBiggerThanA4(nonSplittablePageHTML)) {
				SplitResult splitPageOutput = splitPageModules(this, nonSplittablePageHTML, pageWidth, pageMaxHeight);
				htmlToAdd += splitPageOutput.getHeadHtml();			
				printablePageHTML = splitPageOutput.getTailHtml();
				nonSplittablePageHTML = "";
			}
		} else {
			SplitResult splitPageOutput = splitPageModules(this, nonSplittablePageHTML, pageWidth, pageMaxHeight);
			htmlToAdd += splitPageOutput.getHeadHtml();
			printablePageHTML = splitPageOutput.getTailHtml();
			nonSplittablePageHTML = "";
		}

		return new SplitPageResult(htmlToAdd, printablePageHTML, nonSplittablePageHTML);
	}

	private String paginatePageHTMLs(List<String> pageHTMLs) {
		int pageMaxHeight = getA4HeightInPixels(10);
		contentHeight = pageMaxHeight - footerHeight - headerHeight;
		int pageWidth = getA4WidthInPixels(10);
		String printablePageHTML = "";
		String nonSplittablePageHTML = "";
		boolean twoColumnPrintOriginalValue = enableTwoColumnPrint;

		String result = "<div class='printable_lesson'>";
		boolean firstPage = true;
		for (String wrappedPageHTML: pageHTMLs) {
			String pageHTML = unwrapHTML(wrappedPageHTML);
			if (firstPage && enableTwoColumnPrint) { // First mauthor page is always in single column
				enableTwoColumnPrint = false;
			}

			if (isStartOfPage(wrappedPageHTML)) {
				if (nonSplittablePageHTML.length() > 0) {
					if (isHTMLBiggerThanA4(nonSplittablePageHTML + printablePageHTML)) {
						SplitPageResult splitPageResult = splitAccumulatedHTMLmarkRestSplittable(printablePageHTML, nonSplittablePageHTML);
						result += splitPageResult.htmlToAdd;
						printablePageHTML = splitPageResult.printablePageHTML;
						nonSplittablePageHTML = splitPageResult.nonSplittablePageHTML;
					} else {
						printablePageHTML += nonSplittablePageHTML;
						nonSplittablePageHTML = "";		
					}
				}
				if (isStartOfUnsplittablePage(wrappedPageHTML)) {
					nonSplittablePageHTML = pageHTML;
					if (isHTMLBiggerThanA4(nonSplittablePageHTML + printablePageHTML)) {
						SplitPageResult splitPageResult = splitAccumulatedHTMLmarkRestNonSplittable(printablePageHTML, nonSplittablePageHTML);
						result += splitPageResult.htmlToAdd;
						printablePageHTML = splitPageResult.printablePageHTML;
						nonSplittablePageHTML = splitPageResult.nonSplittablePageHTML;
					}
					continue;
				}
			} else if (nonSplittablePageHTML.length() > 0) {
				nonSplittablePageHTML += pageHTML;
				if (isHTMLBiggerThanA4(nonSplittablePageHTML + printablePageHTML)) {
					SplitPageResult splitPageResult = splitAccumulatedHTMLmarkRestNonSplittable(printablePageHTML, nonSplittablePageHTML);
					result += splitPageResult.htmlToAdd;
					printablePageHTML = splitPageResult.printablePageHTML;
					nonSplittablePageHTML = splitPageResult.nonSplittablePageHTML;
				}
				continue;
			}

			String newPrintablePageHTML = printablePageHTML + pageHTML;
			if (isHTMLBiggerThanA4(newPrintablePageHTML)) {
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

		String rest = printablePageHTML + nonSplittablePageHTML;
		if (isHTMLBiggerThanA4(rest)) {
			SplitPageResult splitPageResult = splitAccumulatedHTMLmarkRestSplittable(printablePageHTML, nonSplittablePageHTML);
			result += splitPageResult.htmlToAdd;
			result += wrapPrintablePage(splitPageResult.printablePageHTML , pageWidth, pageMaxHeight);
		} else {
			result += wrapPrintablePage(printablePageHTML + nonSplittablePageHTML, pageWidth, pageMaxHeight);
		}

		result += "</div>";
		return result;
	}

	public void generatePrintableHTML(Content contentModel, ArrayList<Integer> pageSubset) {
		List<Page> pages;
		if (pageSubset == null) {
			pages = contentModel.getPages().getAllPages();
		} else {
			pages = new ArrayList<Page>();
			for (int index: pageSubset) {
				IPage ipage = contentModel.getPage(index);
				if (ipage instanceof Page) {
					pages.add((Page) ipage);
				}
			}
		}

		createContentInformation(contentModel, pageSubset);

		Page header = contentModel.getDefaultHeader();
		if (header != null) {
			setHeader(header);
		}
		Page footer = contentModel.getDefaultFooter();
		if (footer != null) {
			setFooter(footer);
		}
		setTwoColumnPrintEnabled(Boolean.valueOf(contentModel.getMetadataValue("enableTwoColumnPrint")));
		generatePrintableHTMLForPages(pages);
	}

	private void createContentInformation (Content contentModel, ArrayList<Integer> pageSubset) {
		this.contentInformation.clear();
		IChapter tableOfContents = contentModel.getTableOfContents();

		updateContentInformation(tableOfContents, pageSubset, 0, null);
	}

	private int updateContentInformation (
			IChapter chapter, ArrayList<Integer> pageSubset, int index, String parentId) {
		int size = chapter.size();
		int pageIndex = index;

		for (int i = 0; i < size; i++) {
			HashMap<String, String> nodeInformation = new HashMap<String, String>();
			IContentNode node = chapter.get(i);

			nodeInformation.put("id", node.getId());
			nodeInformation.put("parentId", parentId);
			nodeInformation.put("name", node.getName());

			if (node instanceof Page) {
				pageIndex++;
				if (pageSubset != null && !pageSubset.contains(pageIndex - 1)) {
					continue;
				}
				nodeInformation.put("isReportable", Boolean.toString(((Page) node).isReportable()));
				nodeInformation.put("isVisited", Boolean.toString(((Page) node).isVisited()));
				nodeInformation.put("type", ((Page) node).getClassNamePrefix());
				nodeInformation.put("maxScore", Integer.toString(((Page) node).getModulesMaxScore()));
				nodeInformation.put("pageWeight", Integer.toString(((Page) node).getPageWeight()));
				this.contentInformation.add(nodeInformation);
			} else if (node instanceof PageList) {
				nodeInformation.put("isReportable", Boolean.toString(false));
				nodeInformation.put("isVisited", null);
				nodeInformation.put("type", "chapter");
				this.contentInformation.add(nodeInformation);
				pageIndex = updateContentInformation(
						(IChapter) node, pageSubset, pageIndex, node.getId());
			}
		}
		return pageIndex;
	}
	
	public void generatePrintableHTML(Content contentModel) {
		generatePrintableHTML(contentModel, null);
	}
	
	public void generatePrintableHTMLForPage(Page page) {
		List<Page> pages = new ArrayList<Page>();
		pages.add(page);
		generatePrintableHTMLForPages(pages);
	}
	
	public static String addClassToPrintableModule(String printableHTML, String className) {
		return addClassToPrintableModule(printableHTML, className, false);
	}
	
	public static String addClassToPrintableModule(String printableHTML, String className, boolean isSplittable) {
		Element element = (new HTML(printableHTML)).getElement().getFirstChildElement();
		element.addClassName("printable_module");
		String[] classNames = className.split(" ");
		for (String name: classNames) {
			if (name.trim().length() > 0) {
				element.addClassName("printable_module-" + name);
			}
		}
		if (isSplittable) {
			element.addClassName(SPLITTABLE_CLASS_NAME);
		}
		return element.getString();
	}

	public static String[] getPrintableModuleAdditionalClassNames(String className, boolean isSplittable) {
		String tempContent = "<div></div>";
		String tempContentWithClasses = PrintableContentParser.addClassToPrintableModule(tempContent, className, isSplittable);
		Element element = (new HTML(tempContentWithClasses)).getElement().getFirstChildElement();
		return element.getClassName().split(" ");
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
	
	public static native int getHTMLHeight (String html, int pageWidth) /*-{
		var $_ = $wnd.$;
		var $outerLessonWrapper = @com.lorepo.icplayer.client.printable.PrintableContentParser::getModuleTestingWrappers()();
		var $wrapper = $outerLessonWrapper.find(".printable-content-wrapper");
		$wrapper.css("width", pageWidth + "px");
		$wrapper.html(html);

		$_("body").append($outerLessonWrapper);
		var height = $wrapper[0].getBoundingClientRect().height;
		$outerLessonWrapper.remove();
		return height;
	}-*/;
	
	private static native SplitResult splitModule (String html, int maxHeight, int minSplitHeight, int pageWidth, boolean enableTwoColumnPrint) /*-{
		var $_ = $wnd.$;
		var $outerLessonWrapper = @com.lorepo.icplayer.client.printable.PrintableContentParser::getModuleTestingWrappers()();
		var $wrapper = $outerLessonWrapper.find(".printable-content-wrapper");
		$wrapper.css("width", pageWidth + "px");
		if (enableTwoColumnPrint) {
			$wrapper.css("columns", "2");
			$wrapper.css("-webkit-columns", "2");
			$wrapper.css("-moz-columns", "2");
		}
		$wrapper.html(html);
		$_("body").append($outerLessonWrapper);

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
		
		if (lastNode == null) {
		    $outerLessonWrapper.remove();
		    return {head: "", tail: html};
        }
		
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
		
		$outerLessonWrapper.remove();
		return {head: headHTML, tail: tailHTML};
	}-*/;

	private String getModuleState(String moduleId, String pageId) {
		if (moduleId == null) return ""; // moduleId == null when printable represents a group
		String stateKey = pageId + moduleId;
		if (this.loadedState != null && this.loadedState.containsKey(stateKey)) {
			return this.loadedState.get(stateKey);
		}
		return "";
	}

	private static native JavaScriptObject getModuleTestingWrappers()/*-{
		var $_ = $wnd.$;
		var $outerLessonWrapper = $_("<div></div>");
		$outerLessonWrapper.css("position", "absolute");
		$outerLessonWrapper.css("top", "0px");
		$outerLessonWrapper.css("left", "0px");
		$outerLessonWrapper.css("visibility", "hidden");
		$outerLessonWrapper.addClass("printable_lesson");

		var $outerPageWrapper = $_("<div></div>");
		$outerPageWrapper.addClass("printable_page");
		$outerPageWrapper.css("position", "absolute");
		$outerPageWrapper.css("top", "0px");
		$outerPageWrapper.css("left", "0px");
		$outerLessonWrapper.append($outerPageWrapper);

		var $wrapper = $_("<div></div>");
		$wrapper.css("position", "absolute");
		$wrapper.css("top", "0px");
		$wrapper.css("left", "0px");
		$wrapper.css("margin", "0px");
		$wrapper.css("padding", "0px");
		$wrapper.addClass("printable-content-wrapper");
		$outerPageWrapper.append($wrapper);

		return $outerLessonWrapper;
	}-*/;

	private native void preloadPageHTMLs(PrintableContentParser x, String pageHTMLs)/*-{
		var $_ = $wnd.$;
		var $outerLessonWrapper = @com.lorepo.icplayer.client.printable.PrintableContentParser::getModuleTestingWrappers()();
		var $wrapper = $outerLessonWrapper.find(".printable-content-wrapper");
		$wrapper.html(pageHTMLs);

		var $imgs = $outerLessonWrapper.find('img');
		var asyncModuleCount = x.@com.lorepo.icplayer.client.printable.PrintableContentParser::getAsyncModuleCounter()();
		var loadCounter = $imgs.length + asyncModuleCount + 2; // number of images + async modules + outerLessonWrapper.ready + mathjax;

		var isReady = false;
		var continuedParsing = false; // Flag blocks continueGeneratePrintableHTML from getting called mutiple times

		var loadCallback = function(){
			loadCounter -= 1;
			if (loadCounter < 1 && isReady && !continuedParsing) {
				continuedParsing = true;
				x.@com.lorepo.icplayer.client.printable.PrintableContentParser::continueGeneratePrintableHTML(Lcom/google/gwt/core/client/JavaScriptObject;)($outerLessonWrapper[0]);
			}
		};

		var mathJaxFinished = function() {
			x.@com.lorepo.icplayer.client.printable.PrintableContentParser::mathJaxPostProcessing(Lcom/google/gwt/core/client/JavaScriptObject;)($outerLessonWrapper);
			loadCallback();
		}

		x.@com.lorepo.icplayer.client.printable.PrintableContentParser::setParsedModuleCallback(Lcom/google/gwt/core/client/JavaScriptObject;)(loadCallback);

		$imgs.each(function(){
			var $this = $_(this);
			if (this.complete && this.naturalHeight !== 0) {
				loadCallback();
			} else {
				$this.load(loadCallback);
			}
		});

		$outerLessonWrapper.ready(function(){
			isReady = true;
			loadCallback();
		});

		var timeout = setTimeout(function(){
			if (loadCounter > 0 || isReady == false) {
				isReady = true;
				loadCounter = 0;
				loadCallback();
			}
		}, 20000);

		$_('body').append($outerLessonWrapper);

		var args = new $wnd.Array();
		args.push("Typeset", $wnd.MathJax.Hub, $outerLessonWrapper[0]);
		args.push(mathJaxFinished);
		$wnd.MathJax.Hub.Queue(args);
	}-*/;

	private List<String> getModuleHTMLsFromWrapper(JavaScriptObject wrapper) {
		JsArray array = _getModuleHTMLsFromWrapper(wrapper);
		List<String> moduleHTMLs = getStringListFromJsArray(array);
		return moduleHTMLs;
	}

	private void mathJaxPostProcessing(JavaScriptObject wrapper) {
		TextPrintable.mathJaxPostProcessing(wrapper);
	};

	private List<String> getStringListFromJsArray(JsArray array) {
		List<String> list = new ArrayList<String>();
		for (int i = 0; i < array.length(); i++) {
			list.add(array.get(i).toString());
		}
		return list;
	}

	private native JsArray _getModuleHTMLsFromWrapper(JavaScriptObject wrapper)/*-{
		var $_ = $wnd.$;
		var $outerWrapper = $_(wrapper);
		var resultArray = [];
		$outerWrapper.find(".printable-content-wrapper").children().each(function(){
			resultArray.push(this.outerHTML);
		});
		return resultArray;
	}-*/;

	private native void updateImageSizes(JavaScriptObject wrapper, int maxHeight, int maxWidth)/*-{
		var $_ = $wnd.$;
		var $outerWrapper = $_(wrapper);
		$outerWrapper.find('img').each(function(){
			var $this = $_(this);
			if (!$this.parent().hasClass('printable_ic_image') && this.naturalHeight) {
				var height = this.naturalHeight;
				var width = this.naturalWidth;
				if (width > maxWidth && width/maxWidth > height/maxHeight) {
					height = maxWidth * height/width;
					width = maxWidth;
					$this.css('object-fit','scale-down');
				} else if (height > maxHeight && height/maxHeight > width/maxWidth) {
					width = maxHeight * width/height;
					height = maxHeight;
					this.css('object-fit','scale-down');
				}
				$this.css('height', height + 'px');
				$this.css('width', width + 'px');
			}
		});
	}-*/;

	private native String unwrapHTML(String pageHTML)/*-{
		var $_ = $wnd.$;
		var $page = $_(pageHTML);
		return $page.html();
	}-*/;

	private native void removeJSElement(JavaScriptObject element)/*-{
		$wnd.$(element).html('');
		if (element && element.parentNode) element.parentNode.removeChild(element);
	}-*/;

	public void setPreview(boolean preview) {
	  this.preview = preview;
	};

	private String createTemplateOfPrintableLesson() {
		int pageMaxHeight = getA4HeightInPixels(10);
		int pageWidth = getA4WidthInPixels(10);
		String content = "<div id=\"printable_placeholder\"/>";
		
		int previousContentHeight = contentHeight;
		contentHeight = pageMaxHeight - footerHeight - headerHeight;
		String printablePage = wrapPrintablePage(content, pageWidth, pageMaxHeight);
		contentHeight = previousContentHeight;
		return "<div class='printable_lesson'>" + printablePage + "</div>";
	};

	public void setPrintableOrder(HashMap<String, List<String>> printableOrder) {
		this.printableOrder = printableOrder;
	}
}
