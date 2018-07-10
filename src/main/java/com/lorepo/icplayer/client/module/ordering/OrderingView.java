package com.lorepo.icplayer.client.module.ordering;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.NodeList;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.DomEvent;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.MouseUpEvent;
import com.google.gwt.event.dom.client.MouseUpHandler;
import com.google.gwt.event.dom.client.TouchEndEvent;
import com.google.gwt.event.dom.client.TouchEndHandler;
import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.CellPanel;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.utils.RandomUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icf.utils.dom.ElementHTMLUtils;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.ordering.OrderingPresenter.IDisplay;
import com.lorepo.icplayer.client.module.text.WCAGUtils;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.utils.MathJax;


public class OrderingView extends Composite implements IDisplay, IWCAG, IWCAGModuleView {

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
	private boolean isWCAGActive = false;
	private boolean isWCAGOn = false;
	private PageController pageController;
	static public String WCAG_SELECTED_CLASS_NAME = "keyboard_navigation_active_element";
	
	private final String ITEM_CORRECT_CLASS = "ic_ordering-item-correct";
	private final String ITEM_WRONG_CLASS = "ic_ordering-item-wrong";

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

		module.validate();

		if (module.isValid()) {
			Integer itemWidth = module.getWidth() / module.getItemCount();

			for (int index = 0; index < module.getItemCount(); index++ ) {
				ItemWidget itemWidget = new ItemWidget(module.getItem(index), module);
				itemWidget.setWidthWithoutMargin(itemWidth);

				if (this.module.isTabindexEnabled()){
			    	itemWidget.getElement().setTabIndex(0);
			    }

				addWidget(itemWidget);
			}
		} else {
			ItemWidget error = new ItemWidget( new OrderingItem(0, module.getValidationError(), "", null), module );
			addWidget(error);
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
		getElement().setAttribute("lang", this.getLang());
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
				selectItem(selectedWidget);
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

	private void replaceWidgetPositions(int srcIndex, int destIndex) {
		if (srcIndex != destIndex) {
			List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
			textVoices.addAll(getWidgetTextVoicesByIndex(destIndex));
			textVoices.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(2)));
			textVoices.addAll(getWidgetTextVoicesByIndex(srcIndex));

			this.speak(textVoices);
		} else {
			this.speak(TextToSpeechVoice.create(this.module.getSpeechTextItem(1)));
		}

		int loIndex;
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
		if (!module.isValid()) {
			return;
		}

		String originalOrder = new String(initialOrder);
		String correctOrder = StringUtils.trimSpacesInside(module.getItemsOrder());
		String altCorrectOrder = StringUtils.trimSpacesInside(module.getOptionalOrder());
		int widgetsCount = innerCellPanel.getWidgetCount();
		int availablePositions = this.module.availablePositions();
		int unsetPositions = this.module.unsetPositions();
		
		if (module.isDontGenerateCorrectOrder()) {
			do {
				generateRandomItemOrder();
			} while (initialOrder.equals(correctOrder) || 
					 initialOrder.equals(altCorrectOrder) ||
					(initialOrder.equals(originalOrder) && widgetsCount > 2 && unsetPositions > 2 && availablePositions > 2));
		}
		else {
			generateRandomItemOrder();
		}
	}
	
	private void generateRandomItemOrder() {

		ArrayList<Widget> widgets = new ArrayList<Widget>();
		HashMap<Integer, Widget> widgetsWithPositions = new HashMap<Integer, Widget>();

		// place items with specified position in hashmap under correct position
		while (innerCellPanel.getWidgetCount() > 0) {
			Widget widget = innerCellPanel.getWidget(0);
			
			if (widget instanceof ItemWidget) {
				Integer startingPosition = ((ItemWidget) widget).getStartingPosition();
				
				if (startingPosition != null) {
					widgetsWithPositions.put(startingPosition - 1, widget);
				} else {
					widgets.add(widget);
				}
			} else {
				widgets.add(widget);
			}

			innerCellPanel.remove(0);
		}
		
		List<Integer> order = this.getRandomOrder(widgets.size());
		
		// insert all items into cell panel 
		for (int i = 0, itemToPlace = 0; i < widgetsWithPositions.size() + widgets.size(); i++) {
			if (widgetsWithPositions.containsKey(i)) {
				innerCellPanel.add(widgetsWithPositions.get(i));
			} else {
				int index = order.get(itemToPlace);
				itemToPlace++;
				innerCellPanel.add(widgets.get(index));
			}
		}

		initialOrder = getState();
	}
	
	public List<Integer> getRandomOrder(int size) {
		return RandomUtils.singlePermutation(size);
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
		
		if(selectedWidget!=null){
			selectedWidget.removeStyleName("ic_drag-source");
			selectedWidget = null;
		}
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
		if(selectedWidget!=null){
			selectedWidget.removeStyleName("ic_drag-source");
			selectedWidget = null;
		}
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

		if(selectedWidget!=null){
			selectedWidget.removeStyleName("ic_drag-source");
			selectedWidget = null;
		}
		
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
	public void escape (KeyDownEvent event) {
		this.deselectCurrentItem();
		currentWCAGSelectedItemIndex = 0;
		this.isWCAGActive = false;
	}
	
	private String prepearContentToRead (CellPanel cp) {
		String result = "";
		
		for (int i=0; i<this.innerCellPanel.getWidgetCount(); i++) {
			final Widget w = this.innerCellPanel.getWidget(i);
			result += " " + (i+1) + ": " + w.getElement().getInnerHTML();
			
			final String lastChar = result.substring(result.length() - 1);
			if (!".!?".contains(lastChar)) {
				result += ".";
			}
		}
		
		return result;
	}
	
	@Override
	public void enter (boolean isExiting) {
		this.isWCAGActive = !isExiting;
		if (isExiting) {
			this.deselectCurrentItem();
			currentWCAGSelectedItemIndex = 0;
		} else {
			this.selectCurrentItem();
			this.readItem(this.currentWCAGSelectedItemIndex);
		}
	}
	
	@Override
	public void space (KeyDownEvent event) {
		this.deselectCurrentItem();
		DomEvent.fireNativeEvent(Document.get().createMouseUpEvent(0, 0, 0, 0, 0, false, false, false, false, 0), this.getWidget(this.currentWCAGSelectedItemIndex));
		this.selectCurrentItem();
	}
	
	private native void clickElement (Element elementToClick) /*-{
		elementToClick.click();
	}-*/;
	
	@Override
	public void tab (KeyDownEvent event) {
		this.move(1);
	}
	
	@Override
	public void left (KeyDownEvent event) {
		this.move(-1);
	}
	
	@Override
	public void right (KeyDownEvent event) {
		this.move(1);
	}
	
	@Override
	public void up (KeyDownEvent event) {
		this.move(-1);
	}
	
	@Override
	public void down (KeyDownEvent event) {
		this.move(1);
	}
	
	private void readItem (int index) {
		List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
		textVoices.addAll(getWidgetTextVoicesByIndex(index));
		
		Widget widget = this.innerCellPanel.getWidget(index);
		if (ElementHTMLUtils.hasClass(widget.getElement(), "ic_drag-source")) {
			textVoices.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(0)));
		}
		
		if (ElementHTMLUtils.hasClass(widget.getElement(), ITEM_CORRECT_CLASS)) {
			textVoices.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(3)));
		}
		
		if (ElementHTMLUtils.hasClass(widget.getElement(), ITEM_WRONG_CLASS)) {
			textVoices.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(4)));
		}
		
		this.speak(textVoices);
	}
	
	private void selectItem (Widget selectedWidget) {
		if (selectedWidget != null) {
			this.speak(TextToSpeechVoice.create(this.module.getSpeechTextItem(0)));
		}
	}
	
	private void move(int delta) {
		this.deselectCurrentItem();
		this.currentWCAGSelectedItemIndex += delta;
		if (this.currentWCAGSelectedItemIndex < 0) {
			this.currentWCAGSelectedItemIndex = 0;
		}
		
		if (this.currentWCAGSelectedItemIndex >= this.getWidgetCount()) {
			this.currentWCAGSelectedItemIndex = this.getWidgetCount() - 1;
		}
		this.selectCurrentItem();
		
		this.readItem(currentWCAGSelectedItemIndex);
	}
	
	private void selectCurrentItem () {
		this.getWidget(this.currentWCAGSelectedItemIndex).addStyleName(OrderingView.WCAG_SELECTED_CLASS_NAME);
	}
	
	private void deselectCurrentItem () {
		this.getWidget(this.currentWCAGSelectedItemIndex).removeStyleName(OrderingView.WCAG_SELECTED_CLASS_NAME);
	}
	
	private void refreshSelection () {
		if (this.isWCAGActive) { 
			int savedWidget = this.currentWCAGSelectedItemIndex;
			for (int i = 0; i < this.getWidgetCount(); i++) {
				this.currentWCAGSelectedItemIndex = i;
				this.deselectCurrentItem();
			}
			
			this.currentWCAGSelectedItemIndex = savedWidget;
			this.selectCurrentItem();
		}
	}

	@Override
	public void shiftTab (KeyDownEvent event) {
		this.move(-1);
	}

	@Override
	public void customKeyCode(KeyDownEvent event) {}

	@Override
	public void setWCAGStatus (boolean isWCAGOn) {
		this.isWCAGOn = isWCAGOn;
	}

	@Override
	public void setPageController (PageController pc) {
		this.setWCAGStatus(true);
		this.pageController = pc;
	}
	
	private String getWidgetWCAGText(Element element, boolean breaks){
		String html = breaks ? WCAGUtils.getImageAltTextsWithBreaks(element.getInnerHTML()) : WCAGUtils.getImageAltTexts(element.getInnerHTML());
		Element clone = new HTML(html).getElement();
		NodeList<Element> spans = clone.getElementsByTagName("span");
		for (int i = 0; i<spans.getLength(); i++) {
			Element child = spans.getItem(i);
			if (child.getAttribute("aria-label").length() > 0) {
				Element textNode = DOM.createElement("span");
				String innerText = child.getAttribute("aria-label");
				if (child.getAttribute("lang").length() > 0) {
					innerText = "\\alt{ |" + innerText + "}[lang " + child.getAttribute("lang") + "]";
				}
				textNode.setInnerHTML(innerText);
				child.appendChild(textNode);
			} else if(child.getAttribute("aria-hidden").equals("true")){
				child.removeFromParent();
			}
		}
		return clone.getInnerText();
		
	}
	
	private String getWidgetWCAGText (int index) {
		return getWidgetWCAGText(this.innerCellPanel.getWidget(index).getElement(),false);
	}
	
	private String getWidgetWCAGTextWithBreaks (int index) {
		return getWidgetWCAGText(this.innerCellPanel.getWidget(index).getElement(),true);
	}
	
	private List<TextToSpeechVoice> getWidgetTextVoicesByIndex(int index) {
		String fullText = getWidgetWCAGTextWithBreaks (index);
		String[] textArray = fullText.split(WCAGUtils.BREAK_TEXT);
		List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
		for(String text: textArray){
			textVoices.add(TextToSpeechVoice.create(text, this.getLang()));
		}
		return textVoices;
	}

	@Override
	public String getLang () {
		return this.module.getLangAttribute();
	}
	
	private void speak (TextToSpeechVoice t1) {
		List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
		textVoices.add(t1);
		
		this.speak(textVoices);
	}
	
	private void speak (List<TextToSpeechVoice> textVoices) {
		if (this.pageController != null) {
			this.pageController.speak(textVoices);
		}
	}
	
}
