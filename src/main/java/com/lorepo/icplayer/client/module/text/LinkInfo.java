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
	private String lang;
	
	
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
		this.lang = "";
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
		setBaseUrl(newBaseUrl, false);
	}
	
	public void setBaseUrl(String newBaseUrl, boolean useContentBaseURL) {
		if (this.type.equals(LinkType.PAGE) || this.type.equals(LinkType.DEFINITION)) {
			return;
		}

		if (href.startsWith("#") || (!useContentBaseURL && href.startsWith("/")) || href.startsWith("http")
				|| href.startsWith("file") || href.startsWith("javascript")){
			return;
		} else if (useContentBaseURL && href.startsWith("//")) {
			updatedHref = "https:" + href;
		} else {
			updatedHref = newBaseUrl + href;
		}
	}

	public void setLang(String lang) {
		this.lang = lang;
	}

	public String getLang() {
		return this.lang;
	}

}
