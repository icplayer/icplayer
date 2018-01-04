package com.lorepo.icplayer.client.module.imagegap;

import java.util.HashMap;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IEventProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IStringListProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;

public class ImageGapModule extends BasicModuleModel {

	public static final String EVENT_CORRECT = "onCorrect";
	public static final String EVENT_WRONG = "onWrong";
	public static final String EVENT_EMPTY = "onEmpty";

	private String answerId = "";
	private boolean isActivity = true;
	private boolean isDisabled = false;
	private boolean blockWrongAnswers = false;

	private final HashMap<String, String> events = new HashMap<String, String>();

	public ImageGapModule() {
		super("Image gap", DictionaryWrapper.get("image_gap_module"));

		addPropertyAnswer();
		addPropertyIsActivity();
		addPropertyEvent(EVENT_CORRECT);
		addPropertyEvent(EVENT_WRONG);
		addPropertyEvent(EVENT_EMPTY);
		addPropertyIsDisabled();
		addPropertyBlockWrongAnswers();
	}

	public String getAnswerId() {
		return answerId;
	}
	
	@Override
	protected void parseModuleNode(Element node) {
		loadEvents(node);

		NodeList nodes = node.getChildNodes();
		for (int i = 0; i < nodes.getLength(); i++) {
			Node childNode = nodes.item(i);
			if (childNode instanceof Element) {
				if (childNode.getNodeName().compareTo("gap") == 0 && childNode instanceof Element) {
					Element gapElement = (Element) childNode;
					answerId = XMLUtils.getAttributeAsString(gapElement, "answerId");
					isActivity = XMLUtils.getAttributeAsBoolean(gapElement, "isActivity", true);
					isDisabled = XMLUtils.getAttributeAsBoolean(gapElement, "isDisabled", false);
					blockWrongAnswers = XMLUtils.getAttributeAsBoolean(gapElement, "blockWrongAnswers", false);
					break;
				}
			}
		}
	}

	private void loadEvents(Element rootElement) {

		NodeList eventsNodes = rootElement.getElementsByTagName("events");

		if (eventsNodes.getLength() > 0) {

			NodeList eventNodes = eventsNodes.item(0).getChildNodes();
			for (int i = 0; i < eventNodes.getLength(); i++) {

				Node node = eventNodes.item(i);
				if (node instanceof Element && node.getNodeName().compareTo("event") == 0) {
					Element element = (Element)eventNodes.item(i);
					String name = element.getAttribute("name");
					String rawCode = element.getAttribute("code");
					String code = StringUtils.unescapeXML(rawCode);
					events.put(name, code);
				}
			}
		}
	}

	/**
	 * Convert module into XML
	 */
	@Override
	public String toXML() {
		Element imageGapModule = XMLUtils.createElement("imageGapModule");
		
		this.setBaseXMLAttributes(imageGapModule);
		imageGapModule.appendChild(this.getLayoutsXML());
		
		Element events = XMLUtils.createElement("events");
		events.appendChild(this.eventToXML(EVENT_CORRECT));
		events.appendChild(this.eventToXML(EVENT_WRONG));
		events.appendChild(this.eventToXML(EVENT_EMPTY));
		imageGapModule.appendChild(events);
		
		Element gap = XMLUtils.createElement("gap");
		gap.setAttribute("answerId", answerId);
		gap.setAttribute("isActivity", Boolean.toString(isActivity));
		gap.setAttribute("isDisabled", Boolean.toString(isDisabled));
		gap.setAttribute("blockWrongAnswers", Boolean.toString(blockWrongAnswers));
		imageGapModule.appendChild(gap);

		return imageGapModule.toString();
	}

	private Node eventToXML(String eventName) {
		String code = events.get(eventName);
		String escapedCode = StringUtils.escapeXML(code);
		
		Element event = XMLUtils.createElement("event");
		event.setAttribute("name", eventName);
		event.setAttribute("code", escapedCode);
		
		return event;
	}

	private void addPropertyAnswer() {

		IProperty property = new IStringListProperty() {

			@Override
			public void setValue(String newValue) {
				answerId = newValue.replace("\n", ";");
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return answerId.replace(";", "\n");
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("image_gap_answer");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("image_gap_answer");
			}

			@Override
			public boolean isDefault() {
				return true;
			}
		};

		addProperty(property);
	}

	private void addPropertyBlockWrongAnswers() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);
				if (value!= blockWrongAnswers) {
					blockWrongAnswers = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return blockWrongAnswers ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("block_wrong_answers");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("block_wrong_answers");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}
	
	private void addPropertyIsActivity() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != isActivity) {
					isActivity = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isActivity ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("is_activity");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("is_activity");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}

	private void addPropertyIsDisabled() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != isDisabled) {
					isDisabled = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isDisabled ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("image_gap_is_disabled");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("image_gap_is_disabled");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}

	private void addPropertyEvent(final String eventName) {

		IProperty property = new IEventProperty() {

			@Override
			public void setValue(String newValue) {
				events.put(eventName, newValue);
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				String value = events.get(eventName);
				return value == null ? "" : value;
			}

			@Override
			public String getName() {
				return getEventTranslatedName(eventName);
			}

			@Override
			public String getDisplayName() {
				return getEventTranslatedName(eventName);
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	private String getEventTranslatedName(final String eventName) {
		String label = "image_gap_on_";

		if (eventName.equals(EVENT_CORRECT)) {
			label += "correct";
		} else if (eventName.equals(EVENT_WRONG)) {
			label += "wrong";
		} else if (eventName.equals(EVENT_EMPTY)) {
			label += "empty";
		} else {
			throw new IllegalArgumentException();
		}

		return DictionaryWrapper.get(label);
	}

	public String getEventCode(String eventName) {
		return events.get(eventName);
	}

	public boolean isActivity() {
		return isActivity;
	}

	public boolean isDisabled() {
		return isDisabled;
	}
	
	public boolean shouldBlockWrongAnswers() {
		return blockWrongAnswers;
	}

}
