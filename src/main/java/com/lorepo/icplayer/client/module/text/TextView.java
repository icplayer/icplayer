package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.text.TextPresenter.IDisplay;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.page.ResponsiveVoiceOnEndCallback;
import com.lorepo.icplayer.client.utils.MathJax;


public class TextView extends HTML implements IDisplay, IWCAG, IWCAGModuleView {

	private final TextModel module;
	private ITextViewListener listener;
	private ArrayList<TextElementDisplay> textElements = new ArrayList<TextElementDisplay>();
	private final ArrayList<String> mathGapIds = new ArrayList<String>();
	private boolean moduleHasFocus = false;
	private int clicks = 0;
	private TextElementDisplay activeGap = null;
	private PageController pageController;
	private ArrayList<InlineChoiceInfo> inlineChoiceInfoArrayList = new ArrayList<InlineChoiceInfo>();
	private boolean isWCAGon = false;
	
	public TextView (TextModel module, boolean isPreview) {
		this.module = module;
		createUI(isPreview);
	}

	private void createUI (boolean isPreview) {
		getElement().setId(module.getId());
		setStyleName("ic_text");
		StyleUtils.applyInlineStyle(this, module);
		if (!isPreview && !module.isVisible()) {
			hide();
		}
		
		getElement().setAttribute("lang", this.module.getLangAttribute());
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
			InlineChoiceWidget gap = new InlineChoiceWidget(ic, listener);
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
			InlineChoiceWidget gap = new InlineChoiceWidget(c, listener);
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
				gap.setDisabled(module.isDisabled());
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
						}
					} else {
						GapWidget gap = new GapWidget(gi, listener);
						if (savedDisabledState.size() > 0) {
							gap.setDisabled(savedDisabledState.get(counter));
						} else {
							gap.setDisabled(module.isDisabled());
						}
						textElements.add(gap);
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
		final List<String> gapsOrder = module.getGapsOrder();
		final int gapsOrderSize = gapsOrder.size();
		final int textElementsSize = textElements.size();
		
		if (gapsOrderSize == 0 && textElementsSize != gapsOrderSize) {
			return;
		}
		
		for (int i=0; i<textElementsSize; i++) {
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
		super.setHTML(html);
	}

	@Override
	public void refreshMath () {
		MathJax.refreshMathJax(getElement());
	}
	
	public void rerenderMathJax () {
		MathJax.rerenderMathJax(getElement());
	}

	@Override
	public void hide() {
		getElement().getStyle().setProperty("visibility", "hidden");
		getElement().getStyle().setProperty("display", "none");
	}

	@Override
	public void show(boolean callRefreshMath) {
		Element element = getElement();
		if (element.getStyle().getVisibility().equals("hidden")) {
			element.getStyle().setProperty("visibility", "visible");
			element.getStyle().setProperty("display", "block");

			if (callRefreshMath) {
				refreshMath();
				if (!(module.hasMathGaps() || module.hasDraggableGaps())){
					rerenderMathJax();
				}
			}
		}
	}

	private int getTextElementsSize() {
		return textElements.size();
	}
	
	private void skip() {
		int size = getTextElementsSize();

		if (size == 0) return;
		
		if (activeGap != null) {
			activeGap.setFocusGap(false);
		}
		
		clicks++;
		
		if (clicks >= size && size > 0) {
			clicks = 0;
		}

		activeGap = textElements.get(clicks);
		activeGap.setFocusGap(true);
		
		this.pageController.readGap(module.rawTextNoGaps, activeGap.getTextValue(), clicks);
//		this.readGap(module.rawTextNoGaps, activeGap.getTextValue(), clicks);
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
	
	private String getContentWithGapsValues () {
		String result = "";
		int textElementIndex = 0;
		
		for (int i=0; i<module.rawTextNoGaps.length(); i++) {
			String letter3 = Character.toString ((char) module.rawTextNoGaps.charAt(i));
			result += letter3;
			
			if (i >= 2) {
				String letter1 = Character.toString((char) module.rawTextNoGaps.charAt(i-2));
				String letter2 = Character.toString((char) module.rawTextNoGaps.charAt(i-1));
				
				if (letter1.equals("#") && letter3.equals("#") && (letter2.equals("1") || letter2.equals("2") || letter2.equals("3") || letter2.equals("4"))) {
					result += "  " + this.textElements.get(textElementIndex++).getTextValue();
				}
			}
		}
		
		return result;
	}
	
	public void enter (boolean isExiting) {
		if (isExiting) {
			this.removeAllSelections();
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
			
			if (this.pageController != null) {
				this.pageController.speak(getContentWithGapsValues(), this.module.getLangAttribute(), new ResponsiveVoiceOnEndCallback());
			}
		}
	}

	@Override
	public void tab () {
		int size = getTextElementsSize();

		if (size == 0) return;

		this.removeAllSelections();
		
		clicks++;
		
		if (clicks >= size && size > 0) {
			clicks = 0;
		}
		
		activeGap = textElements.get(clicks);
		activeGap.setFocusGap(true);
		
		this.pageController.readGap(module.rawTextNoGaps, activeGap.getTextValue(), clicks);
//		this.readGap(module.rawTextNoGaps, activeGap.getTextValue(), clicks);
	}

	@Override
	public void escape() {
		this.removeAllSelections();
		moduleHasFocus = false;
	}

	@Override
	public void shiftTab () {
		int size = getTextElementsSize();

		if (size == 0) return;

		this.removeAllSelections();
		
		clicks--;
		
		if (clicks < 0) {
			clicks = size - 1;
		}
		
		activeGap = textElements.get(clicks);
		activeGap.setFocusGap(true);
	}
	
	@Override
	public void left() {
	}

	@Override
	public void right() {
	}

	@Override
	public void down() {
	}

	@Override
	public void up() {
	}
	
	@Override
	public void space() {
		this.listener.onGapClicked(activeGap.getId());
	}

	@Override
	public void customKeyCode(KeyDownEvent event) {
	}

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
	
//    '1': 'Gap number ',
//    '2': 'Option gap number ',
//    '3': 'Math gap number ',
//    '4': 'Filled gap number '
	
	List<String> textToSpeechTexts = new ArrayList<String>();
	
	private void readGap (String text, String currentGapContent, int gapNumber) {
		// TODO wartosci z property
		List<String> textToSpeechTexts = new ArrayList<String>();
		textToSpeechTexts.add("Gap number ");
		textToSpeechTexts.add("Option gap number ");
		textToSpeechTexts.add("Math gap number ");
		textToSpeechTexts.add("Filled gap number ");
		
		JavaScriptUtils.log("readGap");
		JavaScriptUtils.log(text);
		JavaScriptUtils.log(currentGapContent);
		JavaScriptUtils.log(gapNumber);
//		
////        var gaps = text.match(/#[1-4]#/g);
//		final String patternString = "#[1-4]#";
//		final int[] gaps = null;
//		
//		Pattern pattern = Pattern.compile(patternString);
//        Matcher matcher = pattern.matcher(text);
//		
////        var gapTypeNumber = gaps[gapNumber][1];
//		final int gapTypeNumber = Integer.parseInt(matcher.group(gapNumber)); //gaps.get(gapNumber);
//
////        var gapTypeRead = presenter.INPUTS_TRANSLATIONS[presenter.configuration.language][gapTypeNumber];
//		final String gapTypeRead = textToSpeechTexts.get(gapTypeNumber - 1);
////        var gapNumberRead = presenter.getGapAppearanceAtIndexOfType(gaps, gapNumber) + 1;
//
////        presenter.speak(gapTypeRead + ' ' + gapNumberRead + ' ' + currentGapContent);
//		this.pageController.speak(gapTypeRead + " ", this.module.getLangAttribute());
	}

}
