package com.lorepo.icplayer.client.module.imagesource;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.TouchCancelEvent;
import com.google.gwt.event.dom.client.TouchCancelHandler;
import com.google.gwt.event.dom.client.TouchEndEvent;
import com.google.gwt.event.dom.client.TouchEndHandler;
import com.google.gwt.event.dom.client.TouchMoveEvent;
import com.google.gwt.event.dom.client.TouchMoveHandler;
import com.google.gwt.event.dom.client.TouchStartEvent;
import com.google.gwt.event.dom.client.TouchStartHandler;
import com.google.gwt.user.client.ui.Image;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter.IDisplay;
import com.google.gwt.dom.client.Touch;

public class ImageSourceView extends Image implements IDisplay {

	private static final String DEFAULT_STYLE = "ic_sourceImage";
	private static final String SELECTED_STYLE = "selected";
	
	private ImageSourceModule module;
	private IViewListener listener;
	
	private boolean isTouched = false;
	
	public ImageSourceView(ImageSourceModule module, boolean isPreview) {
		
		this.module = module;
		createUI(isPreview);
		connectHandlers();
	}

	
	private void createUI(boolean isPreview) {
		
		setStyleName(DEFAULT_STYLE);
		StyleUtils.applyInlineStyle(this, module);
		String imageUrl = module.getUrl();
		if(imageUrl.length() > 0){
			setUrl(imageUrl);
		}
		
		if(!isPreview){
			setVisible(module.isVisible());
		}
		getElement().setId(module.getId());
	}
	
	
	private void connectHandlers() {
		
		addTouchStartHandler(new TouchStartHandler() {
			public void onTouchStart(TouchStartEvent event) {
				event.stopPropagation();
				event.preventDefault();
				
				isTouched = true;
			}
		});
		
		addTouchMoveHandler(new TouchMoveHandler() {
			public void onTouchMove(TouchMoveEvent event) {
				event.stopPropagation();
				event.preventDefault();
				
				isTouched = false;
			}
		});
		
		addTouchCancelHandler(new TouchCancelHandler() {
			public void onTouchCancel(TouchCancelEvent event) {
				event.stopPropagation();
				event.preventDefault();
				
				isTouched = false;
			}
		});
		
		addTouchEndHandler(new TouchEndHandler() {
			public void onTouchEnd(TouchEndEvent event) {
				event.stopPropagation();
				event.preventDefault();
				
				if (isTouched) {
					if(listener != null){
						listener.onClicked();
					}
				}
			}
		});
		
		addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				event.stopPropagation();
				event.preventDefault();
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
