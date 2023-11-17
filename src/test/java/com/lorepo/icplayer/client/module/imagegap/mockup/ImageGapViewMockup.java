package com.lorepo.icplayer.client.module.imagegap.mockup;

import com.google.gwt.dom.client.Element;
import com.lorepo.icplayer.client.module.imagegap.IViewListener;
import com.lorepo.icplayer.client.module.imagegap.ImageGapModule;
import com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter;
import com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter.IDisplay;

public class ImageGapViewMockup implements IDisplay {

	private IViewListener listener;
	private String imageUrl;
	private String style;
	private boolean disabled;
	private boolean visible = true;


	public ImageGapViewMockup(ImageGapModule module) {
		// TODO Auto-generated constructor stub
	}

	@Override
	public void addListener(IViewListener l) {
		listener = l;
	}

	public IViewListener getListener() {
		return listener;
	}


	public String getImageUrl(){
		return imageUrl;
	}

	@Override
	public void setImageUrl(String url) {
		imageUrl = url;
	}

	@Override
	public void showAsError() {
		style = "error";
	}

	@Override
	public void showAsCorrect() {
		style = "correct";
	}

	@Override
	public void resetStyles() {
		style = "default";
	}

	public String getStyle(){
		return style;
	}

	@Override
	public void setDisabled(boolean disable) {
		this.disabled = disable;
	}

	public boolean isDisabled(){
		return disabled;
	}

	@Override
	public void show() {
		visible = true;
	}

	@Override
	public void hide() {
		visible = false;
	}

	public boolean isVisible(){
		return visible;
	}

	@Override
	public void markGapAsEmpty() {
		// TODO Auto-generated method stub

	}

	@Override
	public void markGapAsWrong() {
		// TODO Auto-generated method stub

	}

	@Override
	public Element getElement() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean isAttempted() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public void showCorrectAnswers() {
		// TODO Auto-generated method stub

	}

	@Override
	public void makeDraggable(ImageGapPresenter imageGapPresenter) {
		// TODO Auto-generated method stub

	}

	@Override
	public boolean getDisabled() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public void makeDroppable(ImageGapPresenter imageGapPresenter) {
		// TODO Auto-generated method stub

	}

	@Override
	public void removeClass(String string) {
		// TODO Auto-generated method stub

	}

	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setAltText(String alt) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void clearAltText() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setLangTag(String langTag) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getLang() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void readInserted() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void readRemoved() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void handleLimitedCheck(int score, int error, boolean hideMarkContainer) {
		// TODO Auto-generated method stub
		
	}
}
