package com.lorepo.icplayer.client.module.lessonreset;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;

public class LessonResetModule extends BasicModuleModel {

private String title = "";
private boolean resetMistakes = false;
private boolean resetChecks = false;
	
	public LessonResetModule() {		
		super("Lesson Reset", DictionaryWrapper.get("Lesson_Reset_name"));
		
		addPropertyTitle();
		addPropertyResetMistakes();
		addPropertyResetChecks();
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
	
	public boolean getResetMistakes() {
		return resetMistakes;
	}
	
	public boolean getResetChecks() {
		return resetChecks;
	}
	
	@Override
	protected void parseModuleNode(Element node) {
		NodeList nodes = node.getChildNodes();
		for (int i = 0; i < nodes.getLength(); i++) {
			
			Node childNode = nodes.item(i);
			if (childNode instanceof Element) {
				if(childNode.getNodeName().compareTo("lessonReset") == 0) {
					Element childElement = (Element) childNode;
					
					title = XMLUtils.getAttributeAsString(childElement, "title");
					resetMistakes = XMLUtils.getAttributeAsBoolean((Element)childElement, "resetMistakes", false);
					resetChecks = XMLUtils.getAttributeAsBoolean((Element)childElement, "resetChecks", false);
					
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
		
		return lessonResetElement;
	}
}
