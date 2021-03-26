package com.lorepo.icplayer.client.module.choice;

import com.google.gwt.user.client.Random;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.PrintableController;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

public class ChoicePrintable {

	ChoiceModel model = null;
	PrintableController controller = null;
	
	public ChoicePrintable(ChoiceModel model, PrintableController controller) {
		this.model = model;
		this.controller = controller;
	}
	
	public String getPrintableHTML(String className, boolean showAnswers) {
		if (model.getPrintable() == PrintableMode.NO) return null;

		HashMap<String, String> printableState = model.getPrintableState();
		List<String> optionsHTMLs;
		if (printableState != null && printableState.containsKey("options")) {
			optionsHTMLs = getStyledOptionsIfPrintableState(showAnswers, printableState);
		}
		else {
			optionsHTMLs = getStyledOptionsIfNotPrintableState(showAnswers);
		}

		if (model.isRandomOrder()) {
			for(int index = 0; index < optionsHTMLs.size(); index += 1) {
				Collections.swap(optionsHTMLs, index, index + Random.nextInt(optionsHTMLs.size() - index));
			}
		}

		String result = "<div class=\"printable_ic_choice\" id=\"" + model.getId() +"\"><ol type=\"A\">";
		for (String optionHTML: optionsHTMLs) {
			result += optionHTML;
		}
		result += "</ol></div>";
		result = PrintableContentParser.addClassToPrintableModule(result, className);

		return result;
	}

	private List<String> getStyledOptionsIfPrintableState(boolean showAnswers, HashMap<String, String> printableState) {
		ArrayList<ChoiceOption> orderedOptions = new ArrayList<ChoiceOption>();
		ArrayList<Boolean> orderedIsSelectedOptions = new ArrayList<Boolean>();

		List<String> optionHTMLs = new ArrayList<String>();

		String optionState = printableState.get("options");
		for (int i = 0; i < model.getOptionCount() &&  i < optionState.length(); i++) {
			orderedOptions.add(model.getOption(i));
			Boolean value = (optionState.charAt(i) == '1');
			orderedIsSelectedOptions.add(value);
		}
		if (orderedIsSelectedOptions.size() != orderedOptions.size()) {
			return optionHTMLs;
		}

		for (int i = 0; i < orderedOptions.size(); i++) {
			ChoiceOption option = orderedOptions.get(i);
			Boolean isDown = orderedIsSelectedOptions.get(i);
			String optionHTML = createPrintableOptionIfSetState(option, showAnswers, isDown);
			optionHTMLs.add(optionHTML);
		}

		return optionHTMLs;
	}

	private String createPrintableOptionIfSetState(ChoiceOption option, boolean showAnswers, Boolean isDown) {
		String className = "";
		String innerText = "";
		String text = option.getText();
		if (showAnswers) {
			if (isDown) {
				if (option.getValue() > 0) {
					className = "ic_poption-down-correct-answer";
				} else {
					className = "ic_poption-down-wrong-answer";
				}
				innerText = "<div class=\"" + className + "\">" + text + "</div>";
			} else {
				innerText = text;
			}
		} else {
			if (isDown) {
				className = "ic_poption-down-answer";
				innerText = "<div class=\"" + className + "\">" + text + "</div>";
			} else {
				innerText = text;
			}
		}
		String optionHTML = "<li id=\"" + getOptionViewId(option) + "\">";
		optionHTML += innerText;
		optionHTML += "</li>";
		return optionHTML;
	}

	private List<String> getStyledOptionsIfNotPrintableState(boolean showAnswers) {
		ArrayList<ChoiceOption> orderedOptions = new ArrayList<ChoiceOption>();

		List<String> optionHTMLs = new ArrayList<String>();

		for (int i = 0; i < model.getOptionCount(); i++) {
			orderedOptions.add(model.getOption(i));
		}

		for (ChoiceOption option: orderedOptions) {
			String optionHTML = createPrintableOptionIfNotSetState(option, showAnswers);
			optionHTMLs.add(optionHTML);
		}
		return optionHTMLs;
	}
	
	private String createPrintableOptionIfNotSetState(ChoiceOption option, boolean showAnswers) {
		String text = option.getText();
		String className = "";
		String innerText = "";
		if (showAnswers && option.getValue() > 0) {
			text += " (" + Integer.toString(option.getValue()) + ")" ;
			className = "ic_poption-correct-answer";
			innerText = "<div class=\"" + className + "\">" + text + "</div>";
		} else {
			innerText = text;
		}
		String optionHTML = "<li id=\"" + getOptionViewId(option) + "\">";
		optionHTML += innerText;
		optionHTML += "</li>";
		return optionHTML;
	}
	
	private String getOptionViewId(ChoiceOption option) {
		return model.getId() + "_ic_option_" + option.getID();
	}
	
	private int nextInt(int upperBound) {
		int result = 0;
		if (controller != null) {
			result = controller.nextInt(upperBound);
		} else {
			result = Random.nextInt(upperBound);
		}
		return result;
	}
}
