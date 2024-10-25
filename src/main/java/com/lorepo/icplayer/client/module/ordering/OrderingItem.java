package com.lorepo.icplayer.client.module.ordering;

import java.util.ArrayList;

import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.DOM;
import com.lorepo.icf.properties.BasicPropertyProvider;
import com.lorepo.icf.properties.IHtmlProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.ExtendedRequestBuilder;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.model.alternativeText.AlternativeTextService;

public class OrderingItem extends BasicPropertyProvider {

	private String html;
	private final String baseURL;
	private final String contentBaseURL;
	private final int index;
	private final ArrayList<Integer> alternativeIndexes = new ArrayList<Integer>();
	private Integer startingPosition;
	private String startingPositionString = "";
	private static final String AUDIO_REGEX = "\\\\audio\\{\\S+?\\}";
	private static final String DIV_WITH_AUDIO_REGEX = "<div>\\\\audio\\{\\S+?\\}</div>";
	private static final String DIV_WITHOUT_AUDIO = "<div><br></div>";

	public OrderingItem(int index, String safeHtml, String baseURL, Integer startingPosition) {
		super(DictionaryWrapper.get("ordering_item"));
		this.index = index;
		this.html = safeHtml;
		this.baseURL = baseURL;
		this.contentBaseURL = null;
		this.startingPosition = startingPosition;
		if (this.startingPosition != null) {
			this.startingPositionString = String.valueOf(this.startingPosition);
		}

		this.addPropertyText();
		this.addPropertyStartingPosition();
	}

	public OrderingItem(int index, String safeHtml, String baseURL, Integer startingPosition, String contentBaseURL) {
		super(DictionaryWrapper.get("ordering_item"));
		this.index = index;
		this.html = safeHtml;
		this.baseURL = baseURL;
		this.contentBaseURL = contentBaseURL;
		this.startingPosition = startingPosition;
		if (this.startingPosition != null) {
			this.startingPositionString = String.valueOf(this.startingPosition);
		}

		this.addPropertyText();
		this.addPropertyStartingPosition();
	}

	public String getText() {
		return (baseURL == null && contentBaseURL == null && ExtendedRequestBuilder.getSigningPrefix() == null) ? html : StringUtils.updateLinks(html, baseURL, contentBaseURL);
	}

	private void addPropertyText() {

		IHtmlProperty property = new IHtmlProperty() {

			@Override
			public void setValue(String newValue) {
				html = newValue;
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return html;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("ordering_item_text");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("ordering_item_text");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}
	
	private void addPropertyStartingPosition() {

		IProperty property = new IProperty() {

			@Override
			public void setValue(String newValue) {
				startingPositionString = newValue;
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return startingPositionString;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("ordering_item_starting_position");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("ordering_item_starting_position");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	public void addAlternativeIndex(int index) {
		alternativeIndexes.add(index);
	}

	public int getIndex() {
		return index;
	}

	public boolean isCorrect(int position) {

		if (index == position) return true;

		for (int index : alternativeIndexes)
			if (index == position) return true;

		return false;
	}

	public void clearAlternativeIndexes() {
		alternativeIndexes.clear();
	}
	
	public String getStartingPositionString() {
		return this.startingPositionString;
	}

	public Integer getStartingPosition() {
		return this.startingPosition;
	}

	public void setStartingPositionString(String value) {
		this.startingPositionString = value;
	}
	
	public void setStartingPosition(Integer value) {
		this.startingPosition = value;
	}

	public Element toPrintableDOMElement(Element indexBox) {
		Element table = DOM.createTable();
		Element TR = DOM.createTR();
		table.appendChild(TR);

		Element indexBoxTD = createTDWithIndexBox(indexBox);
		TR.appendChild(indexBoxTD);

		Element textTD = createTDWithItemText();
		TR.appendChild(textTD);

		Element item = DOM.createDiv();
		item.setClassName("item-wrapper");
		item.appendChild(table);
		return item;
	}

	private Element createTDWithIndexBox(Element indexBox){
		Element indexBoxTD = DOM.createTD();
		indexBoxTD.appendChild(indexBox);
		return indexBoxTD;
	}

	private Element createTDWithItemText(){
		Element textTD = DOM.createTD();
		String text = this.preprocessItemTextForPrintable();
		textTD.setInnerHTML(text);
		return textTD;
	}

	private String preprocessItemTextForPrintable() {
		String text = this.getText();
		text = this.removeAudioFromHTML(text);
		return AlternativeTextService.getVisibleText(text);
	}

	private String removeAudioFromHTML(String text) {
		String newText = text.replaceAll(DIV_WITH_AUDIO_REGEX, DIV_WITHOUT_AUDIO);
		return newText.replaceAll(AUDIO_REGEX, "");
	}
}
