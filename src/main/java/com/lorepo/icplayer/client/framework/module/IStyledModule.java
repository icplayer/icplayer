package com.lorepo.icplayer.client.framework.module;

import java.util.Set;

import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.semi.responsive.SemiResponsiveStyles;

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
	public void syncSemiResponsiveStyles(Set<PageLayout> actualSemiResponsiveLayouts);
}
