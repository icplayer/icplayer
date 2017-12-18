package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;


public class WCAGUtils {
	final static String GAP_START = "\\gap{";
	final static String GAP_END = "}";
	final static String FILLED_GAP_START = "\\filledGap{";
	final static String FILLED_GAP_END = GAP_END;
	final static String DROP_DOWN_GAP_START = "{{";
	final static String DROP_DOWN_GAP_END = "}}";

	private static String replace (String original, int s, int e, String newString) {
		return original.substring(0, s) + newString + original.substring(e, original.length());
	}
	
	private static int getMinPositiveNumber (List<Integer> numbers) {
		Collections.sort(numbers); // ascending order
		
		for (int number: numbers) {
			if (number >= 0) {
				return number;
			}
		}
		
		return -1;
	}
	
	private static String getElementTextElementContent (ArrayList<TextElementDisplay> textElements, int index) {
		if (index >= 0 && index < textElements.size()) {
			return textElements.get(index).getTextValue();
		}
		
		return "";
	}
	
	public static String getReadableText (String originalText, ArrayList<TextElementDisplay> textElements) {
		final String noHTML = originalText.replaceAll("\\<.*?>", " ").replaceAll("&nbsp;", " ");
		String result = noHTML.trim().replaceAll("\\s{2,}", " ");
		int gapNumber = 1;
		
		while (result.indexOf(GAP_START) > 0 || result.indexOf(FILLED_GAP_START) > 0 || result.indexOf(DROP_DOWN_GAP_START) > 0) {
			final int gapIndex = result.indexOf(GAP_START);
			final int filledGapIndex = result.indexOf(FILLED_GAP_START);
			final int dropdownIndex = result.indexOf(DROP_DOWN_GAP_START);
			
			final List<Integer> gapsIndexes = new ArrayList<Integer>();
			gapsIndexes.add(gapIndex);
			gapsIndexes.add(filledGapIndex);
			gapsIndexes.add(dropdownIndex);
			final int lowestIndex = getMinPositiveNumber(gapsIndexes);
			
			final boolean isClosestGap = lowestIndex == gapIndex;
			final boolean isClosestFilledGap = lowestIndex == filledGapIndex;
			final boolean isClosestDropdown = lowestIndex == dropdownIndex;
			
			final String elementContent = getElementTextElementContent(textElements, gapNumber - 1);

			if (isClosestGap) {
				final int endGapIndex = result.indexOf(GAP_END, gapIndex) + GAP_END.length();
				result = replace(result, gapIndex, endGapIndex, "gap " + gapNumber++ + " " + elementContent);
			}
			
			if (isClosestFilledGap) {
				final int endGapIndex = result.indexOf(FILLED_GAP_END, filledGapIndex) + FILLED_GAP_END.length();
				result = replace(result, filledGapIndex, endGapIndex, "gap " + gapNumber++ + " " + elementContent);
			}
			
			if (isClosestDropdown) {
				final int endGapIndex = result.indexOf(DROP_DOWN_GAP_END, dropdownIndex) + DROP_DOWN_GAP_END.length();
				result = replace(result, dropdownIndex, endGapIndex, "dropdown " + gapNumber++ + " " + elementContent);
			}
		}
		
		return result;
	}
	
}
