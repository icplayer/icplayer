package com.lorepo.icplayer.client.module.imagesource;

import com.google.gwt.core.client.GWT;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IImageProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;


/**
 * Obrazek żródłowy, który można przedragować do gapy
 * 
 * @author Krzysztof Langner
 *
 */
public class ImageSourceModule extends BasicModuleModel {

	private String imagePath = "";
	private String baseUrl = "";
	private boolean removable = true;
	
	
	public ImageSourceModule() {
		super(DictionaryWrapper.get("image_source_module"));
		
		addPropertyImage();
		addPropertyRemovable();
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
					removable = XMLUtils.getAttributeAsBoolean((Element)childNode, "removable", true);
				}
			}
		}
	}


	/**
	 * Convert module into XML
	 */
	@Override
	public String toXML() {
		
		String removableString = removable ? "True":"False";
		String xml = 
				"<imageSourceModule " + getBaseXML() + ">" + 
				"<image src='" + StringUtils.escapeHTML(imagePath) + "' removable='" + removableString + "'/>" +
				"</imageSourceModule>";
		
		return xml;
	}
	
	
	private void addPropertyImage() {

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
				return DictionaryWrapper.get("image_source_image");
			}
		};
		
		addProperty(property);
	}
	
	protected boolean isRemovable() {
		return removable;
	}
	
	private void addPropertyRemovable() {

		IProperty property = new IBooleanProperty() {
				
			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0); 
				
				if(value!= removable){
					removable = value;
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(removable){
					return "True";
				}
				else{
					return "False";
				}
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("image_source_removable");
			}

		};
		
		addProperty(property);
	}
	
}
