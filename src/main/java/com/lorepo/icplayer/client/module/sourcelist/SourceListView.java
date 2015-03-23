package com.lorepo.icplayer.client.module.sourcelist;

import java.util.HashMap;

import com.google.gwt.dom.client.Element;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.DragStartEvent;
import com.google.gwt.event.dom.client.DragStartHandler;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.Label;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter.IDisplay;
import com.lorepo.icplayer.client.utils.DOMUtils;
import com.lorepo.icplayer.client.utils.MathJax;

public class SourceListView extends FlowPanel implements IDisplay{

	private static final String SELECTED_STYLE = "ic_sourceListItem-selected";
	private SourceListModule module;
	private HashMap<String, Label>	labels = new HashMap<String, Label>();
	private IViewListener listener;
	private boolean isDragged = false;
	private boolean isPreview = false;
	
	public SourceListView(SourceListModule module, boolean isPreview){

		this.module = module;
		createUI(isPreview);
	}


	private void createUI(boolean isPreview) {

        this.isPreview = isPreview;
		if(module.getStyleClass().isEmpty()){
			setStyleName("ic_sourceList");
		}
		else{
			setStyleName(module.getStyleClass());
		}
		
		StyleUtils.applyInlineStyle(this, module);
		if(!isPreview){
			setVisible(module.isVisible());
		}
		getElement().setId(module.getId());
	}


	private void fireClickEvent(String id) {

		if(listener != null){
			listener.onItemCliked(id);
		}
	}


	@Override
	public void selectItem(String id) {

		Label label = labels.get(id);
		if(label != null){
			label.addStyleName(SELECTED_STYLE);
		}
	}


	@Override
	public void addListener(IViewListener l) {
		this.listener = l;
	}


	@Override
	public void addItem(final String id, String item, boolean callMathJax) {

		final HTML label = new HTML(StringUtils.markup2html(item));
		label.setStyleName("ic_sourceListItem");
		if(module.isVertical()){
			DOMUtils.applyInlineStyle(label.getElement(), "display: block;");
		} else {
			DOMUtils.applyInlineStyle(label.getElement(), "display: inline-block;white-space: nowrap;");
		}
		labels.put(id, label);
		add(label);
		if (callMathJax) {
			refreshMath(label.getElement());
		}
		
		label.addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {
				event.stopPropagation();
				event.preventDefault();
				if (!isDragged) {
					fireClickEvent(id);
				}
				isDragged = false;
			}
		});
		label.addDragStartHandler(new DragStartHandler() {
			
			@Override
			public void onDragStart(DragStartEvent event) {
				isDragged = true;
				fireClickEvent(id);
			}
		});
		
        if(!isPreview){
    		JavaScriptUtils.makeDraggable(label.getElement());
        }
	}


	@Override
	public void removeItem(String id) {
		Label label = labels.get(id);
		if (label != null) {
			remove(label);
		}
	}


	@Override
	public void deselectItem(String id) {
		Label label = labels.get(id);
		if(label != null){
			label.removeStyleName(SELECTED_STYLE);
		}
	}


	@Override
	public void removeAll() {
		labels.clear();
		clear();
	}


	public void refreshMath(Element element) {
		MathJax.refreshMathJax(element);
	}
	
	@Override
	public void show() {
		setVisible(true);
		refreshMath(getElement());
	}


	@Override
	public void hide() {
		setVisible(false);
		refreshMath(getElement());
	}

}
