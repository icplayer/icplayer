package com.lorepo.icplayer.client.module;

import com.lorepo.icplayer.client.framework.module.IStyleListener;
import com.lorepo.icplayer.client.framework.module.IStyledModule;


class StyledModule extends AbsolutePositioningModule implements IStyledModule {

	private IStyleListener styleListener;
	private String	style = "";
	private String	styleClass;
	
	public StyledModule(String name) {
		super(name);
	}

	@Override
	public void addStyleListener(IStyleListener listener){
		styleListener = listener;
	}
	
	@Override
	public String getInlineStyle() {
		return style;
	}
	
	@Override
	public String getStyleClass() {
		
		if(styleClass == null){
			return "";
		}
		
		return styleClass;
	}
	
	@Override
	public void setInlineStyle(String style){
		
		this.style = style;
		if(styleListener != null){
			styleListener.onStyleChanged();
		}
	}

	@Override
	public void setStyleClass(String styleClass){
		
		if(styleClass != null && styleClass.length() > 0){
			this.styleClass = styleClass;
		}
		else{
			this.styleClass = null;
		}

		if(styleListener != null){
			styleListener.onStyleChanged();
		}
	}

	
	@Override
	public String getClassNamePrefix() {
		return "";
	};

}
