package com.lorepo.icplayer.client.model;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.module.ILayoutProperty;
import com.lorepo.icplayer.client.module.api.ILayoutDefinition;
import com.lorepo.icplayer.client.module.api.ILayoutDefinition.Property;
import com.lorepo.icplayer.client.module.image.ImageModule;
import com.lorepo.icplayer.client.module.shape.ShapeModule;

@RunWith(PowerMockRunner.class)
@PrepareForTest(DictionaryWrapper.class)
public class ModuleTestCase {
	
	private static final String PAGE_VERSION = "2";


	private ShapeModule initModule(String filename) throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream(filename);
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		ShapeModule module = new ShapeModule();
		module.load(element, "", PAGE_VERSION);
		return module;
	}

	@Test
	public void defaultModuleLayout() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/module1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		ShapeModule module = new ShapeModule();
		module.load(element, "", PAGE_VERSION);
		ILayoutDefinition layout = module.getLayout();
		
		assertTrue(layout.hasLeft());
		assertEquals("", layout.getLeftRelativeTo());
		assertEquals(Property.left, layout.getLeftRelativeToProperty());

		assertTrue(layout.hasTop());
		assertEquals("", layout.getTopRelativeTo());
		assertEquals(Property.top, layout.getTopRelativeToProperty());
		
		assertTrue(layout.hasWidth());
		assertTrue(layout.hasHeight());
		
		assertFalse(layout.hasRight());
		assertFalse(layout.hasBottom());
	}

	@Test
	public void layoutLTRB() throws SAXException, IOException {
		
		ShapeModule module = initModule("testdata/module2.xml");
		ILayoutDefinition layout = module.getLayout();
		
		assertTrue(layout.hasLeft());
		assertEquals("text1", layout.getLeftRelativeTo());
		assertEquals(Property.right, layout.getLeftRelativeToProperty());

		assertTrue(layout.hasTop());
		assertEquals("text2", layout.getTopRelativeTo());
		assertEquals(Property.bottom, layout.getTopRelativeToProperty());

		assertTrue(layout.hasRight());
		assertEquals("text3", layout.getRightRelativeTo());
		assertEquals(Property.left, layout.getRightRelativeToProperty());

		assertTrue(layout.hasBottom());
		assertEquals("text4", layout.getBottomRelativeTo());
		assertEquals(Property.top, layout.getBottomRelativeToProperty());

		assertFalse(layout.hasWidth());
		assertFalse(layout.hasHeight());
	}

	@Test
	public void layoutRBWH() throws SAXException, IOException {
		
		ShapeModule module = initModule("testdata/module3.xml");
		ILayoutDefinition layout = module.getLayout();
		
		assertFalse(layout.hasLeft());
		assertFalse(layout.hasTop());
		assertTrue(layout.hasRight());
		assertTrue(layout.hasBottom());
		assertTrue(layout.hasWidth());
		assertTrue(layout.hasHeight());
	}

	@Test
	public void position() throws SAXException, IOException {
		
		ShapeModule module = initModule("testdata/module3.xml");
		
		assertEquals(1, module.getLeft());
		assertEquals(2, module.getTop());
		assertEquals(3, module.getWidth());
		assertEquals(4, module.getRight());
		assertEquals(5, module.getBottom());
		assertEquals(6, module.getHeight());
	}
	
	
	@Test
	public void rightBottomProperty() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("right")).thenReturn("Right");
		when(DictionaryWrapper.get("bottom")).thenReturn("Bottom");

		ImageModule module = new ImageModule();
		boolean foundRightProperty = false;
		boolean foundBottomProperty = false;
		for(int i = 0; i < module.getPropertyCount(); i++){
			IProperty property = module.getProperty(i);
			if(property.getName().equals("Right")){
				foundRightProperty = true;
			}
			else if(property.getName().equals("Bottom")){
				foundBottomProperty = true;
			}
		}

		assertTrue(foundRightProperty);
		assertTrue(foundBottomProperty);
	}
	
	
	@Test
	public void layoutProperty() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("layout")).thenReturn("Layout");

		ShapeModule module = initModule("testdata/module2.xml");
		ILayoutProperty layoutProperty = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			IProperty property = module.getProperty(i);
			if(property.getName().equals("Layout")){
				layoutProperty = (ILayoutProperty) property;
				break;
			}
		}

		assertNotNull(layoutProperty);
		assertEquals("LTRB", layoutProperty.getValue());
	}
	
	@Test
	public void isTabindexEnabledPropertyIsByDefaultFalse() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("is_tabindex_enabled")).thenReturn("Is Tabindex Enabled");
		
		ShapeModule module = initModule("testdata/module2.xml");
		IBooleanProperty isTabindexEnabledProperty = null;
		for(int i = 0; i < module.getPropertyCount(); i++) {
			IProperty property = module.getProperty(i);
			if(property.getName().equals("Is Tabindex Enabled")){
				isTabindexEnabledProperty = (IBooleanProperty) property;
				break;
			}
		}
		
		assertNotNull(isTabindexEnabledProperty);
		assertEquals("False", isTabindexEnabledProperty.getValue());
	}
	
	@Test
	public void checksIfisTabindexEnabledPropertyIsFalse() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("is_tabindex_enabled")).thenReturn("Is Tabindex Enabled");
		
		ShapeModule module = initModule("testdata/module4.xml");
		IBooleanProperty isTabindexEnabledProperty = null;
		for(int i = 0; i < module.getPropertyCount(); i++) {
			IProperty property = module.getProperty(i);
			if(property.getName().equals("Is Tabindex Enabled")){
				isTabindexEnabledProperty = (IBooleanProperty) property;
				break;
			}
		}
		
		assertNotNull(isTabindexEnabledProperty);
		assertEquals("False", isTabindexEnabledProperty.getValue());
	}
}
