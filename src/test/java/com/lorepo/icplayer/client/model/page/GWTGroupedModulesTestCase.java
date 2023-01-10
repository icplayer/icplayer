package com.lorepo.icplayer.client.model.page;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.reflect.Whitebox;
import org.xml.sax.SAXException;

import com.google.gwt.i18n.client.Dictionary;
import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v1;


@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTGroupedModulesTestCase extends GwtTest {

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
	
	@Before
	public void setUp() {
		Dictionary dictMock = Mockito.mock(Dictionary.class);
		when(dictMock.get("defaultScore")).thenReturn("Default");
		when(dictMock.get("zeroMaxScore")).thenReturn("Zero or Max");
		when(dictMock.get("graduallyToMaxScore")).thenReturn("Gradually to Max");
		
		Set<String> dictValues = new HashSet<String>();
		dictValues.add("defaultScore");
		dictValues.add("zeroMaxScore");
		dictValues.add("graduallyToMaxScore");
		when(dictMock.keySet()).thenReturn(dictValues);
		
		Whitebox.setInternalState(DictionaryWrapper.class, "dictionary", dictMock);
		Whitebox.setInternalState(DictionaryWrapper.class, "cachedKeySet", dictMock.keySet());
	}

	@Test
	public void savingGroupToXML() throws SAXException, IOException {
		loadPage("testdata/modulesOnThePage2.xml");

		Group group = new Group(page);
		group.setId("Group1");
		group.add(page.getModules().getModuleById("PrevPage"));
		group.add(page.getModules().getModuleById("NextPage"));
		group.initGroupPropertyProvider();

		String groupXML = group.toXML();
		String xml = "<group id=\"" + group.getId() + "\" printable=\"No\" isSplitInPrintBlocked=\"false\">" 
				+ "<scoring type=\"defaultScore\" max=\"1\"/>"
				+ "<groupedModulesList>"
				+ "<groupModule moduleID=\"PrevPage\"/><groupModule moduleID=\"NextPage\"/>"
				+ "</groupedModulesList>"
				+ "<layouts isVisible=\"true\">"
				+ "<layout isLocked=\"false\" "
				+ "isModuleVisibleInEditor=\"true\" id=\"default\" "
				+ "isDiv=\"false\" isModificatedHeight=\"false\" isModificatedWidth=\"false\">"
				+ "<relative type=\"LTWH\">"
				+ "<left relative=\"\" property=\"left\"/>"
				+ "<top relative=\"\" property=\"top\"/>"
				+ "<right relative=\"\" property=\"right\"/>"
				+ "<bottom relative=\"\" property=\"bottom\"/>"
				+ "</relative>"
				+ "<absolute left=\"7\" right=\"0\" top=\"343\" bottom=\"0\" width=\"0\" height=\"0\"/>"
				+ "</layout>"
				+ "</layouts>"
				+ "<styles/>"
				+ "</group>"; 
		assertEquals(xml, groupXML); 
	}
	
	@Test
	public void loadGroupIntoDiv() {
		loadPage("testdata/modulesAndGroups2.xml");
		Group group = page.getGroupedModules().get(3); 
		group.initGroupPropertyProvider();
		assertTrue(group.isDiv()); 
	}
	
	@Test
	public void countingGroups() throws SAXException, IOException {
		loadPage("testdata/modulesAndGroups2.xml");
		
		assertEquals(4, page.getGroupedModules().size());
	}

	@Test
	public void areCountedGroupsCorrect() throws SAXException, IOException {
		loadPage("testdata/modulesAndGroups2.xml");
		
		assertTrue(page.getGroupedModules().get(0).contains(page.getModules().getModuleById("Audio1")));
		assertTrue(page.getGroupedModules().get(0).contains(page.getModules().getModuleById("Text2")));

		assertTrue(page.getGroupedModules().get(1).contains(page.getModules().getModuleById("Choice1")));
		

		assertTrue(page.getGroupedModules().get(2).contains(page.getModules().getModuleById("Title")));
		assertTrue(page.getGroupedModules().get(2).contains(page.getModules().getModuleById("NextPage")));

		assertTrue(page.getGroupedModules().get(3).contains(page.getModules().getModuleById("PrevPage")));
		assertTrue(page.getGroupedModules().get(3).contains(page.getModules().getModuleById("Text1")));
	}

	@Test
	public void isIdUniqueWhenIdJustExists() throws SAXException, IOException {
		loadPage("testdata/modulesAndGroups2.xml");
		
		String groupName1 = "Group5";
		String groupName2 = "Group4";

		assertTrue(page.getGroupedModules().get(0).isIDUnique(groupName1));
		assertTrue(page.getGroupedModules().get(0).isIDUnique(groupName2));
	}

	@Test
	public void loadOldXml() throws SAXException, IOException {
		loadPage("testdata/modulesAndGroups.xml");
		assertFalse(page.getGroupedModules().get(0).isDiv()); 
	}
	
	@Test
	public void isIdUniqueWhenIdNotExists() throws SAXException, IOException {
		loadPage("testdata/modulesAndGroups2.xml");
		String[] groupNames = {"Group1", "Group2", "Group3"};

		for (String i : groupNames) {
			assertFalse(page.getGroupedModules().get(0).isIDUnique(i));
		}
	}

	@Test
	public void isIdUniqueWhenIdExistsOnModule() throws SAXException, IOException {
		loadPage("testdata/modulesAndGroups2.xml");
		String groupName = "Audio1";

		assertFalse(page.getGroupedModules().get(0).isIDUnique(groupName));
	}

	@Test
	public void setScoreFromStringIfScoreTypeExists() throws SAXException, IOException {
		loadPage("testdata/modulesAndGroups2.xml");
		
		assertEquals("zeroMaxScore", page.getGroupedModules().get(0).getScoringType().toString());
	}

	@Test
	public void setScoreFromStringIfScoreTypeNotExists() throws SAXException, IOException {
		loadPage("testdata/modulesAndGroups2.xml");

		page.getGroupedModules().get(2).setScoreFromString("someUndefinedScoreType");
		
		assertEquals("defaultScore", page.getGroupedModules().get(2).getScoringType().toString());
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
