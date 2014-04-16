package com.lorepo.icplayer.client.module.text.mockup;

import java.util.HashMap;
import java.util.Iterator;

import com.google.gwt.dom.client.Element;
import com.lorepo.icplayer.client.module.text.GapInfo;
import com.lorepo.icplayer.client.module.text.ITextViewListener;
import com.lorepo.icplayer.client.module.text.InlineChoiceInfo;
import com.lorepo.icplayer.client.module.text.LinkInfo;
import com.lorepo.icplayer.client.module.text.TextModel;
import com.lorepo.icplayer.client.module.text.TextPresenter.IDisplay;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;


public class TextViewMockup implements IDisplay {

	private ITextViewListener listener;
	private HashMap<String, String> values = new HashMap<String, String>();
	
	
	public TextViewMockup(TextModel module) {
		// TODO Auto-generated constructor stub
	}

	@Override
	public void addListener(ITextViewListener l) {
		listener = l;
	}

	public ITextViewListener getListener(){
		return listener;
	}

	@Override
	public void setValue(String id, String value) {
		values.put(id, value);
	}

	public HashMap<String, String> getValues(){
		return values;
	}

	@Override
	public void setHTML(String html) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void connectGaps(Iterator<GapInfo> giIterator) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void connectInlineChoices(Iterator<InlineChoiceInfo> giIterator) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void connectLinks(Iterator<LinkInfo> giIterator) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public int getChildrenCount() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public TextElementDisplay getChild(int index) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void connectDraggableGaps(Iterator<GapInfo> giIterator) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getHTML() {
		return null;
	}

	@Override
	public void refreshMath() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void hide() {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	public void show() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Element getElement() {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public void addElement(TextElementDisplay el) { 
	}
}
