package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icplayer.client.model.alternativeText.AlternativeTextService;

public class GapInfo implements IGapCommonUtilsProvider {

	private String id;
	private List<String> answers = new ArrayList<String>();
	private List<String> checkAnswers = new ArrayList<String>();
	private int	value;
	private int maxLength;
	private boolean isCaseSensitive = false;
	private boolean isIgnorePunctuation;
	private String placeHolder = "";
	private String langTag = null;
	private boolean isNumericOnly = false;
	
	public GapInfo(String id, int value, boolean isCaseSensitive, boolean isIgnorePunctuation, int maxLength, boolean isNumericOnly){
		this.id = id;
		this.value = value;
		this.isCaseSensitive = isCaseSensitive;
		this.isIgnorePunctuation = isIgnorePunctuation;
		this.maxLength = maxLength;
		this.isNumericOnly = isNumericOnly;
	}
	
	public GapInfo(String id, int value, boolean isCaseSensitive, boolean isIgnorePunctuation, int maxLength, boolean isNumericOnly, String langTag){
		this.id = id;
		this.value = value;
		this.isCaseSensitive = isCaseSensitive;
		this.isIgnorePunctuation = isIgnorePunctuation;
		this.maxLength = maxLength;
		this.langTag = langTag;
		this.isNumericOnly = isNumericOnly;
	}

	public void addAnswer(String answer) {
		boolean matchAllVisbileText = true;
		answer = StringUtils.unescapeXML(answer);
		answer = answer.replaceAll("&nbsp;", " ");
		// this is needed for showing visible text when show answer is called on gap
		answer = AlternativeTextService.unescapeAltText(answer, matchAllVisbileText);
		answers.add(answer);
		if(isIgnorePunctuation) { answer = removePunctuation(answer); }
		checkAnswers.add(isCaseSensitive ? answer : answer.toLowerCase());
	}

	public static boolean isLetter(char c) {
        int character = (int) c;

        return inRange(character, 65, 90) || inRange(character, 97, 122) || inRange(character, 192, 687) || inRange(character, 900, 1159) || // latin letters
		       inRange(character, 1162, 1315) || inRange(character, 1329, 1366) || inRange(character, 1377, 1415) || // cyrillic letters
		       inRange(character, 1425, 1536) || inRange(character, 1569, 1610) || // arabic letters
		       inRange(character, 0x3400, 0x9FFF) || inRange(character, 0x0620, 0x063F) || inRange(character, 0x0641, 0x064A); //chinese and japanese letters
    }
	
	public static boolean isDigit(int d) {
		
        return inRange(d, 0x0030, 0x0039) //standard european digits
        		|| inRange(d, 0x0660, 0x0669) || inRange(d, 0x06F0, 0x06F9) // arabic digits
        		|| inRange(d, 0x1040, 0x108F) || inRange(d, 0x5344, 0x5345) // chinese and japanese digits
        		|| d == 0x3007 || d == 0x5341 || d == 0x4E00 || d == 0x4E8C || d == 0x4E09 || d == 0x56DB
        		|| d == 0x4E94 || d == 0x0516D || d == 0x4E03 || d == 0x516B || d == 0x4E5D || d == 0x5341
        		|| d == 0x767E || d == 0x5343 || d == 0x4E07 || d == 0x842C || d == 0x5104 || d == 0x4EBF || d == 0x5146;
    }

    public static boolean inRange(int value, int min, int max) {
        return (value <= max) & (value >= min);
    }
	
	private static String removePunctuation(String text) {
		String alfaNumericText = "";
		StringBuilder sb = new StringBuilder();

		for (int i = 0; i < text.length(); i++) {
			char c = text.charAt(i);
			if (GapInfo.isLetter(c) || GapInfo.isDigit(c)) {
				sb.append(c);
			}
		}
		
		alfaNumericText = sb.toString();

		return alfaNumericText;
	}

	public boolean isCorrect(String text) {
		boolean correct = false;
		text = getCleanedText(text);
		for (String answer : checkAnswers) {
			String parsedAnswer = AlternativeTextService.getVisibleText(answer);
			if (parsedAnswer.compareTo(text) == 0) {
				correct = true;
				break;
			}
		}

		return correct;
	}

	public boolean isTextOnlyPlaceholder(String text, boolean ignorePlaceholderWhenChecking) {
	    text = getCleanedText(text);
	    if (textEqualsPlaceholder(text) && ignorePlaceholderWhenChecking) {
            return true;
		}
		return false;
	}
	
	/**
	 * @return id
	 */
	public String getId() {
		return id;
	}

	public int getValue() {
		return value;
	}

	public int getMaxLength() {
		return maxLength;
	}
	
	public String getLangTag() {
		return this.langTag;
	}

	public void setPlaceHolder(String placeHolder) {
		this.placeHolder = placeHolder;
	}
	
	public String getPlaceHolder() {
		return placeHolder;
	}
	
	public int getLongestAnswerLength() {
		int longestAnswer = 0;
		
		for (String answer : answers) {
			if (longestAnswer < answer.length()) {
				longestAnswer = answer.length();
			}
		}
		
		return longestAnswer;
	}

	@Override
	public String getFirstCorrectAnswer() {
		return answers.size() > 0 ? answers.get(0) : "";
	}

	/**
	 * @return answers
	 */
	public Iterator<String> getAnswers() {
		return answers.iterator();
	}
	
	public boolean isNumericOnly() {
		return isNumericOnly;
	}

    private String getCleanedText(String text) {
        text = cleanStringAccordingToSettings(text);
		return AlternativeTextService.getVisibleText(text);
    }

	private boolean textEqualsPlaceholder(String text) {
	    String placeholder = cleanStringAccordingToSettings(getPlaceHolder());
	    return placeholder.length() > 0 && text.equals(placeholder);
	}

	private String cleanStringAccordingToSettings(String text) {
	    if (!isCaseSensitive) {
			text = text.toLowerCase();
		}
		if (isIgnorePunctuation) {
			text = removePunctuation(text);
		}
		return text;
	}

}
