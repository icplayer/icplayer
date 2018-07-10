package com.lorepo.icplayer.client.module.ordering;

import java.util.Iterator;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icplayer.client.module.api.event.DefinitionEvent;
import com.lorepo.icplayer.client.module.text.LinkInfo;
import com.lorepo.icplayer.client.module.text.LinkWidget;
import com.lorepo.icplayer.client.module.text.TextParser;
import com.lorepo.icplayer.client.module.text.TextParser.ParserResult;

abstract class ComputedStyle { // safari fix
	public static native int getStyle(Element el, String prop) /*-{
		return parseInt($wnd.$(el).css(prop), 10);
	}-*/;
}

public class ItemWidget extends HTML {

	private final OrderingItem item;
	private final ParserResult parserResult;
	private EventBus eventBus;
	private Integer widthWithoutMargin; // safari fix
	private final OrderingModule container; // safari fix

	public ItemWidget(OrderingItem item, OrderingModule container) {
		this.container = container;
		TextParser parser = new TextParser();
		parserResult = parser.parse(item.getText());
		setHTML(parserResult.parsedText);
		this.item = item;
		setStyleName("ic_ordering-item");
	}

	public void setWidthWithoutMargin(Integer value) {
		widthWithoutMargin = value;
	}

	public int getIndex() {
		return item.getIndex();
	}

	public boolean isCorrect(int position) {
		return item.isCorrect(position);
	}

	@Override
	protected void onAttach() {
		super.onAttach();
		connectLinks(parserResult.linkInfos.iterator());
		if (container.doAllElementsHasSameWidth()) { // safari fix
			int marginLeft = ComputedStyle.getStyle(getElement(), "marginLeft");
			int marginRight = ComputedStyle.getStyle(getElement(), "marginRight");
			Integer width = widthWithoutMargin - marginLeft - marginRight;
			setWidth(width.toString() + "px");
			addStyleName("full-width");
		}
	}

	public void connectLinks(Iterator<LinkInfo> it) {

		if (eventBus != null) {
			while (it.hasNext()) {
				final LinkInfo info = it.next();
				if (DOM.getElementById(info.getId()) != null) {
					LinkWidget widget = new LinkWidget(info);
					widget.addClickHandler(new ClickHandler() {

						@Override
						public void onClick(ClickEvent event) {
							event.preventDefault();
							event.stopPropagation();
							DefinitionEvent defEvent = new DefinitionEvent(info.getHref());
							eventBus.fireEvent(defEvent);
						}
					});
				}
			}
		}
	}

	public void setEventBus(EventBus eventBus) {
		this.eventBus = eventBus;
	}
	
	public Integer getStartingPosition() {
		return this.item.getStartingPosition();
	}
}
