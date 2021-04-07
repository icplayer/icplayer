package com.lorepo.icplayer.client.module.text;

import java.util.HashMap;
import java.util.Iterator;
import java.util.ArrayList;
import java.util.Map;

import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.NodeList;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.content.services.JsonServices;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;

public class TextPrintable {

	private TextModel model = null;
	private float spaceSize = 0;
	private Map<String, String> userAnswers = null;

	public TextPrintable(TextModel model) {
		this.model = model;
		this.spaceSize = getTextWidthInPixels("&nbsp;");
	}
	
	public String getPrintableHTML(String className, boolean showAnswers) {
		if (model.getPrintable() == PrintableMode.NO) {
			return null;
		}

		this.userAnswers = getAnswersFromPrintableState();
		String parsedText = model.parsedText;
		
		// Convert all inputs with initial text to a printer friendly format
		parsedText = makePrintableInput(parsedText, showAnswers);
		
		// Convert all dropdowns to a printer-friendly format
		parsedText = makePrintableDropdowns(parsedText, showAnswers);
		
		String result = "<div class=\"printable_ic_text\" id=\"" + model.getId() +"\">" + parsedText + "</div>";
		result = PrintableContentParser.addClassToPrintableModule(result, className, !model.isSplitInPrintBlocked());
		return result;
	}

	private Map<String, String> getAnswersFromPrintableState() {
		HashMap<String, String> printableState = model.getPrintableState();
		if (printableState != null) {
			String answersString = printableState.get("values");

			IJsonServices jsonServices = new JsonServices();
			Map<String, String> answersMap = jsonServices.decodeHashMap(answersString);

			return answersMap;
		}
		return null;
	}
	
	private String makePrintableInput(String parsedText, boolean showAnswers) {
		HTML html = new HTML(parsedText);

		ArrayList<Element> gaps = new ArrayList<Element>();

		if (this.model.hasDraggableGaps()) {
			NodeList<Element> spans = html.getElement().getElementsByTagName("span");
			for (int i = 0; i < spans.getLength(); i++) {
				Element span = spans.getItem(i);
				if (span.getClassName().indexOf("ic_draggableGap") != -1) {
					gaps.add(span);
				}
			}
		} else {
			NodeList<Element> inputs = html.getElement().getElementsByTagName("input");
			for (int i = 0; i < inputs.getLength(); i++) {
				gaps.add(inputs.getItem(i));
			}
		}

		for (int i = 0; i < gaps.size(); i++) {
			Element input = gaps.get(i);
			String oldValue = input.getString();
			Element span = DOM.createSpan();
			
			span.addClassName("printable_gap");
			span.setAttribute("style", "border-bottom: 1px solid;");
			
			GapInfo gapInfo = model.getGapInfos().get(i);
			Iterator<String> answers = gapInfo.getAnswers();
			String userAnswer = null;
			String value = "";
			String longestAnswer = "";

			if (this.userAnswers != null) {
				userAnswer = this.userAnswers.get(gapInfo.getId());
				if (userAnswer == null) {
					userAnswer = "";
				}

				if (showAnswers) {
					value = userAnswer;
				}
				longestAnswer = userAnswer;
			} else {
				do {
					String nextAnswer = answers.next();
					if (showAnswers && value.length() == 0) {
						value = nextAnswer;
					}
					if (nextAnswer.length() > longestAnswer.length()) {
						longestAnswer = nextAnswer;
					}
				} while (answers.hasNext());
			}
			
			if (longestAnswer.length() == 0) longestAnswer = "&nbsp;&nbsp;&nbsp;";
			
			String placeholder = input.getAttribute("placeholder");
			if(placeholder.length() > 0 && !showAnswers) {
				value = placeholder;
			}

			float gapWidth = 0;
			if (model.getGapWidth() > 0) {
				gapWidth = model.getGapWidth();
			} else {
				gapWidth = getTextWidthInPixels(longestAnswer);
			}
			float valueWidth = 0;
			if (value.length() > 0) {
				valueWidth = getTextWidthInPixels(value);
			}

			int spaceCount = (int) Math.ceil((gapWidth - valueWidth) / this.spaceSize);
			int maxSplitFreeWidth = 50; //must be at least minSplitSize * 2
			int minSplitSize = 20;
			if (spaceCount > maxSplitFreeWidth) {
				// If the gap is more than 50 spaces wide,
				// it will break into lines, with no part smaller than minSplitSize
				for (int j = 0; j < minSplitSize; j++) {
					value += "&nbsp;";
				}

				boolean nextNbsp = false;
				for (int j = 0; j < spaceCount - minSplitSize * 2; j++) {
					if (nextNbsp) {
						value += "&nbsp;";
					} else {
						value += " ";
					}
					nextNbsp = !nextNbsp;
				}

				for (int j = 0; j < minSplitSize; j++) {
					value += "&nbsp;";
				}
			} else {
				for (int j = 0; j < spaceCount; j++) {
					value += "&nbsp;";
				}
			}

			span.setInnerHTML(value);	
			String newValue = "&nbsp;" + span.getString();

			if (this.userAnswers != null && showAnswers) {
				do {
					if (userAnswer.equals(answers.next())) {
						newValue += " ✔ ";
						break;
					}
					if (!answers.hasNext()) {
						newValue += " ✘ ";
						break;
					}
				} while (answers.hasNext());
			}

			parsedText = parsedText.replace(oldValue, newValue);
		}

		return parsedText;
	}
	
	private String makePrintableDropdowns(String parsedText, boolean showAnswers) {
		HTML html = new HTML(parsedText);
		
		NodeList<Element> selects = html.getElement().getElementsByTagName("select");
		for (int i = 0; i < selects.getLength(); i++) {
			Element select = selects.getItem(i);
			NodeList<Element> options = select.getElementsByTagName("option");
			
			String values = "";
			JavaScriptUtils.log("C");
			if (this.userAnswers != null && showAnswers) {
				InlineChoiceInfo choiceInfo = model.getChoiceInfos().get(i);

				values = this.userAnswers.get(choiceInfo.getId());
				if (values.equals(choiceInfo.getAnswer())) {
					values += " ✔ ";
				} else {
					values += " ✘ ";
				}
			} else {
				for (int j = 0; j < options.getLength(); j++) {
					Element option = options.getItem(j);
					String value = option.getInnerText();
					if (!value.equals("---")) {
						if (showAnswers) {
							InlineChoiceInfo choiceInfo = model.getChoiceInfos().get(i);
							if (choiceInfo.getAnswer().equals(value)) {
								value = "<u>" + value + "</u>";
							}
						}
						values += value;
						if (j + 1 != options.getLength()) {
							values += " / ";
						}
					}
				}
			}
			
			Element span = DOM.createSpan();
			span.addClassName("printable_dropdown");
			span.setInnerHTML(values);
			parsedText = parsedText.replace(select.getString(), span.getString());
		}
		return parsedText;
	}
	
	private native float getTextWidthInPixels(String html) /*-{
		var $_ = $wnd.$;
		var $wrapper = $_("<div></div>");
		var $outerLessonWrapper = $_("<div></div>");
		$outerLessonWrapper.css("position", "absolute");
		$outerLessonWrapper.css("visibility", "hidden");
		$outerLessonWrapper.addClass("printable_lesson");

		var $outerPageWrapper = $_("<div></div>");
		$outerPageWrapper.addClass("printable_page");
		$outerLessonWrapper.append($outerPageWrapper);

		var $outerModuleWrapper = $_("<div></div>");
		$outerModuleWrapper.addClass("printable_module");
		$outerModuleWrapper.addClass("printable_ic_text");
		$outerPageWrapper.append($outerModuleWrapper);

		$wrapper.css("margin", "0px");
		$wrapper.css("padding", "0px");
		$wrapper.addClass("printable_gap");
		$wrapper.html(html);
		$outerModuleWrapper.append($wrapper);

		$_("body").append($outerLessonWrapper);
		var width = $wrapper[0].getBoundingClientRect().width;
		$wrapper.detach();
		return width;
	}-*/;
}
