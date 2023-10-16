package com.lorepo.icplayer.client.module.text.mockup;

import com.google.gwt.dom.client.Element;
import com.lorepo.icplayer.client.metadata.ScoreWithMetadata;
import com.lorepo.icplayer.client.module.text.*;
import com.lorepo.icplayer.client.module.text.TextPresenter.IDisplay;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;


public class TextViewMockup implements IDisplay {

	private ITextViewListener listener;
	private HashMap<String, String> values = new HashMap<String, String>();
	private int refreshMathCallCount = 0;
	private int refreshGapMathCallCount = 0;
	private GapWidget gapWidget;

	public TextViewMockup(TextModel module) {
		// TODO Auto-generated constructor stub
	}
	
	public void callAudioButtonClickedListenerWith(AudioInfo audio) {
		this.listener.onAudioButtonClicked(audio);
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
	public void connectFilledGaps(Iterator<GapInfo> giIterator) {
		// TODO Auto-generated method stub
		
	}

	public void connectInlineChoices(Iterator<InlineChoiceInfo> giIterator) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void connectLinks(Iterator<LinkInfo> giIterator) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void connectAudios(Iterator<AudioInfo> iterator) {
		// TODO Auto-generated method stub
	}

	@Override
	public int getChildrenCount() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int getGapCount() {
		return 0;
	}

	@Override
	public TextElementDisplay getChild(int index) {
		//its mocked just for testing purpose; index doesnt matter; to set gapWidget use setGapWidget method
		return gapWidget;
	}

	@Override
	public TextElementDisplay getActivity(int index) {
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
		refreshMathCallCount++;
	}

	@Override
	public void refreshGapMath(String id) {
		refreshGapMathCallCount++;
	}

	public boolean wasRefreshGapMathCalled() {
		return refreshGapMathCallCount > 0;
	}

	public boolean wasRefreshMathCalled() {
		return refreshMathCallCount > 0;
	}

	@Override
	public void hide() {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	public void show(boolean b) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Element getElement() {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public void connectMathGap(Iterator<GapInfo> giIterator, String id, ArrayList<Boolean> savedDisabledState) {
		
	}

	@Override
	public HashMap<String, String> getDroppedElements() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setDroppedElements(String id, String element) {
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

	@Override
	public void connectInlineChoices(List<InlineChoiceInfo> list) {
		// TODO Auto-generated method stub

	}

	@Override
	public void sortGapsOrder() {
		// TODO Auto-generated method stub

	}

	@Override
	public boolean isWCAGon() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public void setWorkMode() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setShowErrorsMode() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setValue(String text) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<ScoreWithMetadata> getScoreWithMetadata() {
		return null;
	}
	
	@Override
	public boolean isBlockedDraggableGapsExtension() {
		return true;
	};

	@Override
	public void enableDraggableGapExtension(String gapId) {};

	@Override
	public void disableDraggableGapExtension(String gapId) {};

    public void setGapWidget(GapWidget gw) {
        gapWidget = gw;
    }
}
