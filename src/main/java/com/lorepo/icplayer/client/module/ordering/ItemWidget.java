package com.lorepo.icplayer.client.module.ordering;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icplayer.client.module.api.event.DefinitionEvent;
import com.lorepo.icplayer.client.module.text.AudioInfo;
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
	private Element moduleView;
	private final OrderingModule container; // safari fix
	private List<AudioInfo> audioInfos = new ArrayList<AudioInfo>();

	public ItemWidget(OrderingItem item, OrderingModule container) {
		this.container = container;
		TextParser parser = new TextParser();
		parser.setBaseURL(container.getBaseURL());
		parser.setContentBaseURL(container.getContentBaseURL());
		parserResult = parser.parse(item.getText());
		audioInfos = parserResult.audioInfos;
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
	
	public void setModuleView(Element view) {
		moduleView = view;
	}

	@Override
	protected void onAttach() {
		super.onAttach();
		connectLinks(parserResult.linkInfos.iterator());
		if (container.doAllElementsHasSameWidth()) { // safari fix
			Element itemElement = this.getElement();
			if (moduleView == null || !moduleView.isOrHasChild(itemElement)) {
				return;
			}
			
			Element tableCell = (Element) itemElement.getParentElement();
			Element tableRow = (Element) tableCell.getParentElement();
			Element tableBody = (Element) tableRow.getParentElement();
			Element table = (Element) tableBody.getParentElement();
			if (!table.equals(moduleView)) {
				return;
			}
			
			int itemWidth = container.getWidth();
			itemWidth -= calculateHorizontalSpaceAroundElement(table);
			itemWidth -= calculateHorizontalSpaceAroundElement(tableBody);
			if (!container.isVertical()) {
				itemWidth /= container.getItemCount();
			}
			itemWidth -= calculateHorizontalSpaceAroundElement(tableRow);
			itemWidth -= calculateHorizontalSpaceAroundElement(tableCell);
			itemWidth -= this.calculateHorizontalMargin(itemElement);
			
			setWidth(itemWidth + "px");
			addStyleName("full-width");
		}
	}

	private int calculateHorizontalSpaceAroundElement(Element element) {
		return calculateHorizontalMargin(element) + calculateHorizontalPadding(element) + calculateHorizontalBorder(element);
	}
	
	private int calculateHorizontalMargin(Element element) {
		return ComputedStyle.getStyle(element, "marginLeft") + ComputedStyle.getStyle(element, "marginRight");
	}
	
	private int calculateHorizontalBorder(Element element) {
		return ComputedStyle.getStyle(element, "borderLeftWidth") + ComputedStyle.getStyle(element, "borderRightWidth");
	}
	
	private int calculateHorizontalPadding(Element element) {
		return ComputedStyle.getStyle(element, "paddingLeft") + ComputedStyle.getStyle(element, "paddingRight");
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

	public List<AudioInfo> getAudioInfos() {
		return audioInfos;
	}
}
