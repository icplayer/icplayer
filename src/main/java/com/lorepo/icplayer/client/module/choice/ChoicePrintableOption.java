package com.lorepo.icplayer.client.module.choice;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.lorepo.icplayer.client.printable.Printable.PrintableStateMode;

public class ChoicePrintableOption {

    private ChoiceOption option = null;
    private boolean isSelected = false;

    public ChoicePrintableOption(ChoiceOption option) {
        this.option = option;
    }

    public String getID() {
        return this.option.getID();
    }

    public void setIsDown(boolean isDown) {
        this.isSelected = isDown;
    }

    public Element toPrintableDOMElement(PrintableStateMode mode) {
        switch (mode) {
            case EMPTY:
                return toPrintableDOMElementWhenEmptyMode();
            case SHOW_ANSWERS:
                return toPrintableDOMElementWhenShowAnswersMode();
            case SHOW_USER_ANSWERS:
                return toPrintableDOMElementWhenShowUserAnswersMode();
            case CHECK_ANSWERS:
                return toPrintableDOMElementWhenCheckAnswersMode();
            default:
                throw new IllegalArgumentException();
        }
    }

    private Element toPrintableDOMElementWhenEmptyMode() {
        Element element = DOM.createDiv();
        setOptionTextAsInnerHTMLToElement(element);
        element.setClassName("ic_poption-up");
        return element;
    }

    private Element toPrintableDOMElementWhenShowAnswersMode() {
        Element element = DOM.createDiv();
        String className;
        if (this.option.isCorrect()) {
            className = "ic_poption-correct-answer";
            setOptionTextAndValueAsInnerHTMLToElement(element);
        } else {
            className = "ic_poption-up";
            setOptionTextAsInnerHTMLToElement(element);
        }
        element.setClassName(className);
        return element;
    }

    private Element toPrintableDOMElementWhenShowUserAnswersMode() {
        Element element = DOM.createDiv();
        setOptionTextAsInnerHTMLToElement(element);
        String className = getElementClassNameWhenShowUserAnswersMode();
        element.setClassName(className);
        return element;
    }

    private String getElementClassNameWhenShowUserAnswersMode() {
        if (this.isSelected)
            return "ic_poption-down";
        return "ic_poption-up";
    }

    private Element toPrintableDOMElementWhenCheckAnswersMode() {
        Element element = DOM.createDiv();
        setOptionTextAsInnerHTMLToElement(element);
        String className = getElementClassNameWhenCheckAnswersMode();
        element.setClassName(className);
        return element;
    }

    private String getElementClassNameWhenCheckAnswersMode() {
        if (this.isSelected) {
            if (this.option.isCorrect())
                return "ic_poption-down-correct";
            return "ic_poption-down-wrong";
        } else
            return "ic_poption-up";
    }

    private void setOptionTextAsInnerHTMLToElement(Element el) {
        String text = option.getText();
        el.setInnerText(text);
    }

    private void setOptionTextAndValueAsInnerHTMLToElement(Element el) {
        String text = option.getText();
        String value = Integer.toString(option.getValue());
        String result = text + " (" + value + ")";
        el.setInnerText(result);
    }
}
