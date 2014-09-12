package com.lorepo.icplayer.client.module.ordering;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.CellPanel;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.utils.RandomUtils;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.ordering.OrderingPresenter.IDisplay;


public class OrderingView extends Composite implements IDisplay {

	private OrderingModule module;
	private IPlayerServices playerServices;
	protected CellPanel innerCellPanel;
	private Widget selectedWidget;
	private IReorderListener listener;
	private boolean workMode = true;
	private String initialOrder = "";
	
	public OrderingView(OrderingModule module, IPlayerServices services) {
		this.module = module;
		this.playerServices = services;
		createUI(module);
	}
	
	public String getInitialOrder() {
		return initialOrder;
	}

	private void createUI(OrderingModule module) {
		
		createWidgetPanel();
		
		Integer itemWidth = module.getWidth() / module.getItemCount();
		
		for (int index = 0; index < module.getItemCount(); index++ ) {
			ItemWidget itemWidget = new ItemWidget(module.getItem(index), module);
			itemWidget.setWidthWithoutMargin(itemWidth);
			addWidget(itemWidget);
		}
		
		initWidget(innerCellPanel);
		setStyleName("ic_ordering");
		StyleUtils.applyInlineStyle(this, module);
		
		if (playerServices != null) {
			randomizeViewItems();
			saveScore();
			setVisible(module.isVisible());
		}
		
		getElement().setId(module.getId());
	}
	
	private void createWidgetPanel() {
		innerCellPanel = module.isVertical() ? new VerticalPanel() : new HorizontalPanel();
	}

	private void addWidget(final ItemWidget widget) {
		
		innerCellPanel.add(widget);
		if (playerServices != null) {
			widget.setEventBus(playerServices.getEventBus());
		}
		widget.addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {
				event.stopPropagation();
				event.preventDefault();
				onWidgetClicked(widget);
			}
		});
		
	}

	private void onWidgetClicked(Widget widget) {

		if (workMode) {
			if (selectedWidget == null) {
				selectedWidget = widget;
				selectedWidget.addStyleName("ic_drag-source");
			} else {
				int sourceIndex = innerCellPanel.getWidgetIndex(selectedWidget);
				int destIndex = innerCellPanel.getWidgetIndex(widget);
				replaceWidgetPositions(sourceIndex, destIndex);
				selectedWidget.removeStyleName("ic_drag-source");
				selectedWidget = null;
				onValueChanged(sourceIndex, destIndex);
			}
		}
	}

	/**
	 * Zamiana miejscami widgetów
	 */
	private void replaceWidgetPositions(int srcIndex, int destIndex) {

		int	loIndex;
		int hiIndex;
		Widget firstWidget;
		Widget secondWidget;
		
		if (srcIndex != destIndex) {
			
			if (srcIndex < destIndex) {
				loIndex = srcIndex;
				hiIndex = destIndex;
			} else {
				loIndex = destIndex;
				hiIndex = srcIndex;
			}
			
			firstWidget = innerCellPanel.getWidget(loIndex);
			secondWidget = innerCellPanel.getWidget(hiIndex);
			innerCellPanel.remove(firstWidget);
			innerCellPanel.remove(secondWidget);

			if (innerCellPanel instanceof VerticalPanel) {
				VerticalPanel vp = (VerticalPanel) innerCellPanel;
				vp.insert(secondWidget, loIndex);
				vp.insert(firstWidget, hiIndex);
			} else if (innerCellPanel instanceof HorizontalPanel) {
				HorizontalPanel hp = (HorizontalPanel) innerCellPanel;
				hp.insert(secondWidget, loIndex);
				hp.insert(firstWidget, hiIndex);
			}
		}
	}

	private void onValueChanged(int sourceIndex, int destIndex) {
		if (listener != null) {
			listener.onItemMoved(sourceIndex, destIndex);
		}
	}

	public void randomizeViewItems() {
		
		ArrayList<Widget> widgets = new ArrayList<Widget>();
		List<Integer> order = RandomUtils.singlePermutation(innerCellPanel.getWidgetCount());
		
		while (innerCellPanel.getWidgetCount() > 0) {
			widgets.add(innerCellPanel.getWidget(0));
			innerCellPanel.remove(0);
		}
		
		for (int i = 0; i < order.size(); i++) {
			Integer index = order.get(i);
			innerCellPanel.add(widgets.get(index));
		}
		
		initialOrder = getState();
	}
	
	public void orderChildren(String[] indexes) {
		ArrayList<Widget> widgets = new ArrayList<Widget>();
		while (innerCellPanel.getWidgetCount() > 0) {
			widgets.add(innerCellPanel.getWidget(0));
			innerCellPanel.remove(0);
		}
		
		for (int i = 0; i < indexes.length; i++) {
	
			int index = Integer.parseInt(indexes[i]);
			for (Widget widget : widgets) {
				
				if (widget instanceof ItemWidget) {
					
					ItemWidget itemWidget = (ItemWidget) widget;
					if (itemWidget.getIndex() == index) {
						innerCellPanel.add(itemWidget);
						break;
					}
				}
			}
		}
	}

	public int getWidgetCount() {
		return innerCellPanel.getWidgetCount();
	}

	public Widget getWidget(int index) {
		return innerCellPanel.getWidget(index);
	}
	
	public String getState() {
		String state = "";
		
		for (int i = 0; i < getWidgetCount(); i++) {
			
			if (getWidget(i) instanceof ItemWidget) {
				
				ItemWidget itemWidget = (ItemWidget) getWidget(i);
				if (i > 0) {
					state += ",";
				}
				state += Integer.toString( itemWidget.getIndex() );
			}
		}
		
		return state;
	}
	
	public void setState(String state) {
		if (!state.isEmpty()) {
			String[] indexes = state.split(",");
			orderChildren(indexes);
			saveScore();
		}
	}
	
	// ------------------------------------------------------------------------
	// IActivity
	// ------------------------------------------------------------------------
	public int getErrorCount() {

		int errors = 0;

		int index = 1;
		for (int i = 0; i < getWidgetCount(); i++) {
			
			if (getWidget(i) instanceof ItemWidget) {
				
				ItemWidget itemWidget = (ItemWidget) getWidget(i);
				if(!itemWidget.isCorrect(index)) {
					errors = 1;
					break;
				}
				index++;
			}
		}
		
		return errors;
	}
	
	public void setShowErrorsMode() {

		workMode = false;
		
		if (module.isActivity()) {
			for (int i = 0; i < getWidgetCount(); i++) {
				
				if (getWidget(i) instanceof ItemWidget) {
					
					ItemWidget itemWidget = (ItemWidget) getWidget(i);
	
					if (itemWidget.isCorrect(i+1)) {
						itemWidget.addStyleName("ic_ordering-item-correct");
					} else {
						itemWidget.addStyleName("ic_ordering-item-wrong");
					}
				}
			}
		}		
	}

	public void setWorkMode() {

		workMode = true;
		
		if (module.isActivity()) {
			for (int i = 0; i < getWidgetCount(); i++) {
				
				if (getWidget(i) instanceof ItemWidget) {
					ItemWidget itemWidget = (ItemWidget) getWidget(i);
					itemWidget.removeStyleName("ic_ordering-item-correct");
					itemWidget.removeStyleName("ic_ordering-item-wrong");
				}
			}
		}		
	}
	
	public void placeItemsByOrder(List<Integer> order) {
		ArrayList<Widget> widgets = new ArrayList<Widget>();
		
		while (innerCellPanel.getWidgetCount() > 0) {
			widgets.add(innerCellPanel.getWidget(0));
			innerCellPanel.remove(0);
		}
		
		for (int i = 0; i < order.size(); i++) {
			Integer index = order.get(i) + 1;
			
			for (int j = 0; j < widgets.size(); j ++) {
				Widget widget = widgets.get(j);
				ItemWidget iWidget = (ItemWidget) widget;
				
				if (index.equals(iWidget.getIndex())) {
					innerCellPanel.add(widget);
					break;
				}
			}
		}
		
	}
	
	public void setWorkStatus(boolean isWorkOn) {
		workMode = isWorkOn;
	}
	
	public void setCorrectAnswer() {
		List<Integer> correctOrder = new ArrayList<Integer>();
		for (int i=0; i<module.getItemCount(); i++) {
			correctOrder.add(module.getItem(i).getIndex() - 1);
		}
		
		placeItemsByOrder(correctOrder);
	}
	
	public void setCorrectAnswersStyles() {
		for (int i = 0; i < getWidgetCount(); i++) {
			if (getWidget(i) instanceof ItemWidget) {
				ItemWidget itemWidget = (ItemWidget) getWidget(i);
				itemWidget.addStyleName("correct-answer");
			}
		}
	}
	
	public void removeCorrectAnswersStyles() {
		for (int i = 0; i < getWidgetCount(); i++) {
			if (getWidget(i) instanceof ItemWidget) {
				ItemWidget itemWidget = (ItemWidget) getWidget(i);
				itemWidget.removeStyleName("correct-answer");
			}
		}
	}

	public void reset() {

		workMode = true;
		
		randomizeViewItems();
		for (int i = 0; i < getWidgetCount(); i++) {
			Widget widget = getWidget(i);
			widget.removeStyleName("ic_ordering-item-correct");
			widget.removeStyleName("ic_ordering-item-wrong");
		}

		removeCorrectAnswersStyles();
		
		saveScore();
	}

	public int getMaxScore() {
		return module.getMaxScore();
	}

	public int getScore() {
		return getMaxScore() - getErrorCount();
	}
	
	/**
	 * Update module score
	 * @param value
	 */
	private void saveScore() {
		if(playerServices != null){
			IScoreService scoreService = playerServices.getScoreService();
			scoreService.setScore(module.getId(), 0, module.getMaxScore());
			scoreService.setScore(module.getId(), getScore(), module.getMaxScore());
		}		
	}

	@Override
	public void addReorderListener(IReorderListener listener) {
		this.listener = listener;
	}
	
}
