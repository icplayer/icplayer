package com.lorepo.icplayer.client.module.ordering;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Document;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.DomEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.MouseUpEvent;
import com.google.gwt.event.dom.client.MouseUpHandler;
import com.google.gwt.event.dom.client.TouchEndEvent;
import com.google.gwt.event.dom.client.TouchEndHandler;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.CellPanel;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.utils.RandomUtils;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.ordering.OrderingPresenter.IDisplay;
import com.lorepo.icplayer.client.utils.MathJax;

public class OrderingView extends Composite implements IDisplay, IWCAG{

	private final OrderingModule module;
	private final IPlayerServices playerServices;
	protected CellPanel innerCellPanel;
	private Widget selectedWidget;
	private IReorderListener listener;
	private boolean workMode = true;
	private String initialOrder = "";
	private JavaScriptObject jsObject = null;
	private boolean isTouched = false;
	private boolean isMouseUp = false;
	private boolean isDragging = false;
	private boolean wasChanged = false;
	private boolean mathJaxIsLoaded = false;
	private boolean shouldRefreshMath = false;
	private int currentWCAGSelectedItemIndex = 0;
	private boolean wcagIsAvtive = false;
	static public String WCAG_SELECTED_CLASS_NAME = "keyboard_navigation_active_element";

	public OrderingView(OrderingModule module, IPlayerServices services, boolean isPreview) {
		this.module = module;
		this.playerServices = services;
		createUI(module, isPreview);
		this.setCallbackForMathJaxLoaded(this);
	}

	@Override
	public String getInitialOrder() {
		return initialOrder;
	}

	public JavaScriptObject getAsJavaScript() {
		if (jsObject == null) {
			jsObject = initJSObject(this, module.isVertical());
		}
		return jsObject;
	}

	private native JavaScriptObject initJSObject(OrderingView x, boolean isVertical) /*-{
		var view = function(){};
		view.markStart = function(startIndex) {
			return x.@com.lorepo.icplayer.client.module.ordering.OrderingView::markStart(I)(startIndex);
		};
		view.markEnd = function(endIndex) {
			return x.@com.lorepo.icplayer.client.module.ordering.OrderingView::markEnd(I)(endIndex);
		}
		view.markChange = function(endIndex) {
			return x.@com.lorepo.icplayer.client.module.ordering.OrderingView::markChange(I)(endIndex);
		}
		view.axis = isVertical ? "y" : "x";

		return view;
	}-*/;

	private void createUI(OrderingModule module, boolean isPreview) {
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
		getAsJavaScript();
		if(!isPreview){
			makeSortable(getElement(), jsObject, workMode);
		}
	}

	private native void makeSortable(Element e, JavaScriptObject jsObject, boolean workMode)/*-{
		var selector = jsObject.axis == "y" ? "tbody" : "tbody tr";
		var displayType = jsObject.axis == "y" ? "table-row" : "table-cell";
		var forceHide = false;
		
		if (!workMode) {
			$wnd.$(e).find(selector).sortable("disable");
			return;
		} else {
			$wnd.$(e).find(selector).sortable("enable");	
		}
		
		$wnd.$(e).find(selector).sortable({
			placeholder: "ic_ordering-placeholder",
			axis: jsObject.axis,
			helper : 'clone',
			cursorAt: { left: 5 },
			start: function(event, ui) {
				jsObject.markStart(ui.item.index());
				ui.helper.html(ui.item.html());
				ui.placeholder.html(ui.helper.html());

				if (ui.item.is(":visible")) {
					forceHide = true;
					ui.item.style("display", "none", "important");
				}
				if (jsObject.axis == "y") {
					ui.helper.find('td').width(ui.placeholder.find('td').width());
					ui.helper.find('td').height(ui.placeholder.find('td').height());
				} else {
					ui.helper.width(ui.placeholder.width());
					ui.helper.height(ui.placeholder.height());
				}
			},
			stop: function(event, ui) {
				jsObject.markEnd(ui.item.index());
				if (forceHide) {
					ui.item.style("display", displayType, "important");
				}
			},
			change: function( event, ui ) {
				jsObject.markChange(ui.item.index());
			}
		});
		$wnd.$(e).disableSelection();
	}-*/;

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
				if (isTouched || isMouseUp || isDragging) {
					return;
				}
				onWidgetClicked(widget);
			}
		});

		widget.addTouchEndHandler(new TouchEndHandler() {

			@Override
			public void onTouchEnd(TouchEndEvent event) {
				if (isDragging) {
					return;
				}
				isTouched = true;
				onWidgetClicked(widget);
			}
		});


		widget.addMouseUpHandler(new MouseUpHandler() {

			@Override
			public void onMouseUp(MouseUpEvent event) {
				if (isTouched || isDragging) {
					return;
				}
				isMouseUp = true;
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

	public void markStart(int startIndex) {
		if (selectedWidget != null) {
			selectedWidget.removeStyleName("ic_drag-source");
			selectedWidget = null;
		}
		selectedWidget = innerCellPanel.getWidget(startIndex);
		selectedWidget.addStyleName("ic_drag-source");
		isDragging = true;
	}

	public void markChange(int destIndex) {
		int sourceIndex = innerCellPanel.getWidgetIndex(selectedWidget);
		selectedWidget.removeStyleName("ic_drag-source");
		onValueChanged(sourceIndex, destIndex);
		wasChanged = true;
	}
	
	public void markEnd(int destIndex) {
		int sourceIndex = innerCellPanel.getWidgetIndex(selectedWidget);
		moveWidget(sourceIndex, destIndex);
		if(wasChanged){
			selectedWidget = null;
			wasChanged = false;
		}
		onValueChanged(sourceIndex, destIndex);
		isDragging = false;
	}

	private void moveWidget(int startIndex, int endIndex) {
		if (startIndex != endIndex) {
			Widget draggedWidget = innerCellPanel.getWidget(startIndex);
			innerCellPanel.remove(draggedWidget);
			if (innerCellPanel instanceof VerticalPanel) {
				VerticalPanel vp = (VerticalPanel) innerCellPanel;
				vp.insert(draggedWidget, endIndex);
			} else if (innerCellPanel instanceof HorizontalPanel) {
				HorizontalPanel hp = (HorizontalPanel) innerCellPanel;
				hp.insert(draggedWidget, endIndex);
			}
		}
	}

	private void onValueChanged(int sourceIndex, int destIndex) {
		if (listener != null) {
			listener.onItemMoved(sourceIndex, destIndex);
			this.refreshSelection();
			
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

	@Override
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

	@Override
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
	@Override
	public int getErrorCount() {
		int index = 1;
		int errors = 0;
		
		for (int i = 0; i < getWidgetCount(); i++) {

			if (getWidget(i) instanceof ItemWidget) {

				ItemWidget itemWidget = (ItemWidget) getWidget(i);
				
				if (module.isGraduallyScore() && !itemWidget.isCorrect(index)) {
					errors++;
				} else if(!itemWidget.isCorrect(index)) {
					return 1;
				}
				
				index++;
			}
		}

		return errors;
	}
	
	@Override
	public void setShowErrorsMode() {
		workMode = false;
		makeSortable(getElement(), jsObject, workMode);

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

	@Override
	public void setWorkMode() {
		workMode = true;
		makeSortable(getElement(), jsObject, workMode);

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

	@Override
	public void setWorkStatus(boolean isWorkOn) {
		workMode = isWorkOn;
		makeSortable(getElement(), jsObject, workMode);
	}

	@Override
	public void setCorrectAnswer() {
		List<Integer> correctOrder = new ArrayList<Integer>();
		for (int i=0; i<module.getItemCount(); i++) {
			correctOrder.add(module.getItem(i).getIndex() - 1);
		}

		placeItemsByOrder(correctOrder);
	}

	@Override
	public void setCorrectAnswersStyles() {
		for (int i = 0; i < getWidgetCount(); i++) {
			if (getWidget(i) instanceof ItemWidget) {
				ItemWidget itemWidget = (ItemWidget) getWidget(i);
				itemWidget.addStyleName("correct-answer");
			}
		}
	}

	@Override
	public void removeCorrectAnswersStyles() {
		for (int i = 0; i < getWidgetCount(); i++) {
			if (getWidget(i) instanceof ItemWidget) {
				ItemWidget itemWidget = (ItemWidget) getWidget(i);
				itemWidget.removeStyleName("correct-answer");
			}
		}
	}

	@Override
	public void reset() {
		workMode = true;
		makeSortable(getElement(), jsObject, workMode);

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

	void refreshMath() {
		MathJax.rerenderMathJax(getElement());
	}

	@Override
	public void hide() {
		setVisible(false);
	}

	private native void setCallbackForMathJaxLoaded(OrderingView x) /*-{
	$wnd.MathJax.Hub.Register.MessageHook("End Process", function mathJaxResolve(message) {
        if ($wnd.$(message[1]).hasClass('ic_page')) {
            x.@com.lorepo.icplayer.client.module.ordering.OrderingView::mathJaxIsLoadedCallback()();
        }
    });
	}-*/;
	
	void mathJaxIsLoadedCallback() {
		this.mathJaxIsLoaded = true;
		if (this.shouldRefreshMath) {
			this.refreshMath();
		}
	}
	
	@Override
	public void show() {
		setVisible(true);
		if (this.mathJaxIsLoaded) {
			refreshMath();
		} else {
			this.shouldRefreshMath = true;
		}
	}

	@Override
	public String getName() {
		return "Ordering";
	}
	
	@Override
	public void executeOnKeyCode(KeyDownEvent event) {
		int code = event.getNativeKeyCode();

		if (code == KeyCodes.KEY_ENTER && !event.isShiftKeyDown()) {
			event.preventDefault();
			this.enter(false);
		} else if (code == KeyCodes.KEY_ENTER && event.isShiftKeyDown()) {
			event.preventDefault();
			this.enter(true);
		} else if (code == 32) {
			event.preventDefault();
			this.space();
		} else if (code == KeyCodes.KEY_TAB) {
			event.preventDefault();
			this.tab();
		} else if (code == KeyCodes.KEY_LEFT) {
			event.preventDefault();
			this.left();
		} else if (code == KeyCodes.KEY_RIGHT) {
			event.preventDefault();
			this.right();
		} else if (code == KeyCodes.KEY_DOWN) {
			event.preventDefault();
			this.down();
		} else if (code == KeyCodes.KEY_UP) {
			event.preventDefault();
			this.up();
		} else if (code == KeyCodes.KEY_ESCAPE) {
			event.preventDefault();
			this.escape();
		}
	}
	
	@Override
	public void escape () {
		this.deselectCurrentItem();
		this.wcagIsAvtive = false;
	}
	
	@Override
	public void enter (boolean isExiting) {
		this.wcagIsAvtive = !isExiting;
		if (isExiting) {
			this.deselectCurrentItem();
		} else {
			this.selectCurrentItem();		
		}
	}
	
	@Override
	public void space () {
		this.deselectCurrentItem();
		DomEvent.fireNativeEvent(Document.get().createMouseUpEvent(0, 0, 0, 0, 0,false, false, false, false, 0), this.getWidget(this.currentWCAGSelectedItemIndex));
		this.selectCurrentItem();
	}
	
	private native void clickElement (Element elementToClick) /*-{
		elementToClick.click();
	}-*/;
	
	@Override
	public void tab() {
		this.move(1);
	}
	
	@Override
	public void left() {
		this.move(-1);
	}
	
	@Override
	public void right() {
		this.move(1);
	}
	
	@Override
	public void up() {
		this.move(-1);
	}
	
	@Override
	public void down() {
		this.move(1);
	}
	
	private void move(int delta) {
		this.deselectCurrentItem();
		this.currentWCAGSelectedItemIndex += delta;
		if (this.currentWCAGSelectedItemIndex < 0) {
			this.currentWCAGSelectedItemIndex = this.getWidgetCount() - 1;
		}
		
		if (this.currentWCAGSelectedItemIndex >= this.getWidgetCount()) {
			this.currentWCAGSelectedItemIndex = 0;
		}
		this.selectCurrentItem();
	}
	
	private void selectCurrentItem () {
		this.getWidget(this.currentWCAGSelectedItemIndex).addStyleName(OrderingView.WCAG_SELECTED_CLASS_NAME);
	}
	
	private void deselectCurrentItem () {
		this.getWidget(this.currentWCAGSelectedItemIndex).removeStyleName(OrderingView.WCAG_SELECTED_CLASS_NAME);
	}
	
	private void refreshSelection () {
		if (this.wcagIsAvtive) { 
			int savedWidget = this.currentWCAGSelectedItemIndex;
			for (int i = 0; i < this.getWidgetCount(); i++) {
				this.currentWCAGSelectedItemIndex = i;
				this.deselectCurrentItem();
			}
			
			this.currentWCAGSelectedItemIndex = savedWidget;
			this.selectCurrentItem();
		}
	}
}
