package com.lorepo.icplayer.client.module.imagesource.mockup;

import com.lorepo.icplayer.client.module.imagesource.IViewListener;
import com.lorepo.icplayer.client.module.imagesource.ImageSourceModule;
import com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter.IDisplay;

public class ImageSourceViewMockup implements IDisplay {

	private boolean selected = false;
	private boolean isVisible = true;
	private IViewListener listener;
	
	
	public ImageSourceViewMockup(ImageSourceModule module) {
		// TODO Auto-generated constructor stub
	}

	@Override
	public void select() {
		selected = true;
	}

	@Override
	public void deselect() {
		selected = false;
	}

	@Override
	public void addListener(IViewListener l) {
		listener = l;
	}

	
	public boolean isSelected(){
		return selected;
	}

	public void click() {
		listener.onClicked();
	}

	public boolean isVisible() {
		return isVisible;
	}

	@Override
	public void showImage() {
		isVisible = true;
	}

	@Override
	public void hideImage() {
		isVisible = false;
	}
}
