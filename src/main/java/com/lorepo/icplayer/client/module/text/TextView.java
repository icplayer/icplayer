package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.text.TextPresenter.IDisplay;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.page.TextToSpeech;
import com.lorepo.icplayer.client.utils.MathJax;

public class TextView extends HTML implements IDisplay{

	private final TextModel module;
	private ITextViewListener listener;
	private ArrayList<TextElementDisplay> textElements = new ArrayList<TextElementDisplay>();
	private final ArrayList<String> mathGapIds = new ArrayList<String>();
	private boolean moduleHasFocus = false;
	private int clicks = 0;
	private TextElementDisplay activeGap = null;
	private PageController pageController;
	
	public TextView(TextModel module, boolean isPreview) {
		this.module = module;
		createUI(isPreview);
	}

	private void createUI(boolean isPreview) {
		getElement().setId(module.getId());
		setStyleName("ic_text");
		StyleUtils.applyInlineStyle(this, module);
		if(!isPreview && !module.isVisible()) {
			hide();
		}
	}

	public ITextViewListener getListener() {
		return listener;
	}

	public void addElement(TextElementDisplay el) {
		textElements.add(el);
	}

	@Override
	public void connectInlineChoices(Iterator<InlineChoiceInfo> giIterator) {

		int gapWidth = module.getGapWidth();
		while (giIterator.hasNext()) {
			InlineChoiceInfo gi = giIterator.next();
			InlineChoiceWidget gap = new InlineChoiceWidget(gi, listener);
			if (gapWidth > 0) {
				gap.setWidth(gapWidth + "px");
			}
			gap.setDisabled(module.isDisabled());
			textElements.add(gap);
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
			if(DOM.getElementById(info.getId()) != null){
				LinkWidget widget = new LinkWidget(info);
				widget.addClickHandler(new ClickHandler() {

					@Override
					public void onClick(ClickEvent event) {
						event.stopPropagation();
						event.preventDefault();
						if(listener != null){
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
			if (textElements.get(i).getGapType() == gapType) {
				return i;
			}
		}
		
		return -1;
	}
	
	public void sortGapsOrder () {
		final List<String> gapsOrder = module.getGapsOrder();
		
		for (int i=0; i<textElements.size(); i++) {
			final String gapType = gapsOrder.get(i);
			final String currentGapType = textElements.get(i).getGapType();
			
			if (gapType != currentGapType) {
				int correctElementId = getIndexOfNextGapType(i, gapType, textElements);
				
				textElements.add(i, textElements.get(correctElementId));
				textElements.remove(correctElementId+1);
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

		for(TextElementDisplay gap : textElements){
			String helper = gap.getDroppedElement();
			if(helper != null){
				String escaped = StringUtils.escapeXML(helper);
				droppedElements.put(gap.getId(), escaped);
			}
		}

		return droppedElements;
	}


	@Override
	public void setValue(String id, String value) {
		for(TextElementDisplay gap : textElements){
			if(gap.hasId(id)){
				gap.setText(value);
				if(!value.equals("---")){
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
	public TextElementDisplay getChild(int index) {
		return textElements.get(index);
	}

	@Override
	public void setHTML(String html){
		super.setHTML(html);
	}

	@Override
	public void refreshMath() {
		MathJax.refreshMathJax(getElement());
	}
	
	public void rerenderMathJax (){
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
				if(!(module.hasMathGaps() || module.hasDraggableGaps())){
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
		
		TextElementDisplay gap = textElements.get(clicks);
		gap.setFocusGap(true);

		activeGap = textElements.get(clicks);
		activeGap.setFocusGap(true);
		
		TextToSpeech.readGap(module.rawTextNoGaps, clicks, pageController);
	}
	
	private void enter() {
		if(textElements.size() > 0) {
			activeGap = textElements.get(0);
		}

		if (activeGap != null && !moduleHasFocus) {
			activeGap.setFocusGap(true);
			moduleHasFocus = true;
		}
		
		TextToSpeech.speak(module.rawTextNoGaps, this.pageController);
	}
	
	private void escape() {
		if (activeGap != null) {
			activeGap.setFocusGap(false);
		}
		moduleHasFocus = false;
	}
	
	@Override
	public void executeOnKeyCode(KeyDownEvent event) {
		int code = event.getNativeKeyCode();

		if (code == KeyCodes.KEY_ENTER) {
			event.preventDefault();
			enter();
		}

		if (code == KeyCodes.KEY_ESCAPE) {
			event.preventDefault();
			escape();
		}
		
		if (code == KeyCodes.KEY_TAB) {
			event.preventDefault();
			skip();
		}
		
		if ((code == 32) && (activeGap instanceof DraggableGapWidget)) { // space key on draggable gap
			event.preventDefault();
			listener.onGapClicked(activeGap.getId());
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
	
	public void setPageController (PageController pc) {
		this.pageController = pc;
	}
	
}
