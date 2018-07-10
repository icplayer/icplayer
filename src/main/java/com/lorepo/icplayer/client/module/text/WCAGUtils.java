package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;


public class WCAGUtils {
	final static String GAP_START = "\\gap{";
	final static String GAP_END = "}";
	final static String FILLED_GAP_START = "\\filledGap{";
	final static String FILLED_GAP_END = GAP_END;
	final static String DROP_DOWN_GAP_START = "{{";
	final static String DROP_DOWN_GAP_END = "}}";
	public final static String BREAK_TEXT = "&&break&&";
	
	private static int getMinPositiveNumber (int n1, int n2, int n3) {
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
	
	private static TextElementDisplay getElement (ArrayList<TextElementDisplay> textElements, int index) {
		if (index >= 0 && index < textElements.size()) {
			return textElements.get(index);
		}
		
		return null;
	}
	
	private static String getElementTextElementContent (TextElementDisplay element) {
		return element != null ? element.getWCAGTextValue() : "";
	}
	
	// TODO change to ENUM
	private static TextToSpeechVoice getElementStatus (TextElementDisplay element, TextModel model) {
		if (!element.isWorkingMode()) {
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
	
	public static String getCleanText (String text) {
		HTML html = new HTML(getImageAltTextsWithBreaks(text));
		final String noHTML = html.getText();
		return noHTML.replaceAll("\\s{2,}", " ").trim(); // remove spaces if more than 1
	}

	public static List<TextToSpeechVoice> getReadableText (TextModel model, ArrayList<TextElementDisplay> textElements, String lang) {
		String text = getCleanText(model.getOriginalText());
		int gapNumber = 1;
		final List<TextToSpeechVoice> result = new ArrayList<TextToSpeechVoice>();
		while (text.indexOf(GAP_START) >= 0 
				|| text.indexOf(FILLED_GAP_START) >= 0 
				|| text.indexOf(DROP_DOWN_GAP_START) >= 0 
				|| text.indexOf(BREAK_TEXT) >= 0) {
			
			final int gapIndex = text.indexOf(GAP_START);
			final int filledGapIndex = text.indexOf(FILLED_GAP_START);
			final int dropdownIndex = text.indexOf(DROP_DOWN_GAP_START);
			final int breakIndex = text.indexOf(BREAK_TEXT);
			
			final int lowestIndex = getMinPositiveNumber(gapIndex, filledGapIndex, dropdownIndex,breakIndex);
			final boolean isClosestGap = lowestIndex == gapIndex;
			final boolean isClosestFilledGap = lowestIndex == filledGapIndex;
			final boolean isClosestDropdown = lowestIndex == dropdownIndex;
			final boolean isClosestBreak = lowestIndex == breakIndex;
			
			final TextElementDisplay element = !isClosestBreak ? getElement(textElements, gapNumber - 1) : null;
			final String elementContent = element!=null ? getElementTextElementContent(element) : null;
			String langTag = element!=null && element.getLangTag()!=null ? element.getLangTag() : lang;
			
			if (isClosestGap) {
				result.add(TextToSpeechVoice.create(text.substring(0, gapIndex), lang));                           // text before gap
				result.add(TextToSpeechVoice.create(model.getSpeechTextItem(TextModel.GAP_INDEX) + " " + gapNumber++));              // gap type and number
				result.add(TextToSpeechVoice.create(elementContent, langTag));                                        // gap content
				result.add(getElementStatus(element, model));
				
				final int endGapIndex = text.indexOf(GAP_END, gapIndex) + GAP_END.length();
				text = text.substring(endGapIndex);
			}
			if (isClosestFilledGap) {
				result.add(TextToSpeechVoice.create(text.substring(0, filledGapIndex), lang));
				result.add(TextToSpeechVoice.create(model.getSpeechTextItem(TextModel.GAP_INDEX) + " " + gapNumber++));
				result.add(TextToSpeechVoice.create(elementContent, langTag));
				result.add(getElementStatus(element, model));
				
				final int endGapIndex = text.indexOf(FILLED_GAP_END, filledGapIndex) + FILLED_GAP_END.length();
				text = text.substring(endGapIndex);
			}
			if (isClosestDropdown) {
				result.add(TextToSpeechVoice.create(text.substring(0, dropdownIndex), lang));
				result.add(TextToSpeechVoice.create(model.getSpeechTextItem(TextModel.DROPDOWN_INDEX) + " " + gapNumber++));
				if ( !elementContent.equals("-") && !elementContent.equals("---")) {
					result.add(TextToSpeechVoice.create(elementContent, langTag));
				} else {
					result.add(TextToSpeechVoice.create(model.getSpeechTextItem(TextModel.EMPTY_INDEX)));
				}
				result.add(getElementStatus(element, model));
				
				final int endGapIndex = text.indexOf(DROP_DOWN_GAP_END, dropdownIndex) + DROP_DOWN_GAP_END.length();
				text = text.substring(endGapIndex);
			}
			if(isClosestBreak){
				result.add(TextToSpeechVoice.create(text.substring(0, breakIndex), lang));
				final int endBreakIndex = breakIndex + BREAK_TEXT.length();
				text = text.substring(endBreakIndex);
			}
			text = TextParser.removeGapOptions(text);
		}
		result.add(TextToSpeechVoice.create(text, lang)); // remaining text
		return result;
	}
	
	public static List<String> getGapsOrder (TextModel model) {
		String text = getCleanText(model.getOriginalText());
		ArrayList<String> result = new ArrayList<String>();

		while (text.indexOf(GAP_START) >= 0 || text.indexOf(FILLED_GAP_START) >= 0 || text.indexOf(DROP_DOWN_GAP_START) >= 0) {
			final int gapIndex = text.indexOf(GAP_START);
			final int filledGapIndex = text.indexOf(FILLED_GAP_START);
			final int dropdownIndex = text.indexOf(DROP_DOWN_GAP_START);
			final int lowestIndex = getMinPositiveNumber(gapIndex, filledGapIndex, dropdownIndex);
			
			final boolean isClosestGap = lowestIndex == gapIndex;
			final boolean isClosestFilledGap = lowestIndex == filledGapIndex;
			final boolean isClosestDropdown = lowestIndex == dropdownIndex;
			
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
		}
		
		return result;
	}
	
	public static boolean hasGaps (TextModel model) {
		String text = getCleanText(model.getOriginalText());
		return text.contains(GAP_START) || text.contains(FILLED_GAP_START) || text.contains(DROP_DOWN_GAP_START);
	}

}
