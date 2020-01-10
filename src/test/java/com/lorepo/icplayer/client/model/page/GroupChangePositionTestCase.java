package com.lorepo.icplayer.client.model.page;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.InputStream;

import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v1;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GroupChangePositionTestCase extends GwtTest{
	
	private Page page = new Page("page2", "");
	private final XMLParserMockup xmlParser = new XMLParserMockup();
	
	private void loadPage(String xmlFile) {
		InputStream inputStream = getClass().getResourceAsStream(xmlFile);
		try {
			Element element = xmlParser.parser(inputStream);
			PageParser_v1 parser = new PageParser_v1();
			parser.setPage(page);
			page = (Page) parser.parse(element);
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Test
	public void changeAbsoluteToRelative() throws SAXException, IOException {
		loadPage("testdata/modulesOnThePage2.xml");
		int left1 = 110; 
		int top1 = 500; 
		int left2 = 300; 
		int top2 = 250; 
		Group group = new Group(page);
		
		IModuleModel model1 = page.getModules().getModuleById("PrevPage"); 
		model1.setLeft(left1);
		model1.setTop(top1);
		
		IModuleModel model2 = page.getModules().getModuleById("NextPage"); 
		model2.setLeft(left2);
		model2.setTop(top2);
		
		group.add(model1);
		group.add(model2); 
		group.initGroupPropertyProvider(); 
		group.setDiv(true);
		assertEquals(group.getLeft(), left1); 
		assertEquals(group.getTop(), top2);
		assertEquals(model1.getLeft(), left1 - group.getLeft());
		assertEquals(model1.getTop(), top1 - group.getTop());
		assertEquals(model2.getLeft(), left2 - group.getLeft());
		assertEquals(model2.getTop(), top2 - group.getTop());
	}

	@Test
	public void changeRelativeToAbsolute() throws SAXException, IOException {
		loadPage("testdata/modulesAndGroups2.xml");
		Group group = page.getGroupedModules().get(3);
		IModuleModel model1 = page.getModules().getModuleById("PrevPage"); 
		IModuleModel model2 = page.getModules().getModuleById("Text1"); 
		
		int left1 = model1.getLeft(); 
		int top1 = model1.getTop(); 
		
		int left2 = model2.getLeft(); 
		int top2 = model2.getTop(); 
		
		int deltaX = group.getLeft(); 
		int deltaY = group.getTop(); 
		
		group.setDiv(false);
		assertEquals(group.getTop(), model2.getTop());
		assertEquals(group.getLeft(), model1.getLeft());
		assertEquals(model1.getLeft(), left1 + deltaX);
		assertEquals(model1.getTop(), top1 + deltaY);
		assertEquals(model2.getLeft(), left2 + deltaX);
		assertEquals(model2.getTop(), top2 + deltaY);
	}
	
	@Test
	public void changeLayoutGroup() throws SAXException, IOException {
		loadPage("testdata/modulesOnThePage2.xml");
		Group group = new Group(page);
		IModuleModel model1 = page.getModules().getModuleById("PrevPage"); 
		IModuleModel model2 = page.getModules().getModuleById("NextPage"); 
		group.add(model1);
		group.add(model2);	
		group.initGroupPropertyProvider();
		int left = group.getLeft(); 
		int top = group.getTop(); 
		int delta = 100; 
		group.setSemiResponsiveLayoutID("11F68DD0-2542-416C-AE4A-F1A622CEE4BC");
		group.setSemiResponsiveLayoutID("default");
		group.setDiv(true);
		group.setLeft(left + delta);
		group.setTop(top + delta);
		assertEquals(group.getTop(), top + delta);
		assertEquals(group.getLeft(), left + delta);
		assertTrue(group.isDiv());
		group.setSemiResponsiveLayoutID("11F68DD0-2542-416C-AE4A-F1A622CEE4BC");
		assertEquals(group.getTop(), top);
		assertEquals(group.getLeft(), left);
		assertFalse(group.isDiv()); 
		group.setSemiResponsiveLayoutID("default");
		assertEquals(group.getTop(), top + delta);
		assertEquals(group.getLeft(), left + delta);
		assertTrue(group.isDiv());
	}
	

	
}
