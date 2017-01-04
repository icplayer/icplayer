package com.lorepo.icplayer.client.module.addon.param;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.IOException;
import java.io.InputStream;

import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.addon.AddonProperty;

public class ListAddonParamTestCase {

	AddonParamFactory factory = new AddonParamFactory();

	@Test
	public void loadFromPageXML() throws SAXException, IOException {
		
		ListAddonParam param = loadList();
		IListProperty property = (IListProperty) param.getAsProperty();
		
		assertEquals(3, property.getChildrenCount());
		
		IPropertyProvider provider = property.getChild(0);
		assertEquals(2, provider.getPropertyCount());
	}


	private ListAddonParam loadList() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("../testdata/listparam.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ListAddonParam param = new ListAddonParam(null, "list", factory);
		param.load(element, "");
		return param;
	}


	@Test
	public void addRows() throws SAXException, IOException {
		
		ListAddonParam param = loadList();
		IListProperty property = (IListProperty) param.getAsProperty();
		
		assertEquals(3, property.getChildrenCount());
		
		property.addChildren(5);
		IPropertyProvider provider = property.getChild(4);
		
		IProperty iconProperty = null;
		for(int i = 0 ; i < provider.getPropertyCount(); i++){
			if(provider.getProperty(i).getName().compareTo("Icon") == 0){
				iconProperty = provider.getProperty(i);
			}
		}
		
		assertNotNull(iconProperty);
	}

	@Test
	public void addField() throws SAXException, IOException {
		
		ListAddonParam param = loadList();
		param.addSubPropertyIfNotExists(new AddonProperty("test", "Test", "string"), factory);
		IListProperty property = (IListProperty) param.getAsProperty();
		IPropertyProvider provider = property.getChild(0);

		assertEquals(3, provider.getPropertyCount());
	}


	@Test
	public void addTheSameField() throws SAXException, IOException {
		
		ListAddonParam param = loadList();
		param.addSubPropertyIfNotExists(new AddonProperty("test", "Test", "string"), factory);
		param.addSubPropertyIfNotExists(new AddonProperty("test", "Test", "html"), factory);
		IListProperty property = (IListProperty) param.getAsProperty();
		IPropertyProvider provider = property.getChild(0);

		assertEquals(3, provider.getPropertyCount());
	}

}
