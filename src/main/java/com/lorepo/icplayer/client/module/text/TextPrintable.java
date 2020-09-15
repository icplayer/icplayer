package com.lorepo.icplayer.client.module.text;

import java.util.Iterator;

import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.NodeList;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icplayer.client.PrintableContentParser;
import com.lorepo.icplayer.client.module.Printable.PrintableMode;

public class TextPrintable {
	
	private TextModel model = null;
	
	public TextPrintable(TextModel model) {
		this.model = model;
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
			input.setAttribute("style", "border-width:0px; border-bottom-width:1px");
			
			GapInfo gapInfo = model.getGapInfos().get(i);
			Iterator<String> answers = gapInfo.getAnswers();
			String value = "";
			int gapSize = 0;
			do {
				String nextAnswer = answers.next();
				if (showAnswers) {
					value += nextAnswer;
					if (answers.hasNext()) {
						value += ", ";
					} else {
						gapSize = value.length();
					}
				} else {
					if (nextAnswer.length() > value.length()) {
						gapSize = value.length();
					}
				}
			} while(answers.hasNext());	
			input.setAttribute("value", value);
			input.setAttribute("size", Integer.toString(value.length()));
			
			String placeholder = input.getAttribute("placeholder");
			if(placeholder.length() > 0) {
				input.setAttribute("placeholder", "");
			}
			
			String newValue = input.getString();
			
			if (placeholder.length() > 0) {
				newValue = placeholder + newValue;
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
			
			String values = "[";
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
						values += " \\ ";
					}
				}
			}
			values += "]";
			parsedText = parsedText.replace(select.getString(), values);
		}
		return parsedText;
	}
}
