package com.lorepo.icplayer.client.module.text;

import java.util.Iterator;

import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.NodeList;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;

public class TextPrintable {
	
	private TextModel model = null;
	private float spaceSize = 0;
	
	public TextPrintable(TextModel model) {
		this.model = model;
		this.spaceSize = getTextWidthInPixels("&nbsp;");
	}
	
	public String getPrintableHTML(String className, boolean showAnswers) {
		if (model.getPrintable() == PrintableMode.NO) {
			return null;
		}

		String parsedText = model.parsedText;
		
		// Convert all inputs with initial text to a printer friendly format
		parsedText = makePrintableInput(parsedText, showAnswers);
		
		// Convert all dropdowns to a printer-friendly format
		parsedText = makePrintableDropdowns(parsedText, showAnswers);
		
		String result = "<div class=\"printable_ic_text\" id=\"" + model.getId() +"\">" + parsedText + "</div>";
		result = PrintableContentParser.addClassToPrintableModule(result, className);
		return result;
	}
	
	private String makePrintableInput(String parsedText, boolean showAnswers) {
		HTML html = new HTML(parsedText);
		
		NodeList<Element> inputs = html.getElement().getElementsByTagName("input");
		for (int i = 0; i < inputs.getLength(); i++) {
			Element input = inputs.getItem(i);
			String oldValue = input.getString();
			Element span = DOM.createSpan();
			
			span.addClassName("printable_gap");
			span.setAttribute("style", "border-bottom: 1px solid;");
			
			GapInfo gapInfo = model.getGapInfos().get(i);
			Iterator<String> answers = gapInfo.getAnswers();
			String value = "";
			String longestAnswer = "";
			do {
				String nextAnswer = answers.next();
				if (showAnswers) {
					value += nextAnswer;
					if (answers.hasNext()) {
						value += ", ";
					} else {
						longestAnswer = value;
					}
				} else {
					if (nextAnswer.length() > longestAnswer.length()) {
						longestAnswer = nextAnswer;
					}
				}
			} while(answers.hasNext());	
			
			if (longestAnswer.length() == 0) longestAnswer = "&nbsp;&nbsp;&nbsp;";
			
			String placeholder = input.getAttribute("placeholder");
			if(placeholder.length() > 0 && !showAnswers) {
				value = placeholder;
			}
			
			if (!showAnswers) {
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
			}

			span.setInnerHTML(value);	
			String newValue = " " + span.getString();
			
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
		$wrapper.css("position", "absolute");
		$wrapper.css("visibility", "hidden");
		$wrapper.css("margin", "0px");
		$wrapper.css("padding", "0px");
		$wrapper.addClass("printable_gap");
		$wrapper.html(html);
		$_("body").append($wrapper);
		var width = $wrapper[0].getBoundingClientRect().width;
		$wrapper.detach();
		return width;
	}-*/;
}
