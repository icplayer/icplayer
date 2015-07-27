package com.lorepo.icplayer.client.model;

import static org.junit.Assert.*;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;


@RunWith(PowerMockRunner.class)
@PrepareForTest(DictionaryWrapper.class)
public class GroupedModulesTestCase {
	
	private Page page = new Page("page2", "");
	private XMLParserMockup xmlParser = new XMLParserMockup();
	private Element element;
	
	@Before
	public void setUp() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("defaultScore")).thenReturn("Default");
		when(DictionaryWrapper.get("zeroMaxScore")).thenReturn("Zero or Max");
		when(DictionaryWrapper.get("graduallyToMaxScore")).thenReturn("Gradually to Max");
	}
	
	@Test
	public void OldXMLTakesGroupsElement() throws SAXException, IOException {		
		InputStream inputStream = getClass().getResourceAsStream("testdata/xmlWithoutGroupedModules.xml");
		element = xmlParser.parser(inputStream);
		
		page.load(element, "");

		assertEquals("<?xml version='1.0' encoding='UTF-8' ?>"
				+ "<page layout='pixels' name='page2' isReportable='true' scoring='percentage' width='100' height='200'>"
				+ "<modules></modules>"
				+ "<groups></groups>"
				+ "</page>",
				page.toXML());
	} 
	
	@Test
	public void savingGroupToXML() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/modulesOnThePage.xml");
		element = xmlParser.parser(inputStream);
		
		page.load(element, "");
		
		Group group = new Group(page);
		group.add(page.getModules().getModuleById("PrevPage"));
		group.add(page.getModules().getModuleById("NextPage"));
		
		String groupXML = group.toXML();

		assertEquals("<group id='" + group.getId() + "'>"
				+ "<scoring type='defaultScore' max='1'/>"
				+ "<groupedModulesList>"
				+ "<groupModule moduleID='PrevPage'/><groupModule moduleID='NextPage'/>"
				+ "</groupedModulesList>"
				+ "</group>", groupXML);
	}
	
	@Test
	public void countingGroups() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/modulesAndGroups.xml");
		element = xmlParser.parser(inputStream);
		
		page.load(element, "");

		assertEquals(4, page.getGroupedModules().size());
	}
	
	@Test
	public void areCountedGroupsCorrect() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/modulesAndGroups.xml");
		element = xmlParser.parser(inputStream);
		
		page.load(element, "");

		assertTrue(page.getGroupedModules().get(0).contains(page.getModules().getModuleById("Choice5")));
		
		assertTrue(page.getGroupedModules().get(1).contains(page.getModules().getModuleById("Audio1")));
		assertTrue(page.getGroupedModules().get(1).contains(page.getModules().getModuleById("Choice4")));
		assertTrue(page.getGroupedModules().get(1).contains(page.getModules().getModuleById("Basic_Math_Gaps1")));
		
		assertTrue(page.getGroupedModules().get(2).contains(page.getModules().getModuleById("Title")));
		assertTrue(page.getGroupedModules().get(3).contains(page.getModules().getModuleById("Fractions1")));
		
		assertTrue(page.getGroupedModules().get(3).contains(page.getModules().getModuleById("TrueFalse1")));
	}
	
	@Test
	public void isIdUniqueWhenIdJustExists() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/modulesAndGroups.xml");
		element = xmlParser.parser(inputStream);
		
		page.load(element, "");
		
		String groupName1 = "Group0";
		String groupName2 = "Group5";
		
		assertTrue(page.getGroupedModules().get(0).isIDUnique(groupName1));
		assertTrue(page.getGroupedModules().get(0).isIDUnique(groupName2));
	}
	
	@Test
	public void isIdUniqueWhenIdNotExists() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/modulesAndGroups.xml");
		element = xmlParser.parser(inputStream);
		
		page.load(element, "");
		
		String[] groupNames = {"Group1", "Group2", "Group3", "Group4"};
		
		for (String i : groupNames) {
			assertFalse(page.getGroupedModules().get(0).isIDUnique(i));
		}
	}
	
	@Test
	public void setScoreFromStringIfScoreTypeExists() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/modulesAndGroups.xml");
		element = xmlParser.parser(inputStream);
		
		page.load(element, "");
		
		assertEquals("zeroMaxScore", page.getGroupedModules().get(0).getScoringType().toString());
	}
	
	@Test
	public void setScoreFromStringIfScoreTypeNotExists() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/modulesAndGroups.xml");
		element = xmlParser.parser(inputStream);
		
		page.load(element, "");
		
		page.getGroupedModules().get(1).setScoreFromString("someUndefinedScoreType");
		
		assertEquals("defaultScore", page.getGroupedModules().get(1).getScoringType().toString());
	}
	
	@Test
	public void checkIsIdCorrectWhenItIs() {
		Group group = new Group();
		
		assertTrue(group.isIdCorrect("someId"));
	}
	
	@Test
	public void checkIsIdCorrectWhenItIsNot() {
		Group group = new Group();
		
		assertFalse(group.isIdCorrect(""));
		assertFalse(group.isIdCorrect("   "));
	}
	
	@Test
	public void checkIsNewValueMaxScoreValidWhenItIs() {
		
		IProperty mockedProperty = Mockito.mock(IProperty.class);
		Group group = new Group();
		
		assertTrue(group.isNewValueMaxScoreValid("5", mockedProperty));
	}
	
	@Test
	public void checkIsNewValueMaxScoreValidWhenItIsNot() {
		
		IProperty mockedProperty = Mockito.mock(IProperty.class);
		Group group = new Group();
		
		assertFalse(group.isNewValueMaxScoreValid("aaasd", mockedProperty));
	}
}