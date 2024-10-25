package com.lorepo.icplayer.client.module.text;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.AudioElement;
import com.google.gwt.dom.client.Document;
import com.google.gwt.event.dom.client.*;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.metadata.IMetadata;
import com.lorepo.icplayer.client.metadata.ScoreWithMetadata;
import com.lorepo.icplayer.client.metadata.ScoreWithMetadataService;
import com.lorepo.icplayer.client.metadata.ScoreWithMetadataUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.text.TextPresenter.IDisplay;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;
import com.lorepo.icplayer.client.module.text.TextPresenter.NavigationTextElement;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.utils.MathJax;
import com.lorepo.icplayer.client.utils.MathJaxElement;

import java.util.*;


public class TextView extends HTML implements IDisplay, IWCAG, MathJaxElement, IWCAGModuleView {
	private final TextModel module;
	private ITextViewListener listener;
	private ArrayList<TextElementDisplay> textElements = new ArrayList<TextElementDisplay>();
	private ArrayList<NavigationTextElement> navigationTextElements = new ArrayList<NavigationTextElement>();
	private final ArrayList<String> mathGapIds = new ArrayList<String>();
	private boolean moduleHasFocus = false;
	private PageController pageController;
	private ArrayList<InlineChoiceInfo> inlineChoiceInfoArrayList = new ArrayList<InlineChoiceInfo>();
	private boolean isWCAGon = false;
	private boolean isShowErrorsMode = false;
	private boolean mathJaxIsLoaded = false;
	private JavaScriptObject mathJaxHook = null;
	private String originalDisplay = "";
	private boolean isPreview = false;
	private double widthGapMultiplier = 2.5;
	private int unwrappedViewWidth = 0;

	// active index of navigation text elements (including links). The order follows the order of navigation elements.
	private int keyboardNavigationCurrentElementIndex = -1;
	private NavigationTextElement keyboardNavigationCurrentElement = null;
	private TextElementDisplay activeGap = null;

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
		navigationTextElements.add((NavigationTextElement) el);
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
			navigationTextElements.add(gap);
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
			} else {
				String longestAnswer = gi.getLongestAnswer();
				String fontSize = getFontSize(gap.getId());
				int calculatedGapWidth = getCalculatedGapWidth(longestAnswer, fontSize);
				Element gapElement = gap.getElement();
				Boolean gapHasWrapper = this.hasDraggableWrapper(gapElement);

				if (gapElement != null && calculatedGapWidth > 0 && !gapHasWrapper) {
					String minWidth = Integer.toString(calculatedGapWidth) + "px";
					DOM.setStyleAttribute(gapElement, "min-width", minWidth);
				}
			}

			gap.setDisabled(module.isDisabled());
			textElements.add(gap);
			navigationTextElements.add(gap);
		}
	}

	private Boolean hasDraggableWrapper(Element child) {
		com.google.gwt.dom.client.Element parentElement = child.getParentElement();
		
		return parentElement.getClassName().contains("draggable");
	}

	@Override
	public void connectGaps(Iterator<GapInfo> giIterator) {
		int gapWidth = module.getGapWidth();
		while (giIterator.hasNext()) {
			GapInfo gi = giIterator.next();
			try {
				GapWidget gap = new GapWidget(gi, listener);
				gap.setIgnorePlaceholder(module.ignoreDefaultPlaceholderWhenCheck());

				if (gapWidth > 0) {
					gap.setWidth(gapWidth + "px");
				} else if (module.getGapType().equals("Editable")) {
					String longestAnswer = gi.getLongestAnswer();
					String fontSize = getFontSize(gap.getId());
					int calculatedGapWidth = getCalculatedGapWidth(longestAnswer, fontSize);

					if (calculatedGapWidth > 0) {
						changeGapMinWidth(gap, calculatedGapWidth);
					}
				}

				if (!module.isOldGapSizeCalculation()) {
					setSizeAttributeToLongestAnswerSize(gap, gi);
				}

				gap.setDisabled(module.isDisabled());
				gapsWidgets.add(gap);
				textElements.add(gap);
				navigationTextElements.add(gap);
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
				} else {
					String longestAnswer = gi.getLongestAnswer();
					String fontSize = getFontSize(gap.getId());
					int calculatedGapWidth = getCalculatedGapWidth(longestAnswer, fontSize);
					
					if (calculatedGapWidth > 0) {
						changeGapMinWidth(gap, calculatedGapWidth);
					}
				}

				gap.setDisabled(module.isDisabled());
				gapsWidgets.add(gap);
			} catch (Exception e) {
				Window.alert("Can't create module: " + gi.getId());
			}
		}
	}

	private native boolean isElementContainedInBody(Element e)/*-{
		return $doc.body.contains(e);
	}-*/;

	private void changeGapMinWidth(GapWidget gap, int width) {
		String minWidth = Double.toString(1.1 * width) + "px";
		Element gapElement = gap.getElement();

		if (gapElement == null) return;

		com.google.gwt.dom.client.Element parentElement = gapElement.getParentElement();
		int parentWidth = parentElement.getClientWidth();

		if (parentWidth < this.widthGapMultiplier * width) {
			DOM.setStyleAttribute(gapElement, "width", minWidth);
		} else {
			DOM.setStyleAttribute(gapElement, "min-width", minWidth);
		}
		
		this.updateParentProperty(gapElement);
	}

	private void updateParentProperty(Element child) {
		com.google.gwt.dom.client.Element parentElement = child.getParentElement();

		if (parentElement !=null && getGapChildrenCount(parentElement) == 1 && !containsNewLine(parentElement)) {
			double childWidth = child.getClientWidth();
			double viewWidth = getViewUnwrappedWidth();
			if (viewWidth == 0.0 || childWidth / viewWidth > 0.7) {
				parentElement.getStyle().setProperty("text-wrap", "nowrap");
			}
		}
	}

	private native int getGapChildrenCount(com.google.gwt.dom.client.Element parent)/*-{
		var $parent = $wnd.$(parent);
		return $parent.find('select, input').length;
	}-*/;

	private native boolean containsNewLine(com.google.gwt.dom.client.Element parent)/*-{
		var $parent = $wnd.$(parent);
		return $parent.find('br, div').length > 0;
	}-*/;

	private int getViewUnwrappedWidth() {
		if (unwrappedViewWidth == 0) unwrappedViewWidth = getViewUnwrappedWidth(this.getElement());
		return unwrappedViewWidth;
	}

	private native int getViewUnwrappedWidth (com.google.gwt.dom.client.Element view)/*-{
		var $view = $wnd.$(view);
		var $viewCopy = $view.clone();
		$viewCopy.css('visibility', 'hidden');
		$viewCopy.css('width', '');
		$viewCopy.insertAfter($view);
		var unwrappedWidth = $viewCopy[0].offsetWidth;
		$viewCopy.remove();
		return unwrappedWidth;
	}-*/;

	@Override
	public void connectMathGap(Iterator<GapInfo> giIterator, String id, ArrayList<Boolean> savedDisabledState) {
		// Stop if Text view is no longer part of the DOM
		if (!isElementContainedInBody(getElement())) return;
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
						gap.setIgnorePlaceholder(module.ignoreDefaultPlaceholderWhenCheck());
						if (savedDisabledState.size() > 0) {
							gap.setDisabled(savedDisabledState.get(counter));
						} else {
							gap.setDisabled(module.isDisabled());
						}

						textElements.add(gap);
						navigationTextElements.add(gap);
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
							String validLink = StringUtils.unescapeXML(info.getHref());
							listener.onLinkClicked(info.getType(), validLink, info.getTarget());
						}
						event.preventDefault();
					}
				});

				navigationTextElements.add(widget);
			}
		}
	}

	@Override
	public void connectAudios(Iterator<AudioInfo> iterator) {
		int audioIndex = 1;
		while (iterator.hasNext()) {
			final AudioInfo info = iterator.next();
			String id = info.getId();
			info.setIndex(audioIndex);

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

			this.addAudioUpdateTimeEventListener(info);
			this.addAudioPlayingEventListener(info);
			this.addAudioPauseEventListener(info);

			textElements.add(button);
			audioIndex += 1;
		}
	}

	private native String getFontSize(String gapId) /*-{
		var divElement = $wnd.document.getElementById("editor-" + gapId);
		if (!divElement) {
			return "18px";
		}
		var cssObject = window.getComputedStyle(divElement, null);
		var fontSize = cssObject.getPropertyValue("font-size");

		return fontSize;
	}-*/;

	private native int getCalculatedGapWidth(String text, String fontSize) /*-{
		var canvas = document.createElement("canvas");
		var fontFamily = 'Arial';
		var fontOptions = fontSize.concat(" ", fontFamily);
		var context = canvas.getContext("2d");
		context.font =  fontOptions;
		
		var metrics = context.measureText(text);

		return Math.ceil(metrics.width);
	}-*/;

	private native void addAudioUpdateTimeEventListener (AudioInfo info) /*-{
		var audioWidget = info.@com.lorepo.icplayer.client.module.text.AudioInfo::getAudio()();
		var audioElement = audioWidget.@com.lorepo.icplayer.client.module.text.AudioWidget::getElement()();
		var that = this;
		audioElement.addEventListener("timeupdate", function(event) {
			var listener = that.@com.lorepo.icplayer.client.module.text.TextView::getListener()();
			if (listener != null) {
				listener.@com.lorepo.icplayer.client.module.text.ITextViewListener::onAudioTimeUpdate(Lcom/lorepo/icplayer/client/module/text/AudioInfo;)(info);
			}
		});
	}-*/;

	private native void addAudioPlayingEventListener (AudioInfo info) /*-{
		var audioWidget = info.@com.lorepo.icplayer.client.module.text.AudioInfo::getAudio()();
		var audioElement = audioWidget.@com.lorepo.icplayer.client.module.text.AudioWidget::getElement()();
		var that = this;
		audioElement.addEventListener("playing", function(event) {
			var listener = that.@com.lorepo.icplayer.client.module.text.TextView::getListener()();
			if (listener != null) {
				listener.@com.lorepo.icplayer.client.module.text.ITextViewListener::onAudioPlaying(Lcom/lorepo/icplayer/client/module/text/AudioInfo;)(info);
			}
		});
	}-*/;

	private native void addAudioPauseEventListener (AudioInfo info) /*-{
		var audioWidget = info.@com.lorepo.icplayer.client.module.text.AudioInfo::getAudio()();
		var audioElement = audioWidget.@com.lorepo.icplayer.client.module.text.AudioWidget::getElement()();
		var that = this;
		audioElement.addEventListener("pause", function(event) {
			var listener = that.@com.lorepo.icplayer.client.module.text.TextView::getListener()();
			if (listener != null) {
				listener.@com.lorepo.icplayer.client.module.text.ITextViewListener::onAudioPause(Lcom/lorepo/icplayer/client/module/text/AudioInfo;)(info);
			}
		});
	}-*/;

	private int getIndexOfNextGapType (int startingIndex, String gapType, ArrayList<NavigationTextElement> navigationTextElements) {
		for (int i=startingIndex; i<navigationTextElements.size(); i++) {
			NavigationTextElement textElement = navigationTextElements.get(i);
			String teGapType = textElement.getElementType() == "draggable" ? "gap" : textElement.getElementType();
			if (teGapType == gapType) {
				return i;
			}
		}

		return -1;
	}

	public void sortGapsOrder () {
		final List<String> gapsOrder = WCAGUtils.getGapsOrder(module);
		final int gapsOrderSize = gapsOrder.size();
		final int textElementsSize = navigationTextElements.size();

		if (gapsOrderSize == 0 && textElementsSize != gapsOrderSize) {
			return;
		}

		for (int i=0; i<textElementsSize && i<gapsOrderSize; i++) {
			final String gapType = gapsOrder.get(i);
			final String currentGapType = navigationTextElements.get(i).getElementType();

			if (gapType != currentGapType) {
				int correctElementId = getIndexOfNextGapType(i, gapType, navigationTextElements);

				if (correctElementId != -1) {
					navigationTextElements.add(i, navigationTextElements.get(correctElementId));
					navigationTextElements.remove(correctElementId+1);
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
	public int getGapCount() {
		int count = 0;

		for (TextElementDisplay d : textElements) {
			count += d.isActivity() ? 1: 0;
		}

		return count;
	}

	@Override
	public TextElementDisplay getChild (int index) {
		return textElements.get(index);
	}

	@Override
	public TextElementDisplay getActivity(int index) {
		int displayIndex = 0;

		for (TextElementDisplay d : textElements) {
			if (d.isActivity() && displayIndex == index) {
				return d;
			} else {
				displayIndex++;
			}
		}

		return null;
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
		this.addDisplayStyleToMathJaxElements();
	}

	@Override
	public void refreshGapMath(String id) {
		for (TextElementDisplay element: this.textElements) {
			if (element.hasId(id) && element instanceof DraggableGapWidget) {
				Element e = ((DraggableGapWidget) element).getElement();
				MathJax.refreshMathJax(e);
				break;
			}
		}
		this.addDisplayStyleToMathJaxElements();
	}

	public void rerenderMathJax () {
		MathJax.rerenderMathJax(getElement());
		// If mathjax was re rendered then gaps lost handlers to thers DOM elements.
		this.reconnectHandlers();
		this.addDisplayStyleToMathJaxElements();
	}

	public native void addDisplayStyleToMathJaxElements () /*-{
		$wnd.$("annotation-xml").css({display: "flex"});
	}-*/;

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

	public void reconnectHandlersCallback () {
		boolean allGapsLoaded = true;
		for (GapWidget element: this.gapsWidgets) {
			Element gapElement = DOM.getElementById(element.gapInfo.getId());
			if (gapElement != null) {
				element.reconnectHandlers(this.listener);
			} else {
				allGapsLoaded = false;
			}
		}
		if (!allGapsLoaded) reconnectHandlersAfterTimeout(this, 500);
	}

	public void reconnectHandlers () {
		boolean allGapsLoaded = true;
		for (GapWidget element: this.gapsWidgets) {
			Element gapElement = DOM.getElementById(element.gapInfo.getId());
			if (gapElement == null) {
				allGapsLoaded = false;
				break;
			}
		}
		if (allGapsLoaded) {
			reconnectHandlersCallback();
		} else {
			reconnectHandlersAfterEndProcess(this);
		}
	}

	public native void reconnectHandlersAfterEndProcess (TextView x) /*-{
		var reconnectState = { endProcessCalled: false, hook: null};

		reconnectState.hook = $wnd.MathJax.Hub.Register.MessageHook("End Process", function () {
			reconnectState.endProcessCalled = true;
			x.@com.lorepo.icplayer.client.module.text.TextView::reconnectHandlersCallback()();
			$wnd.MathJax.Hub.signal.hooks["End Process"].Remove(reconnectState.hook);
		});

		//Fallback
		setTimeout(function(){
			if (reconnectState.endProcessCalled) return;
			x.@com.lorepo.icplayer.client.module.text.TextView::reconnectHandlersCallback()();
			$wnd.MathJax.Hub.signal.hooks["End Process"].Remove(reconnectState.hook);
		}, 1000);
	}-*/;

	public native void reconnectHandlersAfterTimeout (TextView x, int timeoutTime) /*-{
		setTimeout(function(){
			x.@com.lorepo.icplayer.client.module.text.TextView::reconnectHandlersCallback()();
		}, timeoutTime);
	}-*/;

	private int getTextElementsSize() {
		return textElements.size();
	}

	private void removeAllSelections () {
		for (TextElementDisplay element: this.textElements) {
			element.deselect();
		}
	}

	private void removeNavigationElementSelections () {
		for (NavigationTextElement element: this.navigationTextElements) {
			element.deselect();
		}
	}

	public native void connectDOMNodeRemovedEvent (String id) /*-{
		var $addon = $wnd.$(".ic_page [id='" + id + "']"),
			addon = $addon[0];

		function destroy (event, id) {
			var $droppableElements, $draggableElements;
			var addonID = $wnd.$(addon).attr("id");

			if (addonID != id || event.target !== addon) {
				return;
			}

			$wnd.MathJax.Hub.getAllJax().forEach(function (mathJaxElement) {
				mathJaxElement.Detach();
				mathJaxElement.Remove();
			});

			$droppableElements = $addon.find(".ui-droppable");
			$draggableElements = $addon.find(".ui-draggable");

			$droppableElements.droppable("destroy");
			$draggableElements.draggable("destroy");

			$droppableElements = null;
			$draggableElements = null;
			addon = null;
			$addon = null;
		}

		var mockedEvent = {target: addon};
		var observer = new MutationObserver(function (records) {
			records.forEach(function (record) {
				if (record.removedNodes.length) {
					var id = $wnd.$(record.removedNodes[0]).attr("id");
					destroy(mockedEvent, id);
				}

				if (record.target.childNodes.length === 0) {
					observer.disconnect();
				}
			});
		});

		var config = {childList: true};
		observer.observe($wnd.$('.ic_page').get(0), config);
	}-*/;

	@Override
	public String getName() {
		return "Text";
	}

	private void handleWCAGExit() {
		this.removeNavigationElementSelections();
		activeGap = null;
		keyboardNavigationCurrentElementIndex = -1;
		keyboardNavigationCurrentElement = null;
		moduleHasFocus = false;
	}

	public void enter (KeyDownEvent event, boolean isExiting) {
		if (isExiting) {
			handleWCAGExit();
		} else {
			if (activeGap == null) {
				if (navigationTextElements.size() > 0) {
					NavigationTextElement navigationElement = navigationTextElements.get(0);
					activeGap = findDisplayElementForNavigationElement(navigationElement);
				}
			} else {
				if (!moduleHasFocus) {
					move(true);
				}
			}
			this.readTextContent();
		}
	}

	private void move (boolean goNext) {
		int keyboardNavigationElementsLen = navigationTextElements.size();
		if (keyboardNavigationElementsLen == 0) {
			return;
		}

		int keyboardNavigationNextElementIndex = goNext
			? keyboardNavigationCurrentElementIndex + 1
			: keyboardNavigationCurrentElementIndex - 1;
		if (keyboardNavigationNextElementIndex >= keyboardNavigationElementsLen) {
			keyboardNavigationNextElementIndex = keyboardNavigationElementsLen - 1;
		} else if (keyboardNavigationNextElementIndex < 0) {
			keyboardNavigationNextElementIndex = 0;
		}

		this.removeNavigationElementSelections();
		this.keyboardNavigationCurrentElementIndex = keyboardNavigationNextElementIndex;
		this.keyboardNavigationCurrentElement = navigationTextElements.get(keyboardNavigationNextElementIndex);
		this.keyboardNavigationCurrentElement.setElementFocus(true);
		this.moduleHasFocus = true;

		adjustActiveGapInformation();
	}

	private void adjustActiveGapInformation() {
		if (this.keyboardNavigationCurrentElement instanceof LinkWidget) {
			return;
		}

		TextElementDisplay nextGap = findDisplayElementForNavigationElement(this.keyboardNavigationCurrentElement);
		if (nextGap == null) {
			return;
		}

		this.activeGap = nextGap;
	}

	private TextElementDisplay findDisplayElementForNavigationElement(NavigationTextElement navigationElement) {
		String searchId = navigationElement.getId();
		for (int i = 0; i < textElements.size(); i++) {
			TextElementDisplay displayElement = textElements.get(i);
			if (searchId == displayElement.getId()) {
				return displayElement;
			}
		}
		return null;
	}

	/**
	 * Find the index of the active gap.
	 * - When counting the index, links are not taken into account.
	 * - The index is calculated relative to the position of the gap relative to other gaps counting from the top down.
	 * - The type of the gap does not matter.
	 */
	private int findActiveGapIndex() {
		if (activeGap == null) {
			return -1;
		}
		
		String searchId = activeGap.getId();
		int relativeIndex = 0;
		for (int i = 0; i < navigationTextElements.size(); i++) {
			NavigationTextElement navigationTextElement = navigationTextElements.get(i);
			if (searchId == navigationTextElement.getId()) {
				return relativeIndex;
			}
			
			if (!(navigationTextElement instanceof LinkWidget)) {
				relativeIndex++;
			}
		}
		return -1;
	}

	@Override
	public void tab (KeyDownEvent event) {
		this.move(true);
		this.readNavigationText(this.keyboardNavigationCurrentElement, this.findActiveGapIndex());
	}

	@Override
	public void escape(KeyDownEvent event) {
	    event.preventDefault();
	    handleWCAGExit();
	}

	@Override
	public void shiftTab (KeyDownEvent event) {
		this.move(false);
		this.readNavigationText(this.keyboardNavigationCurrentElement, this.findActiveGapIndex());
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
		if(moduleHasFocus == false  ||  (keyboardNavigationCurrentElement != null && keyboardNavigationCurrentElement.getElementType().equals("dropdown") )){
			event.preventDefault();
		}

	inlineChoiceChangeSelected(event, true);
	}

	@Override
	public void up (KeyDownEvent event) {
		if(moduleHasFocus == false  ||  (keyboardNavigationCurrentElement != null && keyboardNavigationCurrentElement.getElementType().equals("dropdown") )){
			event.preventDefault();
		}

		inlineChoiceChangeSelected(event, false);
	}

	@Override
	public void space(KeyDownEvent event) {
		boolean isActivatedLinkWidget = keyboardNavigationCurrentElement != null && keyboardNavigationCurrentElement.getElementType() == "link";

		if(WCAGUtils.hasLinks(this.module) && isActivatedLinkWidget) {
			LinkWidget linkWidget = (LinkWidget) keyboardNavigationCurrentElement;
			LinkInfo linkInfo = linkWidget.getLinkInfo();

			if (listener != null) {
				listener.onLinkClicked(linkInfo.getType(), linkInfo.getHref(), linkInfo.getTarget());
			}

			return;
		}

		if((!moduleHasFocus || activeGap.getGapType().equals("draggable"))){
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

			if (isWCAGon && activeGap.getDroppedElement() != null) {
				String elementText = activeGap.getWCAGTextValue();
				boolean currentElementEmpty = elementText.isEmpty();
				boolean hadValue = !oldTextValue.isEmpty();
				boolean currentValueEmpty = activeGap.getTextValue().isEmpty();

				if (!currentElementEmpty) {
					List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();

					if (activeGap instanceof AltTextGap) {
						textVoices.addAll(((AltTextGap) activeGap).getReadableText());
					} else {
						textVoices.add(TextToSpeechVoice.create(elementText, this.getLang()));
					}
					textVoices.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(TextModel.INSERT_INDEX)));
					this.speak(textVoices);
				} else if (hadValue && currentValueEmpty) {
					List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
					textVoices.add(TextToSpeechVoice.create(oldTextValue,this.getLang()));
					textVoices.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(TextModel.REMOVED_INDEX)));
					this.speak(textVoices);
				}
			}
		}
	}

	private void inlineChoiceChangeSelected (KeyDownEvent event, boolean next) {
		if (isWCAGon && keyboardNavigationCurrentElement != null && keyboardNavigationCurrentElement.getElementType().equals("dropdown")) {
			InlineChoiceWidget icw = (InlineChoiceWidget) keyboardNavigationCurrentElement;
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
	
	public String getSpeechText (int index) {
		return this.module.getSpeechTextItem(index);
	}
	
	private void readTextContent () {
		final List<TextToSpeechVoice> result = WCAGUtils.getReadableText(this.module, this.navigationTextElements, this.module.getLangAttribute());
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

	private void readNavigationText(NavigationTextElement element, int index) {
		List<TextToSpeechVoice> textVoices = prepareNavigationElementSpeech(element, index);
		this.speak(textVoices);
	}

	private List<TextToSpeechVoice> prepareNavigationElementSpeech(NavigationTextElement element, int index) {
		List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();

		textVoices.add(
				TextToSpeechVoice.create(getTypeAndIndexNavigationElement(element, index))
		);
		textVoices.addAll(
				getContent(element)
		);

		if (element.getElementType() != "link") {
			TextElementDisplay gap = (TextElementDisplay) element;
			TextToSpeechVoice showErrorFeedback = getCorrectnessFeedback(gap.getGapState());
			if (isShowErrorsMode && showErrorFeedback != null) {
				textVoices.add(showErrorFeedback);
			}
		}

		return textVoices;
	}

	private String getTypeAndIndexNavigationElement(NavigationTextElement element, int index) {
		String type;
		if (element.getElementType() != null && element.getElementType() == "link") {
			return this.module.getSpeechTextItem(TextModel.LINK_INDEX);
		}
		else {
			TextElementDisplay gap = (TextElementDisplay) element;
			type = gap.getGapType().equals("dropdown") ?
			this.module.getSpeechTextItem(TextModel.DROPDOWN_INDEX) :
			this.module.getSpeechTextItem(TextModel.GAP_INDEX);
		}

		return type + " " + Integer.toString(index + 1);
	}

	private List<TextToSpeechVoice> getContent(NavigationTextElement element) {
		List<TextToSpeechVoice> content = new ArrayList<TextToSpeechVoice>();
		String langTag = getGapOrModuleLangTag(element);
		
		if (element.getElementType() == "link") {
			content.add(TextToSpeechVoice.create(getLinkTitle(element), langTag));
			return content;
		}

		TextElementDisplay gap = (TextElementDisplay) element;
		String type = gap.getGapType();
		String textValue = gap.getWCAGTextValue();

		if ( type.equals("dropdown") && ( textValue.equals("-") || textValue.equals("---"))) {
			if (!this.isShowErrorsMode) {
				content.add(
						TextToSpeechVoice.create(this.module.getSpeechTextItem(TextModel.EMPTY_INDEX))
				);
			}
		} else if (gap instanceof AltTextGap) {
			content.addAll(
					((AltTextGap) gap).getReadableText()
			);
		} else {
			content.add(TextToSpeechVoice.create(textValue, langTag));
		}

		return content;
	}
	
	@Override
	public boolean isBlockedDraggableGapsExtension() {
		return module.getGapWidth() > 0;
	}

	@Override
	public void enableDraggableGapExtension(String gapId) {
		for (TextElementDisplay element: this.textElements) {
			if (element.hasId(gapId) && element instanceof DraggableGapWidget) {
				Element e = ((DraggableGapWidget) element).getElement();
				String width = e.getStyle().getWidth();
				if (width.trim().length() > 0) {
					e.getStyle().setProperty("min-width", width);
					e.getStyle().setProperty("width", "");
				}
				break;
			}
		}
	}

	@Override
	public void disableDraggableGapExtension(String gapId) {
		for (TextElementDisplay element: this.textElements) {
			if (element.hasId(gapId) && element instanceof DraggableGapWidget) {
				Element e = ((DraggableGapWidget) element).getElement();
				String minWidth = e.getStyle().getProperty("min-width");
				if (minWidth.trim().length() > 0) {
					e.getStyle().setProperty("min-width", "");
					e.getStyle().setProperty("width", minWidth);
				}
				break;
			}
		}
	}

	private String getLinkTitle(NavigationTextElement element) {
		LinkWidget linkWidget = (LinkWidget) element;
		String href = linkWidget.getHref();
		String text = this.module.getOriginalText();
		int hrefIndex = text.indexOf(href);
		text = text.substring(hrefIndex);
		int endTagLink = text.indexOf("</a>");

		return text.substring((href.length() + 2), endTagLink).trim();
	}

	private TextToSpeechVoice getCorrectnessFeedback(int gapState) {
		if (gapState == 1) {
			return TextToSpeechVoice.create(this.module.getSpeechTextItem(TextModel.CORRECT_INDEX));
		} else if (gapState == 2) {
			return TextToSpeechVoice.create(this.module.getSpeechTextItem(TextModel.WRONG_INDEX));
		} else if (gapState == 3) {
			return TextToSpeechVoice.create(this.module.getSpeechTextItem(TextModel.EMPTY_INDEX));
		}

		return null;
	}

	private String getGapOrModuleLangTag(NavigationTextElement gap) {
		String gapLangTag = gap.getLangTag();
		if (gapLangTag != null) {
			return gapLangTag;
		}

		return getLang();
	}

	private String getGapTypeAndIndexText(TextElementDisplay gap, int index) {
		String gapType = gap.getGapType().equals("dropdown") ?
				this.module.getSpeechTextItem(TextModel.DROPDOWN_INDEX) :
				this.module.getSpeechTextItem(TextModel.GAP_INDEX);

		return gapType + " " + Integer.toString(index + 1);
	}

	@Override
	public List<ScoreWithMetadata> getScoreWithMetadata() {
		IMetadata metadata = this.module.getMetadata();
		if (!ScoreWithMetadataUtils.validateMetadata(metadata)) {
			return null;
		}
		if (getGapCount() == 0) return null;

		boolean isAlphabetical = ScoreWithMetadataUtils.enumerateAlphabetically(metadata);
		String enumerateStart = ScoreWithMetadataUtils.getEnumerateStart(metadata);

		int gapCount = 0;
		int dropdownCount = 0;

		List<ScoreWithMetadata> scores = new ArrayList<ScoreWithMetadata>();
		for (TextElementDisplay d : textElements) {
			if (d.isActivity()) {

				String questionNumber = ScoreWithMetadataUtils.getQuestionNumber(enumerateStart, gapCount+dropdownCount, isAlphabetical);
				ScoreWithMetadata score = new ScoreWithMetadata(questionNumber);
				score.setModule(module);
				score.setMetadata(metadata);
				score.setQuestionType(d.getGapType());
				String userAnswer = d.getTextValue();
				List<String> allAnswers = new ArrayList<String>();
				if (d.getGapType().equals("dropdown")) {
					if (userAnswer.equals("---")) {
						userAnswer = "";
					}
					InlineChoiceInfo choiceInfo = module.choiceInfos.get(dropdownCount);
					allAnswers.add(choiceInfo.getAnswer());
				} else {
					GapInfo gapInfo = module.getGapInfos().get(gapCount);
					if (userAnswer.equals(gapInfo.getPlaceHolder()) && module.ignoreDefaultPlaceholderWhenCheck()) {
						userAnswer = "";
					}
					Iterator<String> answersIterator = gapInfo.getAnswers();
					while (answersIterator.hasNext()) {
						allAnswers.add(answersIterator.next());
					}
				}
				score.setUserAnswer(userAnswer);
				boolean isCorrect = false;
				if (userAnswer.length() != 0) {
					isCorrect = allAnswers.indexOf(TextParser.parseAnswer(userAnswer)) != -1;
				}
				score.setIsCorrect(isCorrect);
				score.setAllAnswers(allAnswers);
				scores.add(score);
				if (d.getGapType().equals("dropdown")) {
					dropdownCount += 1;
				} else {
					gapCount += 1;
				}
			}
		}
		return scores;
	}

}
