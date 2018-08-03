package com.lorepo.icplayer.client.model.page;

import static org.junit.Assert.*;

import java.io.IOException;
import java.io.InputStream;
import java.util.Scanner;

import org.custommonkey.xmlunit.Diff;
import org.custommonkey.xmlunit.ElementNameAndAttributeQualifier;
import org.custommonkey.xmlunit.XMLAssert;
import org.custommonkey.xmlunit.XMLUnit;
import org.junit.Before;
import org.junit.Test;
import org.powermock.reflect.Whitebox;
import org.xml.sax.SAXException;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.mockup.xml.PageFactoryMockup;
import com.lorepo.icplayer.client.model.ModuleList;
import com.lorepo.icplayer.client.model.layout.Size;
import com.lorepo.icplayer.client.module.api.IModuleModel;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTPageVersionsTestCase extends GwtTest {
	Page page = null;
	private String semiResponsiveLayoutID = "default";
	private int pageWeight = 1;
	
	private String getFromFile(String path) throws IOException {
		InputStream xmlStream = getClass().getResourceAsStream(path);
		Scanner s = new Scanner(xmlStream).useDelimiter("\\A");
		String result = s.hasNext() ? s.next() : "";
		return result;
	}
		
	private void loadPageInAwareFactory(Page page, String path) throws SAXException, IOException {
		PageFactoryMockup factory = new PageFactoryMockup(page);
		factory.produce(getFromFile(path), "");
	}
	
	private void parsePage(String xml, Page page) throws SAXException, IOException {
		PageFactoryMockup factory = new PageFactoryMockup(page);
		factory.produce(xml, "");
	}
	
	private Size getDefaultSize() {
		Size returedValue = new Size(this.semiResponsiveLayoutID, 0, 0);
		returedValue.setIsDefault(true);
		return returedValue;
	}
	
	@Before
	public void setUp() {
		XMLUnit.setIgnoreWhitespace(true);
		XMLUnit.setIgnoreComments(true);
		XMLUnit.setIgnoreDiffBetweenTextAndCDATA(true);
		XMLUnit.setNormalizeWhitespace(true);
		XMLUnit.setIgnoreAttributeOrder(true);
		
		this.page = new Page("Page", "");
	}
	
	// Checking updating xmls
	@Test
	public void updatingVersion2PageWithNoHeaders() throws IOException, SAXException {
		String expected = getFromFile("testdata/PageVersion5NoHeaders.xml");

		this.loadPageInAwareFactory(this.page, "testdata/PageVersion2HeadersFalse.xml");
		
		String result = page.toXML();
		
		Diff diff = new Diff(expected, result);
		XMLAssert.assertXMLEqual(diff, true);
	}
	
	@Test
	public void updatingVersion2Page() throws IOException, SAXException {
		String pageXML = getFromFile("testdata/PageVersion5.xml");

		this.loadPageInAwareFactory(this.page, "testdata/PageVersion2.xml");
		String result = page.toXML();
		
		Diff diff = new Diff(pageXML, result);
		XMLAssert.assertXMLEqual(diff, true);
	}
	
	@Test
	public void updatingPageWithoutVersion() throws IOException, SAXException {
		String expectedXML = getFromFile("testdata/PageVersion5.xml");

		this.loadPageInAwareFactory(this.page, "testdata/PageWithoutVersion.xml");
		String result = this.page.toXML();
		
		Diff diff = new Diff(expectedXML, result);
		
		XMLAssert.assertXMLEqual(diff, true);
	}
	
	@Test
	public void updatingPageVersion3ToHeadersVersion() throws IOException, SAXException {
		String pageXML = getFromFile("testdata/PageVersion5.xml");
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion3NoHeadersInModel.xml");
		
		String result = this.page.toXML();
		Diff diff = new Diff(pageXML, result);
		
		XMLAssert.assertXMLEqual(diff, true);
	}
	
	@Test
	public void updatingVersion2CheckingLayout() throws IOException, SAXException {
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion2.xml");
		
		assertEquals(0, this.page.getHeight());
		assertEquals(0, this.page.getWidth());
		assertTrue(this.page.hasFooter());
		assertTrue(this.page.hasHeader());
	}
	
	@Test
	public void updatingVersion2WithoutHeadersInModel() throws IOException, SAXException {
		String pageXML = getFromFile("testdata/PageVersion5.xml");
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion2NoHeadersInModel.xml");
		
		String result = this.page.toXML();
		Diff diff = new Diff(pageXML, result);
		
		XMLAssert.assertXMLEqual(diff, true);
	}
	
	@Test
	public void updatingVersion2NoClassAndLayout() throws IOException, SAXException {
		String expectedXML = getFromFile("testdata/PageVersion5NoClassAndLayout.xml");
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion2NoClassAndLayout.xml");	
		
		String result = this.page.toXML();
		
		Diff diff = new Diff(expectedXML, result);
		XMLAssert.assertXMLEqual(diff, true);
	}
	
	@Test
	public void updatingWithoutVersionNoClassAndLayout() throws IOException, SAXException {
		String expectedXML = getFromFile("testdata/PageVersion5NoClassAndLayout.xml");
		this.loadPageInAwareFactory(this.page, "testdata/PageWithoutVersionNoClassAndLayout.xml");
		
		String result = this.page.toXML();
		
		Diff diff = new Diff(expectedXML, result);
		
		XMLAssert.assertXMLEqual(diff, true);
	}
	
	@Test
	public void updatingPageVersion3WithManyLayouts() throws SAXException, IOException {
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion3NoHeadersManyLayouts.xml");
		String expectedXML = getFromFile("testdata/PageVersion5ManyLayouts.xml");
		
		String result = this.page.toXML();
		Diff diff = new Diff(expectedXML, result);
		diff.overrideElementQualifier(new ElementNameAndAttributeQualifier());
		XMLAssert.assertXMLEqual(diff, true);
	}
	
	// Checking page attributes
	@Test
	public void checkingIfUpdatedVersion3WillHaveAttributes() throws Exception {
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion3NoHeadersInModel.xml");
		
		Size returnedSize = Whitebox.invokeMethod(this.page, "getDefaultSize");
		Size defaultSize = this.getDefaultSize();
		
		assertTrue(this.page.hasHeader());
		assertTrue(this.page.hasFooter());
		
		assertEquals(defaultSize.getID(), returnedSize.getID());
		assertEquals(defaultSize.getHeight(), returnedSize.getHeight());
		assertEquals(defaultSize.getWidth(), returnedSize.getWidth());
		assertTrue(returnedSize.isDefault());
		
		assertEquals(this.pageWeight, this.page.getPageWeight());
	}
	
	@Test
	public void checkingIfVersion2WithNoHeadersWillHaveAttributes() throws Exception {
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion2NoHeadersInModel.xml");
		
		Size returnedSize = Whitebox.invokeMethod(this.page, "getDefaultSize");
		Size defaultSize = this.getDefaultSize();
		
		assertTrue(this.page.hasHeader());
		assertTrue(this.page.hasFooter());
		
		assertEquals(defaultSize.getID(), returnedSize.getID());
		assertEquals(defaultSize.getHeight(), returnedSize.getHeight());
		assertEquals(defaultSize.getWidth(), returnedSize.getWidth());
		assertTrue(returnedSize.isDefault());
		
		assertEquals(this.pageWeight, this.page.getPageWeight());
	}
	
	@Test
	public void checkingIfVersion2WithFalseHeadersWillHaveAttributes() throws Exception {
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion2HeadersFalse.xml");
		
		Size returnedSize = Whitebox.invokeMethod(this.page, "getDefaultSize");
		Size defaultSize = this.getDefaultSize();
		
		assertFalse(this.page.hasHeader());
		assertFalse(this.page.hasFooter());
		
		assertEquals(defaultSize.getID(), returnedSize.getID());
		assertEquals(defaultSize.getHeight(), returnedSize.getHeight());
		assertEquals(defaultSize.getWidth(), returnedSize.getWidth());
		assertTrue(returnedSize.isDefault());
		
		assertEquals(this.pageWeight, this.page.getPageWeight());
	}
	
	@Test
	public void checkingIfPageWithoutVersionWillHaveProperAttributes() throws Exception {
		this.loadPageInAwareFactory(this.page, "testdata/PageWithoutVersion.xml");
		
		Size returnedSize = Whitebox.invokeMethod(this.page, "getDefaultSize");
		Size defaultSize = this.getDefaultSize();
		
		assertTrue(this.page.hasFooter());
		assertTrue(this.page.hasHeader());

		assertEquals(defaultSize.getID(), returnedSize.getID());
		assertEquals(defaultSize.getHeight(), returnedSize.getHeight());
		assertEquals(defaultSize.getWidth(), returnedSize.getWidth());
		assertTrue(returnedSize.isDefault());
		
		assertEquals(this.pageWeight, this.page.getPageWeight());
	}
	
	// Loading the page from xml, dumping it into xml and loading it again
	
	@Test 
	public void checkingTheOldestLessonXML() throws IOException, SAXException {
		this.loadPageInAwareFactory(this.page, "testdata/oldestPageXml.xml");
		
		String firstXML = this.page.toXML();
		Page pageV3 = new Page("Page", "");
		this.parsePage(firstXML, pageV3);
		
		String secondXML = pageV3.toXML();
		XMLAssert.assertXMLEqual(firstXML, secondXML);
	}
	
	@Test 
	public void checkingV2NoHeadersXML() throws IOException, SAXException {
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion2NoHeadersInModel.xml");
		
		String firstXML = this.page.toXML();
		Page pageV3 = new Page("Page", "");
		this.parsePage(firstXML, pageV3);
		
		String secondXML = pageV3.toXML();
		XMLAssert.assertXMLEqual(firstXML, secondXML);
	}
	
	@Test 
	public void checkingV2XML() throws IOException, SAXException {
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion2NoHeadersInModel.xml");
		String firstXML = this.page.toXML();

		Page pageV4 = new Page("Page", "");
		this.parsePage(firstXML, pageV4);
		
		String secondXML = pageV4.toXML();
		XMLAssert.assertXMLEqual(firstXML, secondXML);
		
	}
	
	@Test 
	public void checkingV3NoHeadersXML() throws IOException, SAXException {
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion3NoHeadersInModel.xml");
		
		String firstXML = this.page.toXML();
		Page pageV3 = new Page("Page", "");
		this.parsePage(firstXML, pageV3);
		
		String secondXML = pageV3.toXML();
		XMLAssert.assertXMLEqual(firstXML, secondXML);
	}
	
	@Test 
	public void checkingV3XML() throws IOException, SAXException {
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion3.xml");
		
		String firstXML = this.page.toXML();
		Page pageV3 = new Page("Page", "");
		this.parsePage(firstXML, pageV3);
		
		String secondXML = pageV3.toXML();
		XMLAssert.assertXMLEqual(firstXML, secondXML);
	}
	
	// Checking modules position and amount
	
	@Test
	public void pageVersion2WithoutHeadersCheckingModules() throws SAXException, IOException {
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion2NoHeadersInModel.xml");
		
		Page version3Page = new Page("Page", "");
		this.loadPageInAwareFactory(version3Page, "testdata/PageVersion3.xml");
		
		ModuleList returnedList = this.page.getModules();
		ModuleList expectedList = version3Page.getModules();
		
		assertEquals(expectedList.size(), returnedList.size());
		
		for(int i = 0; i < expectedList.size(); i++){
			IModuleModel returned = returnedList.get(i);
			IModuleModel expected = expectedList.get(i);
			
			assertEquals(expected.getTop(), returned.getTop());
			assertEquals(expected.getLeft(), returned.getLeft());
			assertEquals(expected.getRight(), returned.getRight());
			assertEquals(expected.getBottom(), returned.getBottom());
			assertEquals(expected.getWidth(), returned.getWidth());
			assertEquals(expected.getHeight(), returned.getHeight());
		}
	}
	
	@Test
	public void pageVersion2CheckingModules() throws SAXException, IOException {
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion2.xml");
		
		Page version3Page = new Page("Page", "");
		this.loadPageInAwareFactory(version3Page, "testdata/PageVersion3.xml");
		
		ModuleList returnedList = this.page.getModules();
		ModuleList expectedList = version3Page.getModules();
		
		assertEquals(expectedList.size(), returnedList.size());
		
		for(int i = 0; i < expectedList.size(); i++){
			IModuleModel returned = returnedList.get(i);
			IModuleModel expected = expectedList.get(i);
			
			assertEquals(expected.getTop(), returned.getTop());
			assertEquals(expected.getLeft(), returned.getLeft());
			assertEquals(expected.getRight(), returned.getRight());
			assertEquals(expected.getBottom(), returned.getBottom());
			assertEquals(expected.getWidth(), returned.getWidth());
			assertEquals(expected.getHeight(), returned.getHeight());
		}
	}
	
	@Test
	public void pageNoVersionCheckingModules() throws SAXException, IOException {
		this.loadPageInAwareFactory(this.page, "testdata/PageWithoutVersion.xml");
		
		Page version3Page = new Page("Page", "");
		this.loadPageInAwareFactory(version3Page, "testdata/PageVersion3.xml");
		
		ModuleList returnedList = this.page.getModules();
		ModuleList expectedList = version3Page.getModules();
		
		assertEquals(expectedList.size(), returnedList.size());
		
		for(int i = 0; i < expectedList.size(); i++){
			IModuleModel returned = returnedList.get(i);
			IModuleModel expected = expectedList.get(i);
			
			assertEquals(expected.getTop(), returned.getTop());
			assertEquals(expected.getLeft(), returned.getLeft());
			assertEquals(expected.getRight(), returned.getRight());
			assertEquals(expected.getBottom(), returned.getBottom());
			assertEquals(expected.getWidth(), returned.getWidth());
			assertEquals(expected.getHeight(), returned.getHeight());
		}
	}
	
	@Test
	public void pageVersion2NoHeadersCheckingModules() throws SAXException, IOException {
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion2NoHeadersInModel.xml");
		
		Page version3Page = new Page("Page", "");
		this.loadPageInAwareFactory(version3Page, "testdata/PageVersion3.xml");
		
		ModuleList returnedList = this.page.getModules();
		ModuleList expectedList = version3Page.getModules();
		
		assertEquals(expectedList.size(), returnedList.size());
		
		for(int i = 0; i < expectedList.size(); i++){
			IModuleModel returned = returnedList.get(i);
			IModuleModel expected = expectedList.get(i);
			
			assertEquals(expected.getTop(), returned.getTop());
			assertEquals(expected.getLeft(), returned.getLeft());
			assertEquals(expected.getRight(), returned.getRight());
			assertEquals(expected.getBottom(), returned.getBottom());
			assertEquals(expected.getWidth(), returned.getWidth());
			assertEquals(expected.getHeight(), returned.getHeight());
		}
	}
	
	@Test
	public void pageVersion3NoHeadersCheckingModules() throws SAXException, IOException {
		this.loadPageInAwareFactory(this.page, "testdata/PageVersion3NoHeadersInModel.xml");
		
		Page version3Page = new Page("Page", "");
		this.loadPageInAwareFactory(version3Page, "testdata/PageVersion3.xml");
		
		ModuleList returnedList = this.page.getModules();
		ModuleList expectedList = version3Page.getModules();
		
		assertEquals(expectedList.size(), returnedList.size());
		
		for(int i = 0; i < expectedList.size(); i++){
			IModuleModel returned = returnedList.get(i);
			IModuleModel expected = expectedList.get(i);
			
			assertEquals(expected.getTop(), returned.getTop());
			assertEquals(expected.getLeft(), returned.getLeft());
			assertEquals(expected.getRight(), returned.getRight());
			assertEquals(expected.getBottom(), returned.getBottom());
			assertEquals(expected.getWidth(), returned.getWidth());
			assertEquals(expected.getHeight(), returned.getHeight());
		}
	}
	
	@Test
	public void updatingVersion4Page() throws IOException, SAXException {
		String pageXML = getFromFile("testdata/PageVersion5.xml");

		this.loadPageInAwareFactory(this.page, "testdata/PageVersion4.xml");
		String result = page.toXML();
		
		Diff diff = new Diff(pageXML, result);
		XMLAssert.assertXMLEqual(diff, true);
	}
	
	@Test
	public void updatingVersion4PageManyLayouts() throws IOException, SAXException {
		String pageXML = getFromFile("testdata/PageVersion5ManyLayouts2.xml");

		this.loadPageInAwareFactory(this.page, "testdata/PageVersion4ManyLayouts2.xml");
		String result = page.toXML();
		
		Diff diff = new Diff(pageXML, result);
		XMLAssert.assertXMLEqual(diff, true);
	}
	
}
