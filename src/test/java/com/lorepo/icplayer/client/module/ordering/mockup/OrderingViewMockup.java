package com.lorepo.icplayer.client.module.ordering.mockup;

import com.google.gwt.dom.client.Element;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.lorepo.icplayer.client.module.ordering.IReorderListener;
import com.lorepo.icplayer.client.module.ordering.OrderingPresenter;

public class OrderingViewMockup implements OrderingPresenter.IDisplay {
	
	private String state;
	
	public OrderingViewMockup() {
	}

	@Override
	public void addReorderListener(IReorderListener listener) {
		// TODO Auto-generated method stub
		
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	@Override
	public void setWorkStatus(boolean b) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setCorrectAnswersStyles() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setCorrectAnswer() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void removeCorrectAnswersStyles() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public int getErrorCount() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public void setShowErrorsMode() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setWorkMode() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void reset() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getInitialOrder() {
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
	public Element getElement() {
		// TODO Auto-generated method stub
		return null;
	}
}
