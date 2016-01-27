package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.RootPanel;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icplayer.client.KeyboardNavigation;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.text.TextPresenter.IDisplay;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;
import com.lorepo.icplayer.client.utils.MathJax;

public class TextView extends HTML implements IDisplay{

	private final TextModel module;
	private ITextViewListener listener;
	private final ArrayList<TextElementDisplay> textElements = new ArrayList<TextElementDisplay>();
	private final ArrayList<String> mathGapIds = new ArrayList<String>();

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

	@Override
	public void hide() {
		getElement().getStyle().setProperty("visibility", "hidden");
	}

	@Override
	public void show(boolean callRefreshMath) {
		Element element = getElement();
		if (element.getStyle().getVisibility().equals("hidden")) {
			element.getStyle().setProperty("visibility", "visible");

			if (callRefreshMath) {
				refreshMath();
			}
		}
	}

	private static native String getModuleStatus(String type) /*-{
		return $wnd.moduleStatus[type];
	}-*/;
	

	private void onEnterKey() {
    	int position = -1;
    	TextElementDisplay gap = null;
    	
    	if (module.getId().equals(getModuleStatus("name"))) {
    		
    		for(int i = 0; i < textElements.size(); i++) {
				gap = textElements.get(i);
				
    			if (gap instanceof InlineChoiceWidget) {
    				position = i;
    			}
    		}
    		
    		if (position == -1) {
    			gap = textElements.get(0);
    		} else {
    			gap = textElements.get(position);
    		}
    		
    		if (gap != null) {
    			gap.setFocusGap(true);
    		}
    	}
	}
	
	private void onEscapeKey() {
    	if (module.getId().equals(getModuleStatus("name"))) {
    		TextElementDisplay gap = textElements.get(0);
    		
    		if (gap != null) {
    			gap.setFocusGap(false);
    		}
    	}
	}
}