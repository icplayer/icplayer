package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icplayer.client.model.alternativeText.AlternativeTextService;

public class GapInfo implements IGapCommonUtilsProvider {

	private String id;
	private List<String> answers = new ArrayList<String>();
	private int	value;
	private int maxLength;
	private boolean isCaseSensitive = false;
	private boolean isIgnorePunctuation;
	private String placeHolder = "";
	private String langTag = null;
	private boolean isNumericOnly = false;
	private boolean wasReset = false;
	// null means "not provided by host" -> fall back to isCaseSensitive/isIgnorePunctuation
	private Boolean capitalisationChecking = null;
	private Boolean punctuationChecking = null;
	private Boolean isTurkishLang = null;
	
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
	}

	public void setCapitalisationChecking(Boolean capitalisationChecking) {
		this.capitalisationChecking = capitalisationChecking;
	}

	public void setPunctuationChecking(Boolean punctuationChecking) {
		this.punctuationChecking = punctuationChecking;
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
		boolean effectiveCaseSensitive = capitalisationChecking != null ? capitalisationChecking : isCaseSensitive;
		boolean effectiveIgnorePunctuation = punctuationChecking != null ? !punctuationChecking : isIgnorePunctuation;

        if (this.isTurkishLang == null) {
           this.isTurkishLang = false;
           for (String answer : answers) {
               if (isTurkishLang(answer, "")) {
                   this.isTurkishLang = true;
                   break;
               }
           }
       }

       if (!this.isTurkishLang && isTurkishLang("", text)) {
           this.isTurkishLang = true;
       }

       text = getCleanedText(text, effectiveCaseSensitive, effectiveIgnorePunctuation);
		for (String answer : answers) {
			String checkAnswer = getCheckAnswer(answer, effectiveCaseSensitive, effectiveIgnorePunctuation);
			String parsedAnswer = getCorrectAnswer(AlternativeTextService.getVisibleText(checkAnswer));
			String parsedUserAnswer = getParsedUserAnswer(text);
			if (parsedAnswer.compareTo(parsedUserAnswer) == 0) {
				correct = true;
				break;
			}
		}

		return correct;
	}

	private String getCheckAnswer(String answer, boolean effectiveCaseSensitive, boolean effectiveIgnorePunctuation) {
		if (effectiveIgnorePunctuation) {
			answer = removePunctuation(answer);
		}
		return effectiveCaseSensitive ? answer : getSafeLowerCase(answer);
	}

	private String getCorrectAnswer(String answer) {
		if (isMathFormula(answer)) {
			return answer.replace("< ", "<").trim();
		}

		return answer.trim();
	}

	private String getParsedUserAnswer(String userAnswer) {
		if (isMathFormula(userAnswer)) {
			return userAnswer.replace("< ", "<").trim();
		}

		return userAnswer.trim();
	}

	private String getSafeLowerCase(String text) {
        if (this.isTurkishLang) {
            return text.replace("I", "ı").replace("İ", "i");
        }

        return text.toLowerCase().replace("\u0307", "");
    }

	private boolean isMathFormula(String value) {
		String pattern = ".*[a-zA-Z0-9\\s]+<[a-zA-Z0-9\\s]+.*";

		return value.matches(pattern);
	}

	private boolean isTurkishLang(String answer, String userAnswer) {
	    String pattern = ".*[ığüşöçİĞÜŞÖÇ]+.*";

	    return (answer != null && answer.matches(pattern)) ||
               (userAnswer != null && userAnswer.matches(pattern));
	}

    public boolean isValueCheckable(boolean ignorePlaceholderWhenChecking, boolean hasGapBeenAccessed) {
        if (getPlaceHolder().trim().isEmpty()) {
            return true;
        }

        if (ignorePlaceholderWhenChecking && !hasGapBeenAccessed) {
            return false;
        }

        return true;
    }
	
	/**
	 * @return id
	 */
	public String getId() {
		return id;
	}

	public boolean getResetStatus() {
		return wasReset;
	}

	public void setResetStatus(boolean wasReset) {
		this.wasReset = wasReset;
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

	public String getLongestAnswer() {
		int longestAnswerLength = 0;
		String longestAnswer = "";
		
		for (String answer : answers) {
			if (longestAnswerLength < answer.length()) {
				longestAnswerLength = answer.length();
				longestAnswer = answer;
			}
		}
		
		return longestAnswer;
	}
	
	public int getLongestAnswerLength() {
		return getLongestAnswer().length();
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

    private String getCleanedText(String text, boolean effectiveCaseSensitive, boolean effectiveIgnorePunctuation) {
        text = cleanStringAccordingToSettings(text, effectiveCaseSensitive, effectiveIgnorePunctuation);
        text = TextParser.parseAnswer(text);
		return AlternativeTextService.getVisibleText(text);
    }

	private String cleanStringAccordingToSettings(String text, boolean effectiveCaseSensitive, boolean effectiveIgnorePunctuation) {
	    if (!effectiveCaseSensitive) {
			text = getSafeLowerCase(text);
		}
		if (effectiveIgnorePunctuation) {
			text = removePunctuation(text);
		}
		return text;
	}

}
