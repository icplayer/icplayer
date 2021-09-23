package com.lorepo.icplayer.client.module.lessonreset;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.properties.IStaticListProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IWCAGModuleModel;
import com.lorepo.icplayer.client.module.choice.SpeechTextsStaticListItem;

import java.util.ArrayList;

public class LessonResetModule extends BasicModuleModel implements IWCAGModuleModel {

private String title = "";
private boolean resetMistakes = false;
private boolean resetChecks = false;
private boolean resetVisitedPages = false;
private ArrayList<SpeechTextsStaticListItem> speechTextItems = new ArrayList<SpeechTextsStaticListItem>();
	
	public LessonResetModule() {		
		super("Lesson Reset", DictionaryWrapper.get("Lesson_Reset_name"));
		
		addPropertyTitle();
		addPropertyResetMistakes();
		addPropertyResetChecks();
		addPropertySpeechTexts();
		addPropertyResetVisitedPages();
	}

	public String getTitle () {
		return title;
	}

	private void addPropertyTitle() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				title = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return title;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("Lesson_Reset_property_title");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Lesson_Reset_property_title");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyResetMistakes() {
		
		IProperty property = new IBooleanProperty() {
			
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if (value!= resetMistakes) {
					resetMistakes = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				return resetMistakes ? "True" : "False";
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("Lesson_Reset_property_reset_mistakes");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Lesson_Reset_property_reset_mistakes");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};
		
		addProperty(property);	
	}

	private void addPropertyResetChecks() {
	
		IProperty property = new IBooleanProperty() {
		
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value!= resetChecks) {
					resetChecks = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return resetChecks ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("Lesson_Reset_property_reset_checks");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Lesson_Reset_property_reset_checks");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};
	
		addProperty(property);
	}

	private void addPropertyResetVisitedPages() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value!= resetVisitedPages) {
					resetVisitedPages = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return resetVisitedPages ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("Lesson_Reset_property_reset_visited_pages");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Lesson_Reset_property_reset_visited_pages");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}
	
	public boolean getResetMistakes() {
		return resetMistakes;
	}
	
	public boolean getResetChecks() {
		return resetChecks;
	}

	public boolean getResetVisitedPages() {
		return resetVisitedPages;
	}
	
	@Override
	protected void parseModuleNode(Element node) {
		NodeList nodes = node.getChildNodes();
		for (int i = 0; i < nodes.getLength(); i++) {
			
			Node childNode = nodes.item(i);
			if (childNode instanceof Element) {
				if(childNode.getNodeName().compareTo("lessonReset") == 0) {
					Element childElement = (Element) childNode;
					
					title = StringUtils.unescapeXML(XMLUtils.getAttributeAsString(childElement, "title"));
					resetMistakes = XMLUtils.getAttributeAsBoolean((Element)childElement, "resetMistakes", false);
					resetChecks = XMLUtils.getAttributeAsBoolean((Element)childElement, "resetChecks", false);
					resetVisitedPages = XMLUtils.getAttributeAsBoolean((Element)childElement, "resetVisitedPages", false);
					this.speechTextItems.get(0).setText(XMLUtils.getAttributeAsString(childElement, "lesson_was_reset"));
				}
			}
		}
	}
	
	@Override
	public String toXML() {
		Element lessonResetModule = XMLUtils.createElement("lessonResetModule");
		this.setBaseXMLAttributes(lessonResetModule);
		lessonResetModule.appendChild(this.getLayoutsXML());
		lessonResetModule.appendChild(this.modelToXML());
		
		return lessonResetModule.toString();
	}
	
	protected Element modelToXML() {
		Element lessonResetElement = XMLUtils.createElement("lessonReset");
		String encodedTitle = StringUtils.escapeHTML(title);
		lessonResetElement.setAttribute("title", encodedTitle);
		XMLUtils.setBooleanAttribute(lessonResetElement, "resetMistakes", resetMistakes);
		XMLUtils.setBooleanAttribute(lessonResetElement, "resetChecks", resetChecks);
		XMLUtils.setBooleanAttribute(lessonResetElement, "resetVisitedPages", resetVisitedPages);
		lessonResetElement.setAttribute("lesson_was_reset", this.speechTextItems.get(0).getText());

		return lessonResetElement;
	}

	private void addPropertySpeechTexts() {
		IStaticListProperty property = new IStaticListProperty() {
			@Override
			public String getName() {
				return DictionaryWrapper.get("choice_speech_texts");
			}

			@Override
			public String getValue() {
				return Integer.toString(speechTextItems.size());
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("choice_speech_texts");
			}

			@Override
			public void setValue(String newValue) {}

			@Override
			public boolean isDefault() {
				return false;
			}

			@Override
			public int getChildrenCount() {
				return speechTextItems.size();
			}

			@Override
			public void addChildren(int count) {
				speechTextItems.add(new SpeechTextsStaticListItem("lesson_was_reset","Lesson_Reset"));
			}

			@Override
			public IPropertyProvider getChild(int index) {
				return speechTextItems.get(index);
			}

			@Override
			public void moveChildUp(int index) {
			}

			@Override
			public void moveChildDown(int index) {
			}

		};

		addProperty(property);
		property.addChildren(1);
	}

	public String getSpeechTextItem (int index) {
		if (index < 0 || index >= this.speechTextItems.size()) {
			return "";
		}

		final String text = this.speechTextItems.get(index).getText();
		if (text.isEmpty()) {
			if (index == 0) {
				return "Lesson has been reset";
			}

			return "";
		}

		return text;
	}
}
