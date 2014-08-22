package com.lorepo.icplayer.client.module.ordering;

import java.util.Iterator;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icplayer.client.module.api.event.DefinitionEvent;
import com.lorepo.icplayer.client.module.text.LinkInfo;
import com.lorepo.icplayer.client.module.text.LinkWidget;
import com.lorepo.icplayer.client.module.text.TextParser;
import com.lorepo.icplayer.client.module.text.TextParser.ParserResult;

public class ItemWidget extends HTML {

	private OrderingItem item;
	private ParserResult parserResult;
	private EventBus eventBus;
	
	public ItemWidget(OrderingItem item) {
		TextParser parser = new TextParser();
		parserResult = parser.parse(item.getText());
		setHTML(parserResult.parsedText);
		this.item = item;
		setStyleName("ic_ordering-item");
	}
	
	public int getIndex() {
		return item.getIndex();
	}

	public boolean isCorrect(int position) {
		return item.isCorrect(position);
	}
	
	protected void onAttach() {
		super.onAttach();
		connectLinks(parserResult.linkInfos.iterator());
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
}
