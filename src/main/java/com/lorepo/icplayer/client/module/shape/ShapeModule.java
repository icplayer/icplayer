package com.lorepo.icplayer.client.module.shape;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;


/**
 * Prostokątny obszar o podanym kolorze i rodzaju ramki
 * Przykład serializacj XML:
 * 
 * <shapeModule left='59.07598' top='29.28864' width='10.0' height='10.0' style='background-color:red'>
 * </shapeModule>
 * 
 *
 */
public class ShapeModule extends BasicModuleModel {

	/**
	 * constructor
	 * @param services
	 */
	public ShapeModule() {
		super("Shape", DictionaryWrapper.get("shape_module"));
	}

	/**
	 * Convert module into XML
	 */
	@Override
	public String toXML() {
		Element shapeModule = XMLUtils.createElement("shapeModule");
		this.setBaseXMLAttributes(shapeModule);
		shapeModule.appendChild(this.getLayoutsXML());
		
		return shapeModule.toString();
	}

	@Override
	protected void parseModuleNode(Element element) {}
}
