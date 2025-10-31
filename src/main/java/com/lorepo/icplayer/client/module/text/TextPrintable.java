package com.lorepo.icplayer.client.module.text;

import java.util.HashMap;
import java.util.Iterator;
import java.util.ArrayList;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.NodeList;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;
import com.lorepo.icplayer.client.printable.PrintableController;

public class TextPrintable {

	private TextModel model = null;
	private float spaceSize = 0;
	PrintableController controller = null;

	public TextPrintable(TextModel model) {
		this.model = model;
		this.spaceSize = getTextWidthInPixels("&nbsp;");
	}

	public void setPrintableController(PrintableController controller) {
	    this.controller = controller;
	}
	
	public String getPrintableHTML(String className, boolean showAnswers) {
		if (model.getPrintable() == PrintableMode.NO) {
			return null;
		}

		String parsedText = model.parsedText;

		parsedText = removeTextAudio(parsedText);

		// Convert all inputs with initial text to a printer friendly format
		parsedText = makePrintableInput(parsedText, showAnswers);

		// Convert all dropdowns to a printer-friendly format
		parsedText = makePrintableDropdowns(parsedText, showAnswers);

		parsedText = makePrintableMathInput(parsedText, showAnswers);

		String result = "<div class=\"printable_ic_text\" id=\"" + model.getId() +"\">" + parsedText + "</div>";
		result = PrintableContentParser.addClassToPrintableModule(result, className, !model.isSplitInPrintBlocked());
		return result;
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
				Element input = inputs.getItem(i);
				if (input.getClassName().indexOf("ic_addon_gap") == -1) {
					gaps.add(input);
				}
			}
		}

		for (int i = 0; i < gaps.size(); i++) {
			Element input = gaps.get(i);
			String oldValue = input.getString();
			GapInfo gapInfo = model.getGapInfos().get(i);
			String placeholder = input.getAttribute("placeholder");
			String newValue = createPrintableGap(gapInfo, placeholder, showAnswers);

			parsedText = parsedText.replace(oldValue, newValue);
		}

		return parsedText;
	}

	private boolean hasElementTypeOfButton(Element element) {
	    return element.hasAttribute("type") && element.getAttribute("type").equals("button");
	}

	private String removeTextAudio(String parsedText) {
	    parsedText = removeTextAudioInfo(parsedText);
	    parsedText = removeTextAudioAudio(parsedText);
	    return parsedText;
	}

	private String removeTextAudioInfo(String parsedText) {
	    HTML html = new HTML(parsedText);
	    NodeList<Element> inputs
	        = html.getElement().getElementsByTagName("input");
	    for (int i = 0; i < inputs.getLength(); i++) {
            Element item = inputs.getItem(i);
            if (hasElementTypeOfButton(item)) {
                String oldValue = item.getString();
			    parsedText = parsedText.replace(oldValue, "");
            }
        }
		return parsedText;
	}

	private String removeTextAudioAudio(String parsedText) {
	    HTML html = new HTML(parsedText);
	    NodeList<Element> audioElements
	        = html.getElement().getElementsByTagName("audio");
	    for (int i = 0; i < audioElements.getLength(); i++) {
            Element item = audioElements.getItem(i);
            String oldValue = item.getString();
			parsedText = parsedText.replace(oldValue, "");
        }

		return parsedText;
	}

	private String createPrintableGap(GapInfo gapInfo, String placeholder, boolean showAnswers) {
        String gapScriptId = "";
        if (gapInfo.getId().split("-").length == 2) {
            gapScriptId = model.getId() + "." + gapInfo.getId().split("-")[1];
        }
		Element span = DOM.createSpan();

		span.setAttribute("style", "border-bottom: 1px solid;");
		span.setId(gapInfo.getId());
		span.addClassName("printable_gap");

		Iterator<String> answers = gapInfo.getAnswers();
		String userAnswer = null;
		String value = "";
		String longestAnswer = "";
		String nextAnswer = "";
		HashMap<String, String> printableState = model.getPrintableState();

		if (printableState != null) {
			userAnswer = printableState.get(gapInfo.getId());

			if (userAnswer != null) {
				value = userAnswer;
			} else {
				userAnswer = "";
			}
			longestAnswer = userAnswer;
		} else {
		    if (controller != null && showAnswers && gapScriptId.length() > 0) {
		        String calculatedAnswer = controller.getCalculatedGapAnswer(gapScriptId);
		        if (calculatedAnswer != null) {
		            value = calculatedAnswer;
		            longestAnswer = calculatedAnswer;
		        }
		    }
			do {
				nextAnswer = answers.next();
				if (showAnswers && value.length() == 0) {
					value = nextAnswer;
				}
				if (nextAnswer.length() > longestAnswer.length()) {
					longestAnswer = nextAnswer;
				}
			} while (answers.hasNext());
		}

		if (longestAnswer.length() == 0) longestAnswer = "&nbsp;&nbsp;&nbsp;";

		if(placeholder.length() > 0 && value.length() == 0 && (!showAnswers || (showAnswers && printableState != null))) {
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
		if (userAnswer != null && userAnswer.length() > 0 && showAnswers) {
		    boolean isCorrect;
		    if (controller != null && gapScriptId.length() > 0 && controller.hasCalculatedGapCorrect(gapScriptId)) {
		        isCorrect = controller.getCalculatedGapCorrect(gapScriptId);
		    } else {
		        isCorrect = gapInfo.isCorrect(userAnswer);
		    }
			if (isCorrect) {
                span.addClassName("ic_text-correct-answer");
            } else {
                span.addClassName("ic_text-wrong-answer");
            }
		}

		if (model.hasDraggableGaps()) {
		    TextParser parser = new TextParser();
		    value = parser.parseAltText(value);
        }

		span.setInnerHTML(value);
		String newValue = "&nbsp;" + span.getString();

		return newValue;
	}

	private String makePrintableMathInput(String parsedText, boolean showAnswers) {
		if (!model.hasMathGaps()) return parsedText;
		Element replacementWrapper = DOM.createDiv();
		String innerHTML = "";
		replacementWrapper.addClassName("math-gap-replacement-wrapper");
		for (GapInfo gapInfo: model.getGapInfos()) {
			innerHTML += createPrintableGap(gapInfo, gapInfo.getPlaceHolder(), showAnswers);
		}
		replacementWrapper.setInnerHTML(innerHTML);
		parsedText += replacementWrapper.getString();
		return parsedText;
	}
	
	private String makePrintableDropdowns(String parsedText, boolean showAnswers) {
		HTML html = new HTML(parsedText);

		NodeList<Element> selects = html.getElement().getElementsByTagName("select");
		for (int i = 0; i < selects.getLength(); i++) {
			Element select = selects.getItem(i);
			Element span = DOM.createSpan();
			NodeList<Element> options = select.getElementsByTagName("option");
			HashMap<String, String> printableState = model.getPrintableState();

			String values = "";
			String userAnswer = "";
			InlineChoiceInfo choiceInfo = model.getChoiceInfos().get(i);
			if (printableState != null) {
				userAnswer = printableState.get(choiceInfo.getId());
			}

			for (int j = 0; j < options.getLength(); j++) {
				Element option = options.getItem(j);
				String value = option.getInnerText();
				if (!value.equals("---")) {
					if (userAnswer == null || userAnswer.length() == 0) {
						if (showAnswers && printableState == null) {
							if (choiceInfo.getAnswer().equals(value)) {
								Element underlined = DOM.createElement("u");
								underlined.setInnerHTML(value);
								value = underlined.getString();
							}
						}
					} else {
						if (value.equals(userAnswer)) {
							Element underlined = DOM.createElement("u");
							underlined.setInnerHTML(value);
							value = underlined.getString();
							if (showAnswers) {
								Element answerSpan = DOM.createSpan();
								answerSpan.setInnerHTML(value);
								if (choiceInfo.getAnswer().equals(userAnswer)) {
									answerSpan.addClassName("ic_text-correct-answer");
								} else {
									answerSpan.addClassName("ic_text-wrong-answer");
								}
								value = answerSpan.getString();
							}
						}

					}
					values += value;
					if (j + 1 != options.getLength()) {
						values += " / ";
					}
				}
			}

			span.addClassName("printable_dropdown");

			span.setInnerHTML(values);
			parsedText = parsedText.replace(select.getString(), span.getString());
		}
		return parsedText;
	}

	public static native float mathJaxPostProcessing(JavaScriptObject wrapper) /*-{
			$wnd.$('.math-gap-replacement-wrapper').each(function(){
			var $this = $wnd.$(this);
			var $moduleParent = $this.closest('.printable_module');
			$this.find('.printable_gap').each(function(){
				if (this.id) {
					var mathGap = $moduleParent.find('input#'+this.id);
					if (mathGap.length > 0) {
						mathGap[0].replaceWith(this);
					}
				}
			});
			$this.remove();
		});
	}-*/;
	
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
		$outerLessonWrapper.remove();
		return width;
	}-*/;
}
