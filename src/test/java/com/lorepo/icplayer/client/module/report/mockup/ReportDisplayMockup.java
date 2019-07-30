package com.lorepo.icplayer.client.module.report.mockup;

import com.google.gwt.dom.client.Element;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.module.report.IViewListener;
import com.lorepo.icplayer.client.module.report.ReportPresenter.IDisplay;

public class ReportDisplayMockup implements IDisplay{

	private int rowCount;
	
	@Override
	public void clear() {
		rowCount = 0;
	}

	@Override
	public void addRow(String name, Integer i, PageScore pageScore) {
		rowCount ++;
	}

	@Override
	public void addSummaryRow(int totalScore, int totalChecks, int totalErrors, int totalMistakes) {
		rowCount ++;
	}
	
	public int getRowCount(){
		return rowCount;
	}

	@Override
	public void addRow(String name) {
		rowCount ++;
	}

	@Override
	public void addListener(IViewListener l) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Element getElement() {
		// TODO Auto-generated method stub
		return null;
	}
}
