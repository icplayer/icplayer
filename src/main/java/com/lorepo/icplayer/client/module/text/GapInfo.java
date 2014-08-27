package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.lorepo.icf.utils.StringUtils;

/**
 * Zawiera informacje o gapie
 * @author Krzysztof Langner
 *
 */
public class GapInfo {

	private String id;
	private List<String> answers = new ArrayList<String>();
	private int	value;
	private int maxLength;
	private boolean isCaseSensitive = false;
	private boolean isIgnorePunctuation;
	private String placeHolder = "";
	
	
	public GapInfo(String id, int value, boolean isCaseSensitive, boolean isIgnorePunctuation, int maxLength){
		this.id = id;
		this.value = value;
		this.isCaseSensitive = isCaseSensitive;
		this.isIgnorePunctuation = isIgnorePunctuation;
		this.maxLength = maxLength;
	}


	public void addAnswer(String answer) {
		answer = StringUtils.unescapeXML(answer);
		if(isIgnorePunctuation) { answer = removePunctuation(answer); }
		answers.add(isCaseSensitive ? answer : answer.toLowerCase());
	}

	private static String removePunctuation(String text) {
		return text.replaceAll("\\W", "");
	}

	public boolean isCorrect(String text) {
		
		boolean correct = false;
		if(!isCaseSensitive){
			text = text.toLowerCase();
		}
		if(isIgnorePunctuation){
			text = removePunctuation(text);
		}
		for(String answer : answers){
			if(answer.compareTo(text) == 0){
				correct = true;
				break;
			}
		}

		return correct;
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

	public void setPlaceHolder(String placeHolder) {
		this.placeHolder = placeHolder;
	}
	
	public String getPlaceHolder() {
		return placeHolder;
	}

	/**
	 * @return answers
	 */
	public Iterator<String> getAnswers() {
		return answers.iterator();
	}

}
