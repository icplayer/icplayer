package com.lorepo.icplayer.client.module.image;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import com.google.gwt.event.dom.client.LoadEvent;
import com.google.gwt.event.dom.client.LoadHandler;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Image;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.image.ImageModule.DisplayMode;
import com.lorepo.icplayer.client.module.image.ImagePresenter.IDisplay;
import com.lorepo.icplayer.client.page.PageController;
import com.google.gwt.event.dom.client.KeyDownEvent;


public class ImageView extends AbsolutePanel implements IDisplay, IWCAG, IWCAGModuleView {

	private ImageModule module;
	private Image image;
	private PageController pageController;
	private boolean isWCAGOn = false;
	private String originalDisplay = null;
	
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
		ImageViewUtils.keepAspect(image, width, height);
		if(image.getWidth() > 0 && image.getHeight() > 0){
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
		return null;
	}

	@Override
	public void enter(KeyDownEvent event, boolean isExiting) {
		this.speak(this.module.getAltText());
	}

	@Override
	public void space(KeyDownEvent event) {
		event.preventDefault();
	}

	@Override
	public void tab(KeyDownEvent event) {}

	@Override
	public void left(KeyDownEvent event) {}

	@Override
	public void right(KeyDownEvent event) {}

	@Override
	public void down(KeyDownEvent event) {
		event.preventDefault(); 
	}

	@Override
	public void up(KeyDownEvent event) {
		event.preventDefault();
	}

	@Override
	public void escape(KeyDownEvent event) {
	    event.preventDefault();
	}

	@Override
	public void customKeyCode(KeyDownEvent event) {}

	@Override
	public void shiftTab(KeyDownEvent event) {}
	
	private void speak (String text) {
		if (this.pageController != null) {
			List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
			textVoices.add(TextToSpeechVoice.create(text, ""));
			textVoices.add(TextToSpeechVoice.create());
			
			this.pageController.speak(textVoices);
		}
	}
	
	@Override
	public void setVisible(boolean visible) {
		if (originalDisplay == null) {
			originalDisplay = getElement().getStyle().getDisplay();
		}
		if (visible) {
			super.setVisible(true);
			getElement().getStyle().setProperty("display", originalDisplay);	
		} else {
			super.setVisible(false);
		}
	}
}
