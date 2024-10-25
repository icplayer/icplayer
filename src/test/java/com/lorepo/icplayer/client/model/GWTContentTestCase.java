package com.lorepo.icplayer.client.model;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.custommonkey.xmlunit.Diff;
import org.custommonkey.xmlunit.ElementNameAndAttributeQualifier;
import org.custommonkey.xmlunit.XMLAssert;
import org.custommonkey.xmlunit.XMLUnit;
import org.junit.Before;
import org.junit.Test;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.model.Content.ScoreType;
import com.lorepo.icplayer.client.model.addon.AddonDescriptor;
import com.lorepo.icplayer.client.model.asset.AudioAsset;
import com.lorepo.icplayer.client.model.asset.ImageAsset;
import com.lorepo.icplayer.client.model.asset.ScriptAsset;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.PageList;
import com.lorepo.icplayer.client.model.utils.ContentFactoryMockup;
import com.lorepo.icplayer.client.module.api.player.IChapter;
import com.lorepo.icplayer.client.module.api.player.IContentNode;
import com.lorepo.icplayer.client.module.api.player.IPage;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTContentTestCase extends GwtTest {

	private String DEFAULT = "default";
	
	private static Content initContentFromString(String xml) throws SAXException, IOException {
		ContentFactoryMockup contentFactory = (ContentFactoryMockup) ContentFactoryMockup.getInstanceWithAllPages();
		return contentFactory.loadFromString(xml);
	}
	
	private Content initContentFactoryFromFile(String path, ArrayList<Integer> pageSubset) throws SAXException, IOException {
		ContentFactoryMockup contentFactory = (ContentFactoryMockup) ContentFactoryMockup.getInstanceWithSubset(pageSubset);
		return contentFactory.loadFromFile(path);
	}
	
	private Content initContentFactoryFromFileWithAllPages(String path) throws SAXException, IOException {
		ContentFactoryMockup contentFactory = (ContentFactoryMockup) ContentFactoryMockup.getInstanceWithAllPages();
		return contentFactory.loadFromFile(path);
	}
	
	private String getFromFile(String path) throws IOException {
		ContentFactoryMockup contentFactory = (ContentFactoryMockup) ContentFactoryMockup.getInstanceWithAllPages();
		return contentFactory.getFromFile(path);
	}

	
	@Before
	public void setUp() {
		XMLUnit.setIgnoreWhitespace(true);
		XMLUnit.setIgnoreComments(true);
		XMLUnit.setIgnoreDiffBetweenTextAndCDATA(true);
		XMLUnit.setNormalizeWhitespace(true);
		XMLUnit.setIgnoreAttributeOrder(true);
	}
	
	@Test
	public void toXMLNotNull() {

		Content content = new Content();
		String xml = content.toXML();

		assertNotNull(xml);
	}

	/**
	 * Sprawdzenie, ze podczas zapisu jest poprawny XML
	 * @throws ParserConfigurationException
	 * @throws IOException
	 * @throws SAXException
	 */
	@Test
	public void toXML() throws ParserConfigurationException, SAXException, IOException {

		Content content = new Content();
		content.getPages().add(new Page("1", ""));
		String xml = content.toXML();

		DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder docBuilder;
		docBuilder = docBuilderFactory.newDocumentBuilder();
		InputSource is = new InputSource(new StringReader(xml));
        docBuilder.parse(is);
	}

	@Test
	public void escapeXML() throws ParserConfigurationException, SAXException, IOException {

		Content content = new Content();
		content.getPages().add(new Page("1\'s", ""));
		String xml = content.toXML();

		DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder docBuilder;
		docBuilder = docBuilderFactory.newDocumentBuilder();
		InputSource is = new InputSource(new StringReader(xml));
        docBuilder.parse(is);

	}

	@Test
	public void toXMLSinglePage() {

		Content content = new Content();
		content.getPages().add(new Page("1", ""));
		String xml = content.toXML();

		int index = xml.indexOf("<page ");

		assertTrue(index > -1);
	}

	@Test
	public void toXMLSingleAsset() throws ParserConfigurationException, SAXException, IOException {

		Content content = new Content();
		content.addAsset(new ImageAsset("/file/2"));
		String xml = content.toXML();

		int index = xml.indexOf("<asset type='image' href='/file/2'");
		assertTrue(index > -1);
	}

	@Test
	public void toXMLCheckValid() throws SAXException, IOException {
		Content model = initContentFactoryFromFileWithAllPages("testdata/content.xml");
		String xml = model.toXML();
		initContentFromString(xml);
	}

	@Test
	public void toXMLCheckAddons() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content.xml");
		String xml = model.toXML();

		int index = xml.indexOf("<addon-descriptor");
		assertTrue(index > 0);
	}

	@Test
	public void loadFromXMLCheckPages() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content.xml");

		assertEquals(17, model.getPages().getTotalPageCount());
	}

	@Test
	public void findPage() throws ParserConfigurationException, SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content.xml");

		Page page = model.findPageByName("cloze");

		assertNotNull(page);
	}


	@Test
	public void findCommonPage() throws ParserConfigurationException, SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content.xml");

		Page page = model.findPageByName("commons/Popup1");

		assertNotNull(page);
	}


	@Test
	public void commonsCount() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content.xml");

		assertEquals(2, model.getCommonPages().getTotalPageCount());

		String xml = model.toXML();
		model = initContentFromString(xml);

		assertEquals(2, model.getCommonPages().getTotalPageCount());

	}

	@Test
	public void checkReportablePages() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content3.xml");

		assertEquals(3, model.getPages().getTotalPageCount());

		assertTrue(model.getPage(0).isReportable());
		assertFalse(model.getPage(1).isReportable());
		assertTrue(model.getPage(2).isReportable());
	}

	@Test
	public void loadSaveReportablePages() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content3.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		assertEquals(3, model.getPages().getTotalPageCount());

		assertTrue(model.getPage(0).isReportable());
		assertFalse(model.getPage(1).isReportable());
		assertTrue(model.getPage(2).isReportable());
	}

	@Test
	public void loadFromXMLCheckStyles() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content.xml");

		HashMap<String, CssStyle> styles = model.getStyles();
		CssStyle defaultStyle = styles.get(this.DEFAULT);
		int index = defaultStyle.getValue().indexOf("ic_page");
		assertTrue(index > 0);
	}

	@Test
	public void loadFromXMLCheckAssets() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content.xml");

		assertEquals(3, model.getAssetCount());
	}

	@Test
	public void loadFromXMLCheckAddons() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content2.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		assertEquals(1, model.getAddonDescriptors().size());

		AddonDescriptor addonDescriptor = model.getAddonDescriptors().get("140");
		assertNotNull(addonDescriptor);
	}

	@Test
	public void addAssetWrongUrl() throws ParserConfigurationException, SAXException, IOException {

		Content content = new Content();
		content.addAsset(new ImageAsset("/file/2<as>"));

		assertEquals(0, content.getAssetCount());
	}

	@Test
	public void addAssetCorrectUrl() throws ParserConfigurationException, SAXException, IOException {

		Content content = new Content();
		content.addAsset(new ImageAsset("/file/2"));

		assertEquals(1, content.getAssetCount());
	}

	@Test
	public void addAssetSameUrl() throws ParserConfigurationException, SAXException, IOException {

		Content content = new Content();
		content.addAsset(new ImageAsset("/file/2"));
		content.addAsset(new ImageAsset("/file/2"));

		assertEquals(1, content.getAssetCount());
	}



	@Test
	public void headerAndFooter() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content-headerfooter.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		Page header = model.getDefaultHeader();
		Page footer = model.getDefaultFooter();
		
		assertNotNull(header);
		assertEquals("header", header.getName());
		assertNotNull(footer);
		assertEquals("footer", footer.getName());

	}


	@Test
	public void caseInsensitiveFolder() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content-headerfooter.xml");

		Page page = model.findPageByName("COMMONS/HEADER");

		assertNotNull(page);
		assertEquals("header", page.getName());

	}

	@Test
	public void soundAsset() throws SAXException, IOException {

		Content model = new Content();

		model.addAsset(new AudioAsset("1"));

		String xml = model.toXML();
		model = new Content();
		model = initContentFromString(xml);

		IAsset asset = model.getAsset(0);
		assertTrue(asset instanceof AudioAsset);
	}


	@Test
	public void loadSaveAssets() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		IAsset asset = model.getAsset(0);
		assertTrue(asset instanceof ImageAsset);
		assertEquals("title1", asset.getTitle());
		assertEquals("file2", asset.getFileName());
		assertEquals("image", asset.getContentType());
	}


	@Test
	public void loadSave() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content3.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		IPage page = model.getPage(0);
		assertEquals("/file/12", page.getPreview());
		assertEquals(ScoreType.first, model.getScoreType());
	}


	@Test
	public void contentName() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		assertEquals("My lesson", model.getName());
	}

	@Test
	public void randomPageId() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content3.xml");

		IPage page = model.getPage(0);
		assertTrue(page.getId().length() > 0);
	}

	@Test
	public void loadSavePageId() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content3.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		IPage page = model.getPage(0);
		assertEquals("123456", page.getId());
	}

	@Test
	public void chapterPages() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content4.xml");

		assertEquals(5, model.getPages().getTotalPageCount());
	}

	@Test
	public void loadSaveChapter() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content4.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		assertEquals(5, model.getPages().getTotalPageCount());
	}

	@Test
	public void chapterName() throws SAXException, IOException {

		Content model = initContentFactoryFromFileWithAllPages("testdata/content4.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		IContentNode node = model.getPages().get(3);
		assertTrue(node instanceof PageList);
		PageList chapter = (PageList) node;
		assertEquals("Chapter 1", chapter.getName());
	}



	@Test
	public void currentChapterRoot() throws SAXException, IOException {

		Content content = initContentFactoryFromFileWithAllPages("testdata/content4.xml");
		String xml = content.toXML();
		content = initContentFromString(xml);

		IContentNode root = content.getTableOfContents();
		IContentNode node = content.getPages().get(0);
		assertEquals(root, content.getParentChapter(node));
	}

	@Test
	public void currentChapterCommons() throws SAXException, IOException {
		Content content = initContentFactoryFromFileWithAllPages("testdata/content4.xml");
		String xml = content.toXML();
		content = initContentFromString(xml);

		PageList root = content.getCommonPages();
		IContentNode node = root.get(0);
		assertEquals(root, content.getParentChapter(node));
	}

	@Test
	public void currentChapterSecondLevel() throws SAXException, IOException {

		Content content = initContentFactoryFromFileWithAllPages("testdata/content4.xml");
		String xml = content.toXML();
		content = initContentFromString(xml);

		IChapter parent = (IChapter) content.getPages().get(3);
		IContentNode node = parent.get(0);
		assertEquals(parent, content.getParentChapter(node));
	}
	
	@Test
	public void getLayoutByNameHaveToReturnItsName() throws SAXException, IOException {
		Content content = initContentFactoryFromFileWithAllPages("testdata/contentV1Parser.xml");
		
		assertEquals("320", content.getLayoutIDByName("320"));
		assertEquals("default", content.getLayoutIDByName("default"));
	}
	
	@Test
	public void getLayoutByNameHaveToReturnItsNameIfIDIsDifferentThanName() throws SAXException, IOException {
		Content content = initContentFactoryFromFileWithAllPages("testdata/contentV1ParserWithDifferentNameAndID.xml");
		
		assertEquals("default", content.getLayoutIDByName("testDefaultLayout"));
	}
	
	@Test
	public void getLayoutByNameHaveToReturnEmptyStringIfDontExists() throws SAXException, IOException {
		Content content = initContentFactoryFromFileWithAllPages("testdata/contentV1Parser.xml");
		
		assertEquals("", content.getLayoutIDByName("f;x.dkjsa;fdjska"));
	}
	
	@Test
	public void loadToXMLHaveToPreserverModulesMaxScoresNonSemiResponsive() throws SAXException, IOException {
		Content content = initContentFactoryFromFileWithAllPages("testdata/contentWithModulesMaxScores.xml");
		
		String result = content.toXML();
		
		String testXML = this.getFromFile("testdata/contentWithModulesMaxScoresExpectedResult.xml");
		Diff diff = new Diff(testXML, result);
		diff.overrideElementQualifier(new ElementNameAndAttributeQualifier());
		
        XMLAssert.assertXMLEqual(diff, true);
	}

	@Test
	public void givenContentWithLargePreviewWhenCallingGetPreviewLargeThenGetCorrectValue() throws SAXException, IOException {
		Content content = initContentFactoryFromFileWithAllPages("testdata/contentWithLargePreview.xml");
		content.getPage(0).getPreviewLarge();

		assertEquals("/file/serve/123", content.getPageById("aecOAT").getPreviewLarge());
		assertEquals("/file/serve/456", content.getPageById("Sw8NvN").getPreviewLarge());
	}
	
	@Test
	public void loadToXMLHaveToPreserverModulesMaxScoresSemiResponsiveVersion2() throws SAXException, IOException {
		Content content = initContentFactoryFromFileWithAllPages("testdata/contentWithModulesSemiResponsiveMaxScoresV2.xml");
		
		String result = content.toXML();
		
		String testXML = this.getFromFile("testdata/contentWithModulesSemiResponsiveMaxScoresV2ExpectedResult.xml");
		Diff diff = new Diff(testXML, result);
		diff.overrideElementQualifier(new ElementNameAndAttributeQualifier());
		
        XMLAssert.assertXMLEqual(diff, true);
	}
	
	public void gettingAllHeaders() {
		Page header1 = new Page("header", null);
		Page header2 = new Page("header2", null);
		Page header3 = new Page("Header", null);
		Page randomPage = new Page("1", null);
		Content content = new Content();
		
		content.getCommonPages().add(header1);
		content.getCommonPages().add(header2);
		content.getCommonPages().add(randomPage);
		content.getCommonPages().add(header3);
		
		ArrayList<Page> headers = content.getHeaders();
		assertEquals(3, headers.size());
		assertEquals(header1, headers.get(0));
		assertEquals(header2, headers.get(1));
		assertEquals(header3, headers.get(2));
	}
	
	@Test
	public void gettingAllFooters() {
		Page footer1 = new Page("footer", null);
		Page footer2 = new Page("footer2", null);
		Page footer3 = new Page("Footer", null);
		Page randomPage = new Page("1", null);
		Content content = new Content();
		
		content.getCommonPages().add(footer1);
		content.getCommonPages().add(footer2);
		content.getCommonPages().add(randomPage);
		content.getCommonPages().add(footer3);
		
		ArrayList<Page> footers = content.getFooters();
		assertEquals(3, footers.size());
		assertEquals(footer1, footers.get(0));
		assertEquals(footer2, footers.get(1));
		assertEquals(footer3, footers.get(2));
	}
	
	@Test
	public void whenPageHasHeaderAndHeaderIdIsSetItShouldReturnThatHeader() {
		Page page = new Page("Page 1", "");
		Page header = new Page("header1", "");
		page.setHeaderId(header.getId());
		Content content = new Content();
		
		content.getAllPages().add(page);
		content.getCommonPages().add(header);
		
		Page result = content.getHeader(page);
		assertEquals(header, result);
	}
	
	@Test
	public void whenPageHasHeaderAndItHasNoHeaderIdSetShouldReturnDefaultHeader() {
		Page page = new Page("Page 1", "");
		Page header = new Page("header", "");
		
		Content content = new Content();
		
		content.getAllPages().add(page);
		content.getCommonPages().add(header);
		
		Page result = content.getHeader(page);
		assertEquals(header, result);
	}
	
	@Test
	public void pageSubset() throws SAXException, IOException {

		ArrayList<Integer> selectedPages = new ArrayList<Integer>();
		selectedPages.add(1);
		selectedPages.add(2);
		selectedPages.add(5);
		
		Content content = initContentFactoryFromFile("testdata/content.xml", selectedPages);
		assertEquals(3, content.getPages().getTotalPageCount());
		
		assertNotNull(content.getPageById("schoice1"));
		assertNotNull(content.getPageById("ordering2"));
		assertNotNull(content.getPageById("report5"));
	}

	@Test
	public void givenOnlyValidScriptAssetWhenAddAssetWasCalledThenAddToContent() {
		Content content = new Content();
		
		content.addAsset(new ScriptAsset("test/file"));
		content.addAsset(new ScriptAsset(null));

		assertEquals(1, content.getAssetCount());
	}
}
