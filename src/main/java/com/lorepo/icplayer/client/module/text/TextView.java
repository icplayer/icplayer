package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.Iterator;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.text.TextPresenter.IDisplay;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;
import com.lorepo.icplayer.client.utils.MathJax;

public class TextView extends HTML implements IDisplay{

	private TextModel	module;
	private ITextViewListener listener;
	private ArrayList<TextElementDisplay>	textElements = new ArrayList<TextElementDisplay>();

	public TextView(TextModel module, boolean isPreview){
		this.module = module;
		createUI(isPreview);
	}

	
	private void createUI(boolean isPreview) {

		getElement().setId(module.getId());
		setStyleName("ic_text");
		StyleUtils.applyInlineStyle(this, module);
		if(!isPreview){
			setVisible(module.isVisible());
		}
	}
	
	
	@Override
	public void connectInlineChoices(Iterator<InlineChoiceInfo> giIterator) {
		
		int gapWidth = module.getGapWidth(); 
		while(giIterator.hasNext()){
			InlineChoiceInfo gi = giIterator.next();
			InlineChoiceWidget gap = new InlineChoiceWidget(gi, listener);
			if(gapWidth > 0){
				gap.setWidth(gapWidth + "px");
			}
			gap.setDisabled(module.isDisabled());
			textElements.add(gap);
		}
	}


	@Override
	public void connectDraggableGaps(Iterator<GapInfo> giIterator) {
		
		int gapWidth = module.getGapWidth(); 
		while(giIterator.hasNext()){
			GapInfo gi = giIterator.next();
			DraggableGapWidget gap = new DraggableGapWidget(gi, listener);
			if(gapWidth > 0){
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
	public void connectLinks(Iterator<LinkInfo> it) {
		
		while(it.hasNext()){
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
	public void setValue(String id, String value) {

		for(TextElementDisplay gap : textElements){
			if(gap.hasId(id)){
				gap.setText(value);
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
		setVisible(false);
	}


	@Override
	public void show() {
		if(!isVisible()){
			setVisible(true);
			refreshMath();
		}
	}
}
