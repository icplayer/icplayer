package com.lorepo.icplayer.client.model;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.module.api.player.IAddonDescriptor;
import com.lorepo.icplayer.client.utils.IXMLSerializable;


/**
 * Zawiera opis addona.
 * 
 * @author Krzysztof Langner
 *
 */
public class AddonDescriptor implements IAddonDescriptor, IXMLSerializable{

	private String href;
	private String id;
	private ArrayList<AddonProperty>	propertyNames = new ArrayList<AddonProperty>();
	private ArrayList<String>	resources = new ArrayList<String>();
	private ArrayList<String>	libs = new ArrayList<String>();
	private String viewHtml = "";
	private String previewHtml = "";
	private String code = "";
	private String css = "";
	private boolean isLoaded = false;
	
	
	public AddonDescriptor(String id, String href) {
		this.id = id;
		this.href = href;
	}


	@Override
	public String getAddonId() {
		return id;
	}


	public String getHref() {
		return href;
	}


	public List<AddonProperty> getProperties(){
		return propertyNames;
	}


	public String getCode() {
		return code;
	}
	
	public void setCode(String code){
		this.code = code;
	}


	public String getCSS() {
		return css;
	}

	public void setCSS(String newCSS){
		this.css = newCSS;
	}


	@Override
	public void load(Element rootElement, String baseUrl) {
		
		id = rootElement.getAttribute("id");
		
		loadModel(rootElement);
		loadLibs(rootElement);
		loadResources(rootElement);
		loadCSS(rootElement);
		loadView(rootElement);
		loadPreview(rootElement);
		loadCode(rootElement);
		isLoaded = true;
	}


	private void loadModel(Element rootElement) {
		
		propertyNames.clear();
		NodeList modelNodes = rootElement.getElementsByTagName("model");
		if(modelNodes.getLength() > 0){
			
			NodeList optionNodes = modelNodes.item(0).getChildNodes();
			for(int i = 0; i < optionNodes.getLength(); i++){
		
				Node node = optionNodes.item(i);
				if(node instanceof Element && node.getNodeName().compareTo("property") == 0){
					Element element = (Element)optionNodes.item(i);
					AddonProperty property = new AddonProperty();
					property.load(element);
					propertyNames.add(property);
				}
			}
		}
	}


	private void loadLibs(Element rootElement) {
		
		resources.clear();
		NodeList optionNodes = rootElement.getElementsByTagName("js");
		for(int i = 0; i < optionNodes.getLength(); i++){
	
			Element element = (Element)optionNodes.item(i);
			String src = XMLUtils.getAttributeAsString(element, "src");
			libs.add(src);
		}
	}


	private void loadResources(Element rootElement) {
		
		resources.clear();
		NodeList optionNodes = rootElement.getElementsByTagName("image");
		for(int i = 0; i < optionNodes.getLength(); i++){
	
			Element element = (Element)optionNodes.item(i);
			String src = XMLUtils.getAttributeAsString(element, "src");
			resources.add(src);
		}
	}


	private void loadCSS(Element rootElement) {
		
		NodeList optionNodes = rootElement.getElementsByTagName("css");
		if(optionNodes.getLength() > 0){
			Element viewElement = (Element)optionNodes.item(0);
			String rawView = XMLUtils.getText(viewElement);
			rawView = rawView.trim();
			css = StringUtils.unescapeXML(rawView);
		}
	}


	private void loadView(Element rootElement) {
		
		NodeList optionNodes = rootElement.getElementsByTagName("view");
		if(optionNodes.getLength() > 0){
			Element viewElement = (Element)optionNodes.item(0);
			String rawView = XMLUtils.getText(viewElement);
			rawView = rawView.trim();
			viewHtml = StringUtils.unescapeXML(rawView);
		}
	}


	private void loadPreview(Element rootElement) {
		
		NodeList optionNodes = rootElement.getElementsByTagName("preview");
		if(optionNodes.getLength() > 0){
			Element viewElement = (Element)optionNodes.item(0);
			String rawView = XMLUtils.getText(viewElement);
			rawView = rawView.trim();
			previewHtml = StringUtils.unescapeXML(rawView);
		}
	}


	private void loadCode(Element rootElement) {
		
		NodeList optionNodes = rootElement.getElementsByTagName("presenter");
		if(optionNodes.getLength() > 0){
			Element viewElement = (Element)optionNodes.item(0);
			String rawCode = XMLUtils.getText(viewElement);
			rawCode = rawCode.trim();
			code = StringUtils.unescapeXML(rawCode);
		}
	}


	@Override
	public String toXML() {

		String xml = "<?xml version='1.0' encoding='UTF-8' ?>"; 
				
		xml += "<addon id='" + id + "'>";
		
		xml += "<metadata>";
		xml += "</metadata>";
		
		xml += "<model>";
		for(AddonProperty addonProperty : propertyNames){
			xml += addonProperty.toXML();
		}
		xml += "</model>";

		xml += "<libs>";
		for(String libId : libs){
			xml += "<js src='" + StringUtils.escapeXML(libId) + "'/>";
		}
		xml += "</libs>";

		xml += "<resources>";
		for(String resource : resources){
			xml += "<image src='" + StringUtils.escapeXML(resource) + "'/>";
		}
		xml += "</resources>";

		xml += "<css>";
		String encodedCSS = StringUtils.escapeXML(css);
		xml += encodedCSS;
		xml += "</css>";
		
		xml += "<view>";
		String encodedView = StringUtils.escapeXML(viewHtml);
		xml += encodedView;
		xml += "</view>";
		
		xml += "<preview>";
		String encodedPreview = StringUtils.escapeXML(previewHtml);
		xml += encodedPreview;
		xml += "</preview>";
		
		xml += "<presenter>";
		String encodedPresenter = StringUtils.escapeXML(code);
		xml += encodedPresenter;
		xml += "</presenter>";
		
		xml += "</addon>";
		
		return xml;
	}


	@Override
	public String getViewHTML() {
		return viewHtml;
	}


	public void setViewHTML(String html){
		this.viewHtml = html;
	}
	
	
	public void setId(String id) {
		this.id = id;
	}


	public String getPreviewHTML() {
		return previewHtml;
	}


	public void setPreviewHTML(String html){
		this.previewHtml = html;
	}
	
	
	public void addProperty(AddonProperty addonProperty) {

		propertyNames.add(addonProperty);
	}


	public List<String> getResources() {
		return resources;
	}

	
	public List<String> getLibraries() {
		return libs;
	}

	
	public boolean isLoaded(){
		return isLoaded;
	}
}
