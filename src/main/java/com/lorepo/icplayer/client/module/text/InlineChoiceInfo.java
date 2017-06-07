package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * Zawiera informacje o gapie
 * @author Krzysztof Langner
 *
 */
public class InlineChoiceInfo {

	private String 	id;
	private String 	answer;
	private int	value;
	private ArrayList<String>	distractors;
	
	
	/**
	 * constructor
	 * @param id
	 * @param answer
	 * @param value
	 */
	public InlineChoiceInfo(String id, String answer, int value){
		this.id = id;
		this.answer = answer;
		this.value = value;
		distractors = new ArrayList<String>();
	}


	/**
	 * Add distractor to the list
	 * @param text
	 */
	public void addDistractor(String text){
		for(int index = 0; index < distractors.size(); index ++){
			String distractor = distractors.get(index);
			if(distractor.compareTo(text) > 0){
				distractors.add(index, text);
				return;
			}
		}
		
		distractors.add(text);
	}
	
	public void addDistractorInOrder(String text){
		distractors.add(text);
	}
	
	
	/**
	 * @return answer
	 */
	public String getAnswer() {
		return answer;
	}


	/**
	 * @return distractors
	 */
	public Iterator<String> getDistractors() {
		return distractors.iterator();
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
}
