package com.lorepo.icplayer.client.module.image;

import com.google.gwt.core.client.GWT;
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

public class ImageModule extends BasicModuleModel {

	public enum DisplayMode{
		stretch,
		keepAspect,
		originalSize
	}
	
	private String imagePath = "";
	private String baseUrl = "";
	private DisplayMode mode = DisplayMode.stretch;
	private boolean animatedGifRefresh = false;
	private String alternativeText = "";
	
	
	public ImageModule() {
		super("Image", DictionaryWrapper.get("image_module"));
		
		addPropertyImage(true);
		addPropertyMode();
		addPropertyAnimatedGifRefresh();
		this.addPropertyAlternativeText();
	}

	
	public String getUrl(){
	
		if(imagePath.isEmpty()){
			return GWT.getModuleBaseURL() + "media/no_image.gif";
			
		}
		else if(imagePath.startsWith("http") || imagePath.startsWith("/")){
			return imagePath;
		}
		else{
			return baseUrl + imagePath;
		}
	}
	
	public String getAltText() {
		return this.alternativeText;
	}


	@Override
	public void load(Element node, String baseUrl) {
	
		super.load(node, baseUrl);
		
		this.baseUrl = baseUrl;
		NodeList nodes = node.getChildNodes();
		for(int i = 0; i < nodes.getLength(); i++){
			
			Node childNode = nodes.item(i);
			if(childNode instanceof Element){
				
				if(childNode.getNodeName().compareTo("image") == 0 && childNode instanceof Element){
					Element childElement = (Element) childNode;
					imagePath = StringUtils.unescapeXML(childElement.getAttribute("src"));
					String modeName = childElement.getAttribute("mode");
					setModeFromString(modeName);
					animatedGifRefresh = XMLUtils.getAttributeAsBoolean(childElement, "animatedGifRefresh", false);
					this.alternativeText = StringUtils.unescapeXML(XMLUtils.getAttributeAsString(childElement, "alt"));
				}
			}
		}
	}
	
	
	private void setModeFromString(String typeName) {
		
		if(typeName != null){
			for(DisplayMode modeType : DisplayMode.values()){
				if(modeType.toString().compareTo(typeName) == 0){
					mode = modeType;
				}
			}
		}
	}	


	@Override
	public String toXML() {
		
		String xml = 
				"<imageModule " + getBaseXML() + ">" + getLayoutXML() +
				"<image src='" + StringUtils.escapeHTML(imagePath) + "' " +
				"alt='" + StringUtils.escapeXML(this.alternativeText) + "' " + 
				"mode='"+ mode.toString() + "' " + "animatedGifRefresh='" + animatedGifRefresh +"'/>" +
				"</imageModule>";
		
		return xml;
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
}
