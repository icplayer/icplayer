package com.lorepo.icplayer.client.framework.module;

/**
 * 
 * @author Krzysztof Langner
 */
public interface IStyledModule {

	public void addStyleListener(IStyleListener listener);
	public String getInlineStyle();
	public String getStyleClass();
	public void setInlineStyle(String inlineStyle);
	public void setStyleClass(String styleClass);
	public String getClassNamePrefix();
	
}
