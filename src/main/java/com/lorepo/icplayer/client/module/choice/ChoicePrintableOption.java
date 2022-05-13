package com.lorepo.icplayer.client.module.choice;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.lorepo.icplayer.client.model.alternativeText.AlternativeTextService;
import com.lorepo.icplayer.client.printable.Printable.PrintableStateMode;

public class ChoicePrintableOption {

    private ChoiceOption option = null;
    private boolean isSelected = false;
    private final String AUDIO_REGEX = "\\\\audio\\{\\S+?\\}";

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
        String text = getPreprocessedText();
        text = AlternativeTextService.getVisibleText(text);
        el.setInnerHTML(text);
    }

    private void setOptionTextAndValueAsInnerHTMLToElement(Element el) {
        String text = getPreprocessedText();
        String value = Integer.toString(option.getValue());
        String result = text + " (" + value + ")";
        result = AlternativeTextService.getVisibleText(result);
        el.setInnerHTML(result);
    }

    private String getPreprocessedText() {
       String text = option.getText();
       return text.replaceAll(AUDIO_REGEX, "");
    }
}
