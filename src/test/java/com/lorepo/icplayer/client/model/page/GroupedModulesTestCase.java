package com.lorepo.icplayer.client.model.page;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;

import org.junit.Before;
import org.junit.Ignore;
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
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v1;


@RunWith(PowerMockRunner.class)
@PrepareForTest(DictionaryWrapper.class)
public class GroupedModulesTestCase {

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
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("defaultScore")).thenReturn("Default");
		when(DictionaryWrapper.get("zeroMaxScore")).thenReturn("Zero or Max");
		when(DictionaryWrapper.get("graduallyToMaxScore")).thenReturn("Gradually to Max");
	}
	
	@Ignore("toXML need fix")
	@Test
	public void OldXMLTakesGroupsElement() throws SAXException, IOException {
		loadPage("testdata/xmlWithoutGroupedModules.xml");

		assertEquals("<?xml version='1.0' encoding='UTF-8' ?>"
				+ "<page layout='pixels' name='page2' isReportable='true' scoring='percentage' width='100' height='200' version='2'>"
				+ "<modules></modules>"
				+ "<groups></groups>"
				+ "<editorRulers></editorRulers>"
				+ "<page-weight value='1' mode='defaultWeight'></page-weight>"
				+ "</page>",
				page.toXML());
	}

	@Ignore("toXML need fix")
	@Test
	public void savingGroupToXML() throws SAXException, IOException {
		loadPage("testdata/modulesOnThePage.xml");

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
		loadPage("testdata/modulesAndGroups.xml");
		
		assertEquals(4, page.getGroupedModules().size());
	}

	@Test
	public void areCountedGroupsCorrect() throws SAXException, IOException {
		loadPage("testdata/modulesAndGroups.xml");
		
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
		loadPage("testdata/modulesAndGroups.xml");
		
		String groupName1 = "Group0";
		String groupName2 = "Group5";

		assertTrue(page.getGroupedModules().get(0).isIDUnique(groupName1));
		assertTrue(page.getGroupedModules().get(0).isIDUnique(groupName2));
	}

	@Test
	public void isIdUniqueWhenIdNotExists() throws SAXException, IOException {
		loadPage("testdata/modulesAndGroups.xml");
		String[] groupNames = {"Group1", "Group2", "Group3", "Group4"};

		for (String i : groupNames) {
			assertFalse(page.getGroupedModules().get(0).isIDUnique(i));
		}
	}

	@Test
	public void setScoreFromStringIfScoreTypeExists() throws SAXException, IOException {
		loadPage("testdata/modulesAndGroups.xml");

		assertEquals("zeroMaxScore", page.getGroupedModules().get(0).getScoringType().toString());
	}

	@Test
	public void setScoreFromStringIfScoreTypeNotExists() throws SAXException, IOException {
		loadPage("testdata/modulesAndGroups.xml");

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