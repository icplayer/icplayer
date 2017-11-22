package com.lorepo.icplayer.client.module.image;

import java.util.Random;

import com.google.gwt.event.dom.client.LoadEvent;
import com.google.gwt.event.dom.client.LoadHandler;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Image;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.image.ImageModule.DisplayMode;
import com.lorepo.icplayer.client.module.image.ImagePresenter.IDisplay;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.page.ResponsiveVoiceOnEndCallback;
import com.google.gwt.event.dom.client.KeyDownEvent;


public class ImageView extends AbsolutePanel implements IDisplay, IWCAG, IWCAGModuleView {

	private ImageModule module;
	private Image image;
	private PageController pageController;
	private boolean isWCAGOn = false;
	
	
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
		image.setAltText(module.getAltText());

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
		
		if (this.module.isTabindexEnabled()) {
			image.getElement().setTabIndex(0);
		}
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


	@Override
	public String getName() {
		return "Image";
	}


	@Override
	public void setWCAGStatus(boolean isWCAGOn) {
		this.isWCAGOn = isWCAGOn;	
	}


	@Override
	public void setPageController(PageController pc) {
		this.setWCAGStatus(true);
		this.pageController = pc;
	}


	@Override
	public String getLang() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public void enter(boolean isExiting) {
		this.speak(this.module.getAltText());
	}


	@Override
	public void space() {
		// TODO Auto-generated method stub
	}


	@Override
	public void tab() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void left() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void right() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void down() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void up() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void escape() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void customKeyCode(KeyDownEvent event) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void shiftTab() {
		// TODO Auto-generated method stub
		
	}
	
	private void speak (String text) {
		JavaScriptUtils.log(this.pageController);
		if (this.pageController != null) {
			this.pageController.speak(text, "", new ResponsiveVoiceOnEndCallback());
		}
	}
}
