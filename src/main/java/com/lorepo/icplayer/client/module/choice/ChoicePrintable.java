package com.lorepo.icplayer.client.module.choice;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.google.gwt.user.client.Random;
import com.lorepo.icplayer.client.module.Printable.PrintableMode;

public class ChoicePrintable {

	ChoiceModel model = null;
	
	public ChoicePrintable(ChoiceModel model) {
		this.model = model;
	}
	
	public String getPrintableHTML(boolean showAnswers) {
		if (model.getPrintable() == PrintableMode.NO) return null;
		
		ArrayList<ChoiceOption> orderedOptions = new ArrayList<ChoiceOption>();
		for (int i = 0; i < model.getOptionCount(); i++) {
			orderedOptions.add(model.getOption(i));
		}
		
		if (model.isRandomOrder()) {
			for(int index = 0; index < orderedOptions.size(); index += 1) {  
			    Collections.swap(orderedOptions, index, index + Random.nextInt(orderedOptions.size() - index));  
			}
		}
		
		List<String> optionHTMLs = new ArrayList<String>();
		for (ChoiceOption option: orderedOptions) {
			String optionHTML = createPrintableOption(option, showAnswers);
			optionHTMLs.add(optionHTML);
		}
		
		String result = "<div class=\"ic_choice printable_module\" id=\"" + model.getId() +"\"><ol type=\"A\">";
		for (String optionHTML: optionHTMLs) {
			result += optionHTML;
		}
		result += "</ol></div>";
		
		return result;
	}
	
	private String createPrintableOption(ChoiceOption option, boolean showAnswers) {
		String optionHTML = "";
		if (showAnswers && option.getValue() > 0) {
			optionHTML += "<li><u>";
			optionHTML += option.getText();
			optionHTML += "</u> (" + Integer.toString(option.getValue()) + ")";
			optionHTML += "</li>";
		} else {
			optionHTML += "<li>";
			optionHTML += option.getText();
			optionHTML += "</li>";
		}
		return optionHTML;
	}
}
