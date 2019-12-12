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
	private String updatedHref;
	
	
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
		this.updatedHref = "";
	}


	public String getId() {
		return id;
	}


	public LinkType getType() {
		return type;
	}


	public String getHref() {
		if (this.updatedHref.length() > 0) {
			return updatedHref;
		} else {
			return href;
		}
	}

	public String getTarget() {
		return target;
	}
	
	public void setBaseUrl(String newBaseUrl) {
		if (this.type.equals(LinkType.PAGE)) {
			return;
		}

		if(href.startsWith("#") || href.startsWith("/") || href.startsWith("http")
				|| href.startsWith("file") || href.startsWith("javascript")){
			return;
		}
		else{
			updatedHref = newBaseUrl + href;
		}
	}

}
