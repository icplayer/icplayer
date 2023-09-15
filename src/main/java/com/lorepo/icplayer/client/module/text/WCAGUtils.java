package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.Node;
import com.google.gwt.dom.client.NodeList;
import com.google.gwt.dom.client.Text;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.module.text.TextPresenter.NavigationTextElement;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;
import com.google.gwt.regexp.shared.MatchResult;
import com.google.gwt.regexp.shared.RegExp;


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
	final static String NON_BREAKING_SPACE = "\u00A0";
	
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
		return _element != null ? decodeString(_element.getWCAGTextValue()) : "";
	}

	private static String decodeString (String text) {
		return text.replaceAll("&apos;", "\'");
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

	public static void parseLineBreakTags (Element wrapper) {
		NodeList<Element> elements = wrapper.getElementsByTagName("br");
		for (int i = elements.getLength() - 1; i >= 0; i--) {
			Element br = elements.getItem(i);
			Element parent = br.getParentElement();
			Element replacement = DOM.createDiv();
			replacement.setInnerHTML("." + NON_BREAKING_SPACE);
			parent.insertAfter(replacement, br);
			parent.removeChild(br);
		}
	}

	public static String addSpacesToListTags (String text) {
		return text.replaceAll("</li>", ", </li>");
	}

	private static void addListNumbers(Element wrapper) {
		NodeList<Element> lis = wrapper.getElementsByTagName("li");
		for	(int i = 0; i < lis.getLength(); i++) {
			Element selectedLI = lis.getItem(i);
			Element parent = selectedLI.getParentElement();
			if(parent.getTagName().toLowerCase().equals("ul")) continue;
			Element currentElement = selectedLI;
			int index = 0;
			while (currentElement != null) {
				if (currentElement.getTagName().toLowerCase().equals("li")) {
					index += 1;
					if (currentElement.hasAttribute("value")) {
						Integer value = getSafeNumberFromString(currentElement.getAttribute("value"));
						if (value != null) {
							index += value - 1;
							break;
						}
					}
				}
				currentElement = currentElement.getPreviousSiblingElement();
			}
			if (currentElement == null && parent.hasAttribute("start")) {
				Integer startValue = getSafeNumberFromString(parent.getAttribute("start"));
				if (startValue != null) index += startValue - 1;
			}
			String indexValue = String.valueOf(index);
			if (parent.hasAttribute("type") && parent.getAttribute("type").toLowerCase().equals("a")) {
				indexValue = getAlphabeticIndex(index);
			}

			selectedLI.setInnerHTML(". " + indexValue + ": " + selectedLI.getInnerHTML());
			selectedLI.setAttribute("value", String.valueOf(index));
		}
	}

	private static String getAlphabeticIndex(int index) {
		char[] ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();
		String result = "";
		while (index != 0) {
			int mod = index % 26;
			result = " " + ALPHABET[mod - 1] + result;
			index -= mod;
			index = index / 26;
		}
		return result;
	}

	private static Integer getSafeNumberFromString (String text) {
		try {
			return Integer.parseInt(text);
		} catch (NumberFormatException e) {
			return null;
		}
	}

	private static void addEndingSpace(Element wrapper) {
		String[] tags = {"div", "p"};
		for (String tag: tags) {
			NodeList<Element> elements = wrapper.getElementsByTagName(tag);
			for (int i = 0; i < elements.getLength(); i++) {
				Element div = elements.getItem(i);
				String originalHTML = div.getInnerHTML();
				if (div.getPreviousSibling() != null) {
					Node prev = div.getPreviousSibling();
					if (prev.getNodeType() == Node.TEXT_NODE) {
						String previousText = ((Text) prev).getData();
						if (!endsWithPunctuation(previousText)) {
							originalHTML = "." + NON_BREAKING_SPACE + originalHTML;
						}
					}
				}
				if (div.getLastChild() != null) {
					Node lastChild = div.getLastChild();
					if (lastChild.getNodeType() == Node.TEXT_NODE && !endsWithPunctuation(originalHTML)) {
						originalHTML = originalHTML + "." + NON_BREAKING_SPACE;
					}
				}
				originalHTML += NON_BREAKING_SPACE;
				div.setInnerHTML(originalHTML);
			}
		}
	}

	private static boolean endsWithPunctuation(String text) {
		// regex replaces all non-breaking spaces with regular spaces
		String trimmedText = text.replaceAll("\\u00A0", " ").replaceAll("&nbsp;", " ").trim();
		String punc = ".,;?!";
		if (trimmedText.length() == 0) return true; //text node with only white spaces should be ignored
		for (int i = 0; i < punc.length(); i++) {
			if (trimmedText.endsWith(punc.substring(i, i+1))) {
				return true;
			}
		}
		return false;
	}

	public static String getCleanText (String text) {
		text = updateLinks(text);
		text = addSpacesToListTags(text);

		Element wrapper = DOM.createElement("div");
		wrapper.setInnerHTML(text);
		addListNumbers(wrapper);
		parseLineBreakTags(wrapper);
		addEndingSpace(wrapper);
		text = wrapper.getInnerHTML();

		HTML html = new HTML(getImageAltTextsWithBreaks(text));
		final String noHTML = html.getText();
		return removeSeparatedPunctation(noHTML.replaceAll("\\s{2,}", " ").trim()); // remove spaces if more than 1
	}

	private static String removeSeparatedPunctation(String text) {
		String textWithoutSeparatedDots = removeSeparatedDots(text);
		String textWithClearedAltText = removePunctation(textWithoutSeparatedDots);

		return removeComma(textWithClearedAltText);
	}

	private static String removeSeparatedDots(String text) {
		return text.replaceAll("\\.*\\s*(\\,|\\.)\\s\\.\\s", ". ");
	}

	private static String removeComma(String text) {
		final String pattern = "[^a-z]\\,";
		RegExp gapRegExp = RegExp.compile(pattern);
		MatchResult matchResult;
		String replacedText;
		String parsedText = text;

		while ((matchResult = gapRegExp.exec(parsedText)) != null) {
			if (matchResult.getGroupCount() > 0) {
				String group = matchResult.getGroup(0);
				replacedText = group.replace(",", "");
				parsedText = parsedText.replaceFirst(pattern, replacedText);
			} else {
				break;
			}
		}

		return parsedText;
	}

	private static String removePunctation(String text) {
		final String pattern = "[a-z](\\.\\s*)\\\\alt\\{";
		RegExp gapRegExp = RegExp.compile(pattern);
		MatchResult matchResult;
		String replacedText;
		String parsedText = text;

		while ((matchResult = gapRegExp.exec(parsedText)) != null) {
			if (matchResult.getGroupCount() > 0) {
				String group = matchResult.getGroup(0);
				replacedText = group
								.replaceAll("\\s", "")
								.replace(".", " \\\\");
				parsedText = parsedText.replaceFirst(pattern, replacedText);
			} else {
				break;
			}
		}

		return parsedText;
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
