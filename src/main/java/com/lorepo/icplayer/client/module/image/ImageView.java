package com.lorepo.icplayer.client.module.image;

import java.util.Random;

import com.google.gwt.event.dom.client.LoadEvent;
import com.google.gwt.event.dom.client.LoadHandler;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Image;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.image.ImageModule.DisplayMode;
import com.lorepo.icplayer.client.module.image.ImagePresenter.IDisplay;


public class ImageView extends AbsolutePanel implements IDisplay {

	private ImageModule module;
	private Image image;
	
	
	public ImageView(ImageModule module, boolean isPreview) {
	
		this.module = module;

		createUI(isPreview);
	}


	private void createUI(boolean isPreview) {
		
		image = new Image();
		setStyleName("ic_image");
		StyleUtils.applyInlineStyle(this, module);
		String imageUrl = module.getUrl();
		add(image);

		if(imageUrl.length() > 0){
			image.addLoadHandler(new LoadHandler() {
				@Override
				public void onLoad(LoadEvent event) {
					if (!isVisible()) { //if not visible make it, just to work on IE9, 10
						setVisible(true);
						setImageSize();
						setVisible(false);
					} else {
						setImageSize();
					}
				}
			});
			
			if(module.getAnimatedGifRefresh()) {
				Random rand = new Random();
				imageUrl = imageUrl + "?" + rand.nextInt(1000000);
			}

			image.setUrl(imageUrl);
		}

		setImageSize();
		if(!isPreview){
			setVisible(module.isVisible());
		}
		getElement().setId(module.getId());
	}

	
	private void setImageSize() {
		if(module.getDisplayMode() == DisplayMode.stretch){
			image.setPixelSize(module.getWidth(), module.getHeight());
		}
		else if(module.getDisplayMode() == DisplayMode.keepAspect){
			keepAspect(module.getWidth(), module.getHeight());
		}
		else if(module.getDisplayMode() == DisplayMode.originalSize){
			image.setVisibleRect(0, 0, module.getWidth(), module.getHeight());
		}
	}

	
	private void keepAspect(int width, int height) {
		if(image.getWidth() > 0 && image.getHeight() > 0){
		
			float aspectX = width/(float)image.getWidth();
			float aspectY = height/(float)image.getHeight();

			if(aspectX < aspectY){
				int newHeight = (int) (image.getHeight()*aspectX);
				image.setPixelSize(width, newHeight);
			}
			else{
				int newWidth = (int) (image.getWidth()*aspectY);
				image.setPixelSize(newWidth, height);
			}
			
			center();
		}
	}


	private void center() {

		int left = (getOffsetWidth()-image.getWidth())/2;
		int top = (getOffsetHeight()-image.getHeight())/2;
		setWidgetPosition(image, left, top);
	}


	@Override
	public void show() {

		setVisible(true);
		if(module.getDisplayMode() == DisplayMode.keepAspect){
			center();
		}
	}


	@Override
	public void hide() {
		setVisible(false);
	}
}
