package com.lorepo.icplayer.client.module.choice;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.EndedHandler;
import com.google.gwt.event.dom.client.EndedEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.user.client.DOM;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.AudioElement;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;
import com.lorepo.icplayer.client.module.text.WCAGUtils;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.utils.MathJax;
import com.lorepo.icplayer.client.utils.MathJaxElement;
import com.lorepo.icplayer.client.module.text.AudioInfo;
import com.lorepo.icplayer.client.module.text.AudioWidget;
import com.lorepo.icplayer.client.module.text.AudioButtonWidget;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Iterator;


public class ChoiceView extends AbsolutePanel implements ChoicePresenter.IDisplay, ValueChangeHandler<Boolean>, IWCAG, IWCAGModuleView, MathJaxElement {

	private ChoiceModel module;
	private VerticalPanel optionsPanel;
	private HorizontalPanel optionsPanelHorizontal;
	private ArrayList<IOptionDisplay> optionWidgets = new ArrayList<IOptionDisplay>();
	private ArrayList<IOptionDisplay> orderedWidgets = new ArrayList<IOptionDisplay>();
	private IOptionListener listener;
	private int[] order;
	private PageController pageController;
	private String selectedText = "selected";
	private String deselectedText = "deselected";
	private String correctText = "correct";
	private String incorrectText = "incorrect";
	private boolean isEnabled = true;
	private boolean isWCAGOn = false;
	private boolean isShowErrorsMode = false;
	private boolean mathJaxIsLoaded = false;
	private JavaScriptObject mathJaxHook = null;
	private String originalDisplay = "";

	private int position = -1;
	
	public ChoiceView(ChoiceModel module, boolean isPreview) {
		this.module = module;
		createUI(isPreview);
		mathJaxLoaded();
	}
	
	/**
	 * To zamieszanie z tworzeniem VerticalPanel jest potrzebne ponieważ bez tego 
	 * GWT głupieje.
	 * @param isPreview 
	 */
	private void createUI(boolean isPreview){

		optionsPanel = new VerticalPanel();
		optionsPanelHorizontal = new HorizontalPanel();

		if(module.isHorizontalLayout()){
			optionsPanelHorizontal.setStyleName("ic_choice");
		}else{
			optionsPanel.setStyleName("ic_choice");
		}
		
		makeOrder(isPreview);
		
		for(int i = 0; i < order.length; i++) {
			ChoiceOption option;
			option = module.getOption(order[i]);
			OptionView widget;
			widget = new OptionView(option, module.isMulti());
			
			if (!this.module.isTabindexEnabled()) {
				// must be negative other than -1, otherwise GWT resets it to 0 for FocusWidget in onAttach
				widget.setTabIndex(-2);
			}
			
			widget.addValueChangeHandler(this);
			optionWidgets.add(widget);
			if(module.isHorizontalLayout()){
				optionsPanelHorizontal.add((Widget)widget);
			}else{
				optionsPanel.add((Widget)widget);
			}
		}

		getOrderedOptions();
		if(module.isHorizontalLayout()){
			optionsPanelHorizontal.setSize("100%", "100%");
			add(optionsPanelHorizontal);
			setWidgetPosition(optionsPanelHorizontal, 0, 0);
		}else{
			optionsPanel.setSize("100%", "100%");
			add(optionsPanel);
			setWidgetPosition(optionsPanel, 0, 0);
		}
		
		StyleUtils.applyInlineStyle(this, module);
		originalDisplay = getElement().getStyle().getDisplay();
		if(!isPreview){
			setVisible(module.isVisible());
		}
		getElement().setId(module.getId());
		if(module.isDisabled()){
			setEnabled(false);
		}
		
		getElement().setAttribute("lang", this.module.getLangAttribute());
		
		if(this.module.getSpeechTextItem(0) != "") {
			this.selectedText = this.module.getSpeechTextItem(0);
		}
		
		if(this.module.getSpeechTextItem(1) != "") {
			this.deselectedText = this.module.getSpeechTextItem(1);
		}
		
		if(this.module.getSpeechTextItem(2) != "") {
			this.correctText = this.module.getSpeechTextItem(2);
		}
		
		if(this.module.getSpeechTextItem(3) != "") {
			this.incorrectText = this.module.getSpeechTextItem(3);
		}
	}
	
	@Override
	protected void onDetach() {
		this.removeHook();
		
		super.onDetach();
	};
	
	@Override
	public void mathJaxLoaded() {
		this.mathJaxHook = MathJax.setCallbackForMathJaxLoaded(this);
	}
	    
	@Override
	public void mathJaxIsLoadedCallback() {
		if (!this.mathJaxIsLoaded) {
			this.mathJaxIsLoaded = true;
			this.refreshMath();
		}
	}
	
	
	private void shuffleArray(List<Integer> list) {
        int n = list.size();
        Random random = new Random();
        random.nextInt();
        for (int i = 0; i < n; i++) {
            int change = i + random.nextInt(n - i);
            swap(list, i, change);
        }
    }

    private void swap(List<Integer> list, int i, int change) {
        int helper = list.get(i);
        list.set(i, list.get(change));
        list.set(change, helper);
    }
	
    private List<Integer> singlePerm(int size){
		  
		List<Integer> list = new ArrayList<Integer>();
		for(int i = 0; i < size; i ++){
			list.add(i);
		}

		shuffleArray(list);
		return list;
	}
	
	private void makeOrder(boolean isPreview) {
		if (!isPreview && module.isRandomOrder()) {
			List<Integer> tmp_order = singlePerm(module.getOptionCount());
			order = new int[module.getOptionCount()];
			for(int i = 0; i < module.getOptionCount(); i ++) {
				order[i]=tmp_order.get(i);
			}
		} else {
			order = new int[module.getOptionCount()];
			for(int i = 0; i < module.getOptionCount(); i ++) {
				order[i]=i;
			}
		}
	}

	public void getOrderedOptions() {
		for (int i = 0; i < order.length; i++) {
			for (int j = 0; j < order.length; j++) {
				if (order[j] == i) {
					orderedWidgets.add(optionWidgets.get(j));
				}
			}
		}
	}
	
	@Override
	public List<IOptionDisplay> getOptions() {
		return orderedWidgets;
	}

	@Override
	public void addListener(IOptionListener listener) {
		this.listener = listener;
	}

	@Override
	public void onValueChange(ValueChangeEvent<Boolean> event) {
		if (listener != null) {
			listener.onValueChange((IOptionDisplay) event.getSource(), event.getValue());
		}
		
	}

	@Override
	public void setEnabled(boolean b) {

		for (IOptionDisplay optionView : optionWidgets) {
			OptionView widget = (OptionView) optionView;
			widget.setEnabled(b);
		}
	}
	
	@Override
	public void isShowErrorsMode(boolean isShowErrorsMode) {
		this.isShowErrorsMode = isShowErrorsMode;
	}

	@Override
	public void hide() {
		setVisible(false);
	}

	@Override
	public void show() {
		setVisible(true);
		if (this.mathJaxIsLoaded) {
			refreshMath();
		}
	}
	
	@Override
	public void setVisibleVal(boolean val) {
		setVisible(val);
	}

	@Override
	public void refreshMath() {
		MathJax.refreshMathJax(getElement());
	}

	public int[] getOryginalOrder() {
		int[] array = new int[order.length];
		for (int i=0; i<order.length; i++) {
			array[order[i]]=i;
		}
		return array;
	}

	private void skip() {
		position++;
		
		if (position == optionWidgets.size()) {
			position = position-1;
		}

		IOptionDisplay option = optionWidgets.get(position);

		for (IOptionDisplay widget : optionWidgets) {
			widget.removeBorder();
		}
		
		if (option != null) {
			option.addBorder();
		}
	}
	
	private void previous () {
		position--;

		if (position < 0) {
			position = position + 1;
		}

		IOptionDisplay option = optionWidgets.get(position);

		for (IOptionDisplay widget : optionWidgets) {
			widget.removeBorder();
		}

		if (option != null) {
			option.addBorder();
		}
	}
	
	private void textToSpeechCurrentOption () {
		IOptionDisplay widget = optionWidgets.get(position);
		ChoiceOption option = widget.getModel();
		String callbackText = "";
		
		if (widget.isDown()) {
			if (this.isShowErrorsMode) {
				final String checkText = option.getValue() > 0 ? this.correctText : this.incorrectText;
				callbackText = this.selectedText + " " + checkText;
			} else {
				callbackText = this.selectedText;
			}
		}
		
		List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
		String fullText = StringUtils.removeAllFormatting(WCAGUtils.getImageAltTextsWithBreaks(widget.getModel().getText()));
		String[] textsArray = fullText.split(WCAGUtils.BREAK_TEXT);
		for(String text: textsArray){
			textVoices.add(TextToSpeechVoice.create(text, this.getLang()));
		}
		textVoices.add(TextToSpeechVoice.create(callbackText));
		this.speak(textVoices);
	}

	private void textToSpeechSelectOption () {
		IOptionDisplay widget = optionWidgets.get(position);
		OptionView optionView = (OptionView) widget;
		if (!optionView.isEnabled()) return;
		
		this.speak(
			TextToSpeechVoice.create(widget.isDown() ? this.selectedText : this.deselectedText, ""),
			TextToSpeechVoice.create()
		);
	}

	public static native void blurFocusedElements() /*-{
	  $wnd.$(':focus').blur();
	}-*/;
	
	private void select() {
		blurFocusedElements();
		
		if (position < 0) return;
		
		IOptionDisplay option = optionWidgets.get(position);
		
		OptionView optionView = (OptionView) option;
		if (!optionView.isEnabled()) return;

		if (!module.isMulti()) {
			for (IOptionDisplay widget : optionWidgets) {
				if(option != widget) {
					widget.setDown(false);
				}
			}
		}

		if (option != null) {
			option.setDown(!option.isDown());
			listener.onValueChange(option, !option.isDown());
		}
	}
	
	private void addBorder() {
		if (position < 0) {
			position = 0;
		}
		IOptionDisplay option = optionWidgets.get(position);
		
		if (option != null) {
			option.addBorder();
		}
	}
	
	private void removeBorder() {
		if (position < 0) return;
		IOptionDisplay option = optionWidgets.get(position);
		
		if (option != null) {
			option.removeBorder();
		}
	}

	@Override
	public void enter(KeyDownEvent event, boolean isExiting) {
		if (!isExiting) {
			addBorder();
			textToSpeechCurrentOption();
		} else {
			removeBorder();
			position = -1;
		}
	}

	@Override
	public void space(KeyDownEvent event) {
		event.preventDefault(); 
		select();
		textToSpeechSelectOption();
	}

	@Override
	public void tab(KeyDownEvent event) {
		skip();
		textToSpeechCurrentOption();
	}

	@Override
	public void left(KeyDownEvent event) {
		previous();
		textToSpeechCurrentOption();
	}

	@Override
	public void right(KeyDownEvent event) {
        skip();
        textToSpeechCurrentOption();
	}

	@Override
	public void down(KeyDownEvent event) {
		event.preventDefault(); 
		skip();
        textToSpeechCurrentOption();
	}

	@Override
	public void up(KeyDownEvent event) {
		event.preventDefault(); 
	    previous();
		textToSpeechCurrentOption();
	}

	@Override
	public void escape(KeyDownEvent event) {
		event.preventDefault();
		removeBorder();
		position = -1;
	}

	@Override
	public void customKeyCode(KeyDownEvent event) {
	}

	@Override
	public String getName() {
		return "Choice";
	}
	
	@Override
	public void shiftTab(KeyDownEvent event) {
	    previous();
		textToSpeechCurrentOption();
	}

	@Override
	public void setWCAGStatus (boolean isOn) {
		this.isWCAGOn = isOn;
	}

	@Override
	public void setPageController (PageController pc) {
		this.setWCAGStatus(true);
		this.pageController = pc;
	}
	
	@Override
	public String getLang () {
		return this.module.getLangAttribute();
	}
	
	private void speak (TextToSpeechVoice t1, TextToSpeechVoice t2) {
		if (this.pageController != null) {
			List<TextToSpeechVoice> voiceTexts = new ArrayList<TextToSpeechVoice>();
			voiceTexts.add(t1);
			voiceTexts.add(t2);
		
			this.pageController.speak(voiceTexts);
		}
	}
	
	private void speak (List<TextToSpeechVoice> voiceTexts) {
		if (this.pageController != null) {	
			this.pageController.speak(voiceTexts);
		}
	}

	@Override
	public void removeHook() {
		if (this.mathJaxHook != null) {
			MathJax.removeMessageHookCallback(this.mathJaxHook);
		}
	}

	@Override
	public String getElementId() {
		return this.module.getId();
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

	@Override
	public void connectAudios() {
	    for (IOptionDisplay optionView : optionWidgets) {
	        this.connectSingleAudio(optionView.getAudioInfos().iterator());
		}
	}

	private void connectSingleAudio(Iterator<AudioInfo> iterator) {
	    while (iterator.hasNext()) {
	        final AudioInfo info = iterator.next();
			String id = info.getId();

			Element buttonElement = DOM.getElementById(AudioButtonWidget.BUTTON_ID_PREFIX + id);
			AudioButtonWidget button = new AudioButtonWidget(buttonElement);

			AudioElement audioElement = Document.get().getElementById(AudioWidget.AUDIO_ID_PREFIX + id).cast();
			AudioWidget audio = new AudioWidget(audioElement);

			info.setAudio(audio);
			info.setButton(button);

			button.addClickHandler(new ClickHandler() {
				@Override
				public void onClick(ClickEvent clickEvent) {
					if (listener != null) {
						listener.onAudioButtonClicked(info);
					}
				}
			});

			audio.addEndedHandler(new EndedHandler() {
				@Override
				public void onEnded(EndedEvent endedEvent) {
					if (listener != null) {
						listener.onAudioEnded(info);
					}
				}
			});
        }
	}

}
