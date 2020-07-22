package com.lorepo.icplayer.client.module.image;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Style;
import com.google.gwt.user.client.ui.Image;
import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IEnumSetProperty;
import com.lorepo.icf.properties.IImageProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IPrintableModuleModel;
import com.lorepo.icplayer.client.module.IWCAGModuleModel;
import com.lorepo.icplayer.client.module.Printable;
import com.lorepo.icplayer.client.module.Printable.PrintableMode;

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
	
	public ImageModule() {
		super("Image", DictionaryWrapper.get("image_module"));
		
		addPropertyImage(true);
		addPropertyMode();
		addPropertyAnimatedGifRefresh();
		this.addPropertyAlternativeText();
		addPropertyPrintable();
	}

	
	public String getUrl(){
	
		if(imagePath.isEmpty()){
			return GWT.getModuleBaseURL() + "media/no_image.gif";
			
		}
		else if(imagePath.startsWith("http") || imagePath.startsWith("/")){
			return imagePath;
		}
		else{
			return this.baseURL + imagePath;
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
		JavaScriptUtils.log(getPrintableHTML(true));
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
	
	private void keepAspect(Image image, int width, int height) {
		ImageViewUtils.keepAspect(image, getWidth(), getHeight());
		Style style = image.getElement().getStyle();
		style.setPosition(Style.Position.ABSOLUTE);
		style.setLeft((width - image.getWidth())/2, Style.Unit.PX);
	}

	@Override
	public String getPrintableHTML(boolean showAnswers) {
		if (getPrintable() == PrintableMode.NO) return null;
		
		String rootStyle = "width:"+Integer.toString(getWidth())+"px;";
		rootStyle += "height:"+Integer.toString(getHeight())+"px;";
		rootStyle += "position: relative;";
		String result = "<div class=\"ic_image\" id=\"" + getId() + "\" style=\"" + rootStyle + "\">";
		
		Image image = new Image();
		image.setUrl(getUrl());
		if(getDisplayMode() == DisplayMode.stretch){
			image.setPixelSize(getWidth(), getHeight());
		}
		else if(getDisplayMode() == DisplayMode.keepAspect){
			keepAspect(image, getWidth(), getHeight());
		}
		else if(getDisplayMode() == DisplayMode.originalSize){
			image.setVisibleRect(0, 0, getWidth(), getHeight());
		}
		result += image.getElement().getString();
		result += "</div>";
		
		return result;
	}


	@Override
	public PrintableMode getPrintableMode() {
		return getPrintable();
	}
}
