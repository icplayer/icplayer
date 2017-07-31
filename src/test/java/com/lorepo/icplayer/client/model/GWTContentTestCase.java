package com.lorepo.icplayer.client.model;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.tools.ant.filters.StringInputStream;
import org.junit.Test;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.Content.ScoreType;
import com.lorepo.icplayer.client.model.addon.AddonDescriptor;
import com.lorepo.icplayer.client.model.asset.AudioAsset;
import com.lorepo.icplayer.client.model.asset.ImageAsset;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.PageList;
import com.lorepo.icplayer.client.module.api.player.IChapter;
import com.lorepo.icplayer.client.module.api.player.IContentNode;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.xml.content.parsers.ContentParser_v0;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTContentTestCase extends GwtTest {

	private boolean receivedEvent = false;
	private String DEFAULT = "default";


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

		Content model = initContentFromFile("testdata/content.xml");
		String xml = model.toXML();
		initContentFromString(xml);
	}

	@Test
	public void toXMLCheckAddons() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content.xml");
		String xml = model.toXML();

		int index = xml.indexOf("<addon-descriptor");
		assertTrue(index > 0);
	}

	@Test
	public void loadFromXMLCheckPages() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content.xml");

		assertEquals(17, model.getPages().getTotalPageCount());
	}

	@Test
	public void findPage() throws ParserConfigurationException, SAXException, IOException {

		Content model = initContentFromFile("testdata/content.xml");

		Page page = model.findPageByName("cloze");

		assertNotNull(page);
	}


	@Test
	public void findCommonPage() throws ParserConfigurationException, SAXException, IOException {

		Content model = initContentFromFile("testdata/content.xml");

		Page page = model.findPageByName("commons/Popup1");

		assertNotNull(page);
	}


	@Test
	public void commonsCount() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content.xml");

		assertEquals(2, model.getCommonPages().getTotalPageCount());

		String xml = model.toXML();
		model = initContentFromString(xml);

		assertEquals(2, model.getCommonPages().getTotalPageCount());

	}

	@Test
	public void checkReportablePages() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content3.xml");

		assertEquals(3, model.getPages().getTotalPageCount());

		assertTrue(model.getPage(0).isReportable());
		assertFalse(model.getPage(1).isReportable());
		assertTrue(model.getPage(2).isReportable());
	}

	@Test
	public void loadSaveReportablePages() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content3.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		assertEquals(3, model.getPages().getTotalPageCount());

		assertTrue(model.getPage(0).isReportable());
		assertFalse(model.getPage(1).isReportable());
		assertTrue(model.getPage(2).isReportable());
	}

	@Test
	public void loadFromXMLCheckStyles() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content.xml");

		HashMap<String, CssStyle> styles = model.getStyles();
		CssStyle defaultStyle = styles.get(this.DEFAULT);
		int index = defaultStyle.getValue().indexOf("ic_page");
		assertTrue(index > 0);
	}

	@Test
	public void loadFromXMLCheckAssets() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content.xml");

		assertEquals(3, model.getAssetCount());
	}

	@Test
	public void loadFromXMLCheckAddons() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content2.xml");
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

	private Content initContentFromFile(String path) throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream(path);
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ContentParser_v0 parser = new ContentParser_v0();
		parser.setPagesSubset(new ArrayList<Integer> ());
		
		return (Content) parser.parse(element);
	}

	private static Content initContentFromString(String xml) throws SAXException, IOException {

		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(new StringInputStream(xml));
		
		ContentParser_v0 parser = new ContentParser_v0();
		parser.setPagesSubset(new ArrayList<Integer> ());
		
		return (Content) parser.parse(element);
	}

	@Test
	public void pageListener() {

		receivedEvent = false;
		Content content = new Content();
		content.addChangeListener(new IContentListener() {

			@Override
			public void onRemovePage(IContentNode node, IChapter parent) {
			}

			@Override
			public void onPageMoved(IChapter source, int from, int to) {
			}

			@Override
			public void onAddPage(IContentNode node) {
				receivedEvent = true;
			}

			@Override
			public void onChanged(IContentNode source) {
			}
		});

		content.getPages().add(new Page("1", ""));
		assertTrue(receivedEvent);
	}

	@Test
	public void commonPageListener() {

		receivedEvent = false;
		Content content = new Content();
		content.addChangeListener(new IContentListener() {

			@Override
			public void onRemovePage(IContentNode node, IChapter parent) {
			}

			@Override
			public void onPageMoved(IChapter source, int from, int to) {
			}

			@Override
			public void onAddPage(IContentNode node) {
				receivedEvent = true;
			}

			@Override
			public void onChanged(IContentNode source) {
			}
		});

		content.getCommonPages().add(new Page("1", ""));
		assertTrue(receivedEvent);
	}


	@Test
	public void headerAndFooter() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content-headerfooter.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		Page header = model.getHeader();
		Page footer = model.getFooter();

		assertNotNull(header);
		assertEquals("header", header.getName());
		assertNotNull(footer);
		assertEquals("footer", footer.getName());

	}


	@Test
	public void caseInsensitiveFolder() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content-headerfooter.xml");

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

		Content model = initContentFromFile("testdata/content.xml");
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

		Content model = initContentFromFile("testdata/content3.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		IPage page = model.getPage(0);
		assertEquals("/file/12", page.getPreview());
		assertEquals(ScoreType.first, model.getScoreType());
	}


	@Test
	public void contentName() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		assertEquals("My lesson", model.getName());
	}

	@Test
	public void randomPageId() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content3.xml");

		IPage page = model.getPage(0);
		assertTrue(page.getId().length() > 0);
	}

	@Test
	public void loadSavePageId() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content3.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		IPage page = model.getPage(0);
		assertEquals("123456", page.getId());
	}

	@Test
	public void chapterPages() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content4.xml");

		assertEquals(5, model.getPages().getTotalPageCount());
	}

	@Test
	public void loadSaveChapter() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content4.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		assertEquals(5, model.getPages().getTotalPageCount());
	}

	@Test
	public void chapterName() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content4.xml");
		String xml = model.toXML();
		model = initContentFromString(xml);

		IContentNode node = model.getPages().get(3);
		assertTrue(node instanceof PageList);
		PageList chapter = (PageList) node;
		assertEquals("Chapter 1", chapter.getName());
	}

	@Test
	public void chapterNameEvent() throws SAXException, IOException {

		Content model = initContentFromFile("testdata/content4.xml");

		receivedEvent = false;
		model.addChangeListener(new IContentListener() {

			@Override
			public void onRemovePage(IContentNode node, IChapter parent) {
			}

			@Override
			public void onPageMoved(IChapter source, int from, int to) {
			}

			@Override
			public void onAddPage(IContentNode node) {
			}

			@Override
			public void onChanged(IContentNode source) {
				receivedEvent = true;
			}
		});
		
		IContentNode node = model.getPages().get(3);
		assertTrue(node instanceof PageList);
		PageList chapter = (PageList) node;
		chapter.getProperty(0).setValue("new name");
		
		assertTrue(receivedEvent);
	}


	@Test
	public void currentChapterRoot() throws SAXException, IOException {

		Content content = initContentFromFile("testdata/content4.xml");
		String xml = content.toXML();
		content = initContentFromString(xml);

		IContentNode root = content.getTableOfContents();
		IContentNode node = content.getPages().get(0);
		assertEquals(root, content.getParentChapter(node));
	}

	@Test
	public void currentChapterCommons() throws SAXException, IOException {

		Content content = initContentFromFile("testdata/content4.xml");
		String xml = content.toXML();
		content = initContentFromString(xml);

		PageList root = content.getCommonPages();
		IContentNode node = root.get(0);
		assertEquals(root, content.getParentChapter(node));
	}

	@Test
	public void currentChapterSecondLevel() throws SAXException, IOException {

		Content content = initContentFromFile("testdata/content4.xml");
		String xml = content.toXML();
		content = initContentFromString(xml);

		IChapter parent = (IChapter) content.getPages().get(3);
		IContentNode node = parent.get(0);
		assertEquals(parent, content.getParentChapter(node));
	}
}
