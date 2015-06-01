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

/**
 * Gapa przyjmująca obrazek
 * 
 * @author Krzysztof Langner
 *
 */
public class ImageGapModule extends BasicModuleModel {

	public static final String EVENT_CORRECT = "onCorrect";
	public static final String EVENT_WRONG = "onWrong";
	public static final String EVENT_EMPTY = "onEmpty";
	
	private String answerId = "";
	private boolean isActivity = true;
	private boolean isDisabled = false;
	
	private HashMap<String, String>  events = new HashMap<String, String>();
	
	public ImageGapModule() {
		super(DictionaryWrapper.get("image_gap_module"));
		
		addPropertyAnswer();
		addPropertyIsActivity();
		addPropertyEvent(EVENT_CORRECT);
		addPropertyEvent(EVENT_WRONG);
		addPropertyEvent(EVENT_EMPTY);
		addPropertyIsDisabled();
	}
	
	public String getAnswerId() {
		return answerId;
	}
	
	@Override
	public void load(Element node, String baseUrl) {
		super.load(node, baseUrl);
		
		loadEvents(node);
		
		NodeList nodes = node.getChildNodes();
		for (int i = 0; i < nodes.getLength(); i++) {
			Node childNode = nodes.item(i);
			if (childNode instanceof Element) {
				if (childNode.getNodeName().compareTo("gap") == 0 && childNode instanceof Element) {
					Element gapElement = (Element)childNode;
					answerId = XMLUtils.getAttributeAsString(gapElement, "answerId");
					isActivity = XMLUtils.getAttributeAsBoolean(gapElement, "isActivity", true);
					isDisabled = XMLUtils.getAttributeAsBoolean(gapElement, "isDisabled", false);
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
		
		String xml = "<imageGapModule " + getBaseXML() + ">" + getLayoutXML();
		xml += "<events>";
		xml += eventToXML(EVENT_CORRECT);
		xml += eventToXML(EVENT_WRONG);
		xml += eventToXML(EVENT_EMPTY);
		xml += "</events>";
		xml += "<gap answerId='" + answerId + "' isActivity='" + isActivity + "' isDisabled='" + isDisabled + "'/>";
		xml += "</imageGapModule>";
		
		return xml;
	}

	private String eventToXML(String eventName) {
		String code = events.get(eventName);
		String escapedCode = StringUtils.escapeXML(code);
		return "<event name='" + eventName + "' code='" + escapedCode + "'/>";
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
		};
		
		addProperty(property);
	}


	private void addPropertyIsActivity() {
		
		IProperty property = new IBooleanProperty() {
			
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if (value!= isActivity) {
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

		};
		
		addProperty(property);	
	}
	
	private void addPropertyIsDisabled() {
		
		IProperty property = new IBooleanProperty() {
			
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if (value!= isDisabled) {
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

}
