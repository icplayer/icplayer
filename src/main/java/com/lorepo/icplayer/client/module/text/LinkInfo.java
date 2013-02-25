package com.lorepo.icplayer.client.module.text;

/**
 * Zawiera informacje o gapie
 * @author Krzysztof Langner
 *
 */
public class LinkInfo {

	public enum LinkType{
		PAGE,
		DEFINITION
	}
	
	private String 	id;
	private String 	href;
	private LinkType	type;
	
	
	/**
	 * constructor
	 * @param id
	 * @param answer
	 * @param value
	 */
	public LinkInfo(String id, LinkType type, String href){

		this.id = id;
		this.type = type;
		this.href = href;
	}


	public String getId() {
		return id;
	}


	public LinkType getType() {
		return type;
	}


	public String getHref() {
		return href;
	}


}
