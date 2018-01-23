package com.lorepo.icplayer.client.module.imagesource.mockup;

import com.google.gwt.dom.client.Element;
import com.lorepo.icplayer.client.module.imagesource.IViewListener;
import com.lorepo.icplayer.client.module.imagesource.ImageSourceModule;
import com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter;
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
	public Element getElement() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void show(boolean refreshPosition) {
		isVisible = true;
	}

	@Override
	public void hide() {
		isVisible = false;
	}

	@Override
	public void makeDraggable(ImageSourcePresenter imageSourcePresenter) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void getInitialPosition() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setDisabled(boolean disable) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public boolean getDisabled() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public void unsetDragMode() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setDragMode() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return null;
	}
}
