package com.lorepo.icplayer.client.module.choice;

import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Random;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.PrintableController;
import com.lorepo.icplayer.client.printable.Printable.PrintableStateMode;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

public class ChoicePrintable {

	private ChoiceModel model = null;
	private PrintableController controller = null;
	private PrintableStateMode printableStateMode = null;
	private ArrayList<ChoicePrintableOption> printableOptions
			= new ArrayList<ChoicePrintableOption>();

	public ChoicePrintable(ChoiceModel model, PrintableController controller) {
		this.model = model;
		this.controller = controller;
	}
	
	public String getPrintableHTML(String className, boolean showAnswers) {
		if (model.getPrintable() == PrintableMode.NO) return null;

		chosePrintableStateMode(showAnswers);
		initPrintableOptions();
		if (printableStateExist())
			configurePrintableOptionsBaseOnPrintableState();

		Element orderedList = createOrderedListWithElements();
		Element printableClassWrapper = createPrintableClassWrapper();
		printableClassWrapper.appendChild(orderedList);

		return PrintableContentParser.addClassToPrintableModule(
				printableClassWrapper.getString(), className);
	}

	private void chosePrintableStateMode(boolean showMode) {
		HashMap<String, String> printableState = model.getPrintableState();
		boolean isPrintableStateExist =
				(printableState != null
						&& printableState.containsKey("options"));
		if (isPrintableStateExist){
			if (showMode)
				this.printableStateMode = PrintableStateMode.CHECK_ANSWERS;
			else
				this.printableStateMode = PrintableStateMode.SHOW_USER_ANSWERS;
		} else {
			if (showMode)
				this.printableStateMode = PrintableStateMode.SHOW_ANSWERS;
			else
				this.printableStateMode = PrintableStateMode.EMPTY;
		}
	}

	private void initPrintableOptions() {
		for (ChoiceOption option: model.getOptions()) {
			ChoicePrintableOption printableOption
					= new ChoicePrintableOption(option);
			this.printableOptions.add(printableOption);
		}
	}

	private boolean printableStateExist() {
		return (this.printableStateMode == PrintableStateMode.SHOW_USER_ANSWERS
				|| this.printableStateMode == PrintableStateMode.CHECK_ANSWERS);
	}

	private void configurePrintableOptionsBaseOnPrintableState() {
		boolean[] selected = getOptionsIsDownStatusFromPrintableState();
		if (selected.length != printableOptions.size())
			throw new IllegalStateException();

		for (int i = 0; i < printableOptions.size(); i++){
			ChoicePrintableOption printableOption = printableOptions.get(i);
			printableOption.setIsDown(selected[i]);
		}
	}

	private boolean[] getOptionsIsDownStatusFromPrintableState() {
		HashMap<String, String> printableState = model.getPrintableState();
		String optionsState = printableState.get("options");
		boolean[] optionsIsDownStatus = new boolean[optionsState.length()];

		for (int i = 0; i < optionsState.length(); i++)
			optionsIsDownStatus[i] = optionsState.charAt(i) == '1';
		return optionsIsDownStatus;
	}

	private Element createOrderedListWithElements() {
		ArrayList<Element> listElements
				= createPrintableOptionHTMLWrappedInListElement();
		if (model.isRandomOrder())
			randomizeOrder(listElements);
		return wrapToOrderedList(listElements);
	}

	private ArrayList<Element> createPrintableOptionHTMLWrappedInListElement() {
		ArrayList<Element> listElements = new ArrayList<Element>();

		for (ChoicePrintableOption printableOption: printableOptions) {
			Element element = printableOption.toPrintableDOMElement(
					this.printableStateMode);

			Element listElement = DOM.createElement("li");
			listElement.setId(getPrintableOptionViewId(printableOption));
			listElement.appendChild(element);
			listElements.add(listElement);
		}
		return listElements;
	}

	private String getPrintableOptionViewId(
			ChoicePrintableOption printableOption) {
		String ID = printableOption.getID();
		return model.getId() + "_ic_option_" + ID;
	}

	private void randomizeOrder(ArrayList<Element> elements) {
		for(int index = 0; index < elements.size(); index += 1) {
			int secondElementIndex = index + nextInt(elements.size() - index);
			Collections.swap(elements, index, secondElementIndex);
		}
	}

	private Element wrapToOrderedList(ArrayList<Element> elements) {
		Element wrapper = DOM.createElement("ol");
		wrapper.setAttribute("type", "A");
		for (Element element: elements)
			wrapper.appendChild(element);
		return wrapper;
	}

	private Element createPrintableClassWrapper() {
		Element wrapper = DOM.createDiv();
		wrapper.setClassName("printable_ic_choice");
		wrapper.setId(this.model.getId());
		return wrapper;
	}

	private int nextInt(int upperBound) {
		if (controller != null)
			return controller.nextInt(upperBound);
		return Random.nextInt(upperBound);
	}
}
