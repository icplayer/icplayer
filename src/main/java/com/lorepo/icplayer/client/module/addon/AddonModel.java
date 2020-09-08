package com.lorepo.icplayer.client.module.addon;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IAudioProperty;
import com.lorepo.icf.properties.IEditableSelectProperty;
import com.lorepo.icf.properties.IFileProperty;
import com.lorepo.icf.properties.IHtmlProperty;
import com.lorepo.icf.properties.IImageProperty;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.properties.IStaticListProperty;
import com.lorepo.icf.properties.IStaticRowProperty;
import com.lorepo.icf.properties.IVideoProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IPrintableModuleModel;
import com.lorepo.icplayer.client.module.Printable;
import com.lorepo.icplayer.client.module.Printable.PrintableMode;
import com.lorepo.icplayer.client.module.addon.param.AddonParamFactory;
import com.lorepo.icplayer.client.module.addon.param.IAddonParam;

public class AddonModel extends BasicModuleModel implements IPrintableModuleModel {

	private String addonId;
	private ArrayList<IAddonParam>	addonParams = new ArrayList<IAddonParam>();
	
	public interface OnAddonReleaseAction {
		public void onRelease();
	}
	
	private OnAddonReleaseAction onAddonReleaseAction = null;
	
	
	public AddonModel() {
		super("Addon", "Addon");
	}

	@Override
	public void release() {
		super.release();
		
		if (this.onAddonReleaseAction != null) {
			this.onAddonReleaseAction.onRelease();
			this.onAddonReleaseAction = null;
		}
	}
	
	public void setReleaseAction (OnAddonReleaseAction action) {
		this.onAddonReleaseAction = action;
	}
	
	@Override
	public String getModuleTypeName() {
		
		if(addonId == null){
			return super.getModuleTypeName();
		}
		
		return addonId;
	}
	
	@Override
	public String getModuleName() {
		return getModuleTypeName();
	}

	
	@Override
	public String getProviderName() {
		return getModuleTypeName();
	}
	
	@Override
	protected void parseModuleNode(Element rootElement) {
		addonParams.clear();
		addonId = rootElement.getAttribute("addonId");
		loadProperties(rootElement);
	}

	
	private void loadProperties(Element rootElement) {
		AddonParamFactory paramFactory = new AddonParamFactory();
		NodeList propertiesNodes = rootElement.getElementsByTagName("properties");

		if(propertiesNodes.getLength() > 0){
			
			NodeList optionNodes = propertiesNodes.item(0).getChildNodes();
			for(int i = 0; i < optionNodes.getLength(); i++){
	
				Node node = optionNodes.item(i);
				if(node instanceof Element && node.getNodeName().compareTo("property") == 0){
					Element element = (Element)node;
					String type = XMLUtils.getAttributeAsString(element, "type");
					IAddonParam addonParam = paramFactory.createAddonParam(this, type);

					addonParam.load(element, this.getBaseURL());
					addAddonParam(addonParam);
				}
			}
		}
	}

	@Override
	public String toXML() {
		Element addonModule = XMLUtils.createElement("addonModule");
		
		addonModule.setAttribute("addonId", addonId);
		this.setBaseXMLAttributes(addonModule);
		addonModule.appendChild(this.getLayoutsXML());
		
		Element properties = XMLUtils.createElement("properties");

		for (IAddonParam property : addonParams) {
			properties.appendChild(property.toXML());
		}
		
		addonModule.appendChild(properties);
		
		return addonModule.toString();
	}


	public String getAddonId() {
		return addonId;
	}


	public void setAddonId(String id) {
		this.addonId = id;
	}


	public void addAddonParam(String name, String displayName, String type) {
		AddonParamFactory paramFactory = new AddonParamFactory();
		IAddonParam addonParam = paramFactory.createAddonParam(this, type);
		addonParam.setName(name);
		addonParam.setDisplayName(displayName);
		
		addAddonParam(addonParam);
	}

	public void addAddonParam(IAddonParam param) {

		addonParams.add(param);
		addProperty(param.getAsProperty());
	}

	public List<IAddonParam> getParams(){
		return addonParams;
	}

	@Override
	public String getPrintableHTML(boolean showAnswers) {
		if (getPrintableMode() == PrintableMode.NO) return null;
		
		String addonName = "Addon" + getAddonId() + "_create";
		JavaScriptObject jsModel = createJsModel(this);
		String className = this.getStyleClass();
		
		return getPrintableHTML(addonName, jsModel, className, showAnswers);
	}
	
	private native String getPrintableHTML(String addonName, JavaScriptObject model, String className, boolean showAnswers) /*-{
		if($wnd.window[addonName] == null){
			return null;
		}
		var presenter = $wnd.window[addonName]();
		
		if (!presenter.hasOwnProperty("getPrintableHTML")) {
			return null;
		}
		
		var printableHTML = presenter.getPrintableHTML(model, showAnswers);
		if (className) {
			var $printable = $wnd.$(printableHTML);
			$printable.addClass("printable_module-" + className);
			printableHTML = $printable[0].outerHTML;
		}
		return printableHTML;
	}-*/;

	@Override
	public PrintableMode getPrintableMode() {
		for (IAddonParam addonParam: addonParams) {
			if(addonParam.getName().equals("printable")) {
				IProperty prop = addonParam.getAsProperty();
				return Printable.getPrintableModeFromString(prop.getValue());
			}
		}
		return PrintableMode.NO;
	}
	
	@Override
	public boolean isSection() {
		for (IAddonParam addonParam: addonParams) {
			if(addonParam.getName().equals("isSection")) {
				return addonParam.getAsProperty().getValue().equals("True");
			}
		}
		return false;
	}
	
	public JavaScriptObject createJsModel(IPropertyProvider provider) {

		JavaScriptObject jsModel = JavaScriptObject.createArray();
		for(int i=0; i < provider.getPropertyCount(); i++){
			IProperty property = provider.getProperty(i);
			if(property instanceof IListProperty){
				IListProperty listProperty = (IListProperty) property;
				JavaScriptObject listModel = JavaScriptObject.createArray();
				for(int j = 0; j < listProperty.getChildrenCount(); j++){
					JavaScriptObject providerModel = createJsModel(listProperty.getChild(j));
					addToJSArray(listModel, providerModel);
				}
				addPropertyToJSObject(jsModel, property.getName(), listModel);
			} else if (property instanceof IStaticListProperty) {
				IStaticListProperty listProperty = (IStaticListProperty) property;
				JavaScriptObject listModel = JavaScriptObject.createObject();
				for(int j = 0; j < listProperty.getChildrenCount(); j++){
					IPropertyProvider child = listProperty.getChild(j);
					JavaScriptObject childModel = createJsModel(child);
					String name = this.getStringFromJSObject(childModel, "name");
					JavaScriptObject object = this.getObjectFromJSObject(childModel, "value");
					this.addPropertyToJSObject(listModel, name, object);
				}
				addPropertyToJSObject(jsModel, property.getName(), listModel);
			} else if (property instanceof IStaticRowProperty) {
				jsModel = JavaScriptObject.createObject();
				IStaticRowProperty listProperty = (IStaticRowProperty) property;
				JavaScriptObject listModel = JavaScriptObject.createObject();
				for(int j = 0; j < listProperty.getChildrenCount(); j++){
					if (listProperty.getChild(j).getPropertyCount() > 0) {
						addPropertyToModel(listModel,listProperty.getChild(j).getProperty(0));
					}
				}
				addPropertyToJSObject(jsModel, "value", listModel);
				addPropertyToJSObject(jsModel, "name", property.getName());
			} else if (property instanceof IEditableSelectProperty) {
				IEditableSelectProperty castedProperty = (IEditableSelectProperty)property;
				JavaScriptObject editableSelectModel = JavaScriptObject.createObject();
				addPropertyToJSObject(editableSelectModel, "value", castedProperty.getChild(castedProperty.getSelectedIndex()).getValue());
				addPropertyToJSObject(editableSelectModel, "name", castedProperty.getChild(castedProperty.getSelectedIndex()).getName());
				addPropertyToJSObject(jsModel, property.getName(), editableSelectModel);
			} else{
				addPropertyToModel(jsModel, property);
			}
		}
		return jsModel;
	}
	
	private void addPropertyToModel(JavaScriptObject jsModel, IProperty property){
		String value = property.getValue();
		
		if(	property instanceof IAudioProperty || 
			property instanceof IImageProperty ||
			property instanceof IVideoProperty ||
			property instanceof IFileProperty)
		{
			value = URLUtils.resolveURL(this.getBaseURL(), value);
		}
		else if(property instanceof IHtmlProperty){
			value = StringUtils.updateLinks(value, this.getBaseURL());
		}
		addPropertyToJSObject(jsModel, property.getName(), value);
	}
	
	private native String getStringFromJSObject (JavaScriptObject model, String name)  /*-{
		return model[name];
	}-*/; 
	
	private native JavaScriptObject getObjectFromJSObject (JavaScriptObject model, String name)  /*-{
		return model[name];
	}-*/;
	
	private native void addPropertyToJSObject(JavaScriptObject model, String name, String value)  /*-{
		model[name] = value;
	}-*/; 
	
	private native void addPropertyToJSObject(JavaScriptObject model, String name, JavaScriptObject obj)  /*-{
		model[name] = obj;
	}-*/; 
	
	private native void addToJSArray(JavaScriptObject model, JavaScriptObject obj)  /*-{
		model.push(obj);
	}-*/; 
}
