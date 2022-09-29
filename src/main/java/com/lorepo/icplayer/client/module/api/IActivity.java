package com.lorepo.icplayer.client.module.api;

/**
 * Interace implementowany przez moduły ćwiczeniowe
 * 
 * @author Krzysztof Langner
 */
public interface IActivity {

	public int getErrorCount();

	public int getMaxScore();

	public int getScore();

	public boolean isActivity();
}
