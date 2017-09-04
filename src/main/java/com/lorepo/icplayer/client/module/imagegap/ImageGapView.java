package com.lorepo.icplayer.client.module.imagegap;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.ui.Image;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter.IDisplay;

public class ImageGapView extends Image implements IDisplay, IWCAG {

	private static final String HOLLOW_IMAGE = "media/hollow.png";
	private static final String DEFAULT_STYLE = "ic_imageGap";
	private static final String FILLED_STYLE = "filled";
	private static final String CORRECT_STYLE = "correct";
	private static final String WRONG_STYLE = "wrong";
	private static final String DISABLED_STYLE = "disabled";
	private static final String EMPTY_STYLE = "empty";
	private static final String SHOW_CORRECT_STYLE = "correct-answer";

	private final ImageGapModule module;
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
		if (isPreview && module.isDisabled()) {
			StyleUtils.addStateDisableClass(this);
		}

		if (!isPreview) {
			setVisible(module.isVisible());
		}
		setImageUrl("");
		getElement().setId(module.getId());
	}

	private void connectHandlers() {
		addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				event.stopPropagation();
				event.preventDefault();
				if (listener != null && !disabled) {
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
		setUrl(url.isEmpty() ? GWT.getModuleBaseURL() + HOLLOW_IMAGE : url);
		resetStyles();
	}

	@Override
	public void showAsError() {
		String style = getUrl().indexOf(HOLLOW_IMAGE) < 0 ? WRONG_STYLE : EMPTY_STYLE;
		addStyleDependentName(style);
	}

	@Override
	public void showCorrectAnswers() {
		addStyleDependentName(SHOW_CORRECT_STYLE);
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
		removeStyleDependentName(SHOW_CORRECT_STYLE);

		if (getUrl().indexOf(HOLLOW_IMAGE) < 0) {
			addStyleDependentName(FILLED_STYLE);
		}
	}

	@Override
	public void setDisabled(boolean disable) {
		this.disabled = disable;
		if (disabled) {
			addStyleDependentName(DISABLED_STYLE);
			removeDroppable(getElement());
		} else {
			removeStyleDependentName(DISABLED_STYLE);
			reDroppableElement(getElement());
		}
	}

	@Override
	public boolean getDisabled() {
		return this.disabled;
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

	@Override
	public boolean isAttempted() {
		return getUrl().indexOf(HOLLOW_IMAGE) < 0;
	}

	@Override
	public void makeDraggable(ImageGapPresenter presenter) {
		JavaScriptUtils.makeDroppedDraggable(getElement(), presenter.getAsJavaScript());
	}

	@Override
	public void makeDroppable(ImageGapPresenter presenter) {
		JavaScriptUtils.makeDropable(getElement(), presenter.getAsJavaScript());
	}

	public native static void removeDroppable(Element e) /*-{
		$wnd.$(e).droppable( "option", "disabled", true );
	}-*/;

	public native static void reDroppableElement(Element e) /*-{
		$wnd.$(e).droppable( "option", "disabled", false );
	}-*/;

	@Override
	public void removeClass(String className) {
		StyleUtils.removeClassFromElement(this, className);
	}

	@Override
	public String getName() {
		return "ImageGap";
	}
	
	public void enter(boolean isExiting) {
		if (!isExiting) {
			this.listener.onClicked();
		}
		
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
}
