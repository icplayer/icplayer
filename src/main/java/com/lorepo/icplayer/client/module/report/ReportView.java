package com.lorepo.icplayer.client.module.report;

import java.util.HashMap;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Grid;
import com.google.gwt.user.client.ui.HTMLTable.Cell;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.module.report.ReportPresenter.IDisplay;
import com.lorepo.icplayer.client.utils.widget.ProgressBar;


public class ReportView extends Composite implements IDisplay{

	private ReportModule module;
	private Grid grid;
	private int lastRow;
	private IViewListener listener;
	private HashMap<Integer, String> pageLinks;
	
	
	public ReportView(ReportModule module, boolean isPreview){
	
		this.module = module;
		
		createUI(isPreview);
	}
	
	private void createUI(boolean isPreview){
		
		pageLinks = new HashMap<Integer, String>();
		grid = new Grid(2, getColumnCount());
		lastRow = 1;

		grid.setStyleName("ic_report");
		StyleUtils.applyInlineStyle(grid, module);
		grid.setCellSpacing(0);

		grid.getRowFormatter().addStyleName(0, "ic_report-header");
		if(module.getPageNameWidth() > 0){
			grid.getColumnFormatter().setWidth(0, module.getPageNameWidth() + "px");
		}
		grid.setText(0, 0, module.getResultLabel());
		if(module.isShowCounters()){
			grid.setText(0, 2, module.getChecksLabel());
			grid.setText(0, 3, module.getErrorsLabel());
		}

		initWidget(grid);
		if(!isPreview){
			setVisible(module.isVisible());
		}
		getElement().setId(module.getId());
		grid.addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {
				event.stopPropagation();
				event.preventDefault();
				Cell cell = grid.getCellForEvent(event);
				if(cell != null){
					fireEvent(cell);
				}
			}
		});
	}

	
	private int getColumnCount() {
		if(module.isShowCounters()){
			return 4;
		}
		else{
			return 2;
		}
	}

	protected void fireEvent(Cell cell) {
		int row = cell.getRowIndex();
		if(cell.getCellIndex() == 0 && row > 0 && row < grid.getRowCount()-1){
			if(listener != null){
				String link = pageLinks.get(row);
				listener.onClicked(link);
			}
		}
	}

	
	@Override
	public void clear() {
		grid.resize(2, getColumnCount());
		lastRow = 1;
	}

	@Override
	public void addRow(String pageName, PageScore pageScore){

		appendEmptyRow();
		pageLinks.put(lastRow, pageName);
		grid.setText(lastRow, 0, pageName);
		grid.getCellFormatter().addStyleName(lastRow, 0, "ic_reportPage");

		ProgressBar progressBar = new ProgressBar();
		progressBar.setProgress(pageScore.getPercentageScore());
		String errors = pageScore.getErrorCount() + "/" + pageScore.getMistakeCount();
		grid.setWidget(lastRow, 1, progressBar);
		if(module.isShowCounters()){
			grid.setText(lastRow, 2, Integer.toString(pageScore.getCheckCount()));
			grid.setText(lastRow, 3, errors );
		}

		lastRow++;
	}

	private void appendEmptyRow() {
		grid.insertRow(lastRow);
		if(lastRow%2 > 0){
			grid.getRowFormatter().addStyleName(lastRow, "ic_report-odd");
		}
		else{
			grid.getRowFormatter().addStyleName(lastRow, "ic_report-even");
		}
	}

	@Override
	public void addRow(String pageName) {

		appendEmptyRow();
		grid.setText(lastRow, 0, pageName);
		grid.getCellFormatter().addStyleName(lastRow, 0, "ic_reportPage");

		ProgressBar progressBar = new ProgressBar();
		progressBar.setProgress(100);
		if(module.isShowCounters()){
			grid.setText(lastRow, 2, "-" );
			grid.setText(lastRow, 3, "-" );
		}
		lastRow++;
	}

	
	@Override
	public void addSummaryRow(int totalScore, int totalChecks, int totalErrors, int totalMistakes) {
	
		grid.getRowFormatter().addStyleName(lastRow, "ic_report-footer");
		grid.setText(lastRow, 0, module.getTotalLabel());
		
		ProgressBar progressBar = new ProgressBar();
		progressBar.setProgress(totalScore);
		String errors = totalErrors + "/" + totalMistakes;
		grid.setWidget(lastRow, 1, progressBar);
		if(module.isShowCounters()){
			grid.setText(lastRow, 2, Integer.toString(totalChecks) );
			grid.setText(lastRow, 3, errors );
		}
	}

	@Override
	public void addListener(IViewListener l) {
		this.listener = l;
	}

	@Override
	public String getName() {
		return "Report";
	}
}
