package com.lorepo.icplayer.client.module.imagesource;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.dom.client.Style.Unit;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.DragStartEvent;
import com.google.gwt.event.dom.client.DragStartHandler;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.MouseUpEvent;
import com.google.gwt.event.dom.client.MouseUpHandler;
import com.google.gwt.event.dom.client.TouchEndEvent;
import com.google.gwt.event.dom.client.TouchEndHandler;
import com.google.gwt.user.client.ui.Image;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter.IDisplay;
import com.lorepo.icplayer.client.page.PageController;

public class ImageSourceView extends Image implements IDisplay, IWCAG, IWCAGModuleView {

	private static final String DEFAULT_STYLE = "ic_sourceImage";
	private static final String SELECTED_STYLE = "selected";
	private static final String DISABLED_STYLE = "disabled";
	private static final String ACTIVE_STYLE = "ic_active_module";
	
	private ImageSourceModule module;
	private IViewListener listener;
	private boolean isDragged = false;
	private boolean isTouchSupported = false;
	private boolean isPreview;
	private int initialLeft;
	private int initialTop;
	private boolean disabled = false;
	private boolean isWCAGon = false;
	private PageController pageController;
	private String originalDisplay = "";
	
	public ImageSourceView(ImageSourceModule module, boolean isPreview) {
		this.module = module;
		this.isPreview = isPreview;
		createUI();
		connectHandlers();
	}

	private void createUI() {
		setStyleName(DEFAULT_STYLE);
		StyleUtils.applyInlineStyle(this, module);
		originalDisplay = getElement().getStyle().getDisplay();
		if (isPreview && module.isDisabled()) {
			StyleUtils.addStateDisableClass(this);
		}

		String imageUrl = module.getUrl();
		if (imageUrl.length() > 0) {
			setUrl(imageUrl);
		}
		
		getElement().setId(module.getId());
		if (!isPreview) {
			setVisible(module.isVisible());
		}
		
		getElement().setAttribute("alt", this.module.getAlttext());
		getElement().setAttribute("lang", this.module.getLangAttribute());
		
		if (this.module.isTabindexEnabled()) {
			getElement().setTabIndex(0);
		}
	}
	
	@Override
	public boolean getDisabled() {
		return this.disabled;
	}
	
	@Override
	public void setDisabled(boolean disable) {
		this.disabled = disable;
		if (disabled) {
			addStyleDependentName(DISABLED_STYLE);
			removeDraggable(getElement());
		} else {
			removeStyleDependentName(DISABLED_STYLE);
			reDraggableElement(getElement());
		}
	}
	
	public native static void removeDraggable(Element e) /*-{
		$wnd.$(e).draggable( "option", "disabled", true );
	}-*/;

	public native static void reDraggableElement(Element e) /*-{
		$wnd.$(e).draggable( "option", "disabled", false );
	}-*/;
	
	public void makeDraggable(ImageSourcePresenter p) {
		if (!isPreview) {
			JavaScriptUtils.makeDraggable(getElement(), p.getAsJavaScript());
		}
	}
	
	protected void connectHandlers() {
		addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				event.stopPropagation();
				event.preventDefault();
			}
		});

		addDragStartHandler(new DragStartHandler() {
			@Override
			public void onDragStart(DragStartEvent event) {
				if (listener != null && !disabled) {
					listener.onDragged();
				}
			}
		});
		
		addMouseUpHandler(new MouseUpHandler() {
			@Override
			public void onMouseUp(MouseUpEvent event) {
				if (!isDragged && !isTouchSupported) {
					if (listener != null && !disabled) {
						listener.onClicked();
					}
				}
			}
		});
		
		addTouchEndHandler(new TouchEndHandler() {
			@Override
			public void onTouchEnd(TouchEndEvent event) {
				isTouchSupported = true;
				if (!isDragged) {
					if (listener != null && !disabled) {
						listener.onClicked();
					}
				}
			}
		});
	}

	@Override
	public void select() {
		setStyleDependentName(SELECTED_STYLE, true);
		List<TextToSpeechVoice> voicesArray = new ArrayList<TextToSpeechVoice>();
		voicesArray.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(ImageSourceModule.SELECTED_INDEX)));
		speak(voicesArray);
		
	}

	@Override
	public void deselect() {
		setStyleDependentName(SELECTED_STYLE, false);
		if(isActive()){
			List<TextToSpeechVoice> voicesArray = new ArrayList<TextToSpeechVoice>();
			voicesArray.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(ImageSourceModule.DESELECTED_INDEX)));
			speak(voicesArray);
		}
	}

	private boolean isActive(){
		String[] classes = this.getElement().getClassName().toLowerCase().split(" ");
		for(String _class: classes){
			if(_class.equals(ACTIVE_STYLE)){
				return true;
			}
		}
		return false;
	}
	
	private boolean isSelected(){
		String[] classes = this.getElement().getClassName().toLowerCase().split(" ");
		for(String _class: classes){
			if(_class.equals((this.getStylePrimaryName()+"-"+SELECTED_STYLE).toLowerCase())){
				return true;
			}
		}
		return false;
	}

	@Override
	public void addListener(IViewListener l) {
		listener = l;
	}
	
	public void show(boolean refreshPosition) {
		setVisible(true);
		if (refreshPosition) {
			setInitialPosition();
		}
	}
	
	public void setDragMode() {
		isDragged = true;
	}
	
	public void unsetDragMode() {
		isDragged = false;
	}

	@Override
	public void hide() {
		setVisible(false);
	}
	
	public void getInitialPosition() {
		initialLeft = Integer.parseInt(getElement().getStyle().getLeft().replace("px", ""));
		initialTop = Integer.parseInt(getElement().getStyle().getTop().replace("px", ""));
	}
	
	private void setInitialPosition() {
		getElement().getStyle().setLeft(initialLeft, Unit.PX);
		getElement().getStyle().setTop(initialTop, Unit.PX);
	}

	@Override
	public String getName() {
		return "ImageSource";
	}

	public void enter(KeyDownEvent event, boolean isExiting) {
		List<TextToSpeechVoice> voicesArray = new ArrayList<TextToSpeechVoice>();
		voicesArray.add(TextToSpeechVoice.create(this.module.getAlttext(),this.module.getLangAttribute()));
		if (isSelected()) {
			voicesArray.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(ImageSourceModule.SELECTED_INDEX)));
		}
		if (disabled) {
			voicesArray.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(ImageSourceModule.DISABLED_INDEX)));
		}
		speak(voicesArray);
	}

	@Override
	public void space(KeyDownEvent event) {
		event.getNativeEvent().preventDefault();
		if (listener != null && !disabled) {
			this.listener.onClicked();
		}
		if (disabled) {
			speak(TextToSpeechVoice.create(this.module.getSpeechTextItem(ImageSourceModule.DISABLED_INDEX)));
		}
	}

	@Override
	public void tab(KeyDownEvent event) {
	}

	@Override
	public void left(KeyDownEvent event) {
	}

	@Override
	public void right(KeyDownEvent event) {
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
	}

	@Override
	public void customKeyCode(KeyDownEvent event) {
	}

	@Override
	public void shiftTab(KeyDownEvent event) {
	}

	@Override
	public void setPageController(PageController pc) {
		this.setWCAGStatus(true);
		this.pageController = pc;
	}

	@Override
	public void setWCAGStatus(boolean isWCAGOn) {
		this.isWCAGon = isWCAGOn;
	}

	@Override
	public String getLang() {
		return this.module.getLangAttribute();
	}
	
	private void speak (TextToSpeechVoice textVoice) {
		if (this.isWCAGon && this.pageController != null) {
			List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
			textVoices.add(textVoice);
			this.pageController.speak(textVoices);
		}
	}
	
	private void speak (List<TextToSpeechVoice> textVoices) {
		if (this.isWCAGon && this.pageController != null) {
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
