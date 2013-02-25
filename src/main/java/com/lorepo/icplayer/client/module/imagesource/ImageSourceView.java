package com.lorepo.icplayer.client.module.imagesource;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.Image;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter.IDisplay;


public class ImageSourceView extends Image implements IDisplay {

	private static final String DEFAULT_STYLE = "ic_sourceImage";
	private static final String SELECTED_STYLE = "selected";
	
	private ImageSourceModule module;
	private IViewListener listener;
	
	
	public ImageSourceView(ImageSourceModule module) {
		
		this.module = module;
		createUI();
		connectHandlers();
	}

	
	private void createUI() {
		
		setStyleName(DEFAULT_STYLE);
		StyleUtils.applyInlineStyle(this, module);
		String imageUrl = module.getUrl();
		if(imageUrl.length() > 0){
			setUrl(imageUrl);
		}
		setVisible(module.isVisible());
		getElement().setId(module.getId());
	}
	
	
	private void connectHandlers() {
		
		addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				if(listener != null){
					listener.onClicked();
				}
			}
		});
	}


	@Override
	public void select() {
		setStyleDependentName(SELECTED_STYLE, true);
	}

	@Override
	public void deselect() {
		setStyleDependentName(SELECTED_STYLE, false);
	}

	@Override
	public void addListener(IViewListener l) {
		listener = l;
	}


	@Override
	public void showImage() {

		setVisible(true);
	}


	@Override
	public void hideImage() {
		deselect();
		setVisible(false);
	}

	
}
