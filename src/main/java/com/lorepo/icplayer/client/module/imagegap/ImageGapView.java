package com.lorepo.icplayer.client.module.imagegap;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.Image;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter.IDisplay;


public class ImageGapView extends Image implements IDisplay {

	private static final String HOLLOW_IMAGE = "media/hollow.png";
	private static final String DEFAULT_STYLE = "ic_imageGap";
	private static final String FILLED_STYLE = "filled";
	private static final String CORRECT_STYLE = "correct";
	private static final String WRONG_STYLE = "wrong";
	private static final String DISABLED_STYLE = "disabled";
	private static final String EMPTY_STYLE = "empty";
	
	private ImageGapModule module;
	private IViewListener listener;
	private boolean disabled = false;
	
	
	public ImageGapView(ImageGapModule module, boolean isPreview) {
		
		this.module = module;
		createUI(isPreview);
		connectHandlers();
	}

	
	private void createUI(boolean isPreview) {
		
		setStylePrimaryName(DEFAULT_STYLE);
		StyleUtils.applyInlineStyle(this, module);
		if(!isPreview){
			setVisible(module.isVisible());
		}
		setImageUrl("");
		getElement().setId(module.getId());
		JavaScriptUtils.makeDropable(getElement(), ".ic_sourceImage");
	}
	
	
	private void connectHandlers() {
		
		addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				event.stopPropagation();
				event.preventDefault();
				if(listener != null && !disabled){
					listener.onClicked();
				}
			}
		});
	}


	@Override
	public void addListener(IViewListener l) {
		listener = l;
	}


	@Override
	public void setImageUrl(String url) {

		if(url.isEmpty()){
			setUrl(GWT.getModuleBaseURL() + HOLLOW_IMAGE);
		}
		else{
			setUrl(url);
		}
		resetStyles();
	}


	@Override
	public void showAsError() {
		if(getUrl().indexOf(HOLLOW_IMAGE) < 0){
			addStyleDependentName(WRONG_STYLE);
		}
		else{
			addStyleDependentName(EMPTY_STYLE);
		}
	}


	@Override
	public void showAsCorrect() {
		addStyleDependentName(CORRECT_STYLE);
	}


	@Override
	public void resetStyles() {

		removeStyleDependentName(WRONG_STYLE);
		removeStyleDependentName(CORRECT_STYLE);
		removeStyleDependentName(FILLED_STYLE);
		removeStyleDependentName(EMPTY_STYLE);
		
		if(getUrl().indexOf(HOLLOW_IMAGE) < 0){
			addStyleDependentName(FILLED_STYLE);
		}
	}


	@Override
	public void setDisabled(boolean disable) {
		this.disabled = disable;
		if(disabled){
			addStyleDependentName(DISABLED_STYLE);
		}
		else{
			removeStyleDependentName(DISABLED_STYLE);	
		}
	}


	@Override
	public void show() {
		setVisible(true);		
	}


	@Override
	public void hide() {
		setVisible(false);
	}

	@Override
	public void markGapAsEmpty() {
		resetStyles();
		addStyleDependentName(EMPTY_STYLE);
	}


	@Override
	public void markGapAsWrong() {
		resetStyles();
		addStyleDependentName(WRONG_STYLE);		
	}

}
