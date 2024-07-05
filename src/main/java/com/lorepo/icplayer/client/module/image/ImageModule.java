package com.lorepo.icplayer.client.module.image;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IEnumSetProperty;
import com.lorepo.icf.properties.IImageProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IWCAGModuleModel;
import com.lorepo.icplayer.client.printable.IPrintableModuleModel;
import com.lorepo.icplayer.client.printable.Printable;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.PrintableController;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;

public class ImageModule extends BasicModuleModel implements IWCAGModuleModel, IPrintableModuleModel {

	public enum DisplayMode{
		stretch,
		keepAspect,
		originalSize
	}
	
	private String imagePath = "";
	private DisplayMode mode = DisplayMode.stretch;
	private boolean animatedGifRefresh = false;
	private String alternativeText = "";
	private String printableValue = "No";
	private PrintableController printableController = null;
	
	public ImageModule() {
		super("Image", DictionaryWrapper.get("image_module"));
		
		addPropertyImage(true);
		addPropertyMode();
		addPropertyAnimatedGifRefresh();
		this.addPropertyAlternativeText();
		addPropertyPrintable();
	}

	
	public String getUrl(){
		if (imagePath.isEmpty()){
			return GWT.getModuleBaseURL() + "media/no_image.gif";
		}
		
		String contentBaseURL = this.getContentBaseURL();
		if (contentBaseURL == null) {
			if (imagePath.startsWith("http") || imagePath.startsWith("/")) {
				return imagePath;
			}
			return this.baseURL + imagePath;
		} else {
			if (imagePath.startsWith("http")) {
				return imagePath;
			} else if (imagePath.startsWith("//")) {
				return "https:" + imagePath;
			}
			return contentBaseURL + imagePath;
		}
	}

	public String getAltText() {
		return this.alternativeText;
	}
	
	protected void parseModuleNode(Element node) {
		NodeList nodes = node.getChildNodes();
		for(int i = 0; i < nodes.getLength(); i++){
			
			
			Node childNode = nodes.item(i);
			if(childNode instanceof Element){
				if(childNode.getNodeName().compareTo("image") == 0){
					Element childElement = (Element) childNode;
					imagePath = StringUtils.unescapeXML(childElement.getAttribute("src"));
					String modeName = childElement.getAttribute("mode");
					setModeFromString(modeName);
					printableValue = XMLUtils.getAttributeAsString(childElement, "printable");
					animatedGifRefresh = XMLUtils.getAttributeAsBoolean(childElement, "animatedGifRefresh", false);
					this.alternativeText = StringUtils.unescapeXML(XMLUtils.getAttributeAsString(childElement, "alt"));
				}
			}
		}
	}
	

	private void setModeFromString(String typeName) {
		if (typeName != null) {
			this.mode = DisplayMode.valueOf(typeName); 
		}
	}	


	@Override
	public String toXML() {
		Element imageModule = XMLUtils.createElement("imageModule");
		
		this.setBaseXMLAttributes(imageModule);
		imageModule.appendChild(this.getLayoutsXML());
		
		Element imageElement = XMLUtils.createElement("image");
		imageElement.setAttribute("src", StringUtils.escapeHTML(imagePath));
		imageElement.setAttribute("alt", StringUtils.escapeXML(this.alternativeText));
		imageElement.setAttribute("mode", mode.toString());
		imageElement.setAttribute("printable", printableValue);
		imageElement.setAttribute("animatedGifRefresh", Boolean.toString(animatedGifRefresh));

		imageModule.appendChild(imageElement);
		
		return imageModule.toString();
	}
	
	
	private void addPropertyImage(final boolean isDefault) {

		IProperty property = new IImageProperty() {
				
			@Override
			public void setValue(String newValue) {
				imagePath = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return imagePath;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("image_property");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("image_property");
			}

			@Override
			public boolean isDefault() {
				return isDefault;
			}
		};
		
		addProperty(property);
	}

	
	private void addPropertyMode() {

		IProperty property = new IEnumSetProperty() {
			
			@Override
			public void setValue(String newValue) {
				setModeFromString(newValue);
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return mode.toString();
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("mode_property");
			}
			
			@Override
			public int getAllowedValueCount() {
				return DisplayMode.values().length;
			}
			
			@Override
			public String getAllowedValue(int index) {
				return DisplayMode.values()[index].toString();
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("mode_property");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyAnimatedGifRefresh() {
		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != animatedGifRefresh) {
					animatedGifRefresh = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return animatedGifRefresh ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("image_property_animated_gif_refresh");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("image_property_animated_gif_refresh");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}
	
	private void addPropertyAlternativeText() {
		IProperty property = new IProperty() {

			@Override
			public void setValue(String newValue) {
				alternativeText = newValue;
			}

			@Override
			public String getValue() {
				return alternativeText;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("image_property_alternative_text");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("image_property_alternative_text");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}
	
	public boolean getAnimatedGifRefresh() {
		return animatedGifRefresh;
	}

	
	public DisplayMode getDisplayMode(){
		return mode;
	}
	
	private void addPropertyPrintable() {
		IProperty property = new IEnumSetProperty() {

			@Override
			public void setValue(String newValue) {	
				printableValue = newValue;
			}

			@Override
			public String getValue() {
				return printableValue;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get(Printable.NAME_LABEL);
			}

			@Override
			public int getAllowedValueCount() {
				return 3;
			}

			@Override
			public String getAllowedValue(int index) {
				return Printable.getStringValues(index);
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(Printable.NAME_LABEL);
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}
	
	public PrintableMode getPrintable() {
		return Printable.getPrintableModeFromString(printableValue);
	}


	@Override
	public String getPrintableHTML(boolean showAnswers) {
		ImagePrintable printable = new ImagePrintable(this);
		String className = this.getStyleClass();
		String result = printable.getPrintableHTML(className, showAnswers);	
		return result;
	}

	@Override
	public PrintableMode getPrintableMode() {
		return getPrintable();
	}

	@Override
	public boolean isSection() {
		return false;
	}

	@Override
	public void setPrintableState(String state) {
		//TODO implement
	}

	@Override
	public boolean isPrintableAsync() {
		return false;
	}

	@Override
	public void setPrintableAsyncCallback(String id, PrintableContentParser.ParsedListener listener) {

	}


	@Override
	public JavaScriptObject getPrintableContext() {
		return null;
	}


	@Override
	public void setPrintableController(PrintableController controller) {
		this.printableController = controller;
		
	}
}
