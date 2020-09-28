package com.lorepo.icplayer.client.module.ordering;

import com.lorepo.icplayer.client.PrintableContentParser;

public class OrderingPrintable {

	OrderingModule model = null;
	
	public OrderingPrintable(OrderingModule model) {
		this.model = model;
	}
	
	public String getPrintableHTML(String className, boolean showAnswers) {
		for (int i = 0; i < model.getItemCount(); i++) {
			OrderingItem item = model.getItem(i);
			item.getText();
		}
		String result = "<div>HELLO WORLD ORDERING</div>";
		result = PrintableContentParser.addClassToPrintableModule(result, className);
		return result;
	}
	
}
