package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.Node;
import com.google.gwt.dom.client.NodeList;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.module.text.TextPresenter.NavigationTextElement;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;


public class WCAGUtils {
	final static String GAP_START = "\\gap{";
	final static String GAP_END = "}";
	final static String FILLED_GAP_START = "\\filledGap{";
	final static String FILLED_GAP_END = GAP_END;
	final static String DROP_DOWN_GAP_START = "{{";
	final static String DROP_DOWN_GAP_END = "}}";
	public final static String BREAK_TEXT = "&&break&&";
	final static String LINK_START = "start-link";
	final static String LINK_END = "end-link";
	
	private static int getMinPositiveNumber (int n1, int n2, int n3, int n4, int n5) {
		boolean overwritten = false;
		int i = -1;
		if(n1 >= 0) {
			i = n1;
			overwritten = true;
		}

		if(n2 >= 0 && (!overwritten || n2 < i)) {
			i = n2;
			overwritten = true;
		}

		if(n3 >= 0 && (!overwritten || n3 < i)) {
			i = n3;
			overwritten = true;
		}

		if(n4 >= 0 && (!overwritten || n4 < i)) {
			i = n4;
			overwritten = true;
		}

		if(n5 >= 0 && (!overwritten || n5 < i)) {
			i = n5;
			overwritten = true;
		}

		return i;
	}
	
	private static int getMinPositiveNumber (int n1, int n2, int n3, int n4) {
		boolean overwritten = false;
		int i = -1;
		if(n1 >= 0) {
			i = n1;
			overwritten = true;
		}

		if(n2 >= 0 && (!overwritten || n2 < i)) {
			i = n2;
			overwritten = true;
		}

		if(n3 >= 0 && (!overwritten || n3 < i)) {
			i = n3;
			overwritten = true;
		}

		if(n4 >= 0 && (!overwritten || n4 < i)) {
			i = n4;
			overwritten = true;
		}
		
		return i;
	}
	
	private static NavigationTextElement getElement (ArrayList<NavigationTextElement> textElements, int index) {
		if (index >= 0 && index < textElements.size()) {
			return textElements.get(index);
		}
		
		return null;
	}
	
	private static String getElementTextElementContent (NavigationTextElement element) {
		if (element.getElementType() == "link") {
			return "";
		}
		TextElementDisplay _element = (TextElementDisplay) element;
		return _element != null ? _element.getWCAGTextValue() : "";
	}
	
	// TODO change to ENUM
	private static TextToSpeechVoice getElementStatus (TextElementDisplay element, TextModel model) {
		if (element != null && !element.isWorkingMode()) {
			if (element.getGapState() == 1) {
				return TextToSpeechVoice.create(model.getSpeechTextItem(TextModel.CORRECT_INDEX));
			}
			
			if (element.getGapState() == 2) {
				return TextToSpeechVoice.create(model.getSpeechTextItem(TextModel.WRONG_INDEX));
			}
			
			if (element.getGapState() == 3) {
				return TextToSpeechVoice.create(model.getSpeechTextItem(TextModel.EMPTY_INDEX));
			}
		}
		
		return TextToSpeechVoice.create();
	}
	
	public static String getImageAltTexts(String html){
		String result = html.replaceAll("<[^>]*?img[^>]*?alt=\"(.*?)\"[^<]*?>", " $1 "); //Replace all img nodes containing an alt with that attribute's value
		result = result.replaceAll("<[^>]*?img[^>]*?alt='(.*?)'[^<]*?>", " $1 ");
		return result;	
	}

	public static String getImageAltTextsWithBreaks(String html){
		String result = html.replaceAll("<[^>]*?img[^>]*?alt=\"(.*?)\"[^<]*?>", BREAK_TEXT + " $1 " + BREAK_TEXT); //Replace all img nodes containing an alt with that attribute's value
		result = result.replaceAll("<[^>]*?img[^>]*?alt='(.*?)'[^<]*?>", BREAK_TEXT + " $1 " + BREAK_TEXT);
		return result;	
	}

	public static String addSpacesToListTags (String text) {
	    return text.replaceAll("</li>", ", </li>");
	}

	private static String addListNumbers(String html) {
		JavaScriptUtils.log("addListNumbers");
		JavaScriptUtils.log(html);
		Element wrapper = DOM.createElement("div");
		wrapper.setInnerHTML(html);
		NodeList<Element> ols = wrapper.getElementsByTagName("ol");
		for	(int i = 0; i < ols.getLength(); i++) {
			JavaScriptUtils.log("ol element");
			Node olNode = ols.getItem(i);
			int index = 0;
			for (int j = 0; j < olNode.getChildCount(); j++) {
				JavaScriptUtils.log("ol child");
				Node child =olNode.getChild(j);
				if (child instanceof Element) {
					JavaScriptUtils.log("ol child element");
					Element element = (Element) child;
					JavaScriptUtils.log(element.getTagName());
					if(element.getTagName().toLowerCase().equals("li")) {
						JavaScriptUtils.log("is li");
						index += 1;
						element.setInnerHTML(". "+String.valueOf(index)+". "+element.getInnerHTML());
						JavaScriptUtils.log(index);
					}
				}
			}
		}
		JavaScriptUtils.log(wrapper.getInnerHTML());
		return wrapper.getInnerHTML();
	}

	private static String addListNumbers2(String html) {
		JavaScriptUtils.log("addListNumbers");
		JavaScriptUtils.log(html);
		Element wrapper = DOM.createElement("div");
		wrapper.setInnerHTML(html);
		NodeList<Element> ols = wrapper.getElementsByTagName("li");
		for	(int i = 0; i < ols.getLength(); i++) {
			JavaScriptUtils.log("ol element");
			Node olNode = ols.getItem(i);
			int index = 0;
			for (int j = 0; j < olNode.getChildCount(); j++) {
				JavaScriptUtils.log("ol child");
				Node child =olNode.getChild(j);
				if (child instanceof Element) {
					JavaScriptUtils.log("ol child element");
					Element element = (Element) child;
					JavaScriptUtils.log(element.getTagName());
					if(element.getTagName().toLowerCase().equals("li")) {
						JavaScriptUtils.log("is li");
						index += 1;
						element.setInnerHTML(". "+String.valueOf(index)+". "+element.getInnerHTML());
						JavaScriptUtils.log(index);
					}
				}
			}
		}
		JavaScriptUtils.log(wrapper.getInnerHTML());
		return wrapper.getInnerHTML();
	}

	public static String getCleanText (String text) {
		text = updateLinks(text);
		text = addSpacesToListTags(text);
		text = addListNumbers(text);

		HTML html = new HTML(getImageAltTextsWithBreaks(text));
		final String noHTML = html.getText();
		return noHTML.replaceAll("\\s{2,}", " ").trim(); // remove spaces if more than 1
	}

	private static String updateLinks(String text) {
		if (!text.contains("href")) { 
			return text;
		}

		return text.replaceAll("<a[^>]*?href=\"(.*?)\"*?>(.*?)</a>", LINK_START + " $2 " + LINK_END);
	}

	private static String convertWhitespaceToSpace(String text) {
//      	Whitespace with code \u00a0 (NO-BREAK SPACE) replaces normal space character when it is present before a new line.
//      	This causes TTS to read too fast.
	    	return text.replace("\u00a0"," ");
	}

	private static String removeCommaAfterGap(String text) {
		if (text.startsWith(".") || text.startsWith(",")) {
			return text.substring(1);
		}
		return text;
	}

	private static int getGapEndIndex(String text, int gapIndex) {
		int openBrackets = 0;
		int closeBrackets = 0;
		int index = 0;
		for (int i = gapIndex; i < text.length(); i++){
			char c = text.charAt(i);
			if (c == '{') {
				openBrackets++;
			}

			if(c == '}'){
				closeBrackets++;
			}

			if(openBrackets == closeBrackets && openBrackets != 0) {
				index = i;
				break;
			}
		}

		return index;
	}

	public static List<TextToSpeechVoice> getReadableText (TextModel model, ArrayList<NavigationTextElement> textElements, String lang) {
		String text = getCleanText(model.getOriginalText());
		int gapNumber = 1;
		int elementNumber = 1; 		//added to distinct gaps from links
		final List<TextToSpeechVoice> result = new ArrayList<TextToSpeechVoice>();
		while (text.indexOf(GAP_START) >= 0 
				|| text.indexOf(FILLED_GAP_START) >= 0 
				|| text.indexOf(DROP_DOWN_GAP_START) >= 0 
				|| text.indexOf(BREAK_TEXT) >= 0
				|| text.indexOf(LINK_START) >= 0) {
			
			final int gapIndex = text.indexOf(GAP_START);
			final int filledGapIndex = text.indexOf(FILLED_GAP_START);
			final int dropdownIndex = text.indexOf(DROP_DOWN_GAP_START);
			final int breakIndex = text.indexOf(BREAK_TEXT);
			final int linkIndex = text.indexOf(LINK_START);
			
			final int lowestIndex = getMinPositiveNumber(gapIndex, filledGapIndex, dropdownIndex, breakIndex, linkIndex);
			final boolean isClosestGap = lowestIndex == gapIndex;
			final boolean isClosestFilledGap = lowestIndex == filledGapIndex;
			final boolean isClosestDropdown = lowestIndex == dropdownIndex;
			final boolean isClosestBreak = lowestIndex == breakIndex;
			final boolean isClosestLink = lowestIndex == linkIndex;
			
			final NavigationTextElement element = !isClosestBreak ? getElement(textElements, elementNumber - 1) : null;
			String langTag = element != null && element.getLangTag() != null ? element.getLangTag() : lang;

			final String elementContent = element != null ? getElementTextElementContent(element) : "";
			final List<TextToSpeechVoice> content = new ArrayList<TextToSpeechVoice>();

			if (element instanceof AltTextGap) {
				TextElementDisplay textElement = (TextElementDisplay) element;
				content.addAll(((AltTextGap) textElement).getReadableText());
			} else {
				content.add(TextToSpeechVoice.create(elementContent, langTag));
			}

			if (isClosestGap) {
				elementNumber++;
				TextElementDisplay textElement = (TextElementDisplay) element;
				result.add(TextToSpeechVoice.create(text.substring(0, gapIndex), lang));                           // text before gap
				result.add(TextToSpeechVoice.create(model.getSpeechTextItem(TextModel.GAP_INDEX) + " " + gapNumber++));              // gap type and number
				result.addAll(content);                                        // gap content
				result.add(getElementStatus(textElement, model));

				final int endGapIndex = getGapEndIndex(text, gapIndex) + GAP_END.length();
				text = text.substring(endGapIndex);
			}
			if (isClosestFilledGap) {
				elementNumber++;
				TextElementDisplay textElement = (TextElementDisplay) element;
				result.add(TextToSpeechVoice.create(text.substring(0, filledGapIndex), lang));
				result.add(TextToSpeechVoice.create(model.getSpeechTextItem(TextModel.GAP_INDEX) + " " + gapNumber++));
				result.addAll(content);
				result.add(getElementStatus(textElement, model));

				final int endGapIndex = WCAGUtils.getGapEndIndex(text, filledGapIndex) + FILLED_GAP_END.length();
				text = text.substring(endGapIndex);
			}
			if (isClosestDropdown) {
				elementNumber++;
				TextElementDisplay textElement = (TextElementDisplay) element;
				result.add(TextToSpeechVoice.create(text.substring(0, dropdownIndex), lang));
				result.add(TextToSpeechVoice.create(model.getSpeechTextItem(TextModel.DROPDOWN_INDEX) + " " + gapNumber++));
				if ( !elementContent.equals("-") && !elementContent.equals("---")) {
					result.addAll(content);
				} else {
					result.add(TextToSpeechVoice.create(model.getSpeechTextItem(TextModel.EMPTY_INDEX)));
				}
				result.add(getElementStatus(textElement, model));
				
				final int endGapIndex = text.indexOf(DROP_DOWN_GAP_END, dropdownIndex) + DROP_DOWN_GAP_END.length();
				text = text.substring(endGapIndex);
			}
			if (isClosestBreak) {
				result.add(TextToSpeechVoice.create(text.substring(0, breakIndex), lang));
				final int endBreakIndex = breakIndex + BREAK_TEXT.length();
				text = text.substring(endBreakIndex);
			}
			if (isClosestLink) {
				text = text.trim();
				elementNumber++;
				int endLinkTagIndex = text.indexOf(LINK_END);
				String linkName = text.substring(linkIndex + LINK_START.length(), endLinkTagIndex);
				String textModel = model.getSpeechTextItem(TextModel.LINK_INDEX);
				
				if (linkIndex > 1) {
					result.add(TextToSpeechVoice.create(text.substring(0, linkIndex - 1), lang));                           // text before gap
				}
				
				result.add(TextToSpeechVoice.create(textModel + " " + linkName.trim()));
				final int endGapIndex =  text.indexOf(LINK_END, linkIndex) + LINK_END.length();
				text = text.substring(endGapIndex);
			}
			text = TextParser.removeGapOptions(text);
			text = convertWhitespaceToSpace(text);
			text = removeCommaAfterGap(text);
		}
		result.add(TextToSpeechVoice.create(text, lang)); // remaining text
		return result;
	}
	
	public static List<String> getGapsOrder (TextModel model) {
		String text = getCleanText(model.getOriginalText());
		ArrayList<String> result = new ArrayList<String>();

		while (text.indexOf(GAP_START) >= 0 || text.indexOf(FILLED_GAP_START) >= 0 || text.indexOf(DROP_DOWN_GAP_START) >= 0 || text.indexOf(LINK_START) >= 0) {
			final int gapIndex = text.indexOf(GAP_START);
			final int filledGapIndex = text.indexOf(FILLED_GAP_START);
			final int dropdownIndex = text.indexOf(DROP_DOWN_GAP_START);
			final int linkIndex = text.indexOf(LINK_START);
			final int lowestIndex = getMinPositiveNumber(gapIndex, filledGapIndex, dropdownIndex, linkIndex);
			
			final boolean isClosestGap = lowestIndex == gapIndex;
			final boolean isClosestFilledGap = lowestIndex == filledGapIndex;
			final boolean isClosestDropdown = lowestIndex == dropdownIndex;
			final boolean isClosestLink = lowestIndex == linkIndex;
			
			if (isClosestGap) {
				result.add("gap");
				
				final int endGapIndex = text.indexOf(GAP_END, lowestIndex) + GAP_END.length();
				text = text.substring(endGapIndex);
			}

			if (isClosestFilledGap) {
				result.add("gap");
				
				final int endGapIndex = text.indexOf(FILLED_GAP_END, lowestIndex) + FILLED_GAP_END.length();
				text = text.substring(endGapIndex);
			}

			if (isClosestDropdown) {
				result.add("dropdown");
				
				final int endGapIndex = text.indexOf(DROP_DOWN_GAP_END, lowestIndex) + DROP_DOWN_GAP_END.length();
				text = text.substring(endGapIndex);
			}

			if (isClosestLink) {
				result.add("link");
				
				final int endGapIndex = text.indexOf(LINK_END, lowestIndex) + LINK_END.length();
				text = text.substring(endGapIndex);
			}
		}
		
		return result;
	}

	public static boolean hasGaps (TextModel model) {
		String text = getCleanText(model.getOriginalText());
		return text.contains(GAP_START) || text.contains(FILLED_GAP_START) || text.contains(DROP_DOWN_GAP_START);
	}

	public static boolean hasLinks(TextModel model) {
		return model.getOriginalText().contains("href");
	}
}
