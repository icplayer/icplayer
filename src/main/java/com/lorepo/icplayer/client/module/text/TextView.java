package com.lorepo.icplayer.client.module.text;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.AudioElement;
import com.google.gwt.dom.client.Document;
import com.google.gwt.event.dom.client.*;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.text.TextPresenter.IDisplay;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.utils.MathJax;
import com.lorepo.icplayer.client.utils.MathJaxElement;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;


public class TextView extends HTML implements IDisplay, IWCAG, MathJaxElement, IWCAGModuleView{
	private final TextModel module;
	private ITextViewListener listener;
	private ArrayList<TextElementDisplay> textElements = new ArrayList<TextElementDisplay>();
	private final ArrayList<String> mathGapIds = new ArrayList<String>();
	private boolean moduleHasFocus = false;
	private int clicks = -1;
	private TextElementDisplay activeGap = null;
	private PageController pageController;
	private ArrayList<InlineChoiceInfo> inlineChoiceInfoArrayList = new ArrayList<InlineChoiceInfo>();
	private boolean isWCAGon = false;
	private boolean isShowErrorsMode = false;
	private boolean mathJaxIsLoaded = false;
	private JavaScriptObject mathJaxHook = null;
	private String originalDisplay = "";
	private boolean isPreview = false;
	
	// because of bug (#4498, commit b4c6f7ea1f4a299dc411de1cff408549aa22bf54) FilledGapWidgets aren't added to textElements array as FilledGapWidgets, but as GapWidgets (check connectFilledGaps vs connectGaps)
	// later this causes issues with inheritance in reconnectHandlers function, so this array contains proper objects (because of poor filledGaps creation, they are added twice - as GapWidgets and FilledGapWidgets)
	private ArrayList<GapWidget> gapsWidgets = new ArrayList<GapWidget>();
	
	public TextView (TextModel module, boolean isPreview) {
		this.module = module;
		this.isPreview = isPreview;
		createUI(isPreview);
		mathJaxLoaded();
	}

	@Override
	public void mathJaxLoaded() {
		this.mathJaxHook = MathJax.setCallbackForMathJaxLoaded(this);
	}
	
	private void createUI (boolean isPreview) {
		getElement().setId(module.getId());
		setStyleName("ic_text");
		StyleUtils.applyInlineStyle(this, module);
		originalDisplay = getElement().getStyle().getDisplay();
		if (!isPreview && !module.isVisible()) {
			hide();
		}
		
		if (this.module.isTabindexEnabled()) {
			this.getElement().setTabIndex(0);
		}
		
		getElement().setAttribute("lang", this.module.getLangAttribute());
	}
	
	public void mathJaxIsLoadedCallback() {
        if (!this.mathJaxIsLoaded) {
            this.mathJaxIsLoaded = true;
            this.refreshMath();
        }
    }

	public ITextViewListener getListener() {
		return listener;
	}

	public void addElement(TextElementDisplay el) {
		textElements.add(el);
	}

	@Override
	public void connectInlineChoices (List<InlineChoiceInfo> InlineChoiceList) {
		final int gapWidth = module.getGapWidth();
		
		for (InlineChoiceInfo ic: InlineChoiceList) {
			inlineChoiceInfoArrayList.add(ic);
			InlineChoiceWidget gap = new InlineChoiceWidget(ic, listener,this);
			gap.setLang(this.module.getLangAttribute());
			if (gapWidth > 0) {
				gap.setWidth(gapWidth + "px");
			}
			
			gap.setDisabled(module.isDisabled());
			
			textElements.add(gap);
		}
	}
	
	private void setPageControllerToInLineChoices () {
		for (InlineChoiceInfo c: this.inlineChoiceInfoArrayList) {
			InlineChoiceWidget gap = new InlineChoiceWidget(c, listener,this);
			gap.setPageController(this.pageController);
		}
	}

	@Override
	public void connectDraggableGaps(Iterator<GapInfo> giIterator) {
		int gapWidth = module.getGapWidth();
		while (giIterator.hasNext()) {
			GapInfo gi = giIterator.next();
			DraggableGapWidget gap = new DraggableGapWidget(gi, listener);
			if (gapWidth > 0) {
				gap.setWidth(gapWidth + "px");
			}
			
			gap.setDisabled(module.isDisabled());
			textElements.add(gap);
		}
	}

	@Override
	public void connectGaps(Iterator<GapInfo> giIterator) {
		int gapWidth = module.getGapWidth();
		while (giIterator.hasNext()) {
			GapInfo gi = giIterator.next();
			try {
				GapWidget gap = new GapWidget(gi, listener);
				
				if (gapWidth > 0) {
					gap.setWidth(gapWidth + "px");
				}
				
				if (!module.isOldGapSizeCalculation()) {
					setSizeAttributeToLongestAnswerSize(gap, gi);
				}
				
				gap.setDisabled(module.isDisabled());
				gapsWidgets.add(gap);
				textElements.add(gap);
			} catch (Exception e) {
				Window.alert("Can't create module: " + gi.getId());
			}
		}
	}

	@Override
	public void connectFilledGaps(Iterator<GapInfo> giIterator) {
		int gapWidth = module.getGapWidth();
		while (giIterator.hasNext()) {
			GapInfo gi = giIterator.next();

			if (gi.getPlaceHolder() == "") {
				continue;
			}
			try {
				FilledGapWidget gap = new FilledGapWidget(gi, listener);
				if (gapWidth > 0) {
					gap.setWidth(gapWidth + "px");
				}
				
				gap.setDisabled(module.isDisabled());
				gapsWidgets.add(gap);
			} catch (Exception e) {
				Window.alert("Can't create module: " + gi.getId());
			}
		}
	}

	@Override
	public void connectMathGap(Iterator<GapInfo> giIterator, String id, ArrayList<Boolean> savedDisabledState) {
		while (giIterator.hasNext()) {
			GapInfo gi = giIterator.next();
			if (gi.getId().equals(id)) {
				try {
					int counter = Integer.parseInt(id.split("-")[1]) - 1;
					if (mathGapIds.contains(id)) {
						if (savedDisabledState.size() > counter) {
							GapWidget gap = (GapWidget) getChild(counter);
							gap.setDisabled(savedDisabledState.get(counter));

							textElements.set(counter, gap);
							gapsWidgets.set(counter, gap);
						}
					} else {
						GapWidget gap = new GapWidget(gi, listener);
						if (savedDisabledState.size() > 0) {
							gap.setDisabled(savedDisabledState.get(counter));
						} else {
							gap.setDisabled(module.isDisabled());
						}

						textElements.add(gap);
						gapsWidgets.add(gap);
						mathGapIds.add(id);
					}
				} catch (Exception e) {
					Window.alert("Can't create module: " + gi.getId());
				}
			}
		}
	}

	@Override
	public void connectLinks(Iterator<LinkInfo> it) {
		while (it.hasNext()) {
			final LinkInfo info = it.next();
			if (DOM.getElementById(info.getId()) != null) {
				LinkWidget widget = new LinkWidget(info);
				widget.addClickHandler(new ClickHandler() {

					@Override
					public void onClick(ClickEvent event) {
						event.stopPropagation();
						event.preventDefault();
						if (listener != null) {
							listener.onLinkClicked(info.getType(), info.getHref(), info.getTarget());
						}
						event.preventDefault();
					}
				});
			}
		}
	}

	@Override
	public void connectAudios(Iterator<AudioInfo> iterator) {
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

			textElements.add(button);
		}
	}

	private int getIndexOfNextGapType (int startingIndex, String gapType, ArrayList<TextElementDisplay> textElements) {
		for (int i=startingIndex; i<textElements.size(); i++) {
			TextElementDisplay textElement = textElements.get(i);
			String teGapType = textElement.getGapType() == "draggable" ? "gap" : textElement.getGapType();
			if (teGapType == gapType) {
				return i;
			}
		}

		return -1;
	}
	
	public void sortGapsOrder () {
		final List<String> gapsOrder = WCAGUtils.getGapsOrder(module);
		final int gapsOrderSize = gapsOrder.size();
		final int textElementsSize = textElements.size();
		
		if (gapsOrderSize == 0 && textElementsSize != gapsOrderSize) {
			return;
		}
		
		for (int i=0; i<textElementsSize && i<gapsOrderSize; i++) {
			final String gapType = gapsOrder.get(i);
			final String currentGapType = textElements.get(i).getGapType();
			
			if (gapType != currentGapType) {
				int correctElementId = getIndexOfNextGapType(i, gapType, textElements);
				
				if (correctElementId != -1) {
					textElements.add(i, textElements.get(correctElementId));
					textElements.remove(correctElementId+1);
				}
			}
		}
	}

	@Override
	public void addListener(ITextViewListener l) {
		listener = l;
	}

	@Override
	public void setDroppedElements(String id, String element) {
		for(TextElementDisplay gap : textElements){
			if(gap.getId().substring(gap.getId().lastIndexOf("-") + 1) == id.substring(id.lastIndexOf("-") + 1)){
				gap.setDroppedElement(element);
				return;
			}
		}
	}

	@Override
	public HashMap<String, String> getDroppedElements() {
		HashMap<String, String> droppedElements = new HashMap<String, String>();

		for (TextElementDisplay gap : textElements) {
			String helper = gap.getDroppedElement();
			if (helper != null) {
				String escaped = StringUtils.escapeXML(helper);
				droppedElements.put(gap.getId(), escaped);
			}
		}

		return droppedElements;
	}

	@Override
	public void setValue (String id, String value) {
		for (TextElementDisplay gap : textElements) {
			if (gap.hasId(id)) {
				gap.setText(value);
				if (!value.equals("---")) {
					gap.removeDefaultStyle();
				}
				return;
			}
		}
	}

	@Override
	public int getChildrenCount() {
		return textElements.size();
	}

	@Override
	public TextElementDisplay getChild (int index) {
		return textElements.get(index);
	}

	@Override
	public void setHTML (String html) {
		if (isPreview && module.hasSyntaxError()) {
			html += "<div class=\"errorMessage\">" + DictionaryWrapper.get("text_parse_error") + "</div>";
		}
		super.setHTML(html);
	}
	
	public void setValue(String text) {
		super.setHTML(text);
		this.module.setText(text);
	}

	@Override
	public void refreshMath () {
		MathJax.refreshMathJax(getElement());
	}

	public void rerenderMathJax () {
		MathJax.rerenderMathJax(getElement());
		// If mathjax was re rendered then gaps lost handlers to thers DOM elements.
		this.reconnectHandlers();
	}

	@Override
	public void hide() {
		setVisible(false);
	}

	@Override
	public void show(boolean callRefreshMath) {
		setVisible(true);
		if (this.mathJaxIsLoaded) {
			refreshMath();
		}
		if (callRefreshMath) {
			refreshMath();
			rerenderMathJax();
		}
	}
	
	private void reconnectHandlers () {
		for (GapWidget element: this.gapsWidgets) {
			element.reconnectHandlers(this.listener);
		}
	}

	private int getTextElementsSize() {
		return textElements.size();
	}
	
	private void removeAllSelections () {
		for (TextElementDisplay element: this.textElements) {
			element.deselect();
		}
	}
	
	public native void connectDOMNodeRemovedEvent (String id) /*-{
		var $addon = $wnd.$(".ic_page [id='" + id + "']"),
			addon = $addon[0];

		function onDOMNodeRemoved (event) {
			var $droppableElements, $draggableElements;
			if (event.target !== addon) {
				return;
			}

			$wnd.MathJax.Hub.getAllJax().forEach(function (mathJaxElement) {
				mathJaxElement.Detach();
				mathJaxElement.Remove();
			});

			addon.removeEventListener("DOMNodeRemoved", onDOMNodeRemoved);

			$droppableElements = $addon.find(".ui-droppable");
			$draggableElements = $addon.find(".ui-draggable");

			$droppableElements.droppable("destroy");
			$draggableElements.draggable("destroy");

			$droppableElements = null;
			$draggableElements = null;
			addon = null;
			$addon = null;
		}

		if (addon && addon.addEventListener) {
		    addon.addEventListener("DOMNodeRemoved", onDOMNodeRemoved);
		} else {
            $addon = null;
            addon = null;
        }
	}-*/;

	@Override
	public String getName() {
		return "Text";
	}
	
	public void enter (KeyDownEvent event, boolean isExiting) {
		if (isExiting) {
			this.removeAllSelections();
			clicks = -1;
			activeGap = null;
		} else {
			if (activeGap == null) {
				if (textElements.size() > 0) {
					activeGap = textElements.get(0);
				}
			} else {
				if (!moduleHasFocus) {
					activeGap.setFocusGap(true);
					moduleHasFocus = true;
				}
			}

			this.readTextContent();
		}
	}
	
	private void move (boolean goNext) {
		int size = getTextElementsSize();
		
		if (size == 0) {
			return;
		}
		
		this.removeAllSelections();
		
		clicks += goNext ? 1 : -1;
		
		if (clicks >= size) {
			clicks = size-1;
		}
		
		if (clicks < 0) {
			clicks = 0;
		}
		
		activeGap = textElements.get(clicks);
		activeGap.setFocusGap(true);
		moduleHasFocus = true;
		
		this.readGap(activeGap.getGapType(), clicks, activeGap.getWCAGTextValue(),activeGap.getGapState(), activeGap.getLangTag());
	}

	@Override
	public void tab (KeyDownEvent event) {
		this.move(true);
	}

	@Override
	public void escape(KeyDownEvent event) {
	    event.preventDefault();
		this.removeAllSelections();
		moduleHasFocus = false;
		clicks = -1;
		activeGap = null;
	}

	@Override
	public void shiftTab (KeyDownEvent event) {
		this.move(false);
	}
	
	@Override
	public void left (KeyDownEvent event) {
		inlineChoiceChangeSelected(event, false);
	}

	@Override
	public void right (KeyDownEvent event) {
		inlineChoiceChangeSelected(event, true);
	}

	@Override
	public void down (KeyDownEvent event) {
		if((moduleHasFocus == false  ||  activeGap.getGapType() == "draggable" )){
			event.preventDefault(); 
		}
				
	inlineChoiceChangeSelected(event, true);
	}

	@Override
	public void up (KeyDownEvent event) {		
		if((moduleHasFocus == false  ||  activeGap.getGapType() == "draggable" )){
			event.preventDefault(); 
		}
		
		inlineChoiceChangeSelected(event, false);
	}

	@Override
	public void space(KeyDownEvent event) {
		if((moduleHasFocus == false  ||  activeGap.getGapType() == "draggable" )){
			event.preventDefault(); 
		}
				
	    if(!WCAGUtils.hasGaps(this.module)){ // text without gaps
	        event.preventDefault();
	    }
		if(!isShowErrorsMode && WCAGUtils.hasGaps(this.module)){
			if (isWCAGon && activeGap != null && activeGap.getGapType().equals("dropdown") ) {
				event.preventDefault(); // Prevent space button from displaying dropdown list when in WCAG mode
				return;
			}
			String oldTextValue = activeGap.getTextValue();
			this.listener.onGapClicked(activeGap.getId());
			if (isWCAGon && activeGap.getDroppedElement()!=null) {
				String elementText = getDroppedElementText(activeGap.getDroppedElement());
				if (elementText.length()>0) {
					List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
					textVoices.add(TextToSpeechVoice.create(elementText,this.getLang()));
					textVoices.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(TextModel.INSERT_INDEX)));
					this.speak(textVoices);
				} else if (oldTextValue.length()>0 && activeGap.getTextValue().length()==0) {
					List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
					textVoices.add(TextToSpeechVoice.create(oldTextValue,this.getLang()));
					textVoices.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(TextModel.REMOVED_INDEX)));
					this.speak(textVoices);
				}
			}
		}
	}

	private void inlineChoiceChangeSelected (KeyDownEvent event, boolean next) {
		if (isWCAGon && activeGap!=null && activeGap.getGapType().equals("dropdown")) {
			InlineChoiceWidget icw = (InlineChoiceWidget) activeGap;
			if (icw.getPageController() == null){
				icw.setPageController(this.pageController);
			};
			event.preventDefault();
			icw.changeSelected(next);
		}
	}
	
	private native static String getDroppedElementText(String element) /*-{
		return $wnd.$(element).text();
	}-*/;

	@Override
	public void setWorkMode(){
		this.isShowErrorsMode = false;
	}
	
	@Override
	public void setShowErrorsMode () {
		this.isShowErrorsMode = true;
	}
	
	@Override
	public void customKeyCode(KeyDownEvent event) {}

	@Override
	public boolean isWCAGon() {
		return this.isWCAGon;
	}

	@Override
	public void setWCAGStatus (boolean isOn) {
		this.isWCAGon = isOn;
	}

	@Override
	public void setPageController (PageController pc) {
		this.setWCAGStatus(true);
		this.pageController = pc;
		this.setPageControllerToInLineChoices();
	}
	
	public String getLang () {
		return this.module.getLangAttribute();
	}

	private void readGap (String type, int index, String content, int gapState, String langTag) {
		if(langTag == null){
			langTag = this.module.getLangAttribute();
		}
		final String gapType = type == "dropdown" ? this.module.getSpeechTextItem(TextModel.DROPDOWN_INDEX) : this.module.getSpeechTextItem(TextModel.GAP_INDEX);

		List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
		textVoices.add(TextToSpeechVoice.create(gapType + " " + Integer.toString(index + 1)));
		if ( type.equals("dropdown") && ( content.equals("-") || content.equals("---"))) {
			if(!this.isShowErrorsMode) {
				textVoices.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(TextModel.EMPTY_INDEX)));
			}
		} else {
			textVoices.add(TextToSpeechVoice.create(content, langTag));
		}
		
		if(this.isShowErrorsMode) {
			if(gapState==1) {
				textVoices.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(TextModel.CORRECT_INDEX)));
			}else if(gapState==2) {
				textVoices.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(TextModel.WRONG_INDEX)));
			}else if(gapState==3) {
				textVoices.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(TextModel.EMPTY_INDEX)));
			}
		}

		this.speak(textVoices);
	}
	
	public String getSpeechText (int index) {
		return this.module.getSpeechTextItem(index);
	}
	
	private void readTextContent () {
		final List<TextToSpeechVoice> result = WCAGUtils.getReadableText(this.module, this.textElements, this.module.getLangAttribute());
		this.speak(result);
	}
	
	private void speak (TextToSpeechVoice t1) {
		List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
		textVoices.add(t1);
		
		this.speak(textVoices);
	}
	
	private void speak (List<TextToSpeechVoice> textVoices) {
		if (this.pageController != null && this.isWCAGon) {
			this.pageController.speak(textVoices);
		}
	}
	
	@Override
	protected void onDetach() {		
		this.removeHook();
		
		super.onDetach();
	};

	@Override
	public void removeHook() {
		if (this.mathJaxHook != null) {
			MathJax.removeMessageHookCallback(this.mathJaxHook);
			this.mathJaxHook = null;
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
	
	private void setSizeAttributeToLongestAnswerSize(GapWidget gap, GapInfo info) {
		int longestAnswer = info.getLongestAnswerLength();
		gap.setSizeAttribute(longestAnswer);
	}

}
