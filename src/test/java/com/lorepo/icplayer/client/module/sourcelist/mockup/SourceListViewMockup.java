package com.lorepo.icplayer.client.module.sourcelist.mockup;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import com.google.gwt.dom.client.Element;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.lorepo.icplayer.client.module.sourcelist.IViewListener;
import com.lorepo.icplayer.client.module.sourcelist.SourceListModule;
import com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter;
import com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter.IDisplay;

public class SourceListViewMockup implements IDisplay {

	private IViewListener listener;
	private String selectedId;
	private HashMap<String, String> items = new HashMap<String, String>();
	
	
	public SourceListViewMockup(SourceListModule model) {
	}

	@Override
	public void selectItem(String id) {
		selectedId = id;
	}

	@Override
	public void addListener(IViewListener l) {
		this.listener = l;
	}

	public void click(String id){
		listener.onItemCliked(id);
	}
	
	@Override
	public void addItem(String id, String value, boolean callMathJax) {
		
		if(items.get(id) != null){
			id = id + System.currentTimeMillis(); 
		}
		
		items.put(id, value);
	}

	@Override
	public void removeItem(String id) {
		items.remove(id);
	}

	@Override
	public void removeAll() {
		items.clear();
	}

	public void deselectItem(String id) {
		if(selectedId.compareTo(id) == 0){
			selectedId = null;
		}
	}
	
	
	public String getSelectedId(){
		return selectedId;
	}
	
	public HashMap<String, String> getItems(){
		return items;
	}

	@Override
	public Element getElement() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void show() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void hide() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Element getItem(String id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Set<String> getCurrentLabels() {
		return new HashSet<String>(items.keySet());
	}

	@Override
	public void setPresenter(SourceListPresenter p) {
		// TODO Auto-generated method stub
		
	}

	public void setDragMode() {
		// TODO Auto-generated method stub
	}

	public void unsetDragMode() {
		// TODO Auto-generated method stub
	}

	@Override
	public void hideItem(String id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void showItem(String id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void connectDOMNodeRemovedEvent(String id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return null;
	}

	public void executeOnKeyCode(KeyDownEvent keyDownEvent) {
		// TODO Auto-generated method stub
	}

	@Override
	public void deselectItem(String id, boolean read) {
		// TODO Auto-generated method stub
		
	}

	public void rerenderMath() {
		// TODO Auto-generated method stub
	}

	public void refreshMathJax() {
		// TODO Auto-generated method stub
	}

}
