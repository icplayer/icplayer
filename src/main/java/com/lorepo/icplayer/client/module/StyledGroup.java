package com.lorepo.icplayer.client.module;

import java.util.HashMap;
import java.util.Set;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.framework.module.IStyleListener;
import com.lorepo.icplayer.client.framework.module.IStyledModule;
import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.semi.responsive.SemiResponsiveStyles;


public class StyledGroup extends AbsolutePositioningGroup implements IStyledModule {

	private IStyleListener styleListener;
	private SemiResponsiveStyles semiResponsiveStyles = new SemiResponsiveStyles();

	
	public StyledGroup(String name) {
		super(name);
	}

	
	public SemiResponsiveStyles getSemiResponsiveStyles() {
		return semiResponsiveStyles;
	}
	
	@Override
	public void addStyleListener(IStyleListener listener){
		styleListener = listener;
	}
	
	@Override
	public String getInlineStyle() {
		return this.semiResponsiveStyles.getInlineStyle(this.getSemiResponsiveID(), this.getDefaultSemiResponsiveID());
	}
	
	protected HashMap<String, String> getInlineStyles() {
		return this.semiResponsiveStyles.getInlineStyles();
	}
	
	protected HashMap<String, String> getStylesClasses() {
		return this.semiResponsiveStyles.getStylesClasses();
	}
	
	@Override
	public String getStyleClass() {
		return this.semiResponsiveStyles.getStyleClass(this.getSemiResponsiveID(), this.getDefaultSemiResponsiveID());
	}
	
	@Override
	public void setInlineStyle(String style){
		this.semiResponsiveStyles.setInlineStyle(this.getSemiResponsiveID(), style);

		if(styleListener != null){
			styleListener.onStyleChanged();
		}
	}

	@Override
	public void setStyleClass(String styleClass){
		this.semiResponsiveStyles.setStyleClass(this.getSemiResponsiveID(), styleClass);
		
		if(styleListener != null){
			styleListener.onStyleChanged();
		}
	}

	
	@Override
	public String getClassNamePrefix() {
		return "moduleGroup";
	};
	
	
	public void setDefaultInlineStyle(String inlineStyle) {
		this.semiResponsiveStyles.setInlineStyle(this.getDefaultSemiResponsiveID(), inlineStyle);
	}
	
	public void setDefaultStyleClass(String styleClass) {
		this.semiResponsiveStyles.setStyleClass(this.getDefaultSemiResponsiveID(), styleClass);
	}
	
	public void setInlineStyles(HashMap<String, String> inlineStyles) {
		this.semiResponsiveStyles.setInlineStyles(inlineStyles);
	}
	
	public void setStylesClasses(HashMap<String, String> styleClasses) {
		this.semiResponsiveStyles.setStylesClasses(styleClasses);
	}
	
	
	protected boolean haveStyles() {
		return this.semiResponsiveStyles.haveStyles();
	}
	
	protected Element stylesToXML() {
		return this.semiResponsiveStyles.toXML();
	}
	
	public void syncSemiResponsiveStyles(Set<PageLayout> actualSemiResponsiveLayouts) {
		this.semiResponsiveStyles.syncStyles(actualSemiResponsiveLayouts, this.getDefaultSemiResponsiveID());
		
	}
	
	
}
