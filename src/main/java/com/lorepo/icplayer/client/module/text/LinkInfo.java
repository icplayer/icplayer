package com.lorepo.icplayer.client.module.text;

/**
 * Zawiera informacje o gapie
 * @author Krzysztof Langner
 *
 */
public class LinkInfo {

	public enum LinkType{
		PAGE,
		DEFINITION,
		EXTERNAL
	}
	
	private String 	id;
	private String 	href;
	private LinkType type;
	private String target;
	
	
	/**
	 * constructor
	 * @param id
	 * @param answer
	 * @param value
	 */
	public LinkInfo(String id, LinkType type, String href, String target){

		this.id = id;
		this.type = type;
		this.href = href;
		this.target = target;
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

	public String getTarget() {
		return target;
	}

}
