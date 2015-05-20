package com.lorepo.icplayer.client.module.imagesource;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.DragStartEvent;
import com.google.gwt.event.dom.client.DragStartHandler;
import com.google.gwt.user.client.ui.Image;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter.IDisplay;

public class ImageSourceView extends Image implements IDisplay {

	private static final String DEFAULT_STYLE = "ic_sourceImage";
	private static final String SELECTED_STYLE = "selected";
	
	private ImageSourceModule module;
	private IViewListener listener;
	private boolean isDragged = false;
	private boolean isPreview;
	
	public ImageSourceView(ImageSourceModule module, boolean isPreview) {
		this.module = module;
		this.isPreview = isPreview;
		createUI();
		connectHandlers();
	}

	private void createUI() {
		setStyleName(DEFAULT_STYLE);
		StyleUtils.applyInlineStyle(this, module);
		String imageUrl = module.getUrl();
		if (imageUrl.length() > 0) {
			setUrl(imageUrl);
		}
		
		getElement().setId(module.getId());
		if (!isPreview) {
			setVisible(module.isVisible());
		}
	}
	
	public void makeDraggable(ImageSourcePresenter p) {
		if (!isPreview) {
			JavaScriptUtils.makeDraggable(getElement(), p.getAsJavaScript());
		}
	}
	
	private void connectHandlers() {
		addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				event.stopPropagation();
				event.preventDefault();
				if (!isDragged) {
					if (listener != null) {
						listener.onClicked();
					}
				}
				isDragged = false;
			}
		});

		addDragStartHandler(new DragStartHandler() {
			@Override
			public void onDragStart(DragStartEvent event) {
				isDragged = true;
				if (listener != null) {
					listener.onDragged();
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
	public void getImageUrl() {
		// TODO Auto-generated method stub
	}
	
	@Override
	public void show() {
		setVisible(true);
	}


	@Override
	public void hide() {
		setVisible(false);
	}

}
