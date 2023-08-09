package com.lorepo.icplayer.client.module.text;

public interface IGapCommonUtilsProvider {
	public String getId();
	public int getLongestAnswerLength();
	public String getLongestAnswer();
	String getFirstCorrectAnswer();
}
