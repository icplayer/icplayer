package com.lorepo.icplayer.client.model.asset;

import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icplayer.client.model.IAsset;


/**
 * Model reprezentujący zasób prezentacji.
 * Na razie wersja uproszczona, ale na pewno się rozwinie
 * 
 * @author Krzysztof Langner
 *
 */
public class BasicAsset implements IAsset{

	private String type;
	private String href;
	private String title = "";
	private String fileName = "";
	private String contentType = "";
	private int OrderNumber;
	
	
	public BasicAsset(String type, String url){
	
		this.type = type;
		this.href = url;
	}
	
	
	@Override
	public String getHref() {
		return href;
	}

	@Override
	public String getType() {
		return type;
	}

	@Override
	public String toXML() {

		String titleEscaped = StringUtils.escapeXML(title);
		String fileNameEscaped = StringUtils.escapeXML(fileName);
		String xml = "<asset type='" + type + "' href='" + href + "' title='" + 
				titleEscaped + "' fileName='" + fileNameEscaped + "' contentType='" + contentType + "'/>";
		
		return xml;
	}


	@Override
	public String getTitle() {
		return title;
	}


	@Override
	public String getFileName() {
		return fileName;
	}


	@Override
	public String getContentType() {
		return contentType;
	}


	@Override
	public void setTitle(String title) {
		this.title = title;
	}


	@Override
	public void setFileName(String name) {
		this.fileName = name;
	}


	@Override
	public void setContentType(String type) {
		this.contentType = type;
	}


	@Override
	public void setOrderNumber(int number) {
		this.OrderNumber = number;
	}


	@Override
	public int getOrderNumber() {
		return this.OrderNumber;
	}

}
