package com.lorepo.icplayer.client.module.shape;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;


/**
 * Prostokątny obszar o podanym kolorze i rodzaju ramki
 * Przykład serializacj XML:
 * 
 * <shapeModule left='59.07598' top='29.28864' width='10.0' height='10.0' style='background-color:red'>
 * </shapeModule>
 * 
 * @author Krzysztof Langner
 *
 */
public class ShapeModule extends BasicModuleModel {

	/**
	 * constructor
	 * @param services
	 */
	public ShapeModule() {
		super(DictionaryWrapper.get("shape_module"));
	}

	
	@Override
	public void load(Element node, String baseUrl) {

		super.load(node, baseUrl);
	}

	
	/**
	 * Convert module into XML
	 */
	@Override
	public String toXML() {
		
		String xml = 
				"<shapeModule " + getBaseXML() + ">" + 
				"</shapeModule>";
		
		return xml;
	}
}
