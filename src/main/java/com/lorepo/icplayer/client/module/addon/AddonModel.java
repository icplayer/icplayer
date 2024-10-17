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
import com.lorepo.icf.properties.IScriptProperty;
import com.lorepo.icf.utils.ExtendedRequestBuilder;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.addon.param.AddonParamFactory;
import com.lorepo.icplayer.client.module.addon.param.IAddonParam;
import com.lorepo.icplayer.client.printable.IPrintableModuleModel;
import com.lorepo.icplayer.client.printable.Printable;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.PrintableController;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;

public class AddonModel extends BasicModuleModel implements IPrintableModuleModel {

	private String addonId;
	private ArrayList<IAddonParam>	addonParams = new ArrayList<IAddonParam>();
	private PrintableController printableController = null;
	private PrintableContentParser.ParsedListener printableAsyncCallback = null;
	private String printableAsyncID = "";
	private String printableState = "";

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
					Element element = (Element) node;
					IAddonParam addonParam = this.createAddonParam(paramFactory, element);
					addonParam.load(element, this.getBaseURL());
					addAddonParam(addonParam);
				}
			}
		}
	}

	private IAddonParam createAddonParam(AddonParamFactory paramFactory, Element element) {
		String name = XMLUtils.getAttributeAsString(element, "name");
		
		String type = XMLUtils.getAttributeAsString(element, "type");
		if (addonId.compareTo("Advanced_Connector") == 0 && name.compareTo("Scripts") == 0) {
			type = "editablescript";
		}
		
		return paramFactory.createAddonParam(this, type);
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
		JavaScriptObject printController = getPrintableControllerAsJsObject();
		
		String result = getPrintableHTML(this, addonName, jsModel, printController, printableState, printableAsyncID, printableAsyncCallback, showAnswers);
		if (result == null || result.length() == 0) return null;
		result = addClassToPrinatableModule(result);
		return result;
	}

	private String addClassToPrinatableModule(String html) {
		String className = this.getStyleClass();
		return PrintableContentParser.addClassToPrintableModule(html, className, !isSplitInPrintBlocked());
	}

	public String[] getPrintableModuleAdditionalClassNames() {
		String className = this.getStyleClass();
		return PrintableContentParser.getPrintableModuleAdditionalClassNames(className, !isSplitInPrintBlocked());
	}

	private native String getPrintableHTML(AddonModel x, String addonName, JavaScriptObject model, JavaScriptObject controller,
										   String state, String asyncID, PrintableContentParser.ParsedListener
												   parsedCallbackObject, boolean showAnswers) /*-{
		if($wnd.window[addonName] == null){
			return null;
		}
		var presenter = $wnd.window[addonName]();
		
		if (!presenter.hasOwnProperty("getPrintableHTML")) {
			return null;
		}
		
		if (presenter.hasOwnProperty("setPrintableController") && controller != null) {
			presenter.setPrintableController(controller);
		}

		if (presenter.hasOwnProperty("setPrintableClassNames") && controller != null) {
			var classNames = x.@com.lorepo.icplayer.client.module.addon.AddonModel::getPrintableModuleAdditionalClassNames()();
			presenter.setPrintableClassNames(classNames);
		}

		if (presenter.hasOwnProperty("setPrintableAsyncCallback") && parsedCallbackObject != null) {
			var asyncCallback = function (result) {
				result = x.@com.lorepo.icplayer.client.module.addon.AddonModel::addClassToPrinatableModule(Ljava/lang/String;)(result);
				parsedCallbackObject.@com.lorepo.icplayer.client.printable.PrintableContentParser.ParsedListener::onParsed(Ljava/lang/String;)(result);
			}
			presenter.setPrintableAsyncCallback(asyncID, asyncCallback);
		}

		if (presenter.hasOwnProperty("setPrintableState") && state != null && state.length > 0) {
			presenter.setPrintableState(state);
		}
		
		return presenter.getPrintableHTML(model, showAnswers);
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
	
	public boolean isSplitInPrintBlocked() {
		for (IAddonParam addonParam: addonParams) {
			if(addonParam.getName().equals("isSplitInPrintBlocked")) {
				return addonParam.getAsProperty().getValue().equals("True");
			}
		}
		return false;
	}
	
	@Override
	public JavaScriptObject getPrintableContext() {
		String addonName = "Addon" + getAddonId() + "_create";
		JavaScriptObject jsModel = createJsModel(this);
		return getPrintableContext(addonName, jsModel);
	} 
	
	@Override
	public void setPrintableController(PrintableController controller) {
		printableController = controller;
	}

	@Override
	public void setPrintableState(String state) {
		this.printableState = state;
	}

	@Override
	public boolean isPrintableAsync(){
		String addonName = "Addon" + getAddonId() + "_create";
		return isPrintableAsync(addonName);
	}

	public native boolean isPrintableAsync(String addonName)/*-{
		if($wnd.window[addonName] == null){
			return false;
		}
		var presenter = $wnd.window[addonName]();

		if (!presenter.hasOwnProperty("isPrintableAsync")) {
			return false;
		}

		return presenter.isPrintableAsync();
	}-*/;

	@Override
	public void setPrintableAsyncCallback(String id, PrintableContentParser.ParsedListener listener) {
		this.printableAsyncCallback = listener;
		this.printableAsyncID = id;
	}

	private JavaScriptObject getPrintableControllerAsJsObject() {
		if (printableController != null) {
			return printableController.getAsJavaScript();
		} else {
			return null;
		}
	}
	
	private native JavaScriptObject getPrintableContext(String addonName, JavaScriptObject model) /*-{
		if ($wnd.window[addonName] == null) {
			return null;
		}
		var presenter = $wnd.window[addonName]();
		
		if (!presenter.hasOwnProperty("getPrintableContext")) {
			return null;
		}
		
		return presenter.getPrintableContext(model);
	}-*/;
	
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
		
		if (property instanceof IAudioProperty ||
			property instanceof IImageProperty ||
			property instanceof IVideoProperty ||
			property instanceof IScriptProperty ||
			property instanceof IFileProperty)
		{
			value = URLUtils.resolveURL(this.getBaseURL(), value, this.getContentBaseURL());
			value = ExtendedRequestBuilder.signURL(value);
		} else if (property instanceof IHtmlProperty){
			value = StringUtils.updateLinks(value, this.getBaseURL(), this.getContentBaseURL());
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
