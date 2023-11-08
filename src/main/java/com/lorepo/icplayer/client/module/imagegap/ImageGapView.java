package com.lorepo.icplayer.client.module.imagegap;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.ui.Image;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter.IDisplay;
import com.lorepo.icplayer.client.page.PageController;

public class ImageGapView extends Image implements IDisplay, IWCAGModuleView, IWCAG {

	private static final String HOLLOW_IMAGE = "media/hollow.png";
	private static final String DEFAULT_STYLE = "ic_imageGap";
	private static final String FILLED_STYLE = "filled";
	private static final String CORRECT_STYLE = "correct";
	private static final String WRONG_STYLE = "wrong";
	private static final String DISABLED_STYLE = "disabled";
	private static final String CORRECT_CONTAINER_STYLE = "correct-container";
	private static final String WRONG_CONTAINER_STYLE = "wrong-container";
	private static final String DISABLED_CONTAINER_STYLE = "disabled-container";
	private static final String EMPTY_STYLE = "empty";
	private static final String SHOW_CORRECT_STYLE = "correct-answer";

	private final ImageGapModule module;
	private IViewListener listener;
	private boolean disabled = false;
	
	private boolean isWCAGOn = false;
	private PageController pageController = null;
	private String langTag = "";
	private String altText = "";
	private String imageUrl = "";
	private String originalDisplay = "";
	

	public ImageGapView(ImageGapModule module, boolean isPreview) {
		this.module = module;
		createUI(isPreview);
		connectHandlers();
	}

	private void createUI(boolean isPreview) {
		setStylePrimaryName(DEFAULT_STYLE);
		StyleUtils.applyInlineStyle(this, module);
		originalDisplay = getElement().getStyle().getDisplay();
		if (isPreview && module.isDisabled()) {
			StyleUtils.addStateDisableClass(this);
		}

		if (!isPreview) {
			setVisible(module.isVisible());
		}
		setImageUrl("");
		getElement().setId(module.getId());
	}

	public native static void addResponseMarkContainer(Element e, String className) /*-{
		var parentElement = e.parentElement;
		var computedStyles = window.getComputedStyle(e, null);
		var width = computedStyles.getPropertyValue("width");
		var height = computedStyles.getPropertyValue("height");
		var top = computedStyles.getPropertyValue("top");
		var left = computedStyles.getPropertyValue("left");
		var paddingLeft = computedStyles.getPropertyValue("padding-left");
		var paddingTop = computedStyles.getPropertyValue("padding-top");
		var markWrapperElement =  $wnd.document.createElement('div');

		var absoluteTop = parseInt(top) + parseInt(paddingTop) + 'px';
		var absoluteLeft = parseInt(left) + parseInt(paddingLeft) + 'px';

		markWrapperElement.id = e.id + "-mark-container";
		markWrapperElement.classList.add('ic_imageGap-mark-container', className);
		markWrapperElement.style.width = width;
		markWrapperElement.style.height = height;
		markWrapperElement.style.top = absoluteTop;
		markWrapperElement.style.left = absoluteLeft;

		$wnd.$(markWrapperElement).insertAfter('#' + e.id);
	}-*/;

	public native static void removeResponseMarkContainer(Element e) /*-{
		var wrapperID = e.id + "-mark-container";
		var elementToRemove = $wnd.document.getElementById(wrapperID);
		if (elementToRemove) {
			elementToRemove.remove();
		}
	}-*/;

	@Override
	public void handleLimitedCheck(int score, int error, boolean hideMarkContainer) {
		if (hideMarkContainer) {
			removeResponseMarkContainer(getElement());
		}

		if (score == 1) {
			addResponseMarkContainer(getElement(), CORRECT_CONTAINER_STYLE);
		} else if (error == 1){
			addResponseMarkContainer(getElement(), WRONG_CONTAINER_STYLE);
		} else if (score == 0 && error == 0) {
			addResponseMarkContainer(getElement(), DISABLED_CONTAINER_STYLE);
		}
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
		this.imageUrl = url;
	}

	@Override
	public void showAsError() {
		String style = getUrl().indexOf(HOLLOW_IMAGE) < 0 ? WRONG_STYLE : EMPTY_STYLE;
		addStyleDependentName(style);

		if (module.displayResponseContainer()) {
			String containerStyle = getUrl().indexOf(HOLLOW_IMAGE) < 0 ? WRONG_CONTAINER_STYLE : DISABLED_CONTAINER_STYLE;
			addResponseMarkContainer(getElement(), containerStyle);
		}
	}

	@Override
	public void showCorrectAnswers() {
		addStyleDependentName(SHOW_CORRECT_STYLE);
	}

	@Override
	public void showAsCorrect() {
		addStyleDependentName(CORRECT_STYLE);

		if (module.displayResponseContainer()) {
			addResponseMarkContainer(getElement(), CORRECT_CONTAINER_STYLE);
		}
	}

	@Override
	public void resetStyles() {
		removeStyleDependentName(WRONG_STYLE);
		removeStyleDependentName(CORRECT_STYLE);
		removeStyleDependentName(FILLED_STYLE);
		removeStyleDependentName(EMPTY_STYLE);
		removeStyleDependentName(SHOW_CORRECT_STYLE);
		removeResponseMarkContainer(getElement());

		if (getUrl().indexOf(HOLLOW_IMAGE) < 0) {
			addStyleDependentName(FILLED_STYLE);
		}
	}

	@Override
	public void setDisabled(boolean disable) {
		this.disabled = disable;
		this.module.setDisabled(disable);

		if (disabled) {
			addStyleDependentName(DISABLED_STYLE);
			removeDroppable(getElement());
		} else {
			removeStyleDependentName(DISABLED_STYLE);
			reDroppableElement(getElement());

			if (module.displayResponseContainer()) {
				removeResponseMarkContainer(getElement());
			}
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
	
	@Override
	public void enter(KeyDownEvent event, boolean isExiting) {
		this.readStatus();
	}

	@Override
	public void space(KeyDownEvent event) {
		event.preventDefault();
		if (!module.isDisabled()) {
			this.listener.onClicked();
		}
	}

	@Override
	public void tab(KeyDownEvent event) {
		// TODO Auto-generated method stub
	}

	@Override
	public void left(KeyDownEvent event) {
		// TODO Auto-generated method stub
	}

	@Override
	public void right(KeyDownEvent event) {
		// TODO Auto-generated method stub
	}

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
		// TODO Auto-generated method stub
	}

	@Override
	public void customKeyCode(KeyDownEvent event) {
		// TODO Auto-generated method stub
	}

	@Override
	public void shiftTab(KeyDownEvent event) {
		// TODO Auto-generated method stub
	}

	@Override
	public void clearAltText() {
		getElement().setAttribute("alt", "");	
		this.altText = "";
	}
	
	@Override
	public void setAltText(String alt){
		getElement().setAttribute("alt", alt);
		this.altText = alt;
	}

	@Override
	public void setPageController(PageController pc) {
		this.pageController = pc;
		this.setWCAGStatus(true);
		
	}

	@Override
	public void setWCAGStatus(boolean isWCAGOn) {
		this.isWCAGOn = isWCAGOn;
		
	}

	@Override
	public String getLang() {
		return langTag;
	}
	
	@Override
	public void setLangTag(String langTag) {
		this.langTag = langTag;
		getElement().setAttribute("lang", langTag);
	}

	@Override
	public void readInserted() {
		List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
		textVoices.add(TextToSpeechVoice.create(module.getSpeechTextItem(ImageGapModule.INSERTED_INDEX)));
		textVoices.add(TextToSpeechVoice.create(this.altText, this.langTag));
		speak(textVoices);
	}

	@Override
	public void readRemoved() {
		List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
		textVoices.add(TextToSpeechVoice.create(module.getSpeechTextItem(ImageGapModule.REMOVED_INDEX)));
		textVoices.add(TextToSpeechVoice.create(this.altText, this.langTag));
		speak(textVoices);
	}

	public void readStatus() {
		List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
		if (this.imageUrl.length() > 0) {
			textVoices.add(TextToSpeechVoice.create(this.altText, this.langTag));
			if (getElement().getClassName().contains(CORRECT_STYLE) && !(getElement().getClassName().contains(SHOW_CORRECT_STYLE))) {
				textVoices.add(TextToSpeechVoice.create(module.getSpeechTextItem(ImageGapModule.CORRECT_INDEX)));
			} else if (getElement().getClassName().contains(WRONG_STYLE)) {
				textVoices.add(TextToSpeechVoice.create(module.getSpeechTextItem(ImageGapModule.WRONG_INDEX)));
			}
		} else {
			textVoices.add(TextToSpeechVoice.create(module.getSpeechTextItem(ImageGapModule.EMPTY_INDEX)));
		}
		speak(textVoices);
	}
	
	private void speak (List<TextToSpeechVoice> textVoices) {
		if (this.isWCAGOn && this.pageController != null) {
			this.pageController.speak(textVoices);
		}
	}
	
	@Override
	public void setVisible(boolean visible) {
		if (visible) {
			super.setVisible(true);
			getElement().getStyle().setProperty("display", originalDisplay);	
		} else {
			super.setVisible(false);
		}
	}

}
