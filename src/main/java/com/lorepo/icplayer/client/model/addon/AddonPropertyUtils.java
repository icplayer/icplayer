package com.lorepo.icplayer.client.model.addon;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;


public class AddonPropertyUtils {

	/**
	 * Loading property display name from addon XML element.
	 * There are multiple situations which should be considering when loading display name for property.
	 * If there is 'nameLabel' attribute and dictionary contains such label then it becomes displayed name.
	 * If there is no 'nameLabel' attribute but there is 'displayName' one present then it becomes displayed name.
	 * In every other cases display name is <code>null</code> (there is none).
	 * 
	 * This is done here for the compatibility reasons - content created before property name translation feature already has
	 * displayName attribute set and this way we don't break compatibility with older versions.
	 * 
	 * @param element XML element representing addon property
	 * @return property name to be displayed in icEditor (either from displayedName attribute or from translation)  
	 */
	public static String loadDisplayNameFromXML(Element element) {
		String displayName = XMLUtils.getAttributeAsString(element, "displayName");

		String label = XMLUtils.getAttributeAsString(element, "nameLabel");
		if (label != null) {
			String translatedName = DictionaryWrapper.get(label);
			if (!translatedName.equals("MISSING_LABEL")) {
				displayName = translatedName;
			}
		}
		
		return displayName;
	}
	
}
